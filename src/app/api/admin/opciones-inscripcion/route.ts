import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET: Get all enrollment options (public for portal, shows only active sorted by orden)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const all = searchParams.get('all') === 'true'

        const options = await prisma.opcionInscripcion.findMany({
            where: all ? {} : { activo: true },
            orderBy: { orden: 'asc' }
        })

        return NextResponse.json(options)
    } catch (error) {
        console.error('Error fetching enrollment options:', error)
        return NextResponse.json({ error: 'Error al obtener opciones' }, { status: 500 })
    }
}

// POST: Create a new enrollment option (admin only)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { nombre, descripcion, emoji, colorFondo, colorBorde, colorHoverBg, tipo, redirigirUrl, esNuevo, orden, activo } = body

        if (!nombre) {
            return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
        }

        const option = await prisma.opcionInscripcion.create({
            data: {
                nombre,
                descripcion: descripcion || '',
                emoji: emoji || '🎨',
                colorFondo: colorFondo || 'bg-emerald-100',
                colorBorde: colorBorde || 'border-lemon-400',
                colorHoverBg: colorHoverBg || 'bg-lemon-50/50',
                tipo: tipo || 'regular',
                redirigirUrl: redirigirUrl || null,
                esNuevo: esNuevo || false,
                orden: orden || 0,
                activo: activo !== false
            }
        })

        return NextResponse.json(option)
    } catch (error: any) {
        console.error('Error creating enrollment option:', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Ya existe una opción con ese nombre' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Error al crear opción' }, { status: 500 })
    }
}

// PATCH: Update an enrollment option (admin only)
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { id, ...data } = body

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
        }

        const option = await prisma.opcionInscripcion.update({
            where: { id },
            data
        })

        return NextResponse.json(option)
    } catch (error: any) {
        console.error('Error updating enrollment option:', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Ya existe una opción con ese nombre' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Error al actualizar opción' }, { status: 500 })
    }
}

// DELETE: Delete an enrollment option (admin only)
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
        }

        await prisma.opcionInscripcion.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting enrollment option:', error)
        return NextResponse.json({ error: 'Error al eliminar opción' }, { status: 500 })
    }
}
