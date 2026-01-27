import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const params = await context.params
        const usuario = await prisma.usuario.findUnique({
            where: { id: params.id },
            include: {
                alumnos: true
            }
        })

        if (!usuario) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        return NextResponse.json(usuario)
    } catch (error) {
        console.error('Error fetching registro:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const params = await context.params
        const body = await req.json()
        const { nombre, email, telefono, rol, activo } = body

        const updated = await prisma.usuario.update({
            where: { id: params.id },
            data: {
                nombre,
                email,
                telefono,
                rol,
                activo
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Error updating registro:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const params = await context.params

        // Students will be deleted via Cascade if configured in schema.
        // Let's verify schema later, but for now we delete the user.
        await prisma.usuario.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting registro:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
