import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/email'
import { genericEmail } from '@/lib/email-templates'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const [alumnos, talleres] = await Promise.all([
            prisma.alumno.findMany({
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    usuario: {
                        select: { email: true }
                    }
                },
                orderBy: { nombre: 'asc' }
            }),
            prisma.taller.findMany({
                select: { id: true, nombre: true },
                where: { activo: true }
            })
        ])

        return NextResponse.json({ alumnos, talleres })
    } catch (error) {
        console.error('Error fetching communication data:', error)
        return NextResponse.json({ error: 'Error al cargar datos' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { target, targetId, subject, body, btnText, btnLink } = await req.json()

        if (!subject || !body) {
            return NextResponse.json({ error: 'Asunto y mensaje son requeridos' }, { status: 400 })
        }

        let recipients: string[] = []

        if (target === 'TODOS') {
            const users = await prisma.usuario.findMany({
                where: { rol: 'ALUMNO', activo: true },
                select: { email: true }
            })
            recipients = users.map(u => u.email)
        } else if (target === 'TALLER') {
            const inscripciones = await prisma.inscripcion.findMany({
                where: {
                    tallerId: targetId,
                    estado: 'ACTIVA',
                    alumno: { usuario: { activo: true } }
                },
                select: { alumno: { select: { usuario: { select: { email: true } } } } }
            })
            recipients = Array.from(new Set(inscripciones.map(i => i.alumno.usuario.email)))
        } else if (target === 'INDIVIDUAL') {
            const alumno = await prisma.alumno.findUnique({
                where: { id: targetId },
                select: { usuario: { select: { email: true } } }
            })
            if (alumno) recipients = [alumno.usuario.email]
        }

        if (recipients.length === 0) {
            return NextResponse.json({ error: 'No se encontraron destinatarios' }, { status: 400 })
        }

        // Send emails
        const html = genericEmail({
            titulo: subject,
            mensaje: body,
            botonTexto: btnText,
            botonUrl: btnLink
        })

        // Use a loop for sending (in production you might want a queue, but for small workshops this is fine)
        const sendPromises = recipients.map(email =>
            sendEmail({
                to: email,
                subject: `${subject} - Taller Limoné`,
                html
            })
        )

        await Promise.all(sendPromises)

        return NextResponse.json({
            success: true,
            count: recipients.length
        })
    } catch (error) {
        console.error('Error sending mass email:', error)
        return NextResponse.json({ error: 'Error al enviar los correos' }, { status: 500 })
    }
}
