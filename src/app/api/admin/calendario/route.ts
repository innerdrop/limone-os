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

        const { fecha, motivo, esLaborable, sendEmail: shouldSendEmail, addCredit: shouldAddCredit } = await req.json()

        // Import email tools
        const { sendEmail } = await import('@/lib/email')
        const { nonWorkingDayEmail } = await import('@/lib/email-templates')

        const date = new Date(fecha)
        // Adjust for timezone offset to ensure we get the correct UTC date if needed, 
        // but since it's from a date picker 'YYYY-MM-DD', new Date(fecha) usually works fine for LOCAL day.
        date.setHours(12, 0, 0, 0) // Use noon to avoid early/late day shifts with timezones

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
            // 0: Sunday, 1: Monday, ..., 6: Saturday
            const dayNamesEs = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']
            const daySpanish = dayNamesEs[date.getDay()]

            console.log(`[CALENDAR API] Processing date: ${date.toISOString()}, Day found: ${daySpanish}`)

            const affectedInscriptions = await prisma.inscripcion.findMany({
                where: {
                    estado: 'ACTIVA',
                    // Removed pagado: true to be safe, everyone active should know
                    OR: [
                        { dia: { contains: daySpanish, mode: 'insensitive' } },
                        // Also try with accents just in case database has MIÉRCOLES or SÁBADO
                        { dia: { contains: daySpanish.replace('MIERCOLES', 'MIÉRCOLES').replace('SABADO', 'SÁBADO'), mode: 'insensitive' } }
                    ]
                },
                include: { alumno: { include: { usuario: true } } }
            })

            console.log(`[CALENDAR API] Found ${affectedInscriptions.length} affected inscriptions`)

            const processedUsers = new Set<string>()
            let emailCount = 0
            let creditCount = 0

            for (const ins of affectedInscriptions) {
                // 1. Add credit if requested
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

                // 2. Notify student (Email and Portal Notification)
                if (!processedUsers.has(ins.alumno.usuarioId)) {
                    processedUsers.add(ins.alumno.usuarioId)

                    // Create database notification
                    await prisma.notificacion.create({
                        data: {
                            usuarioId: ins.alumno.usuarioId,
                            titulo: shouldAddCredit ? '🎨 Clase Extra Disponible' : '⚠️ Aviso: Clase Cancelada',
                            mensaje: `El ${date.toLocaleDateString('es-AR')} no habrá clases por ${motivo || 'Feriado'}.${shouldAddCredit ? ' Tenés un crédito disponible para agendar.' : ''}`,
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
                                    tieneCredito: !!shouldAddCredit
                                })
                            })
                            if (sent) emailCount++
                        } catch (emailErr) {
                            console.error(`[CALENDAR API] Failed to send email to ${ins.alumno.usuario.email}:`, emailErr)
                        }
                    }
                }
            }

            console.log(`[CALENDAR API] Done. Credits: ${creditCount}, Emails: ${emailCount}`)

            return NextResponse.json({
                success: true,
                affectedCount: affectedInscriptions.length,
                emailsSent: emailCount,
                creditsCreated: creditCount
            })
        }
    } catch (error) {
        console.error('Error updating calendar:', error)
        return NextResponse.json({ error: 'Error al actualizar el calendario' }, { status: 500 })
    }
}
