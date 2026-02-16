import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { alumnoId, inscripcionId, monto, fecha, mes, anio } = body

        if (!alumnoId || !inscripcionId || !monto) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
        }

        // Use a transaction to create the payment and update the enrollment
        const [pagoCreado] = await prisma.$transaction([
            prisma.pago.create({
                data: {
                    alumnoId,
                    inscripcionId,
                    monto,
                    fechaPago: new Date(fecha),
                    estado: 'CONFIRMADO',
                    mesCubierto: mes,
                    anioCubierto: anio
                },
                include: {
                    alumno: { include: { usuario: true } },
                    inscripcion: { include: { taller: true } }
                }
            }),
            prisma.inscripcion.update({
                where: { id: inscripcionId },
                data: { pagado: true }
            })
        ])

        // 1. Create notification for student
        await prisma.notificacion.create({
            data: {
                usuarioId: pagoCreado.alumno.usuarioId,
                titulo: '¡Pago Confirmado! ✅',
                mensaje: `Se ha registrado un pago de $${monto.toLocaleString('es-AR')} para ${pagoCreado.inscripcion?.taller?.nombre || 'el taller'}. ¡Ya sos un alumno activo!`,
                tipo: 'SUCCESS'
            }
        })

        // 2. Send confirmation email
        const { sendEmail } = await import('@/lib/email')
        const { paymentConfirmedEmail } = await import('@/lib/email-templates')
        const { format } = await import('date-fns')
        const { es } = await import('date-fns/locale')

        if (pagoCreado.alumno.usuario.email) {
            try {
                await sendEmail({
                    to: pagoCreado.alumno.usuario.email,
                    subject: '¡Pago Confirmado! ✅ - Taller Limoné',
                    html: paymentConfirmedEmail({
                        nombre: pagoCreado.alumno.usuario.nombre || 'Alumno',
                        alumnoNombre: `${pagoCreado.alumno.nombre || ''} ${pagoCreado.alumno.apellido || ''}`.trim() || 'Alumno',
                        monto: Number(monto),
                        concepto: pagoCreado.inscripcion?.taller?.nombre || pagoCreado.inscripcion?.fase || 'Taller',
                        fecha: format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es })
                    })
                })
            } catch (err) {
                console.error('Error sending manual payment email:', err)
            }
        }

        return NextResponse.json(pagoCreado)
    } catch (error) {
        console.error('Error creating manual payment:', error)
        return NextResponse.json({ error: 'Error al registrar el pago' }, { status: 500 })
    }
}
