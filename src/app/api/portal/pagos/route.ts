import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const student = await prisma.alumno.findFirst({
            where: { usuarioId: session.user.id },
            include: {
                pagos: {
                    include: {
                        inscripcion: {
                            include: {
                                taller: true
                            }
                        }
                    },
                    orderBy: {
                        fechaPago: 'desc'
                    }
                }
            }
        })

        if (!student) {
            return NextResponse.json({ error: 'Perfil de alumno no encontrado' }, { status: 404 })
        }

        const formattedPagos = student.pagos.map(p => ({
            id: p.id,
            concepto: p.inscripcion?.fase === 'Colonia de Verano' ? 'Colonia de Verano' : p.inscripcion?.taller.nombre || 'Taller de Arte',
            monto: p.monto,
            fechaPago: p.fechaPago.toISOString(),
            estado: p.estado, // PENDIENTE or CONFIRMADO
            comprobantePdf: p.comprobantePdf
        }))

        return NextResponse.json(formattedPagos)
    } catch (error) {
        console.error('Error fetching payments:', error)
        return NextResponse.json({ error: 'Error al obtener los pagos' }, { status: 500 })
    }
}
