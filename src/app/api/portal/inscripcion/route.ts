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
        const { type, studentId, studentData, authData, signature } = body

        // Find or Create student
        let alumno;

        if (studentId === 'new' || (!studentId && studentData)) {
            // CREATE NEW STUDENT
            const {
                nombre, apellido, dni, fechaNacimiento, edad,
                domicilioCalle, domicilioNumero, domicilioTira, domicilioPiso, domicilioDepto,
                colegio, grado
            } = studentData || {};

            const fullAddress = studentData ? `${domicilioCalle} ${domicilioNumero}${domicilioTira ? `, Tira ${domicilioTira}` : ''}${domicilioPiso ? `, Piso ${domicilioPiso}` : ''}${domicilioDepto ? `, Depto ${domicilioDepto}` : ''}` : null;

            alumno = await prisma.alumno.create({
                data: {
                    usuarioId: session.user.id,
                    nivel: 'PRINCIPIANTE',
                    perfilCompleto: !!studentData,
                    nombre: nombre?.trim() || 'Nuevo Alumno',
                    apellido: apellido?.trim() || '',
                    dni: dni || null,
                    fechaNacimiento: fechaNacimiento && fechaNacimiento !== '' ? new Date(fechaNacimiento) : null,
                    edad: edad ? parseInt(edad) : null,
                    domicilio: fullAddress,
                    domicilioCalle: domicilioCalle || null,
                    domicilioNumero: domicilioNumero || null,
                    domicilioTira: domicilioTira || null,
                    domicilioPiso: domicilioPiso || null,
                    domicilioDepto: domicilioDepto || null,
                    colegio: colegio || null,
                    grado: grado || null,
                    autorizacionParticipacion: authData?.autorizacionParticipacion || false,
                    autorizacionMedica: authData?.autorizacionMedica || false,
                    autorizacionRetiro: authData?.autorizacionRetiro || null,
                    autorizacionImagenes: authData?.autorizacionImagenes || false,
                    aceptacionReglamento: authData?.aceptacionReglamento || false,
                    firmaResponsable: signature || null,
                    aclaracionFirma: authData?.aclaracionFirma || null,
                    dniFirma: authData?.dniFirma || null,
                } as any
            })
        } else if (studentId) {
            // USE EXISTING STUDENT
            alumno = await prisma.alumno.findUnique({
                where: { id: studentId }
            })
        } else {
            // FALLBACK TO SINGLE STUDENT IF EXISTS
            const students = await prisma.alumno.findMany({
                where: { usuarioId: session.user.id }
            })

            if (students.length === 1) {
                alumno = students[0]
            } else if (students.length > 1) {
                return NextResponse.json({ error: 'Debes seleccionar un alumno' }, { status: 400 })
            } else {
                return NextResponse.json({ error: 'Faltan datos del alumno' }, { status: 400 })
            }
        }

        if (!alumno) {
            return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 })
        }

        let finalResponse: any = { success: true };

        if (type === 'placement') {
            // --- PLACEMENT TEST FLOW ---
            const existingCita = await prisma.citaNivelacion.findFirst({
                where: { alumnoId: alumno.id, estado: 'PENDIENTE' }
            })

            if (existingCita) {
                return NextResponse.json({ error: 'Ya tienes una prueba de nivelación agendada.' }, { status: 400 })
            }

            const { date, time } = body
            if (!date || !time) return NextResponse.json({ error: 'Faltan fecha u hora' }, { status: 400 })

            const cita = await prisma.citaNivelacion.create({
                data: {
                    alumnoId: alumno.id,
                    fecha: new Date(`${date}T${time}`),
                    estado: 'PENDIENTE',
                    notas: 'Solicitado desde portal'
                }
            })

            await prisma.notificacion.create({
                data: {
                    usuarioId: session.user.id,
                    titulo: 'Cita de Nivelación Agendada',
                    mensaje: `Te esperamos el ${new Date(date).toLocaleDateString()} a las ${time}hs para tu prueba de nivel.`,
                    tipo: 'INFO'
                }
            })
            finalResponse = { success: true, cita };
        } else if (type === 'single-class') {
            // --- SINGLE CLASS FLOW ---
            const { dia, horario, asiento } = body
            if (!dia || !horario || !asiento) return NextResponse.json({ error: 'Faltan datos de la clase' }, { status: 400 })

            const taller = await prisma.taller.findFirst({
                where: { nombre: { contains: 'Única' } }
            }) || await prisma.taller.findFirst()

            if (!taller) return NextResponse.json({ error: 'Taller no encontrado' }, { status: 404 })

            const precioConfig = await prisma.configuracion.findUnique({ where: { clave: 'PRECIO_CLASE_UNICA' } })
            const precio = precioConfig ? parseFloat(precioConfig.valor) : 15000

            await prisma.$transaction(async (tx) => {
                const asientoOcupado = await tx.inscripcion.findFirst({
                    where: { dia, horario, asiento: asiento.toString(), estado: 'ACTIVA' }
                })
                if (asientoOcupado) throw new Error(`El asiento ${asiento} ya está ocupado.`)

                const inscripcion = await tx.inscripcion.create({
                    data: {
                        alumnoId: alumno.id,
                        tallerId: taller.id,
                        dia,
                        horario,
                        asiento: asiento.toString(),
                        fase: 'Clase Única'
                    } as any
                })

                await tx.pago.create({
                    data: {
                        alumnoId: alumno.id,
                        inscripcionId: inscripcion.id,
                        monto: precio,
                        mesCubierto: new Date().getMonth() + 1,
                        anioCubierto: new Date().getFullYear(),
                        concepto: `Clase Única - ${dia} ${horario}`
                    }
                })

                await tx.notificacion.create({
                    data: {
                        usuarioId: session.user.id,
                        titulo: 'Inscripción a Clase Única',
                        mensaje: `Tu clase está agendada para ${dia} a las ${horario}. Asiento: ${asiento}. Total: $${precio}`
                    }
                })
            })
            finalResponse = { success: true };
        } else {
            // --- ENROLLMENT FLOW (SUMMER or REGULAR) ---
            const { isSummer } = body

            if (isSummer) {
                const { summerModality, summerDays, summerTime, summerFrequency, summerStartDate } = body
                if (!summerModality || !summerDays?.length || !summerStartDate || !summerTime) {
                    return NextResponse.json({ error: 'Faltan datos del taller de verano' }, { status: 400 })
                }

                const taller = await prisma.taller.findFirst({ where: { nombre: 'Taller de Verano', activo: true } })
                if (!taller) return NextResponse.json({ error: 'Taller de Verano no configurado' }, { status: 500 })

                const SUMMER_END_DATE = new Date(2026, 1, 28)
                const startDate = new Date(summerStartDate)
                const RATES: any = { 'BASE': { '1x': 75000, '2x': 130000 }, 'EXTENDED': { '1x': 145000, '2x': 210000 } }
                const PROMOS: any = { 'BASE': { '1x': 150000, '2x': 260000 }, 'EXTENDED': { '1x': 260000, '2x': 380000 } }

                const monthlyRate = RATES[summerModality][summerFrequency || '1x'] || 75000
                const promoPrice = PROMOS[summerModality][summerFrequency || '1x'] || 150000
                const weeksRemaining = Math.max(1, Math.ceil((SUMMER_END_DATE.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)))
                const monto = weeksRemaining >= 7 ? promoPrice : Math.min(Math.round(weeksRemaining * (monthlyRate / 4)), promoPrice)

                await prisma.$transaction(async (tx) => {
                    const diasCombinados = summerDays.join(', ')
                    const inscripcion = await tx.inscripcion.create({
                        data: {
                            alumnoId: alumno.id,
                            tallerId: taller.id,
                            fase: 'Taller de Verano',
                            dia: diasCombinados,
                            horario: summerTime,
                            asiento: '0',
                            notas: `Modalidad: ${summerModality}, Freq: ${summerFrequency}, Inicio: ${summerStartDate}`
                        } as any
                    })

                    await tx.pago.create({
                        data: {
                            alumnoId: alumno.id,
                            inscripcionId: inscripcion.id,
                            monto,
                            mesCubierto: new Date().getMonth() + 1,
                            anioCubierto: new Date().getFullYear(),
                            concepto: `Taller Verano (${summerFrequency}) - ${summerModality} - ${diasCombinados}`
                        }
                    })

                    await tx.notificacion.create({
                        data: {
                            usuarioId: session.user.id,
                            titulo: 'Inscripción Taller de Verano',
                            mensaje: `Inscripción exitosa. Valor total: $${monto}`
                        }
                    })
                })
                finalResponse = { success: true };
            } else {
                // REGULAR FLOW
                const { slots, fase } = body
                const enrollmentSlots = slots || (body.dia ? [{ dia: body.dia, horario: body.horario, asiento: body.asiento }] : [])

                if (!fase || enrollmentSlots.length === 0) {
                    return NextResponse.json({ error: 'Faltan datos de inscripción' }, { status: 400 })
                }

                const taller = await prisma.taller.findFirst({ where: { nombre: 'Taller Regular', activo: true } })
                if (!taller) return NextResponse.json({ error: 'Taller Regular no configurado' }, { status: 500 })

                await prisma.$transaction(async (tx) => {
                    let firstInscId = '';
                    const allDays = enrollmentSlots.map((s: any) => s.dia).join(', ');

                    for (let i = 0; i < enrollmentSlots.length; i++) {
                        const slot = enrollmentSlots[i];
                        const newInsc = await tx.inscripcion.create({
                            data: {
                                alumnoId: alumno.id,
                                tallerId: taller.id,
                                dia: slot.dia,
                                horario: slot.horario,
                                fase,
                                asiento: slot.asiento.toString()
                            } as any
                        })
                        if (i === 0) firstInscId = newInsc.id;
                    }

                    const totalAmount = 25000 * enrollmentSlots.length
                    await tx.pago.create({
                        data: {
                            alumnoId: alumno.id,
                            inscripcionId: firstInscId,
                            monto: totalAmount,
                            mesCubierto: new Date().getMonth() + 1,
                            anioCubierto: new Date().getFullYear(),
                            concepto: `Cuota Mensual - ${taller.nombre} - ${fase} (${allDays})`
                        }
                    })

                    await tx.notificacion.create({
                        data: {
                            usuarioId: session.user.id,
                            titulo: 'Inscripción Registrada',
                            mensaje: `Inscripción exitosa en ${fase}. Días: ${allDays}.`
                        }
                    })
                })
                finalResponse = { success: true };
            }
        }

        // --- FINAL PROFILE UPDATE (if data provided and not complete) ---
        if (studentData && !alumno.perfilCompleto) {
            const {
                nombre, apellido, dni, fechaNacimiento, edad,
                domicilioCalle, domicilioNumero, domicilioTira, domicilioPiso, domicilioDepto,
                colegio, grado
            } = studentData;

            const fullAddress = `${domicilioCalle} ${domicilioNumero}${domicilioTira ? `, Tira ${domicilioTira}` : ''}${domicilioPiso ? `, Piso ${domicilioPiso}` : ''}${domicilioDepto ? `, Depto ${domicilioDepto}` : ''}`;

            await prisma.alumno.update({
                where: { id: alumno.id },
                data: {
                    nombre: nombre?.trim() || alumno.nombre,
                    apellido: apellido?.trim() || alumno.apellido,
                    dni: dni || alumno.dni,
                    fechaNacimiento: fechaNacimiento && fechaNacimiento !== '' ? new Date(fechaNacimiento) : alumno.fechaNacimiento,
                    edad: edad ? parseInt(edad) : alumno.edad,
                    domicilio: fullAddress,
                    domicilioCalle, domicilioNumero, domicilioTira, domicilioPiso, domicilioDepto,
                    colegio, grado,
                    autorizacionParticipacion: authData?.autorizacionParticipacion ?? alumno.autorizacionParticipacion,
                    autorizacionMedica: authData?.autorizacionMedica ?? alumno.autorizacionMedica,
                    autorizacionRetiro: authData?.autorizacionRetiro ?? alumno.autorizacionRetiro,
                    autorizacionImagenes: authData?.autorizacionImagenes ?? alumno.autorizacionImagenes,
                    aceptacionReglamento: authData?.aceptacionReglamento ?? alumno.aceptacionReglamento,
                    firmaResponsable: signature ?? alumno.firmaResponsable,
                    aclaracionFirma: authData?.aclaracionFirma ?? alumno.aclaracionFirma,
                    dniFirma: authData?.dniFirma ?? alumno.dniFirma,
                    perfilCompleto: true
                } as any
            })
        }

        return NextResponse.json(finalResponse)

    } catch (error: any) {
        console.error('Error en inscripción:', error)
        return NextResponse.json({ error: error.message || 'Error al procesar la inscripción' }, { status: 500 })
    }
}
