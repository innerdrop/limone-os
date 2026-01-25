import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { startOfDay, addDays } from 'date-fns'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const adminId = session.user.id

        // 1. Obtener Notificaciones (ej: avisos de pago)
        const notificaciones = await prisma.notificacion.findMany({
            where: {
                usuarioId: adminId,
                leida: false
            },
            orderBy: {
                fechaEnvio: 'desc'
            },
            take: 10
        })

        // 2. Obtener Tareas Pendientes próximas (hoy y próximos 3 días)
        const today = startOfDay(new Date())
        const threeDaysLater = addDays(today, 3)

        const tareasProximas = await prisma.tarea.findMany({
            where: {
                completada: false,
                fecha: {
                    gte: today,
                    lte: threeDaysLater
                }
            },
            orderBy: [
                { fecha: 'asc' },
                { hora: 'asc' }
            ],
            take: 5
        })

        return NextResponse.json({
            notificaciones,
            tareasProximas
        })
    } catch (error) {
        console.error('Error fetching admin notifications:', error)
        return NextResponse.json({ error: 'Error al obtener notificaciones' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const all = searchParams.get('all') === 'true'

        if (all) {
            await prisma.notificacion.updateMany({
                where: {
                    usuarioId: session.user.id,
                    leida: false
                },
                data: {
                    leida: true
                }
            })
        } else if (id) {
            await prisma.notificacion.update({
                where: { id },
                data: { leida: true }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating notifications:', error)
        return NextResponse.json({ error: 'Error al actualizar notificaciones' }, { status: 500 })
    }
}
