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
        const { tallerId, dia, horario, fase, asiento } = body

        if (!tallerId || !dia || !horario || !fase || !asiento) {
            return NextResponse.json({ error: 'Faltan datos de inscripción (taller, día, horario, fase o asiento)' }, { status: 400 })
        }

        // Validar dia (Martes a Viernes)
        const diasValidos = ['MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']
        if (!diasValidos.includes(dia.toUpperCase())) {
            return NextResponse.json({ error: 'Día no válido. Solo Martes a Viernes.' }, { status: 400 })
        }

        // Validar horario
        const horariosValidos = ['16:00-17:20', '17:30-18:50', '19:10-20:30']
        if (!horariosValidos.includes(horario)) {
            return NextResponse.json({ error: 'Horario no válido.' }, { status: 400 })
        }

        // Find student
        const alumno = await prisma.alumno.findUnique({
            where: { usuarioId: session.user.id }
        })

        if (!alumno) {
            return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 })
        }

        // Verificar si el asiento ya está ocupado
        const asientoOcupado = await prisma.inscripcion.findFirst({
            where: {
                dia,
                horario,
                asiento,
                estado: 'ACTIVA'
            }
        })

        if (asientoOcupado) {
            return NextResponse.json({ error: 'El asiento ya está ocupado' }, { status: 400 })
        }

        // Verificar cupo (máximo 10)
        const inscritos = await prisma.inscripcion.count({
            where: {
                dia,
                horario,
                estado: 'ACTIVA'
            }
        })

        if (inscritos >= 10) {
            return NextResponse.json({ error: 'El turno ya está completo (máximo 10 alumnos)' }, { status: 400 })
        }

        // Create inscription and a successful payment record (MOCKED)
        const inscripcion = await prisma.inscripcion.create({
            data: {
                alumnoId: alumno.id,
                tallerId,
                dia,
                horario,
                fase,
                asiento,
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
                concepto: `Inscripción taller ${taller?.nombre} - Fase: ${fase}, ${dia} ${horario}, Asiento: ${asiento}`
            }
        })

        return NextResponse.json({ success: true, inscripcion })
    } catch (error: any) {
        console.error('Error en inscripción:', error)
        return NextResponse.json({ error: 'Error al procesar la inscripción' }, { status: 500 })
    }
}
