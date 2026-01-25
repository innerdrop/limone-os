import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { startOfDay, endOfDay, addDays } from 'date-fns'

// GET - Obtener tareas (con filtros opcionales)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const pendientes = searchParams.get('pendientes') === 'true'
        const dias = parseInt(searchParams.get('dias') || '7')

        const today = startOfDay(new Date())
        const endDate = endOfDay(addDays(today, dias))

        const where: any = {
            fecha: { gte: today, lte: endDate }
        }

        if (pendientes) {
            where.completada = false
        }

        const tareas = await prisma.tarea.findMany({
            where,
            orderBy: [
                { fecha: 'asc' },
                { hora: 'asc' },
                { prioridad: 'desc' }
            ]
        })

        return NextResponse.json(tareas)
    } catch (error) {
        console.error('Error fetching tasks:', error)
        return NextResponse.json({ error: 'Error al obtener tareas' }, { status: 500 })
    }
}

// POST - Crear nueva tarea
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { titulo, descripcion, fecha, hora, prioridad, categoria } = body

        if (!titulo || !fecha) {
            return NextResponse.json({ error: 'Título y fecha son requeridos' }, { status: 400 })
        }

        const nuevaTarea = await prisma.tarea.create({
            data: {
                titulo,
                descripcion: descripcion || null,
                fecha: new Date(fecha),
                hora: hora || null,
                prioridad: prioridad || 'MEDIA',
                categoria: categoria || null,
                completada: false
            }
        })

        return NextResponse.json(nuevaTarea)
    } catch (error) {
        console.error('Error creating task:', error)
        return NextResponse.json({ error: 'Error al crear la tarea' }, { status: 500 })
    }
}
