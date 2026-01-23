import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - List products (with optional filters)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const categoria = searchParams.get('categoria')
        const activo = searchParams.get('activo')

        const where: any = {}
        if (categoria) where.categoria = categoria
        if (activo !== null) where.activo = activo === 'true'

        const productos = await prisma.producto.findMany({
            where,
            orderBy: { creadoEn: 'desc' }
        })

        return NextResponse.json(productos)
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
    }
}

// POST - Create product
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DOCENTE')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const {
            nombre,
            descripcion,
            precio,
            imagenUrl,
            imagenes,
            categoria,
            stock,
            activo,
            destacado,
            tecnica,
            dimensiones,
            artista
        } = body

        if (!nombre || !precio) {
            return NextResponse.json({ error: 'Nombre y precio son requeridos' }, { status: 400 })
        }

        const producto = await prisma.producto.create({
            data: {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                imagenUrl,
                imagenes: imagenes ? JSON.stringify(imagenes) : null,
                categoria: categoria || 'OBRA',
                stock: parseInt(stock) || 1,
                activo: activo !== false,
                destacado: destacado || false,
                tecnica,
                dimensiones,
                artista: artista || 'Natalia Fusari'
            }
        })

        return NextResponse.json(producto)
    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
    }
}

// PUT - Update product
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DOCENTE')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { id, ...data } = body

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
        }

        // Parse numeric fields
        if (data.precio) data.precio = parseFloat(data.precio)
        if (data.stock) data.stock = parseInt(data.stock)
        if (data.imagenes && Array.isArray(data.imagenes)) {
            data.imagenes = JSON.stringify(data.imagenes)
        }

        const producto = await prisma.producto.update({
            where: { id },
            data
        })

        return NextResponse.json(producto)
    } catch (error) {
        console.error('Error updating product:', error)
        return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
    }
}

// DELETE - Remove product
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DOCENTE')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
        }

        await prisma.producto.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
    }
}
