import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/email'
import { paymentConfirmedEmail } from '@/lib/email-templates'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: pagoId } = await params
        const session = await getServerSession(authOptions)

        // Check if user is admin
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.usuario.findUnique({
            where: { id: session.user.id }
        })

        if (user?.rol !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        // Update payment status
        const pago = await prisma.pago.update({
            where: { id: pagoId },
            data: { estado: 'CONFIRMADO' },
            include: {
                inscripcion: { include: { taller: true } },
                alumno: { include: { usuario: true } }
            }
        })

        // Update enrollment status
        await prisma.inscripcion.update({
            where: { id: pago.inscripcionId },
            data: { pagado: true }
        })

        // Create notification for student
        await prisma.notificacion.create({
            data: {
                usuarioId: pago.alumno.usuarioId,
                titulo: '¡Pago Confirmado! ✅',
                mensaje: `Tu pago de $${pago.monto.toLocaleString('es-AR')} ha sido confirmado. ¡Ya sos un participante activo del Taller Limoné!`,
                tipo: 'SUCCESS'
            }
        })

        // Send confirmation email
        const alumno = pago.alumno as any
        const inscripcion = pago.inscripcion as any
        if (alumno?.usuario?.email) {
            try {
                await sendEmail({
                    to: alumno.usuario.email,
                    subject: '¡Pago Confirmado! ✅ - Taller Limoné',
                    html: paymentConfirmedEmail({
                        nombre: alumno.usuario.nombre || 'Alumno',
                        alumnoNombre: `${alumno.nombre || ''} ${alumno.apellido || ''}`.trim() || 'Alumno',
                        monto: Number(pago.monto),
                        concepto: inscripcion?.taller?.nombre || inscripcion?.fase || 'Taller',
                        fecha: format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es })
                    })
                })
            } catch (err) {
                console.error('Error sending payment email:', err)
            }
        }

        return NextResponse.json({ success: true, pago })

    } catch (error) {
        console.error('Error al confirmar pago:', error)
        return NextResponse.json({ error: 'Error al confirmar el pago' }, { status: 500 })
    }
}
