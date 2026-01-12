import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const users = await prisma.usuario.findMany({ select: { id: true, email: true, nombre: true } })
        const alumnos = await prisma.alumno.findMany({ include: { citasNivelacion: true } })
        const citas = await prisma.citaNivelacion.findMany()
        const notificaciones = await prisma.notificacion.findMany()

        return NextResponse.json({
            usersCount: users.length,
            alumnosCount: alumnos.length,
            citasCount: citas.length,
            notificacionesCount: notificaciones.length,
            details: {
                users,
                alumnos,
                citas,
                notificaciones
            }
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
