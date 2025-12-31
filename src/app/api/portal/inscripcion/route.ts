import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { tallerId, dia, horario } = body

        if (!tallerId || !dia || !horario) {
            return NextResponse.json({ error: 'Faltan datos de inscripción' }, { status: 400 })
        }

        // Find student
        const alumno = await prisma.alumno.findUnique({
            where: { usuarioId: session.user.id }
        })

        if (!alumno) {
            return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 })
        }

        // Create inscription and a successful payment record (MOCKED)
        const inscripcion = await prisma.inscripcion.create({
            data: {
                alumnoId: alumno.id,
                tallerId,
                dia,
                horario,
                pagado: true,
                estado: 'ACTIVA'
            }
        })

        // Also create a Pago record
        const taller = await prisma.taller.findUnique({ where: { id: tallerId } })
        await prisma.pago.create({
            data: {
                alumnoId: alumno.id,
                inscripcionId: inscripcion.id,
                monto: taller?.precio || 0,
                estado: 'APROBADO',
                mesCubierto: new Date().getMonth() + 1,
                anioCubierto: new Date().getFullYear(),
                concepto: `Inscripción taller ${taller?.nombre} - ${dia} ${horario}`
            }
        })

        return NextResponse.json({ success: true, inscripcion })
    } catch (error: any) {
        console.error('Error en inscripción:', error)
        return NextResponse.json({ error: 'Error al procesar la inscripción' }, { status: 500 })
    }
}
