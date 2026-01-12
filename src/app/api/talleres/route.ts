import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const talleres = await prisma.taller.findMany({
            where: { activo: true },
            orderBy: { nombre: 'asc' }
        })

        return NextResponse.json(talleres)
    } catch (error) {
        console.error('Error al obtener talleres:', error)
        return NextResponse.json(
            { error: 'Error al obtener los talleres' },
            { status: 500 }
        )
    }
}
