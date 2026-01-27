import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id } = await params

        // Ensure the student belongs to the user
        const student = await prisma.alumno.findFirst({
            where: { id, usuarioId: session.user.id }
        })

        if (!student) {
            return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 })
        }

        // Delete (Baja)
        // Note: Real "Baja" might involve marking as inactive, 
        // but user requested "Eliminar el alumno, que en realidad se llamaria: Darle de baja".
        // Usually, deleting the record is what they expect if it's a simple CRUD.
        // However, there might be constraints (inscriptions, works).
        // Let's use delete and Prisma will handle Cascade if configured, or fail.

        await prisma.alumno.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: 'Alumno dado de baja correctamente' })
    } catch (error) {
        console.error('Error deleting student:', error)
        return NextResponse.json({ error: 'No se pudo dar de baja al alumno. Es posible que tenga inscripciones o pagos asociados.' }, { status: 500 })
    }
}
