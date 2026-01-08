import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { titulo, descripcion, fecha, prioridad } = body

        if (!titulo || !fecha) {
            return NextResponse.json({ error: 'Título y fecha son requeridos' }, { status: 400 })
        }

        const nuevaTarea = await (prisma as any).tarea.create({
            data: {
                titulo,
                descripcion,
                fecha: new Date(fecha),
                prioridad: prioridad || 'MEDIA'
            }
        })

        return NextResponse.json(nuevaTarea)
    } catch (error) {
        console.error('Error creating task:', error)
        return NextResponse.json({ error: 'Error al crear la tarea' }, { status: 500 })
    }
}
