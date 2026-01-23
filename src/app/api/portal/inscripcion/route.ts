import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { type } = body

        // Find student
        let alumno = await prisma.alumno.findUnique({
            where: { usuarioId: session.user.id }
        })

        if (!alumno) {
            // Auto-create Alumno if not exists (Robustness fix)
            console.log('Alumno no encontrado, creando perfil automático para:', session.user.id)
            alumno = await prisma.alumno.create({
                data: {
                    usuarioId: session.user.id,
                    nivel: 'PRINCIPIANTE'
                }
            })
        }

        // --- PLACEMENT TEST FLOW ---
        if (type === 'placement') {
            // SINGLETON CHECK: Verify if user already has a pending test
            const existingCita = await prisma.citaNivelacion.findFirst({
                where: {
                    alumnoId: alumno.id,
                    estado: 'PENDIENTE'
                }
            })

            if (existingCita) {
                return NextResponse.json({ error: 'Ya tienes una prueba de nivelación agendada.' }, { status: 400 })
            }

            const { date, time } = body
            if (!date || !time) return NextResponse.json({ error: 'Faltan fecha u hora' }, { status: 400 })

            // Create Date object directly from input
            const fechaCita = new Date(`${date}T${time}`)

            const cita = await prisma.citaNivelacion.create({
                data: {
                    alumnoId: alumno.id,
                    fecha: fechaCita,
                    estado: 'PENDIENTE',
                    notas: 'Solicitado desde portal'
                }
            })

            // Create notification
            await prisma.notificacion.create({
                data: {
                    usuarioId: session.user.id,
                    titulo: 'Cita de Nivelación Agendada',
                    mensaje: `Te esperamos el ${new Date(date).toLocaleDateString()} a las ${time}hs para tu prueba de nivel.`,
                    tipo: 'INFO',
                    leida: false
                }
            })

            return NextResponse.json({ success: true, cita })
        }

        // --- ENROLLMENT FLOW ---
        const { slots, fase, isSummer, summerModality, summerDay, summerStartDate } = body

        if (isSummer) {
            const { summerDays, summerTime, summerFrequency } = body

            if (!summerModality || !summerDays || !summerDays.length || !summerStartDate || !summerTime) {
                return NextResponse.json({ error: 'Faltan datos del taller de verano' }, { status: 400 })
            }

            // Buscar o Crear el Taller de Verano
            let taller = await prisma.taller.findFirst({
                where: {
                    nombre: { contains: 'Verano' },
                    activo: true
                }
            })

            if (!taller) {
                console.log('Creando Taller de Verano...')
                taller = await prisma.taller.create({
                    data: {
                        nombre: 'Taller de Verano 2026',
                        descripcion: 'Taller artístico de temporada',
                        precio: 75000,
                        activo: true
                    }
                })
            }

            // Calculate Price (Matching Frontend Logic)
            const SUMMER_END_DATE = new Date(2026, 1, 28) // Feb 28, 2026
            const startDate = new Date(summerStartDate)

            // Rates
            const RATES: any = {
                'BASE': { '1x': 75000, '2x': 130000 },
                'EXTENDED': { '1x': 145000, '2x': 210000 }
            }
            const PROMOS: any = {
                'BASE': { '1x': 150000, '2x': 260000 },
                'EXTENDED': { '1x': 260000, '2x': 380000 }
            }

            const monthlyRate = RATES[summerModality][summerFrequency || '1x'] || 75000
            const promoPrice = PROMOS[summerModality][summerFrequency || '1x'] || 150000

            const msPerWeek = 7 * 24 * 60 * 60 * 1000
            const weeksRemaining = Math.max(1, Math.ceil((SUMMER_END_DATE.getTime() - startDate.getTime()) / msPerWeek))

            // Price calculation
            // If full duration (starts near Jan 6), use promo price.
            // approx 7 weeks threshold to be safe
            let monto = 0
            if (weeksRemaining >= 7) {
                monto = promoPrice
            } else {
                const pricePerWeek = monthlyRate / 4
                const calculatedPrice = Math.round(weeksRemaining * pricePerWeek)
                monto = Math.min(calculatedPrice, promoPrice)
            }

            await prisma.$transaction(async (tx) => {
                const createdInscriptions = []

                // Create inscription for EACH day
                for (const dia of summerDays) {
                    const inscripcion = await tx.inscripcion.create({
                        data: {
                            alumnoId: alumno.id,
                            tallerId: taller!.id,
                            fase: 'Taller de Verano',
                            dia: dia,
                            horario: summerTime,
                            asiento: 0, // Virtual seat
                            estado: 'ACTIVA',
                            notas: `Modalidad: ${summerModality}, Freq: ${summerFrequency}, Inicio: ${summerStartDate}`,
                            pagado: false
                        }
                    })
                    createdInscriptions.push(inscripcion)
                }

                // Create Payment linked to the FIRST inscription (covering all)
                if (createdInscriptions.length > 0) {
                    await tx.pago.create({
                        data: {
                            alumnoId: alumno.id,
                            inscripcionId: createdInscriptions[0].id,
                            monto: monto,
                            estado: 'PENDIENTE',
                            mesCubierto: new Date().getMonth() + 1,
                            anioCubierto: new Date().getFullYear(),
                            concepto: `Taller Verano (${summerFrequency}) - ${summerModality} - ${summerDays.join('+')}`
                        }
                    })
                }

                await tx.notificacion.create({
                    data: {
                        usuarioId: session.user.id,
                        titulo: 'Inscripción Taller de Verano',
                        mensaje: `Inscripción exitosa. Modalidad ${summerModality}, Días: ${summerDays.join(', ')}. Valor total: $${monto}`,
                        tipo: 'SUCCESS',
                        leida: false
                    }
                })
            })

            return NextResponse.json({
                success: true
            })
        }

        // --- REGULAR FLOW ---
        // slots: { dia, horario, asiento }[]

        // Simplify payload check: if 'slots' is present, use new flow. Fallback to single slot if legacy fields provided?
        // Let's enforce 'slots' array for the new UI.
        const enrollmentSlots = slots || (body.dia ? [{ dia: body.dia, horario: body.horario, asiento: body.asiento }] : [])

        if (!fase || enrollmentSlots.length === 0) {
            return NextResponse.json({ error: 'Faltan datos de inscripción' }, { status: 400 })
        }

        // 1) Validate Max Slots (2 Days)
        // Check existing active enrollments to enforce strict global limit if needed.
        const activeEnrollmentsCount = await prisma.inscripcion.count({
            where: {
                alumnoId: alumno.id,
                estado: 'ACTIVA'
            }
        })

        if (activeEnrollmentsCount + enrollmentSlots.length > 2) {
            return NextResponse.json({ error: 'El máximo es de 2 días de cursada por alumno.' }, { status: 400 })
        }

        // 2) Validate Each Slot
        const diasValidos = ['MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']
        const horariosValidos = ['16:00-17:20', '17:30-18:50', '19:10-20:30']

        // We need to fetch Taller ID.
        const taller = await prisma.taller.findFirst({ where: { activo: true } })
        if (!taller) return NextResponse.json({ error: 'No hay talleres activos configurados' }, { status: 500 })

        // 3) Process Inscriptions Transactionally
        const inscriptionsResults: any[] = []

        // Use an interactive transaction or sequential checks + create to assume consistency. 
        // Prisma transaction is safer.
        try {
            await prisma.$transaction(async (tx) => {
                for (const slot of enrollmentSlots) {
                    const { dia, horario, asiento } = slot

                    // Val: Day/Time
                    if (!diasValidos.includes(dia.toUpperCase())) throw new Error(`Día no válido: ${dia}`)
                    if (!horariosValidos.includes(horario)) throw new Error(`Horario no válido: ${horario}`)
                    if (!asiento) throw new Error('Falta seleccionar asiento')

                    // Val: Seat Occupied?
                    const asientoOcupado = await tx.inscripcion.findFirst({
                        where: {
                            dia,
                            horario,
                            asiento,
                            estado: 'ACTIVA'
                        }
                    })
                    if (asientoOcupado) throw new Error(`El asiento ${asiento} del ${dia} ${horario} ya está ocupado.`)

                    // Val: Turn Capacity (redundant if seats map is 1-10, but good safety)
                    const inscritos = await tx.inscripcion.count({ where: { dia, horario, estado: 'ACTIVA' } })
                    if (inscritos >= 10) throw new Error(`El turno del ${dia} ${horario} está completo.`)

                    // Create
                    const newInsc = await tx.inscripcion.create({
                        data: {
                            alumnoId: alumno.id,
                            tallerId: taller.id,
                            dia,
                            horario,
                            fase,
                            asiento,
                            pagado: false, // Payment pending
                            estado: 'ACTIVA'
                        }
                    })
                    inscriptionsResults.push(newInsc)

                    // Create Payment (PENDIENTE)
                    await tx.pago.create({
                        data: {
                            alumnoId: alumno.id,
                            inscripcionId: newInsc.id,
                            monto: 25000,
                            estado: 'PENDIENTE',
                            mesCubierto: new Date().getMonth() + 1,
                            anioCubierto: new Date().getFullYear(),
                            concepto: `Inscripción - ${fase}, ${dia} ${horario}, Asiento: ${asiento}`
                        }
                    })
                }

                // Notification (Single summary notification)
                const diasStr = enrollmentSlots.map((s: any) => `${s.dia} ${s.horario} (A${s.asiento})`).join(', ')
                await tx.notificacion.create({
                    data: {
                        usuarioId: session.user.id,
                        titulo: 'Inscripción Registrada',
                        mensaje: `Tu inscripción en ${fase} ha sido registrada. Turnos: ${diasStr}. Realizá la transferencia para confirmar.`,
                        tipo: 'INFO',
                        leida: false
                    }
                })
            })
        } catch (err: any) {
            // Rethrow to catch block below
            throw new Error(err.message)
        }

        return NextResponse.json({
            success: true,
            inscripciones: inscriptionsResults
        })

    } catch (error: any) {
        console.error('Error en inscripción:', error)
        return NextResponse.json({ error: error.message || 'Error al procesar la inscripción' }, { status: 500 })
    }
}
