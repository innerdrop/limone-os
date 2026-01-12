import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const citaId = params.id

        // Verify ownership
        const cita = await prisma.citaNivelacion.findUnique({
            where: { id: citaId },
            include: { alumno: true }
        })

        if (!cita) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
        if (cita.alumno.usuarioId !== session.user.id) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

        // Delete (or soft delete with status CANCELADA)
        await prisma.citaNivelacion.delete({
            where: { id: citaId }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const { date, time } = await request.json()
        const citaId = params.id

        // Verify ownership
        const cita = await prisma.citaNivelacion.findUnique({
            where: { id: citaId },
            include: { alumno: true }
        })

        if (!cita) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
        if (cita.alumno.usuarioId !== session.user.id) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

        const newDate = new Date(`${date}T${time}`)

        await prisma.citaNivelacion.update({
            where: { id: citaId },
            data: { fecha: newDate }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
