import { NextResponse } from 'next/server'
import { sendEmail, verifyEmailConfig } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // First verify the configuration
        console.log('Testing email configuration...')

        return NextResponse.json({
            status: "Testing",
            diagnostico: {
                directorio_actual: process.cwd(),
                variables_detectadas: Object.keys(process.env).filter(k => k.includes('EMAIL')),
                email_user_valor: process.env.EMAIL_USER || "VACIO (No detectado)",
                from_valor: process.env.EMAIL_FROM || "VACIO (No detectado)",
                pass_set: !!process.env.EMAIL_PASS,
                node_env: process.env.NODE_ENV
            }
        })

    } catch (error) {
        console.error('Email test error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
