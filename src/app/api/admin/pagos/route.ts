import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { alumnoId, inscripcionId, monto, fecha, mes, anio } = body

        if (!alumnoId || !inscripcionId || !monto) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
        }

        // Use a transaction to create the payment and update the enrollment
        const result = await prisma.$transaction([
            prisma.pago.create({
                data: {
                    alumnoId,
                    inscripcionId,
                    monto,
                    fechaPago: new Date(fecha),
                    estado: 'APROBADO',
                    mesCubierto: mes,
                    anioCubierto: anio
                }
            }),
            prisma.inscripcion.update({
                where: { id: inscripcionId },
                data: { pagado: true }
            })
        ])

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('Error creating manual payment:', error)
        return NextResponse.json({ error: 'Error al registrar el pago' }, { status: 500 })
    }
}
