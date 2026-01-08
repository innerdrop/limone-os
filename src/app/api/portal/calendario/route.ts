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

        const student = await prisma.alumno.findUnique({
            where: { usuarioId: session.user.id },
            include: {
                inscripciones: {
                    where: { pagado: true, estado: 'ACTIVA' },
                    include: { taller: true }
                },
                citasNivelacion: {
                    where: {
                        fecha: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0)
                        }
                    }
                }
            }
        })

        if (!student) return NextResponse.json({ classes: [] })

        const enrollments = student.inscripciones
        const citas = student.citasNivelacion || []
        const classes: any[] = []

        // 1. Regular Classes Generation
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 2, 0)

        for (const ins of enrollments) {
            // Logic for regular classes
            const targetDay = DAYS_MAP[ins.dia || '']

            if (ins.dia === 'VERANO' && ins.notas) {
                // Parse Summer Workshop: "Modalidad: ..., Frecuencia: 1x, Inicio: YYYY-MM-DD"
                const startDateMatch = ins.notas.match(/Inicio: (\d{4}-\d{2}-\d{2})/)
                const frequencyMatch = ins.notas.match(/Frecuencia: (\d)x/)

                if (startDateMatch) {
                    const [y, m, dNum] = startDateMatch[1].split('-').map(Number)
                    const startDate = new Date(y, m - 1, dNum)
                    const freq = frequencyMatch ? parseInt(frequencyMatch[1]) : 1

                    // Calculate how many days per week (1x = 1 day/week, 2x = 2 days/week)
                    // For continuous days: if 1x per week, show 1 week of continuous days
                    // if 2x per week, show 2 weeks of continuous days
                    const weeksToShow = freq // 1x = 1 week, 2x = 2 weeks
                    const daysToShow = weeksToShow * 5 // 5 days per week (Mon-Fri)

                    let d = new Date(startDate)
                    let daysAdded = 0

                    while (daysAdded < daysToShow) {
                        // Check if current d is within the requested view range [start, end]
                        if (d >= start && d <= end) {
                            const dayOfWeek = d.getDay()

                            // Skip weekends (0=Sun, 6=Sat)
                            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                                // Set time to 17:00 for summer workshop
                                const safeDate = new Date(d)
                                safeDate.setHours(17, 0, 0, 0)

                                classes.push({
                                    id: `${ins.id}-summer-${d.getTime()}`,
                                    taller: 'Colonia de Verano',
                                    dia: 'Verano',
                                    hora: '17:00',
                                    fecha: safeDate,
                                    estado: 'programada',
                                    tipo: 'verano'
                                })
                                daysAdded++
                            }
                        }
                        d.setDate(d.getDate() + 1)
                    }
                }
                continue
            }

            if (targetDay === undefined) continue

            let current = new Date(start)
            while (current <= end) {
                if (current.getDay() === targetDay) {
                    classes.push({
                        id: `${ins.id}-${current.getTime()}`,
                        taller: ins.taller.nombre,
                        dia: ins.dia,
                        hora: ins.horario?.split('-')[0] || '00:00',
                        fecha: new Date(current),
                        estado: 'programada',
                        tipo: 'clase'
                    })
                }
                current.setDate(current.getDate() + 1)
            }
        }

        // 2. Add Citas Nivelacion
        for (const cita of citas) {
            const fecha = new Date(cita.fecha)
            classes.push({
                id: cita.id,
                taller: 'Prueba de Nivelación',
                dia: DAYS_MAP[Object.keys(DAYS_MAP)[fecha.getDay()]] || '',
                // Note: DAYS_MAP keys are in spanish, need reverse lookup or simple str
                // Actually `dia` field in `Clase` interface is mostly for display/logic, 
                // but let's just ensure `fecha` is correct.
                hora: fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                fecha: fecha,
                estado: cita.estado.toLowerCase(),
                tipo: 'nivelacion'
            })
        }

        return NextResponse.json({ classes })
    } catch (error: any) {
        console.error('Error al obtener calendario:', error)
        return NextResponse.json({ error: 'Error al obtener el calendario' }, { status: 500 })
    }
}
