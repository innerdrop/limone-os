import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const alumnoId = searchParams.get('alumnoId')
    const pagado = searchParams.get('pagado')

    if (!alumnoId) {
        return NextResponse.json({ error: 'alumnoId es requerido' }, { status: 400 })
    }

    try {
        const inscripciones = await prisma.inscripcion.findMany({
            where: {
                alumnoId,
                ...(pagado !== null ? { pagado: pagado === 'true' } : {})
            },
            include: {
                taller: true
            }
        })

        return NextResponse.json(inscripciones)
    } catch (error) {
        return NextResponse.json({ error: 'Error al buscar inscripciones' }, { status: 500 })
    }
}
