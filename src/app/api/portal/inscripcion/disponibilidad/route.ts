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
                dia: dia,
                horario: horario,
                estado: 'ACTIVA'
            },
            select: {
                asiento: true
            }
        })

        const occupiedSeats = enrollments
            .map(e => e.asiento)
            .filter((asiento): asiento is number => asiento !== null)

        return NextResponse.json({ occupiedSeats })
    } catch (error: any) {
        console.error('Error fetching availability:', error)
        return NextResponse.json({ error: 'Error al obtener disponibilidad' }, { status: 500 })
    }
}
