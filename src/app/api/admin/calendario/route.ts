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

        const diasNoLaborables = await (prisma as any).diaNoLaborable.findMany({
            orderBy: { fecha: 'asc' }
        })

        return NextResponse.json(diasNoLaborables)
    } catch (error) {
        console.error('Error fetching non-working days:', error)
        return NextResponse.json({ error: 'Error al cargar días' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { fecha, motivo, esLaborable } = await req.json()
        const date = new Date(fecha)
        date.setHours(0, 0, 0, 0)

        if (esLaborable) {
            // Remove non-working day
            await (prisma as any).diaNoLaborable.deleteMany({
                where: { fecha: date }
            })
            return NextResponse.json({ success: true })
        } else {
            // Set as non-working
            const diaNoLaborable = await (prisma as any).diaNoLaborable.upsert({
                where: { fecha: date },
                update: { motivo },
                create: { fecha: date, motivo }
            })

            // IMPACT LOGIC: Identify affected students
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
            const dayMap: Record<string, string> = {
                'SUNDAY': 'DOMINGO', 'MONDAY': 'LUNES', 'TUESDAY': 'MARTES',
                'WEDNESDAY': 'MIERCOLES', 'THURSDAY': 'JUEVES', 'FRIDAY': 'VIERNES', 'SATURDAY': 'SABADO'
            }
            const daySpanish = dayMap[dayOfWeek]

            const affectedInscriptions = await prisma.inscripcion.findMany({
                where: {
                    estado: 'ACTIVA',
                    pagado: true,
                    dia: { contains: daySpanish, mode: 'insensitive' }
                },
                include: { alumno: { include: { usuario: true } } }
            })

            // Create credits for each affected student
            for (const ins of affectedInscriptions) {
                await (prisma as any).creditoClaseExtra.create({
                    data: {
                        alumnoId: ins.alumnoId,
                        tallerId: ins.tallerId,
                        motivo: `Clase cancelada el ${date.toLocaleDateString('es-AR')}: ${motivo || 'Feriado'}`
                    }
                })

                // Create notification for student
                await prisma.notificacion.create({
                    data: {
                        usuarioId: ins.alumno.usuarioId,
                        titulo: '🎨 Clase Extra Disponible',
                        mensaje: `El ${date.toLocaleDateString('es-AR')} no habrá clases por ${motivo || 'Feriado'}. Tenés un crédito disponible para agendar en otra fecha.`,
                        tipo: 'SUCCESS'
                    }
                })
            }

            return NextResponse.json({ success: true, affectedCount: affectedInscriptions.length })
        }
    } catch (error) {
        console.error('Error updating calendar:', error)
        return NextResponse.json({ error: 'Error al actualizar el calendario' }, { status: 500 })
    }
}
