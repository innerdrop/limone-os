import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Public endpoint for listing active products
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const categoria = searchParams.get('categoria')
        const destacado = searchParams.get('destacado')

        const where: any = {
            activo: true, // Only show active products
            stock: { gt: 0 } // Only show products with stock
        }

        if (categoria) where.categoria = categoria
        if (destacado === 'true') where.destacado = true

        const productos = await prisma.producto.findMany({
            where,
            orderBy: [
                { destacado: 'desc' },
                { creadoEn: 'desc' }
            ],
            select: {
                id: true,
                nombre: true,
                descripcion: true,
                precio: true,
                imagenUrl: true,
                imagenes: true,
                categoria: true,
                stock: true,
                destacado: true,
                tecnica: true,
                dimensiones: true,
                artista: true
            }
        })

        return NextResponse.json(productos)
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
    }
}
