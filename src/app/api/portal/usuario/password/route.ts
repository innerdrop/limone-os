import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hash, compare } from 'bcryptjs'

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' }, { status: 400 })
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: session.user.id }
        })

        if (!usuario) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        // Verify current password
        const isCorrect = await compare(currentPassword, usuario.password)
        if (!isCorrect) {
            return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 })
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 12)

        await prisma.usuario.update({
            where: { id: session.user.id },
            data: {
                password: hashedPassword,
                debeCambiarPassword: false // Reset flag if it was set
            }
        })

        return NextResponse.json({ success: true, message: 'Contraseña actualizada' })
    } catch (error) {
        console.error('Error al cambiar contraseña:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
