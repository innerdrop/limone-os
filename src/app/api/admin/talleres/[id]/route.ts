import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()

        const taller = await prisma.taller.update({
            where: { id },
            data: {
                nombre: body.nombre,
                descripcion: body.descripcion,
                cupoMaximo: body.cupoMaximo,
                duracion: body.duracion,
                activo: body.activo,
                diasSemana: body.diasSemana,
                horaInicio: body.horaInicio,
                horarios: body.horarios
            } as any
        })

        return NextResponse.json(taller)
    } catch (error) {
        console.error('Error updating workshop:', error)
        const message = error instanceof Error ? error.message : 'Error al actualizar el taller';
        return NextResponse.json(
            { message },
            { status: 500 }
        )
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
        }

        const { id } = await params

        await prisma.taller.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Taller eliminado con éxito' })
    } catch (error) {
        console.error('Error deleting workshop:', error)
        const message = error instanceof Error ? error.message : 'Error al eliminar el taller';
        return NextResponse.json(
            { message },
            { status: 500 }
        )
    }
}
