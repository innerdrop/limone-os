import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Obtener una tarea por ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const tarea = await prisma.tarea.findUnique({
            where: { id: params.id }
        })

        if (!tarea) {
            return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 })
        }

        return NextResponse.json(tarea)
    } catch (error) {
        console.error('Error fetching task:', error)
        return NextResponse.json({ error: 'Error al obtener tarea' }, { status: 500 })
    }
}

// PUT - Actualizar tarea (incluyendo marcar como completada)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const { titulo, descripcion, fecha, hora, prioridad, categoria, completada } = body

        const updateData: any = {}

        if (titulo !== undefined) updateData.titulo = titulo
        if (descripcion !== undefined) updateData.descripcion = descripcion
        if (fecha !== undefined) updateData.fecha = new Date(fecha)
        if (hora !== undefined) updateData.hora = hora
        if (prioridad !== undefined) updateData.prioridad = prioridad
        if (categoria !== undefined) updateData.categoria = categoria

        // Si se marca como completada, guardar la fecha de completado
        if (completada !== undefined) {
            updateData.completada = completada
            if (completada) {
                updateData.completadaEn = new Date()
            } else {
                updateData.completadaEn = null
            }
        }

        const tareaActualizada = await prisma.tarea.update({
            where: { id: params.id },
            data: updateData
        })

        return NextResponse.json(tareaActualizada)
    } catch (error) {
        console.error('Error updating task:', error)
        return NextResponse.json({ error: 'Error al actualizar tarea' }, { status: 500 })
    }
}

// DELETE - Eliminar tarea
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.tarea.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting task:', error)
        return NextResponse.json({ error: 'Error al eliminar tarea' }, { status: 500 })
    }
}
