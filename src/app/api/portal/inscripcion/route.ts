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
        const { type, studentId } = body

        // Find or Create student
        let alumno;
        if (studentId === 'new') {
            alumno = await prisma.alumno.create({
                data: {
                    usuarioId: session.user.id,
                    nivel: 'PRINCIPIANTE',
                    perfilCompleto: false
                }
            })
        } else if (studentId) {
            alumno = await prisma.alumno.findUnique({
                where: { id: studentId }
            })
        } else {
            // Fallback: If we have studentData, we should probably create a new student
            if (body.studentData) {
                alumno = await prisma.alumno.create({
                    data: {
                        usuarioId: session.user.id,
                        nivel: 'PRINCIPIANTE',
                        perfilCompleto: false
                    }
                })
            } else {
                // Otherwise, try to find any student for the user
                // If there's only one, we can assume it's that one (legacy support)
                // If there are multiple, we must return an error
                const students = await prisma.alumno.findMany({
                    where: { usuarioId: session.user.id }
                })

                if (students.length === 1) {
                    alumno = students[0]
                } else if (students.length > 1) {
                    return NextResponse.json({ error: 'Debes seleccionar un alumno' }, { status: 400 })
                } else {
                    // No students yet, but no studentData either
                    return NextResponse.json({ error: 'Faltan datos del alumno' }, { status: 400 })
                }
            }
        }

        if (!alumno) {
            return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 })
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

        // --- SINGLE CLASS FLOW ---
        if (type === 'single-class') {
            const { dia, horario, asiento } = body

            if (!dia || !horario || !asiento) {
                return NextResponse.json({ error: 'Faltan datos de la clase única' }, { status: 400 })
            }

            // Get or create Clase Única taller
            let taller = await prisma.taller.findFirst({
                where: { nombre: 'Clase Única', activo: true }
            })

            if (!taller) {
                // Create if doesn't exist
                taller = await prisma.taller.create({
                    data: {
                        nombre: 'Clase Única',
                        descripcion: 'Clase individual de prueba',
                        activo: true,
                        precio: 15000
                    }
                })
            }

            // Get price from configuration
            const precioConfig = await prisma.configuracion.findUnique({
                where: { clave: 'precio_clase_unica' }
            })
            const precio = precioConfig ? parseFloat(precioConfig.valor) : 15000

            await prisma.$transaction(async (tx) => {
                // Check seat availability
                const asientoOcupado = await tx.inscripcion.findFirst({
                    where: {
                        dia: dia,
                        horario: horario,
                        asiento: asiento.toString(),
                        estado: 'ACTIVA'
                    }
                })

                if (asientoOcupado) {
                    throw new Error(`El asiento ${asiento} ya está ocupado.`)
                }

                // Create enrollment
                const inscripcion = await tx.inscripcion.create({
                    data: {
                        alumnoId: alumno.id,
                        tallerId: taller.id,
                        dia: dia,
                        horario: horario,
                        asiento: asiento.toString(),
                        fase: 'Clase Única',
                        estado: 'ACTIVA',
                        pagado: false
                    } as any
                })

                // Create payment
                await tx.pago.create({
                    data: {
                        alumnoId: alumno.id,
                        inscripcionId: inscripcion.id,
                        monto: precio,
                        estado: 'PENDIENTE',
                        mesCubierto: new Date().getMonth() + 1,
                        anioCubierto: new Date().getFullYear(),
                        concepto: `Clase Única - ${dia} ${horario}`
                    }
                })

                // Notify user
                await tx.notificacion.create({
                    data: {
                        usuarioId: session.user.id,
                        titulo: 'Inscripción a Clase Única',
                        mensaje: `Tu clase está agendada para ${dia} a las ${horario}. Asiento: ${asiento}. Total: $${precio}`,
                        tipo: 'INFO',
                        leida: false
                    }
                })

                // Notify admins
                const admins = await tx.usuario.findMany({ where: { rol: 'ADMIN' } })
                for (const admin of admins) {
                    await tx.notificacion.create({
                        data: {
                            usuarioId: admin.id,
                            titulo: 'Nueva Clase Única',
                            mensaje: `${alumno.nombre || 'Un alumno'} se inscribió a una Clase Única (${dia} ${horario}). Total: $${precio}`,
                            tipo: 'INFO',
                            enlace: `/admin/alumnos/${alumno.id}`
                        }
                    })
                }
            })

            return NextResponse.json({ success: true })
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
                        asiento: '0',
                        estado: 'ACTIVA',
                        notas: `Modalidad: ${summerModality}, Freq: ${summerFrequency}, Inicio: ${summerStartDate}`,
                        pagado: false
                    } as any
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
                        tipo: 'INFO',
                        leida: false
                    }
                })

                // NOTIFICAR ADMINS
                const admins = await tx.usuario.findMany({ where: { rol: 'ADMIN' } })
                for (const admin of admins) {
                    await tx.notificacion.create({
                        data: {
                            usuarioId: admin.id,
                            titulo: 'Nueva Inscripción (Verano)',
                            mensaje: `${alumno.nombre || 'Un alumno'} se inscribió al Taller de Verano (${summerModality}). Total: $${monto}`,
                            tipo: 'INFO',
                            enlace: `/admin/alumnos/${alumno.id}`
                        }
                    })
                }
            })
        } else {
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
                let firstInscId = '';
                const allDays = enrollmentSlots.map((s: any) => s.dia).join(', ');

                // 1) Create Inscriptions and Validate
                for (let i = 0; i < enrollmentSlots.length; i++) {
                    const slot = enrollmentSlots[i];

                    const asientoOcupado = await tx.inscripcion.findFirst({
                        where: {
                            dia: { contains: slot.dia },
                            horario: { contains: slot.horario },
                            asiento: { contains: slot.asiento.toString() } as any,
                            estado: 'ACTIVA'
                        }
                    })

                    if (asientoOcupado) {
                        const seats = (asientoOcupado.asiento as unknown as string)?.split(',') || [];
                        if (seats.includes(slot.asiento.toString())) {
                            throw new Error(`El asiento ${slot.asiento} del ${slot.dia} ya está ocupado.`);
                        }
                    }

                    const newInsc = await tx.inscripcion.create({
                        data: {
                            alumnoId: alumno.id,
                            tallerId: taller.id,
                            dia: slot.dia,
                            horario: slot.horario,
                            fase,
                            asiento: slot.asiento.toString(),
                            pagado: false,
                            estado: 'ACTIVA'
                        } as any
                    })

                    if (i === 0) firstInscId = newInsc.id;
                }

                // 2) Create SINGLE Payment
                const totalAmount = 25000 * enrollmentSlots.length
                await tx.pago.create({
                    data: {
                        alumnoId: alumno.id,
                        inscripcionId: firstInscId,
                        monto: totalAmount,
                        estado: 'PENDIENTE',
                        mesCubierto: new Date().getMonth() + 1,
                        anioCubierto: new Date().getFullYear(),
                        concepto: `Cuota Mensual - ${taller.nombre} - ${fase} (${allDays})`
                    }
                })

                // 3) Notify
                await tx.notificacion.create({
                    data: {
                        usuarioId: session.user.id,
                        titulo: 'Inscripción Registrada',
                        mensaje: `Inscripción exitosa en ${fase}. Días: ${allDays}. Valor mensual: $${totalAmount}`,
                        tipo: 'INFO',
                        leida: false
                    }
                })

                // NOTIFICAR ADMINS
                const admins = await tx.usuario.findMany({ where: { rol: 'ADMIN' } })
                for (const admin of admins) {
                    await tx.notificacion.create({
                        data: {
                            usuarioId: admin.id,
                            titulo: 'Nueva Inscripción (Regular)',
                            mensaje: `${alumno.nombre || 'Un alumno'} se inscribió a ${fase}. Días: ${allDays}. Total: $${totalAmount}`,
                            tipo: 'INFO',
                            enlace: `/admin/alumnos/${alumno.id}`
                        }
                    })
                }
            })
        }

        // --- PROFILE UPDATE (IF PROVIDED) ---
        const { studentData, authData, signature } = body
        if (studentData && !alumno.perfilCompleto) {
            const {
                nombre, apellido, dni, fechaNacimiento, edad,
                domicilioCalle, domicilioNumero, domicilioTira, domicilioPiso, domicilioDepto,
                colegio, grado
            } = studentData

            const fullAddress = `${domicilioCalle} ${domicilioNumero}${domicilioTira ? `, Tira ${domicilioTira}` : ''}${domicilioPiso ? `, Piso ${domicilioPiso}` : ''}${domicilioDepto ? `, Depto ${domicilioDepto}` : ''}`

            await prisma.alumno.update({
                where: { id: alumno.id },
                data: {
                    nombre,
                    apellido,
                    dni,
                    fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
                    edad: edad ? parseInt(edad) : null,
                    domicilio: fullAddress,
                    domicilioCalle,
                    domicilioNumero,
                    domicilioTira,
                    domicilioPiso,
                    domicilioDepto,
                    colegio,
                    grado,
                    autorizacionParticipacion: authData?.autorizacionParticipacion || false,
                    autorizacionMedica: authData?.autorizacionMedica || false,
                    autorizacionRetiro: authData?.autorizacionRetiro,
                    autorizacionImagenes: authData?.autorizacionImagenes || false,
                    aceptacionReglamento: authData?.aceptacionReglamento || false,
                    firmaResponsable: signature,
                    aclaracionFirma: authData?.aclaracionFirma,
                    dniFirma: authData?.dniFirma,
                    perfilCompleto: true
                } as any
            })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error en inscripción:', error)
        const message = error instanceof Error ? error.message : 'Error al procesar la inscripción';
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
