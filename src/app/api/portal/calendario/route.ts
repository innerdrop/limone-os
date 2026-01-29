import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const DAYS_MAP: Record<string, number> = {
    'DOMINGO': 0, 'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5, 'SABADO': 6
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const students = await prisma.alumno.findMany({
            where: { usuarioId: session.user.id },
            include: {
                inscripciones: {
                    where: { pagado: true, estado: 'ACTIVA' },
                    include: {
                        taller: true,
                        alumno: true
                    }
                },
                citasNivelacion: {
                    where: {
                        fecha: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0)
                        }
                    },
                    include: { alumno: true }
                }
            }
        })

        const classes: any[] = []
        if (!students || students.length === 0) return NextResponse.json({ classes: [] })

        const enrollments = students.flatMap(s => s.inscripciones)
        const citas = students.flatMap(s => s.citasNivelacion || [])

        // 1. Regular Classes Generation
        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 2, 0)

        for (const ins of enrollments) {
            const isSummer = ins.fase === 'Taller de Verano'
            const diasInscripcion = (ins.dia || '').split(',').map(d => d.trim().toUpperCase())

            for (const diaText of diasInscripcion) {
                const targetDayOfWeek = DAYS_MAP[diaText]
                if (targetDayOfWeek === undefined) continue

                if (isSummer && ins.notas) {
                    // Logic for Summer Workshop
                    const startDateMatch = ins.notas.match(/Inicio: (\d{4}-\d{2}-\d{2})/)
                    const startTime = ins.horario?.split('-')[0] || '17:00'

                    if (startDateMatch) {
                        const [y, m, dNum] = startDateMatch[1].split('-').map(Number)
                        const enrollmentStartDate = new Date(y, m - 1, dNum)

                        let d = new Date(enrollmentStartDate)
                        // Find first occurrence of this specific day
                        while (d.getDay() !== targetDayOfWeek) {
                            d.setDate(d.getDate() + 1)
                        }

                        // Add classes for each week until end of summer
                        const SUMMER_END = new Date(2026, 1, 28)
                        while (d <= SUMMER_END) {
                            if (d >= start && d <= end && d >= startOfDay) {
                                const safeDate = new Date(d)
                                const [h, min] = startTime.split(':').map(Number)
                                safeDate.setHours(h || 17, min || 0, 0, 0)

                                classes.push({
                                    id: `${ins.id}-summer-${diaText}-${d.getTime()}`,
                                    taller: `☀️ Verano - ${(ins as any).alumno.nombre}`,
                                    dia: diaText,
                                    hora: startTime,
                                    fecha: safeDate,
                                    estado: 'programada',
                                    tipo: 'verano'
                                })
                            }
                            d.setDate(d.getDate() + 7)
                        }
                    }
                } else {
                    // Logic for Regular Classes
                    let current = new Date(start)
                    const startTime = ins.horario?.includes('/') ?
                        (ins.horario.split('/')[diasInscripcion.indexOf(diaText)] || ins.horario.split('/')[0]).trim().split('-')[0] :
                        (ins.horario?.split('-')[0] || '16:00')

                    while (current <= end) {
                        if (current.getDay() === targetDayOfWeek && current >= startOfDay) {
                            const classDate = new Date(current)
                            const [h, min] = startTime.split(':').map(Number)
                            classDate.setHours(h || 16, min || 0, 0, 0)

                            classes.push({
                                id: `${ins.id}-${diaText}-${current.getTime()}`,
                                taller: `${ins.taller.nombre} (${(ins as any).alumno.nombre})`,
                                dia: diaText,
                                hora: startTime,
                                fecha: classDate,
                                estado: 'programada',
                                tipo: 'clase'
                            })
                        }
                        current.setDate(current.getDate() + 1)
                    }
                }
            }
        }

        // 2. Add Citas Nivelacion
        for (const cita of citas) {
            const fecha = new Date(cita.fecha)
            classes.push({
                id: (cita as any).id,
                taller: `🗣️ Nivelación - ${(cita as any).alumno.nombre}`,
                dia: DAYS_MAP[Object.keys(DAYS_MAP)[fecha.getDay()]] || '',
                hora: fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                fecha: fecha,
                estado: (cita as any).estado.toLowerCase(),
                tipo: 'nivelacion'
            })
        }

        return NextResponse.json({ classes })
    } catch (error) {
        console.error('Error al obtener calendario:', error)
        return NextResponse.json({ error: 'Error al obtener el calendario' }, { status: 500 })
    }
}
