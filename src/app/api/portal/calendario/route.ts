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

            // Summer Workshop: Now uses 'dia' field for the selected day of the week
            // Check if this is a summer workshop enrollment (fase contains 'Verano' or dia is a valid weekday with verano notes)
            if (ins.fase === 'Taller de Verano' && ins.notas && ins.dia) {
                // Parse Summer Workshop: "Modalidad: ..., Dia: MARTES, Inicio: YYYY-MM-DD, Semanas: X"
                const startDateMatch = ins.notas.match(/Inicio: (\d{4}-\d{2}-\d{2})/)
                const weeksMatch = ins.notas.match(/Semanas: (\d+)/)
                const selectedDay = ins.dia // e.g., 'MARTES', 'MIERCOLES', etc.

                if (startDateMatch && DAYS_MAP[selectedDay] !== undefined) {
                    const [y, m, dNum] = startDateMatch[1].split('-').map(Number)
                    const enrollmentStartDate = new Date(y, m - 1, dNum)
                    const weeksRemaining = weeksMatch ? parseInt(weeksMatch[1]) : 8
                    const targetDayOfWeek = DAYS_MAP[selectedDay]

                    // Generate one class per week on the selected day
                    let d = new Date(enrollmentStartDate)
                    let classesAdded = 0

                    // Find the first occurrence of the selected day from the start date
                    while (d.getDay() !== targetDayOfWeek) {
                        d.setDate(d.getDate() + 1)
                    }

                    // Add classes for each week until end of summer or weeks remaining
                    const SUMMER_END = new Date(2026, 1, 28) // Feb 28, 2026
                    while (classesAdded < weeksRemaining && d <= SUMMER_END) {
                        // Check if within the view range
                        if (d >= start && d <= end) {
                            const safeDate = new Date(d)
                            safeDate.setHours(17, 0, 0, 0)

                            classes.push({
                                id: `${ins.id}-summer-${d.getTime()}`,
                                taller: 'Taller de Verano',
                                dia: selectedDay,
                                hora: '17:00',
                                fecha: safeDate,
                                estado: 'programada',
                                tipo: 'verano'
                            })
                        }
                        classesAdded++
                        d.setDate(d.getDate() + 7) // Move to next week
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
    } catch (error) {
        console.error('Error al obtener calendario:', error)
        return NextResponse.json({ error: 'Error al obtener el calendario' }, { status: 500 })
    }
}
