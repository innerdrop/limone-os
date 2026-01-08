import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const student = await prisma.alumno.findFirst({
            where: { usuarioId: session.user.id },
            include: {
                obras: {
                    orderBy: {
                        fechaCreacion: 'desc'
                    }
                }
            }
        })

        if (!student) {
            return NextResponse.json({ error: 'Perfil de alumno no encontrado' }, { status: 404 })
        }

        return NextResponse.json(student.obras)
    } catch (error) {
        console.error('Error al obtener obras:', error)
        return NextResponse.json({ error: 'Error al obtener las obras' }, { status: 500 })
    }
}
