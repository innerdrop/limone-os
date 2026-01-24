import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Obtener todos los slides (activos para público, todos para admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const isAdmin = searchParams.get('admin') === 'true'

        const slides = await prisma.slide.findMany({
            where: isAdmin ? {} : { activo: true },
            orderBy: { orden: 'asc' }
        })

        // Parse tags JSON for each slide
        const parsedSlides = slides.map(slide => ({
            ...slide,
            tags: slide.tags ? JSON.parse(slide.tags) : []
        }))

        return NextResponse.json(parsedSlides)
    } catch (error) {
        console.error('Error fetching slides:', error)
        return NextResponse.json({ error: 'Error al obtener slides' }, { status: 500 })
    }
}

// POST - Crear nuevo slide (solo admin)
export async function POST(request: NextRequest) {
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

        if (!titulo || !imagenUrl) {
            return NextResponse.json({ error: 'Título e imagen son requeridos' }, { status: 400 })
        }

        // Get max order if not provided
        let slideOrder = orden
        if (slideOrder === undefined || slideOrder === null) {
            const maxOrder = await prisma.slide.aggregate({
                _max: { orden: true }
            })
            slideOrder = (maxOrder._max.orden ?? -1) + 1
        }

        const newSlide = await prisma.slide.create({
            data: {
                titulo,
                subtitulo: subtitulo || null,
                descripcion: descripcion || null,
                tags: tags ? JSON.stringify(tags) : null,
                badgeTexto: badgeTexto || null,
                textoBoton: textoBoton || null,
                enlace: enlace || null,
                imagenUrl,
                estiloOverlay: estiloOverlay || 'light',
                orden: slideOrder,
                activo: activo !== false
            }
        })

        return NextResponse.json({
            ...newSlide,
            tags: newSlide.tags ? JSON.parse(newSlide.tags) : []
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating slide:', error)
        return NextResponse.json({ error: 'Error al crear slide' }, { status: 500 })
    }
}
