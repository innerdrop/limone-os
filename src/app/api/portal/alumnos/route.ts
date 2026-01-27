import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const students = await prisma.alumno.findMany({
            where: {
                usuarioId: session.user.id,
                OR: [
                    { nombre: { not: null } },
                    { perfilCompleto: true }
                ] as any
            },
            include: {
                inscripciones: {
                    include: {
                        taller: true
                    }
                }
            }
        })

        return NextResponse.json({ students })
    } catch (error) {
        console.error('Error fetching students:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
