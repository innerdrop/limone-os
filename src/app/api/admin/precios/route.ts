import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: Get all prices
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Get all price configurations
        const precios = await prisma.configuracion.findMany({
            where: {
                clave: {
                    in: [
                        'precio_taller_regular',
                        'precio_clase_unica',
                        'precio_verano_base_1x',
                        'precio_verano_base_2x',
                        'precio_verano_extended_1x',
                        'precio_verano_extended_2x'
                    ]
                }
            }
        })

        // Convert to object format
        const preciosObj: Record<string, number> = {}
        precios.forEach(p => {
            preciosObj[p.clave] = parseFloat(p.valor)
        })

        // Return default values if not set
        return NextResponse.json({
            precio_taller_regular: preciosObj.precio_taller_regular || 25000,
            precio_clase_unica: preciosObj.precio_clase_unica || 15000,
            precio_verano_base_1x: preciosObj.precio_verano_base_1x || 75000,
            precio_verano_base_2x: preciosObj.precio_verano_base_2x || 130000,
            precio_verano_extended_1x: preciosObj.precio_verano_extended_1x || 145000,
            precio_verano_extended_2x: preciosObj.precio_verano_extended_2x || 210000
        })
    } catch (error) {
        console.error('Error fetching prices:', error)
        return NextResponse.json({ error: 'Error al obtener precios' }, { status: 500 })
    }
}

// PATCH: Update prices
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()

        // Validate all prices are positive numbers
        const preciosKeys = [
            'precio_taller_regular',
            'precio_clase_unica',
            'precio_verano_base_1x',
            'precio_verano_base_2x',
            'precio_verano_extended_1x',
            'precio_verano_extended_2x'
        ]

        for (const key of preciosKeys) {
            if (body[key] !== undefined) {
                const value = parseFloat(body[key])
                if (isNaN(value) || value < 0) {
                    return NextResponse.json(
                        { error: `El precio ${key} debe ser un número positivo` },
                        { status: 400 }
                    )
                }
            }
        }

        // Update each price
        const updatePromises = preciosKeys.map(async (key) => {
            if (body[key] !== undefined) {
                const value = parseFloat(body[key]).toString()

                return prisma.configuracion.upsert({
                    where: { clave: key },
                    update: { valor: value },
                    create: {
                        clave: key,
                        valor: value,
                        descripcion: getDescripcion(key)
                    }
                })
            }
        })

        await Promise.all(updatePromises)

        return NextResponse.json({ success: true, message: 'Precios actualizados correctamente' })
    } catch (error) {
        console.error('Error updating prices:', error)
        return NextResponse.json({ error: 'Error al actualizar precios' }, { status: 500 })
    }
}

function getDescripcion(clave: string): string {
    const descripciones: Record<string, string> = {
        precio_taller_regular: 'Precio mensual del Taller Regular',
        precio_clase_unica: 'Precio de la Clase Única',
        precio_verano_base_1x: 'Precio mensual Taller de Verano Base - 1 día',
        precio_verano_base_2x: 'Precio mensual Taller de Verano Base - 2 días',
        precio_verano_extended_1x: 'Precio mensual Taller de Verano Extended - 1 día',
        precio_verano_extended_2x: 'Precio mensual Taller de Verano Extended - 2 días'
    }
    return descripciones[clave] || ''
}
