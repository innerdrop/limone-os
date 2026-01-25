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

        const { searchParams } = new URL(request.url)
        const dia = searchParams.get('dia')
        const horario = searchParams.get('horario')

        if (!dia || !horario) {
            return NextResponse.json({ error: 'Faltan parámetros dia o horario' }, { status: 400 })
        }

        // Get all active enrollments for the given day and time
        const enrollments = await prisma.inscripcion.findMany({
            where: {
                dia: { contains: dia },
                horario: { contains: horario },
                estado: 'ACTIVA'
            },
            select: {
                asiento: true
            }
        })

        const occupiedSeats = enrollments
            .flatMap((e: any) =>
                e.asiento ? e.asiento.toString().split(',').map((s: string) => parseInt(s.trim())) : []
            )
            .filter((num: number): num is number => !isNaN(num))

        return NextResponse.json({ occupiedSeats })
    } catch (error) {
        console.error('Error fetching availability:', error)
        return NextResponse.json({ error: 'Error al obtener disponibilidad' }, { status: 500 })
    }
}
