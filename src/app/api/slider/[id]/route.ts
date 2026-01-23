import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener una imagen específica
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const image = await prisma.sliderImage.findUnique({
            where: { id }
        })

        if (!image) {
            return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
        }

        return NextResponse.json(image)
    } catch (error) {
        console.error('Error fetching slider image:', error)
        return NextResponse.json({ error: 'Error al obtener imagen' }, { status: 500 })
    }
}

// PUT - Actualizar una imagen del slider
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { imagenUrl, titulo, descripcion, enlace, orden, activo } = body

        const updatedImage = await prisma.sliderImage.update({
            where: { id },
            data: {
                ...(imagenUrl !== undefined && { imagenUrl }),
                ...(titulo !== undefined && { titulo }),
                ...(descripcion !== undefined && { descripcion }),
                ...(enlace !== undefined && { enlace }),
                ...(orden !== undefined && { orden }),
                ...(activo !== undefined && { activo })
            }
        })

        return NextResponse.json(updatedImage)
    } catch (error) {
        console.error('Error updating slider image:', error)
        return NextResponse.json({ error: 'Error al actualizar imagen' }, { status: 500 })
    }
}

// DELETE - Eliminar una imagen del slider
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.sliderImage.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Imagen eliminada correctamente' })
    } catch (error) {
        console.error('Error deleting slider image:', error)
        return NextResponse.json({ error: 'Error al eliminar imagen' }, { status: 500 })
    }
}
