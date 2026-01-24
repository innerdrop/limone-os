import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Obtener un slide por ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const slide = await prisma.slide.findUnique({
            where: { id: params.id }
        })

        if (!slide) {
            return NextResponse.json({ error: 'Slide no encontrado' }, { status: 404 })
        }

        return NextResponse.json({
            ...slide,
            tags: slide.tags ? JSON.parse(slide.tags) : []
        })
    } catch (error) {
        console.error('Error fetching slide:', error)
        return NextResponse.json({ error: 'Error al obtener slide' }, { status: 500 })
    }
}

// PUT - Actualizar un slide
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const {
            titulo,
            subtitulo,
            descripcion,
            tags,
            badgeTexto,
            textoBoton,
            enlace,
            imagenUrl,
            estiloOverlay,
            orden,
            activo
        } = body

        const updateData: any = {}

        if (titulo !== undefined) updateData.titulo = titulo
        if (subtitulo !== undefined) updateData.subtitulo = subtitulo
        if (descripcion !== undefined) updateData.descripcion = descripcion
        if (tags !== undefined) updateData.tags = Array.isArray(tags) ? JSON.stringify(tags) : tags
        if (badgeTexto !== undefined) updateData.badgeTexto = badgeTexto
        if (textoBoton !== undefined) updateData.textoBoton = textoBoton
        if (enlace !== undefined) updateData.enlace = enlace
        if (imagenUrl !== undefined) updateData.imagenUrl = imagenUrl
        if (estiloOverlay !== undefined) updateData.estiloOverlay = estiloOverlay
        if (orden !== undefined) updateData.orden = orden
        if (activo !== undefined) updateData.activo = activo

        const updatedSlide = await prisma.slide.update({
            where: { id: params.id },
            data: updateData
        })

        return NextResponse.json({
            ...updatedSlide,
            tags: updatedSlide.tags ? JSON.parse(updatedSlide.tags) : []
        })
    } catch (error) {
        console.error('Error updating slide:', error)
        return NextResponse.json({ error: 'Error al actualizar slide' }, { status: 500 })
    }
}

// DELETE - Eliminar un slide
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        await prisma.slide.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting slide:', error)
        return NextResponse.json({ error: 'Error al eliminar slide' }, { status: 500 })
    }
}
