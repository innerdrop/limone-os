import { NextResponse } from 'next/server'
import { sendEmail, verifyEmailConfig } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // First verify the configuration
        console.log('Testing email configuration...')
        console.log('EMAIL_USER:', process.env.EMAIL_USER)
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET')
        console.log('EMAIL_FROM:', process.env.EMAIL_FROM)

        const configValid = await verifyEmailConfig()

        if (!configValid) {
            return NextResponse.json({
                success: false,
                error: 'Email configuration failed verification',
                config: {
                    user: process.env.EMAIL_USER || 'NOT SET',
                    passSet: !!process.env.EMAIL_PASS,
                    from: process.env.EMAIL_FROM || 'NOT SET'
                }
            }, { status: 500 })
        }

        // Send a test email
        const testEmailSent = await sendEmail({
            to: process.env.EMAIL_USER || 'tallerlimone@gmail.com',
            subject: '🧪 Test Email - Taller Limoné',
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #FFF9C4; border-radius: 10px;">
                    <h1 style="color: #2D2D2D;">✅ Email funcionando!</h1>
                    <p>Este es un correo de prueba del sistema de notificaciones de Taller Limoné.</p>
                    <p>Fecha: ${new Date().toLocaleString('es-AR')}</p>
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
