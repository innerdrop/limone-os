import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                rol: true
            }
        })

        if (!usuario) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        return NextResponse.json(usuario)
    } catch (error) {
        console.error('Error al obtener perfil de usuario:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { email, telefono } = body

        // Validate basic formats if needed, for now we trust the client logic

        const updated = await prisma.usuario.update({
            where: { id: session.user.id },
            data: {
                email: email || undefined,
                telefono: telefono || undefined
            }
        })

        return NextResponse.json({
            success: true,
            usuario: {
                id: updated.id,
                nombre: updated.nombre,
                email: updated.email,
                telefono: updated.telefono
            }
        })
    } catch (error) {
        console.error('Error al actualizar perfil de usuario:', error)
        return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 })
    }
}
