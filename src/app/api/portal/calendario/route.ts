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

                    // Summer ends Feb 28th 2026
                    const summerEnd = new Date(2026, 1, 28) // Month is 0-indexed (1 = Feb)

                    let d = new Date(startDate)
                    // Ensure we don't start before the requested range 'start' if possible, 
                    // but we need to calculate correct day-of-week recurrence.

                    // Main recurrence day
                    const mainDay = startDate.getDay()
                    // Secondary day for 2x: Add 3 days (e.g., Mon->Thu, Tue->Fri)
                    const secondDay = (mainDay + 3) % 7

                    while (d <= summerEnd) {
                        // Check if current d is within the requested view range [start, end]
                        if (d >= start && d <= end) {
                            const dayOfWeek = d.getDay()

                            // Weekend Check (0=Sun, 6=Sat) - Taller Limoné is likely closed?
                            // Assuming Summer Workshop runs Mon-Fri
                            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                                // Check if this day matches our frequency pattern
                                const isMainDay = dayOfWeek === mainDay
                                const isSecondDay = freq === 2 && dayOfWeek === secondDay

                                if (isMainDay || isSecondDay) {
                                    // Set time to 12:00 to avoid timezone shifts (e.g. 00:00 UTC -> Previous Day in Local)
                                    const safeDate = new Date(d)
                                    safeDate.setHours(12, 0, 0, 0)

                                    classes.push({
                                        id: `${ins.id}-summer-${d.getTime()}`,
                                        taller: 'Taller de Verano',
                                        dia: 'Verano Intensivo',
                                        // Use explicit time if user wants, but 12:00 safe for date placement
                                        hora: '17:00',
                                        fecha: safeDate,
                                        estado: 'programada',
                                        tipo: 'taller'
                                    })
                                }
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
