import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/lib/email'
import { passwordChangedEmail } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token y contraseña son requeridos' },
                { status: 400 }
            )
        }

        if (password.length < 4) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 4 caracteres' },
                { status: 400 }
            )
        }

        // Find token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { usuario: true }
        })

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Token inválido o expirado' },
                { status: 400 }
            )
        }

        // Check if token is expired
        if (resetToken.expiresAt < new Date()) {
            // Delete expired token
            await prisma.passwordResetToken.delete({
                where: { id: resetToken.id }
            })
            return NextResponse.json(
                { error: 'El enlace ha expirado. Solicitá uno nuevo.' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update user password and clear debeCambiarPassword flag
        await prisma.usuario.update({
            where: { id: resetToken.usuarioId },
            data: {
                password: hashedPassword,
                debeCambiarPassword: false
            }
        })

        // Delete the used token
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id }
        })

        // Send confirmation email
        await sendEmail({
            to: resetToken.usuario.email,
            subject: 'Contraseña Actualizada - Taller Limoné',
            html: passwordChangedEmail({
                nombre: resetToken.usuario.nombre
            })
        })

        return NextResponse.json({
            success: true,
            message: 'Contraseña actualizada correctamente'
        })

    } catch (error) {
        console.error('Error in reset-password:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
