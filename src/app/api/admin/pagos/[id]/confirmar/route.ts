import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
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

        const pagoId = params.id

        // Update payment status
        const pago = await prisma.pago.update({
            where: { id: pagoId },
            data: { estado: 'CONFIRMADO' },
            include: {
                inscripcion: true,
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
                titulo: '¡Pago Confirmado!',
                mensaje: `Tu pago de $${pago.monto.toLocaleString('es-AR')} ha sido confirmado. Tu inscripción está activa y tus clases ya aparecen en el calendario.`,
                tipo: 'SUCCESS'
            }
        })

        return NextResponse.json({ success: true, pago })
    } catch (error: any) {
        console.error('Error al confirmar pago:', error)
        return NextResponse.json({ error: 'Error al confirmar el pago' }, { status: 500 })
    }
}
