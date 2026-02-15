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
        const next30Days = endOfDay(addDays(today, 30))

        const [citas, inscripcionesActivas, diasNoLaborables, tareas] = await Promise.all([
            prisma.citaNivelacion.findMany({
                where: { fecha: { gte: today, lte: next30Days } },
                include: { alumno: { include: { usuario: true } } },
                orderBy: { fecha: 'asc' }
            }),
            prisma.inscripcion.findMany({
                where: { estado: 'ACTIVA' },
                include: { alumno: true, taller: true }
            }),
            (prisma as any).diaNoLaborable.findMany({
                where: { fecha: { gte: today, lte: next30Days } }
            }),
            prisma.tarea.findMany({
                where: { fecha: { gte: today, lte: next30Days }, completada: false },
                orderBy: { fecha: 'asc' }
            })
        ])

        const agendaItems: any[] = []

        // 1. Process fixed appointments (Citas)
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

        // 2. Process tasks (Tareas)
        tareas.forEach(tarea => {
            const date = new Date(tarea.fecha)
            if (tarea.hora) {
                const [h, m] = tarea.hora.split(':')
                date.setHours(parseInt(h), parseInt(m))
            }
            agendaItems.push({
                id: `tarea-${tarea.id}`,
                tipo: 'TAREA',
                tipoLabel: '📝 Tarea Pendiente',
                fecha: date,
                horaDisplay: tarea.hora || '--:--',
                titulo: tarea.titulo,
                detalle: tarea.descripcion || 'Tarea administrativa',
                color: tarea.prioridad === 'ALTA' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-blue-100 text-blue-700 border-blue-300',
                attendees: []
            })
        })

        // 3. Process recurring inscriptions
        // We look ahead up to 30 days, but we can stop once we have a healthy amount of items
        for (let i = 0; i <= 30; i++) {
            const currentDate = addDays(today, i)
            const dayOfWeekStr = dayMap[getDay(currentDate)]

            const nonWorkingDay = (diasNoLaborables as any[]).find(d =>
                startOfDay(new Date(d.fecha)).getTime() === startOfDay(currentDate).getTime()
            )

            if (nonWorkingDay) continue

            const dayInscriptions = inscripcionesActivas.filter(ins => {
                const workshopDays = (ins.taller?.diasSemana || '').toUpperCase()
                const inscriptionDays = (ins.dia || '').toUpperCase()
                const isSingleClass = ins.fase === 'Clase Única' || ins.taller?.nombre?.toLowerCase().includes('única')

                // Match day of week
                const matchesDay = inscriptionDays !== ''
                    ? inscriptionDays.includes(dayOfWeekStr)
                    : workshopDays.includes(dayOfWeekStr)

                if (!matchesDay) return false

                // Special logic for Single Class: Only show it ONCE
                if (isSingleClass) {
                    const enrollmentDate = startOfDay(new Date(ins.fechaInscripcion || ins.creadoEn))

                    // Find the first occurrence of the day of the week on or after enrollment
                    // We check if this specific 'currentDate' is the FIRST match since enrollment
                    const diffInDays = Math.floor((currentDate.getTime() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24))

                    // If it matches the day of the week and it's within 0-6 days from enrollment, 
                    // it's the first occurrence.
                    return diffInDays >= 0 && diffInDays < 7
                }

                return true
            })

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
                item.detalle = `${item.horaDisplay} hs • ${item.attendees.length} alumnos inscriptos`
                agendaItems.push(item)
            })

            // Optimization: If we already have more than 15 items across these days, we can stop
            if (agendaItems.length >= 20) break
        }

        // Final sort
        agendaItems.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

        // Show at least 6 activities
        // If we have many, we can slice, but usually showing everything in the found window is fine.
        // However, if the user specifically asked for "at least 6", and we have more, 
        // we satisfy the "at least" part. I'll cap it at 30 items for performance.
        const finalizedItems = agendaItems.slice(0, 30)

        return NextResponse.json({
            agendaItems: finalizedItems,
            stats: {
                todayTalleres: finalizedItems.filter(i => i.tipo === 'TALLER' && startOfDay(new Date(i.fecha)).getTime() === today.getTime()).length,
                todayCitas: finalizedItems.filter(i => i.tipo === 'CITA' && startOfDay(new Date(i.fecha)).getTime() === today.getTime()).length
            }
        })
    } catch (error) {
        console.error('Agenda API Error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
