import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: Get all workshops and their prices
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // We use queryRaw to avoid Prisma Client validation errors if it hasn't been generated yet
        const talleres: any = await prisma.$queryRaw`SELECT * FROM talleres ORDER BY nombre ASC`

        return NextResponse.json({
            talleres: talleres.map((t: any) => ({
                id: t.id,
                nombre: t.nombre,
                tipo: t.tipo,
                precio1dia: t.precio1dia || 0,
                precio2dia: t.precio2dia || 0,
                precio1diaExt: t.precio1diaExt || 0,
                precio2diaExt: t.precio2diaExt || 0,
                precio: t.precio || 0
            }))
        })
    } catch (error) {
        console.error('Error fetching prices:', error)
        return NextResponse.json({ error: 'Error al obtener precios' }, { status: 500 })
    }
}

// PATCH: Update workshop prices
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { talleres } = body

        // 1. Update Workshops Pricing using Raw SQL to bypass Prisma Client lock/validation
        if (talleres && Array.isArray(talleres)) {
            for (const t of talleres) {
                await prisma.$executeRawUnsafe(`
                    UPDATE talleres 
                    SET 
                        "precio1dia" = ${parseFloat(t.precio1dia) || 0}, 
                        "precio2dia" = ${parseFloat(t.precio2dia) || 0}, 
                        "precio1diaExt" = ${parseFloat(t.precio1diaExt) || 0}, 
                        "precio2diaExt" = ${parseFloat(t.precio2diaExt) || 0}, 
                        "precio" = ${parseFloat(t.precio) || 0}
                    WHERE "id" = '${t.id}'
                `)
            }
        }

        return NextResponse.json({ success: true, message: 'Precios actualizados correctamente' })
    } catch (error) {
        console.error('Error updating prices:', error)
        return NextResponse.json({ error: 'Error al actualizar precios' }, { status: 500 })
    }
}
