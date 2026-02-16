import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { startOfDay, startOfWeek, startOfMonth, startOfYear, subDays } from 'date-fns'

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'day' // day, week, month, year

    let startDate = startOfDay(new Date())
    if (filter === 'week') startDate = startOfWeek(new Date(), { weekStartsOn: 1 })
    if (filter === 'month') startDate = startOfMonth(new Date())
    if (filter === 'year') startDate = startOfYear(new Date())

    try {
        const visitas = await prisma.visita.findMany({
            where: {
                fecha: {
                    gte: startDate
                }
            }
        })

        const total = visitas.length
        const sources = {
            direct: visitas.filter(v => v.referente === 'direct').length,
            google: visitas.filter(v => v.referente === 'google').length,
            facebook: visitas.filter(v => v.referente === 'facebook').length,
            instagram: visitas.filter(v => v.referente === 'instagram').length,
            other: visitas.filter(v => v.referente === 'other').length,
        }

        // Group by time units for chart (e.g. by hour if day, by day if week/month)
        // For now, let's keep it simple as requested: count and sources.

        return NextResponse.json({
            total,
            sources
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
    }
}
