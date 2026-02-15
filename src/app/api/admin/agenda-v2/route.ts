import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { startOfDay, endOfDay, addDays, getDay } from 'date-fns'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const dayMap: { [key: number]: string } = {
    0: 'DOMINGO',
    1: 'LUNES',
    2: 'MARTES',
    3: 'MIERCOLES',
    4: 'JUEVES',
    5: 'VIERNES',
    6: 'SABADO'
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const today = startOfDay(new Date())
        const next7Days = endOfDay(addDays(today, 7))

        const [citas, inscripcionesActivas, diasNoLaborables] = await Promise.all([
            prisma.citaNivelacion.findMany({
                where: { fecha: { gte: today, lte: next7Days } },
                include: { alumno: { include: { usuario: true } } },
                orderBy: { fecha: 'asc' }
            }),
            prisma.inscripcion.findMany({
                where: { estado: 'ACTIVA' },
                include: { alumno: true, taller: true }
            }),
            (prisma as any).diaNoLaborable.findMany({
                where: { fecha: { gte: today, lte: next7Days } }
            })
        ])

        const agendaItems: any[] = []

        // Process fixed appointments
        citas.forEach(cita => {
            agendaItems.push({
                id: `cita-${cita.id}`,
                tipo: 'CITA',
                tipoLabel: 'Prueba de Nivelación',
                fecha: cita.fecha,
                horaDisplay: cita.fecha.getHours().toString().padStart(2, '0') + ':' + cita.fecha.getMinutes().toString().padStart(2, '0'),
                titulo: cita.alumno.usuario.nombre,
                detalle: cita.notas || 'Cita de nivelación programada',
                color: 'bg-lemon-100 text-lemon-700 border-lemon-300',
                attendees: [{ id: cita.alumnoId, nombre: cita.alumno.nombre, dni: cita.alumno.dni }]
            })
        })

        // Process recurring inscriptions for the next 7 days
        for (let i = 0; i <= 7; i++) {
            const currentDate = addDays(today, i)
            const dayOfWeekStr = dayMap[getDay(currentDate)]

            const nonWorkingDay = (diasNoLaborables as any[]).find(d =>
                startOfDay(new Date(d.fecha)).getTime() === startOfDay(currentDate).getTime()
            )

            if (nonWorkingDay) continue

            // Filter inscriptions for TODAY'S day in the loop
            const dayInscriptions = inscripcionesActivas.filter(ins => {
                const workshopDays = ins.taller?.diasSemana?.toUpperCase() || ''
                const inscriptionDays = ins.dia?.toUpperCase() || ''
                return workshopDays.includes(dayOfWeekStr) || inscriptionDays.includes(dayOfWeekStr)
            })

            // Group by workshop + hour for this specific day
            const groupedByTallerH: Record<string, any> = {}

            dayInscriptions.forEach(ins => {
                const key = `${ins.tallerId}-${ins.horario || 'S/H'}`
                if (!groupedByTallerH[key]) {
                    const [h, m] = (ins.horario?.split('-')[0] || '16:00').split(':')
                    const sessionDate = new Date(currentDate)
                    sessionDate.setHours(parseInt(h || '16'), parseInt(m || '0'), 0, 0)

                    groupedByTallerH[key] = {
                        id: `taller-${ins.tallerId}-${i}`,
                        tipo: 'TALLER',
                        tipoLabel: ins.taller.nombre.toLowerCase().includes('verano') ? '☀️ Taller de Verano' : '🎨 Taller Regular',
                        fecha: sessionDate,
                        horaDisplay: ins.horario?.split('-')[0] || '16:00',
                        titulo: ins.taller.nombre,
                        color: ins.taller.nombre.toLowerCase().includes('verano') ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-leaf-100 text-leaf-700 border-leaf-300',
                        attendees: []
                    }
                }
                groupedByTallerH[key].attendees.push({
                    id: ins.alumnoId,
                    nombre: ins.alumno.nombre + ' ' + (ins.alumno.apellido || ''),
                    dni: ins.alumno.dni
                })
            })

            Object.values(groupedByTallerH).forEach(item => {
                item.detalle = `${item.horaDisplay} hs • ${item.attendees.length} alumnos inscriptos hoy`
                agendaItems.push(item)
            })
        }

        // Final sort
        agendaItems.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

        return NextResponse.json({
            agendaItems,
            stats: {
                todayTalleres: agendaItems.filter(i => i.tipo === 'TALLER' && startOfDay(new Date(i.fecha)).getTime() === today.getTime()).length,
                todayCitas: agendaItems.filter(i => i.tipo === 'CITA' && startOfDay(new Date(i.fecha)).getTime() === today.getTime()).length
            }
        })
    } catch (error) {
        console.error('Agenda API Error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
