import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const alumnoId = searchParams.get('alumnoId')
    const pagado = searchParams.get('pagado')

    if (!alumnoId) {
        return NextResponse.json({ error: 'alumnoId es requerido' }, { status: 400 })
    }

    try {
        const inscripciones = await prisma.inscripcion.findMany({
            where: {
                alumnoId,
                ...(pagado !== null ? { pagado: pagado === 'true' } : {})
            },
            include: {
                taller: true
            }
        })

        return NextResponse.json(inscripciones)
    } catch (error) {
        return NextResponse.json({ error: 'Error al buscar inscripciones' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'DOCENTE')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id, motivo } = await request.json()

        if (!id || !motivo) {
            return NextResponse.json({ error: 'ID y motivo son requeridos' }, { status: 400 })
        }

        const currentInsc = await prisma.inscripcion.findUnique({
            where: { id },
            select: { notas: true, alumnoId: true }
        })

        if (!currentInsc) {
            return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 })
        }

        const newNotas = currentInsc.notas
            ? `${currentInsc.notas}\n\n[CANCELACIÓN: ${new Date().toLocaleDateString('es-AR')}] Motivo: ${motivo}`
            : `[CANCELACIÓN: ${new Date().toLocaleDateString('es-AR')}] Motivo: ${motivo}`;

        const [inscripcion] = await prisma.$transaction([
            prisma.inscripcion.update({
                where: { id },
                data: {
                    estado: 'CANCELADA',
                    notas: newNotas
                },
                include: {
                    alumno: true,
                    taller: true
                }
            }),
            prisma.pago.updateMany({
                where: {
                    inscripcionId: id,
                    estado: { in: ['PENDIENTE', 'PENDIENTE_VERIFICACION'] }
                },
                data: {
                    estado: 'RECHAZADO'
                }
            })
        ])

        // Notificar al alumno
        await prisma.notificacion.create({
            data: {
                usuarioId: (inscripcion.alumno as any).usuarioId,
                titulo: 'Inscripción Cancelada',
                mensaje: `Tu inscripción al taller ${inscripcion.taller.nombre} ha sido cancelada. Motivo: ${motivo}`,
                tipo: 'ALERT'
            }
        })

        return NextResponse.json({ success: true, inscripcion })
    } catch (error) {
        console.error('Error al cancelar inscripción:', error)
        return NextResponse.json({ error: 'Error al cancelar la inscripción' }, { status: 500 })
    }
}
