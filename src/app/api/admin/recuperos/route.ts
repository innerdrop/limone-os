import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DOCENTE')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const solicitudes = await (prisma as any).solicitudRecuperacion.findMany({
            include: {
                alumno: true,
                inscripcion: {
                    include: {
                        taller: true
                    }
                }
            },
            orderBy: {
                creadoEn: 'desc'
            }
        })

        return NextResponse.json(solicitudes)
    } catch (error) {
        console.error('Error fetching recovery requests:', error)
        return NextResponse.json({ error: 'Error al cargar solicitudes' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id, estado, esRecuperable, fechaRecuperacion, horarioRecuperacion } = await req.json()

        const solicitud = await (prisma as any).solicitudRecuperacion.update({
            where: { id },
            data: {
                estado,
                esRecuperable,
                fechaRecuperacion: fechaRecuperacion ? new Date(fechaRecuperacion) : null,
                horarioRecuperacion
            },
            include: { alumno: true }
        })

        // Create notification for student
        let mensaje = ''
        if (estado === 'RECHAZADA') {
            mensaje = `Tu solicitud de recupero para la clase del ${new Date(solicitud.fechaClaseOriginal).toLocaleDateString()} ha sido rechazada.`
        } else if (estado === 'APROBADA' && esRecuperable) {
            mensaje = `¡Solicitud aprobada! Recuperás tu clase el ${new Date(fechaRecuperacion).toLocaleDateString()} a las ${horarioRecuperacion}.`
        } else if (estado === 'APROBADA' && !esRecuperable) {
            mensaje = `Tu inasistencia para la clase del ${new Date(solicitud.fechaClaseOriginal).toLocaleDateString()} fue registrada, pero no es recuperable.`
        }

        if (mensaje) {
            await prisma.notificacion.create({
                data: {
                    usuarioId: solicitud.alumno.usuarioId,
                    titulo: 'Actualización de Recupero de Clase',
                    mensaje,
                    tipo: estado === 'APROBADA' ? 'SUCCESS' : 'INFO'
                }
            })
        }

        return NextResponse.json({ success: true, solicitud })
    } catch (error) {
        console.error('Error updating recovery request:', error)
        return NextResponse.json({ error: 'Error al actualizar solicitud' }, { status: 500 })
    }
}
