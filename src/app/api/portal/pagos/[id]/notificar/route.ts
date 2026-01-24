import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: pagoId } = await params
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Actualizar el estado del pago a PENDIENTE_VERIFICACION
        const pago = await prisma.pago.update({
            where: { id: pagoId },
            data: { estado: 'PENDIENTE_VERIFICACION' },
            include: {
                alumno: { include: { usuario: true } }
            }
        })

        // Notificar al administrador (Crear una notificación para Natalia)
        const admin = await prisma.usuario.findFirst({
            where: { rol: 'ADMIN' }
        })

        if (admin) {
            await prisma.notificacion.create({
                data: {
                    usuarioId: admin.id,
                    titulo: 'Nuevo Aviso de Pago',
                    mensaje: `${pago.alumno.usuario.nombre} avisó que ya realizó la transferencia de ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(pago.monto)}.`,
                    tipo: 'INFO',
                    enlace: '/admin/finanzas'
                }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error al notificar pago:', error)
        return NextResponse.json({ error: 'Error al procesar la notificación' }, { status: 500 })
    }
}
