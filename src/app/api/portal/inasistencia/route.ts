import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const { classId, motivo, fechaClase } = await req.json()

        if (!classId) return NextResponse.json({ error: 'ID de clase requerido' }, { status: 400 })

        // Extract enrollment info from classId (formatted as enrollmentId-day-timestamp)
        const parts = classId.split('-')
        const inscripcionId = parts[0]

        const inscripcion = await prisma.inscripcion.findUnique({
            where: { id: inscripcionId },
            include: { alumno: true }
        })

        if (!inscripcion) return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 })

        // Create the recovery request
        const solicitud = await (prisma as any).solicitudRecuperacion.create({
            data: {
                alumnoId: inscripcion.alumnoId,
                inscripcionId: inscripcion.id,
                fechaClaseOriginal: new Date(fechaClase),
                motivo,
                estado: 'PENDIENTE'
            }
        })

        // Also create a notification for Natalí (admin) maybe? 
        // For now just success

        return NextResponse.json({ success: true, solicitud })
    } catch (error) {
        console.error('Error reporting absence:', error)
        return NextResponse.json({ error: 'Error al procesar el aviso de inasistencia' }, { status: 500 })
    }
}
