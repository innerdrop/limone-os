import nodemailer from 'nodemailer'
import path from 'path'

// Force load .env from the project root to ensure it's available in VPS environments
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

interface EmailOptions {
    to: string
    subject: string
    html: string
    replyTo?: string
}

const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
}

/**
 * Send an email using Gmail SMTP
 */
export async function sendEmail({ to, subject, html, replyTo }: EmailOptions): Promise<boolean> {
    try {
        const transporter = getTransporter()
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'Taller Limoné <tallerlimone@gmail.com>',
            to,
            subject,
            html,
            replyTo
        })
        console.log(`✅ Email sent to ${to}: ${subject}`)
        return true
    } catch (error) {
        console.error('❌ Error sending email:', error)
        return false
    }
}

/**
 * Verify email configuration is working
 */
export async function verifyEmailConfig(): Promise<boolean> {
    try {
        const transporter = getTransporter()
        await transporter.verify()
        console.log('✅ Email configuration verified')
        return true
    } catch (error) {
        console.error('❌ Email configuration error:', error)
        return false
    }
}
