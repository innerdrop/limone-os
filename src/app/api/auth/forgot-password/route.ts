import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email'
import { passwordResetEmail } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email es requerido' },
                { status: 400 }
            )
        }

        // Find user by email
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        })

        // Always return success to prevent email enumeration
        if (!usuario) {
            console.log(`Password reset attempted for non-existent email: ${email}`)
            return NextResponse.json({
                success: true,
                message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
            })
        }

        // Delete any existing reset tokens for this user
        await prisma.passwordResetToken.deleteMany({
            where: { usuarioId: usuario.id }
        })

        // Generate secure token
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

        // Save token to database
        await prisma.passwordResetToken.create({
            data: {
                usuarioId: usuario.id,
                token,
                expiresAt
            }
        })

        // Build reset URL
        const baseUrl = process.env.NEXTAUTH_URL || 'https://limone.vercel.app'
        const resetUrl = `${baseUrl}/reset-password?token=${token}`

        // Send password reset email
        await sendEmail({
            to: email,
            subject: 'Recuperar Contraseña - Taller Limoné',
            html: passwordResetEmail({
                nombre: usuario.nombre,
                resetUrl,
                expiresIn: '1 hora'
            })
        })

        return NextResponse.json({
            success: true,
            message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
        })

    } catch (error) {
        console.error('Error in forgot-password:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
