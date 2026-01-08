import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const notifications = await prisma.notificacion.findMany({
            where: { usuarioId: session.user.id },
            orderBy: { fechaEnvio: 'desc' },
            take: 20
        })

        // Transform to frontend interface if needed, or send as is
        // Frontend expects: id, title, message, date, read, type
        const formatted = notifications.map(n => ({
            id: n.id,
            title: n.titulo,
            message: n.mensaje,
            date: n.fechaEnvio.toISOString(), // Ensure ISO string for date
            read: n.leida,
            type: n.tipo ? n.tipo.toLowerCase() : 'info'
        }))

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { id, markAll } = body

        if (markAll) {
            await prisma.notificacion.updateMany({
                where: { usuarioId: session.user.id, leida: false },
                data: { leida: true }
            })
            return NextResponse.json({ success: true, message: 'All marked as read' })
        }

        if (id) {
            await prisma.notificacion.update({
                where: { id, usuarioId: session.user.id },
                data: { leida: true }
            })
            return NextResponse.json({ success: true, message: 'Notification marked as read' })
        }

        return NextResponse.json({ error: 'Missing id or markAll' }, { status: 400 })
    } catch (error) {
        console.error('Error updating notification:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 })
        }

        await prisma.notificacion.delete({
            where: {
                id,
                usuarioId: session.user.id // Ensure ownership
            }
        })

        return NextResponse.json({ success: true, message: 'Notification deleted' })
    } catch (error) {
        console.error('Error deleting notification:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
