import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const config = await prisma.configuracion.findUnique({
            where: { clave: 'mantenimiento_activado' }
        })

        return NextResponse.json({
            activado: config?.valor === 'true'
        })
    } catch (error) {
        return NextResponse.json({ activado: false })
    }
}
