import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const busqueda = searchParams.get('busqueda') || ''

    try {
        const alumnos = await prisma.alumno.findMany({
            where: busqueda ? {
                usuario: {
                    nombre: { contains: busqueda }
                }
            } : undefined,
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        email: true
                    }
                }
            },
            take: 10
        })

        return NextResponse.json({ alumnos })
    } catch (error) {
        return NextResponse.json({ error: 'Error al buscar alumnos' }, { status: 500 })
    }
}
