import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const [creditos, diasNoLaborables, talleres] = await Promise.all([
            (prisma as any).creditoClaseExtra.findMany({
                where: {
                    alumno: { usuarioId: session.user.id }
                },
                include: {
                    alumno: {
                        include: {
                            inscripciones: {
                                where: { estado: 'ACTIVA' },
                                include: { taller: true }
                            }
                        }
                    },
                    taller: true
                },
                orderBy: { creadoEn: 'desc' }
            }),
            (prisma as any).diaNoLaborable.findMany({
                where: {
                    fecha: { gte: new Date() }
                }
            }),
            (prisma.taller as any).findMany({
                select: {
                    id: true,
                    nombre: true,
                    diasSemana: true,
                    horarios: true,
                    activo: true
                }
            })
        ])

        return NextResponse.json({ creditos, diasNoLaborables, talleres })
    } catch (error) {
        console.error('Error fetching extra class data:', error)
        return NextResponse.json({ error: 'Error al cargar datos' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const { creditoId, fecha, horario } = await req.json()

        const credito = await (prisma as any).creditoClaseExtra.findUnique({
            where: { id: creditoId },
            include: { alumno: true }
        })

        if (!credito || credito.alumno.usuarioId !== session.user.id) {
            return NextResponse.json({ error: 'Crédito no encontrado' }, { status: 404 })
        }

        if (credito.usado) {
            return NextResponse.json({ error: 'El crédito ya fue utilizado' }, { status: 400 })
        }

        // Update credit with local noon to prevent UTC shifts
        const localDate = new Date(fecha)
        const safeDate = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 12, 0, 0)

        await (prisma as any).creditoClaseExtra.update({
            where: { id: creditoId },
            data: {
                usado: true,
                fechaProgramada: safeDate,
                horarioProgramado: horario
            }
        })

        // Notify Natalia (admin)
        await prisma.notificacion.create({
            data: {
                usuarioId: (await prisma.usuario.findFirst({ where: { rol: 'ADMIN' } }))?.id || '',
                titulo: 'Nueva Clase Extra Agendada 🎨',
                mensaje: `${credito.alumno.nombre} agendó una clase extra para el ${new Date(fecha).toLocaleDateString()} a las ${horario}.`,
                tipo: 'INFO'
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error scheduling extra class:', error)
        return NextResponse.json({ error: 'Error al agendar la clase' }, { status: 500 })
    }
}
