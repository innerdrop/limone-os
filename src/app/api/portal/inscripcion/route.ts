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
            alumno = await prisma.alumno.create({
                data: {
                    usuarioId: session.user.id,
                    nivel: 'PRINCIPIANTE'
                }
            })
        }

        // --- PLACEMENT TEST FLOW ---
        if (type === 'placement') {
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

            const fechaCita = new Date(`${date}T${time}`)

            const cita = await prisma.citaNivelacion.create({
                data: {
                    alumnoId: alumno.id,
                    fecha: fechaCita,
                    estado: 'PENDIENTE',
                    notas: 'Solicitado desde portal'
                }
            })

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
        const { slots, fase, isSummer, summerModality, summerDays, summerTime, summerFrequency, summerStartDate } = body

        if (isSummer) {
            if (!summerModality || !summerDays || !summerDays.length || !summerStartDate || !summerTime) {
                return NextResponse.json({ error: 'Faltan datos del taller de verano' }, { status: 400 })
            }

            const taller = await prisma.taller.findFirst({
                where: { nombre: 'Taller de Verano', activo: true }
            })

            if (!taller) return NextResponse.json({ error: 'Taller de Verano no configurado' }, { status: 500 })

            // Calculate Price
            const SUMMER_END_DATE = new Date(2026, 1, 28)
            const startDate = new Date(summerStartDate)

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

            let monto = 0
            if (weeksRemaining >= 7) {
                monto = promoPrice
            } else {
                const pricePerWeek = monthlyRate / 4
                const calculatedPrice = Math.round(weeksRemaining * pricePerWeek)
                monto = Math.min(calculatedPrice, promoPrice)
            }

            await prisma.$transaction(async (tx) => {
                const diasCombinados = summerDays.join(', ')
                const inscripcion = await tx.inscripcion.create({
                    data: {
                        alumnoId: alumno.id,
                        tallerId: taller.id,
                        fase: 'Taller de Verano',
                        dia: diasCombinados,
                        horario: summerTime,
                        asiento: 0,
                        estado: 'ACTIVA',
                        notas: `Modalidad: ${summerModality}, Freq: ${summerFrequency}, Inicio: ${summerStartDate}`,
                        pagado: false
                    }
                })

                await tx.pago.create({
                    data: {
                        alumnoId: alumno.id,
                        inscripcionId: inscripcion.id,
                        monto: monto,
                        estado: 'PENDIENTE',
                        mesCubierto: new Date().getMonth() + 1,
                        anioCubierto: new Date().getFullYear(),
                        concepto: `Taller Verano (${summerFrequency}) - ${summerModality} - ${diasCombinados}`
                    }
                })

                await tx.notificacion.create({
                    data: {
                        usuarioId: session.user.id,
                        titulo: 'Inscripción Taller de Verano',
                        mensaje: `Inscripción exitosa. Modalidad ${summerModality}, Días: ${diasCombinados}. Valor total: $${monto}`,
                        tipo: 'SUCCESS',
                        leida: false
                    }
                })
            })

            return NextResponse.json({ success: true })
        }

        // --- REGULAR FLOW ---
        const enrollmentSlots = slots || (body.dia ? [{ dia: body.dia, horario: body.horario, asiento: body.asiento }] : [])

        if (!fase || enrollmentSlots.length === 0) {
            return NextResponse.json({ error: 'Faltan datos de inscripción' }, { status: 400 })
        }

        const taller = await prisma.taller.findFirst({
            where: { nombre: 'Taller Regular', activo: true }
        })
        if (!taller) return NextResponse.json({ error: 'Taller Regular no configurado' }, { status: 500 })

        await prisma.$transaction(async (tx) => {
            // 1) Validate seats
            for (const slot of enrollmentSlots) {
                const asientoOcupado = await tx.inscripcion.findFirst({
                    where: {
                        dia: { contains: slot.dia },
                        horario: slot.horario,
                        asiento: slot.asiento,
                        estado: 'ACTIVA'
                    }
                })
                if (asientoOcupado) throw new Error(`El asiento ${slot.asiento} del ${slot.dia} ya está ocupado.`)
            }

            // 2) Create SINGLE Inscription
            const diasStr = enrollmentSlots.map((s: any) => s.dia).join(', ')
            const horariosStr = enrollmentSlots.map((s: any) => s.horario).join(' / ')
            const asientosStr = enrollmentSlots.map((s: any) => `A${s.asiento}`).join(' / ')

            const newInsc = await tx.inscripcion.create({
                data: {
                    alumnoId: alumno.id,
                    tallerId: taller.id,
                    dia: diasStr,
                    horario: horariosStr,
                    fase,
                    asiento: enrollmentSlots[0].asiento,
                    pagado: false,
                    estado: 'ACTIVA',
                    notas: `Asientos: ${asientosStr}`
                }
            })

            // 3) Create SINGLE Payment
            const totalAmount = 25000 * enrollmentSlots.length
            await tx.pago.create({
                data: {
                    alumnoId: alumno.id,
                    inscripcionId: newInsc.id,
                    monto: totalAmount,
                    estado: 'PENDIENTE',
                    mesCubierto: new Date().getMonth() + 1,
                    anioCubierto: new Date().getFullYear(),
                    concepto: `Cuota Mensual - ${taller.nombre} - ${fase} (${diasStr})`
                }
            })

            // 4) Notify
            await tx.notificacion.create({
                data: {
                    usuarioId: session.user.id,
                    titulo: 'Inscripción Registrada',
                    mensaje: `Inscripción exitosa en ${fase}. Días: ${diasStr}. Valor mensual: $${totalAmount}`,
                    tipo: 'INFO',
                    leida: false
                }
            })
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error en inscripción:', error)
        const message = error instanceof Error ? error.message : 'Error al procesar la inscripción';
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
