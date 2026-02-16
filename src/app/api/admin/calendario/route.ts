import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DOCENTE')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const diasNoLaborables = await (prisma as any).diaNoLaborable.findMany({
            orderBy: { fecha: 'asc' }
        })

        return NextResponse.json(diasNoLaborables)
    } catch (error) {
        console.error('Error fetching non-working days:', error)
        return NextResponse.json({ error: 'Error al cargar días' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { fecha, motivo, esLaborable, sendEmail: shouldSendEmail, addCredit: shouldAddCredit, trasladarA } = await req.json()

        // Import email tools
        const { sendEmail } = await import('@/lib/email')
        const { nonWorkingDayEmail } = await import('@/lib/email-templates')

        const date = new Date(fecha)
        date.setHours(12, 0, 0, 0)

        // Date format for emails
        const formattedTargetDate = trasladarA ? new Date(trasladarA + 'T12:00:00').toLocaleDateString('es-AR') : null

        if (esLaborable) {
            const startOfDay = new Date(date)
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date(date)
            endOfDay.setHours(23, 59, 59, 999)

            await (prisma as any).diaNoLaborable.deleteMany({
                where: {
                    fecha: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            })
            return NextResponse.json({ success: true })
        } else {
            // Set as non-working
            const diaNoLaborable = await (prisma as any).diaNoLaborable.upsert({
                where: { fecha: new Date(date.setHours(0, 0, 0, 0)) },
                update: { motivo },
                create: { fecha: new Date(date.setHours(0, 0, 0, 0)), motivo }
            })

            // IMPACT LOGIC: Identify affected students
            const dayNamesEs = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']
            const daySpanish = dayNamesEs[date.getDay()]

            const affectedInscriptions = await prisma.inscripcion.findMany({
                where: {
                    estado: 'ACTIVA',
                    OR: [
                        { dia: { contains: daySpanish, mode: 'insensitive' } },
                        { dia: { contains: daySpanish.replace('MIERCOLES', 'MIÉRCOLES').replace('SABADO', 'SÁBADO'), mode: 'insensitive' } }
                    ]
                },
                include: {
                    alumno: { include: { usuario: true } },
                    taller: true
                }
            })

            const processedUsers = new Set<string>()
            let emailCount = 0
            let creditCount = 0
            let transferCount = 0

            for (const ins of affectedInscriptions) {
                // 1. Add credit IF no transfer is requested (usually you don't do both, but we respect the flags)
                if (shouldAddCredit) {
                    await (prisma as any).creditoClaseExtra.create({
                        data: {
                            alumnoId: ins.alumnoId,
                            tallerId: ins.tallerId,
                            motivo: `Clase cancelada el ${date.toLocaleDateString('es-AR')}: ${motivo || 'Feriado'}`
                        }
                    })
                    creditCount++
                }

                // 2. Automated Transfer (New Logic)
                if (trasladarA) {
                    await (prisma as any).creditoClaseExtra.create({
                        data: {
                            alumnoId: ins.alumnoId,
                            tallerId: ins.tallerId,
                            motivo: `Traslado de clase del ${date.toLocaleDateString('es-AR')}`,
                            usado: true, // Marked as used because it's already programmed
                            fechaProgramada: new Date(trasladarA + 'T12:00:00'),
                            horarioProgramado: ins.horario?.split('-')[0] || '16:00'
                        }
                    })
                    transferCount++
                }

                // 3. Notify student
                if (!processedUsers.has(ins.alumno.usuarioId)) {
                    processedUsers.add(ins.alumno.usuarioId)

                    let notificationMessage = `El ${date.toLocaleDateString('es-AR')} no habrá clases por ${motivo || 'Feriado'}.`
                    if (trasladarA) {
                        notificationMessage += ` La clase se traslada al día ${formattedTargetDate}.`
                    } else if (shouldAddCredit) {
                        notificationMessage += ` Tenés un crédito disponible para agendar.`
                    }

                    await prisma.notificacion.create({
                        data: {
                            usuarioId: ins.alumno.usuarioId,
                            titulo: trasladarA ? '📅 Clase Reprogramada' : (shouldAddCredit ? '🎨 Clase Extra Disponible' : '⚠️ Aviso: Clase Cancelada'),
                            mensaje: notificationMessage,
                            tipo: 'INFO'
                        }
                    })

                    // Send Email if requested
                    if (shouldSendEmail && ins.alumno.usuario.email) {
                        try {
                            const sent = await sendEmail({
                                to: ins.alumno.usuario.email,
                                subject: `Aviso Importante: Clase del ${date.toLocaleDateString('es-AR')} - Taller Limoné`,
                                html: nonWorkingDayEmail({
                                    nombre: ins.alumno.nombre || 'Estudiante',
                                    fecha: date.toLocaleDateString('es-AR'),
                                    motivo: (motivo as string) || 'Feriado/Asueto',
                                    tieneCredito: !!shouldAddCredit,
                                    fechaTraslado: formattedTargetDate || undefined
                                })
                            })
                            if (sent) emailCount++
                        } catch (emailErr) {
                            console.error(`[CALENDAR API] Failed to send email to ${ins.alumno.usuario.email}:`, emailErr)
                        }
                    }
                }
            }

            return NextResponse.json({
                success: true,
                affectedCount: affectedInscriptions.length,
                emailsSent: emailCount,
                creditsCreated: creditCount,
                transfersCreated: transferCount
            })
        }
    } catch (error) {
        console.error('Error updating calendar:', error)
        return NextResponse.json({ error: 'Error al actualizar el calendario' }, { status: 500 })
    }
}
