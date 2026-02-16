import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const config = await prisma.configuracion.findUnique({
            where: { clave: 'mantenimiento_activado' }
        })

        return NextResponse.json({
            activado: config?.valor === 'true'
        })
    } catch (error) {
        console.error('Error fetching maintenance mode:', error)
        return NextResponse.json({ error: 'Error al obtener estado de mantenimiento' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { activado } = await request.json()

        await prisma.configuracion.upsert({
            where: { clave: 'mantenimiento_activado' },
            update: { valor: activado ? 'true' : 'false' },
            create: {
                clave: 'mantenimiento_activado',
                valor: activado ? 'true' : 'false',
                descripcion: 'Indica si el sitio está en modo mantenimiento'
            }
        })

        return NextResponse.json({ success: true, activado })
    } catch (error) {
        console.error('Error updating maintenance mode:', error)
        return NextResponse.json({ error: 'Error al actualizar modo mantenimiento' }, { status: 500 })
    }
}
