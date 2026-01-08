import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const users = await prisma.usuario.findMany({ select: { id: true, email: true, name: true } })
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
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
