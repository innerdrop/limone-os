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

        const students = await prisma.alumno.findMany({
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

        if (!students || students.length === 0) {
            return NextResponse.json({ error: 'Perfil de alumno no encontrado' }, { status: 404 })
        }

        const allPagos: any[] = []
        students.forEach((student: any) => {
            student.pagos.forEach((p: any) => {
                allPagos.push({
                    id: p.id,
                    studentName: `${student.nombre || ''} ${student.apellido || ''}`.trim(),
                    concepto: p.inscripcion?.fase === 'Taller de Verano' ? 'Verano' : p.inscripcion?.taller.nombre || 'Taller',
                    monto: p.monto,
                    fechaPago: p.fechaPago.toISOString(),
                    estado: p.estado,
                    comprobantePdf: p.comprobantePdf
                })
            })
        })

        // Sort combined list by date desc
        allPagos.sort((a, b) => new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime())

        return NextResponse.json(allPagos)
    } catch (error) {
        console.error('Error fetching payments:', error)
        return NextResponse.json({ error: 'Error al obtener los pagos' }, { status: 500 })
    }
}
