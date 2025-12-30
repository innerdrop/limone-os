import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const { currentPassword, newPassword } = await request.json()

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Datos incompletos' },
                { status: 400 }
            )
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: session.user.id }
        })

        if (!usuario) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Verify current password
        const isValid = await compare(currentPassword, usuario.password)
        if (!isValid) {
            return NextResponse.json(
                { error: 'La contraseña actual es incorrecta' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 10)

        // Update password and clear flag
        await prisma.usuario.update({
            where: { id: session.user.id },
            data: {
                password: hashedPassword,
                debeCambiarPassword: false
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error changing password:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
