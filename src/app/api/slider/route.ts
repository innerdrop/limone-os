import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todas las imágenes del slider activas
export async function GET() {
    try {
        const images = await prisma.sliderImage.findMany({
            where: { activo: true },
            orderBy: { orden: 'asc' }
        })
        return NextResponse.json(images)
    } catch (error) {
        console.error('Error fetching slider images:', error)
        return NextResponse.json({ error: 'Error al obtener imágenes' }, { status: 500 })
    }
}

// POST - Agregar nueva imagen al slider (solo admin)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { imagenUrl, titulo, descripcion, enlace, orden } = body

        if (!imagenUrl) {
            return NextResponse.json({ error: 'La URL de la imagen es requerida' }, { status: 400 })
        }

        const newImage = await prisma.sliderImage.create({
            data: {
                imagenUrl,
                titulo: titulo || null,
                descripcion: descripcion || null,
                enlace: enlace || null,
                orden: orden || 0,
                activo: true
            }
        })

        return NextResponse.json(newImage, { status: 201 })
    } catch (error) {
        console.error('Error creating slider image:', error)
        return NextResponse.json({ error: 'Error al crear imagen' }, { status: 500 })
    }
}
