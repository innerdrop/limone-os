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
                precio: body.precio,
                cupoMaximo: body.cupoMaximo,
                duracion: body.duracion,
                activo: body.activo,
                diasSemana: body.diasSemana,
                horaInicio: body.horaInicio,
            }
        })

        return NextResponse.json(taller)
    } catch (error: any) {
        console.error('Error updating workshop:', error)
        return NextResponse.json(
            { message: error.message || 'Error al actualizar el taller' },
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
    } catch (error: any) {
        console.error('Error deleting workshop:', error)
        return NextResponse.json(
            { message: error.message || 'Error al eliminar el taller' },
            { status: 500 }
        )
    }
}
