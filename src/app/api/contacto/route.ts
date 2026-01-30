import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { contactFormEmailToAdmin, contactFormEmailToUser } from '@/lib/email-templates'

const MOTIVO_LABELS: Record<string, string> = {
    inscripciones: 'Inscripciones y Registro',
    horarios: 'Horarios y Vacantes',
    materiales: 'Materiales e Insumos',
    pagos: 'Costos y Medios de Pago',
    otro: 'Otras consultas'
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { nombre, email, telefono, motivo, mensaje } = body

        // Validate required fields
        if (!nombre || !email || !mensaje) {
            return NextResponse.json(
                { error: 'Nombre, email y mensaje son requeridos' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            )
        }

        const motivoLabel = MOTIVO_LABELS[motivo] || motivo || 'No especificado'

        // Send email to admin
        const adminEmailSent = await sendEmail({
            to: process.env.EMAIL_USER || 'tallerlimone@gmail.com',
            subject: `Nueva Consulta: ${motivoLabel} - ${nombre}`,
            html: contactFormEmailToAdmin({
                nombre,
                email,
                telefono,
                motivo: motivoLabel,
                mensaje
            }),
            replyTo: email
        })

        // Send confirmation email to user
        const userEmailSent = await sendEmail({
            to: email,
            subject: '¡Recibimos tu consulta! - Taller Limoné',
            html: contactFormEmailToUser({ nombre })
        })

        if (!adminEmailSent) {
            console.error('Failed to send admin email')
        }

        return NextResponse.json({
            success: true,
            message: 'Consulta enviada correctamente'
        })

    } catch (error) {
        console.error('Error processing contact form:', error)
        return NextResponse.json(
            { error: 'Error al procesar la consulta' },
            { status: 500 }
        )
    }
}
