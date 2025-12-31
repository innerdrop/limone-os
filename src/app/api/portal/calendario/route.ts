import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const DAYS_MAP: Record<string, number> = {
    'DOMINGO': 0, 'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5, 'SABADO': 6
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const student = await prisma.alumno.findUnique({
            where: { usuarioId: session.user.id },
            include: {
                inscripciones: {
                    where: { pagado: true, estado: 'ACTIVA' },
                    include: { taller: true }
                }
            }
        })

        if (!student) return NextResponse.json({ classes: [] })

        const enrollments = student.inscripciones
        const classes: any[] = []

        // Generate events for current month and next month
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 2, 0)

        for (const ins of enrollments) {
            const targetDay = DAYS_MAP[ins.dia || '']
            if (targetDay === undefined) continue

            let current = new Date(start)
            while (current <= end) {
                if (current.getDay() === targetDay) {
                    classes.push({
                        id: `${ins.id}-${current.getTime()}`,
                        taller: ins.taller.nombre,
                        dia: ins.dia,
                        hora: ins.horario?.split('-')[0] || '00:00',
                        fecha: new Date(current),
                        estado: 'programada'
                    })
                }
                current.setDate(current.getDate() + 1)
            }
        }

        return NextResponse.json({ classes })
    } catch (error: any) {
        console.error('Error al obtener calendario:', error)
        return NextResponse.json({ error: 'Error al obtener el calendario' }, { status: 500 })
    }
}
