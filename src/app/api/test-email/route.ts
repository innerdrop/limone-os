import { NextResponse } from 'next/server'
import { sendEmail, verifyEmailConfig } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // First verify the configuration
        console.log('Testing email configuration...')

        const configValid = await verifyEmailConfig()

        if (!configValid) {
            return NextResponse.json({
                success: false,
                error: 'Email configuration failed verification',
                diagnostico: {
                    user: process.env.EMAIL_USER || "VACIO",
                    pass_set: !!process.env.EMAIL_PASS
                }
            }, { status: 500 })
        }

        // Send a test email
        const testEmailSent = await sendEmail({
            to: process.env.EMAIL_USER || 'tallerlimone@gmail.com',
            subject: '🧪 Test Email - Taller Limoné',
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #FFF9C4; border-radius: 10px; border: 2px solid #FBC02D;">
                    <h1 style="color: #2D2D2D;">✅ ¡Email Funcionando en Producción!</h1>
                    <p>Este es un correo de prueba exitoso desde el servidor VPS.</p>
                    <p><b>Fecha:</b> ${new Date().toLocaleString('es-AR')}</p>
                    <hr style="border: none; border-top: 1px solid #FBC02D; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">Taller Limoné - Sistema de Notificaciones</p>
                </div>
            `
        })

        if (testEmailSent) {
            return NextResponse.json({
                success: true,
                message: 'Test email sent successfully to ' + process.env.EMAIL_USER
            })
        } else {
            return NextResponse.json({
                success: false,
                error: 'Failed to send test email'
            }, { status: 500 })
        }

    } catch (error) {
        console.error('Email test error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
