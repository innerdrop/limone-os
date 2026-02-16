import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(req: Request) {
    try {
        const { referente, path } = await req.json()
        const headersList = await headers()
        const userAgent = headersList.get('user-agent') || 'unknown'

        // Simple session identification (could be more complex, but for basic stats it's okay)
        // We can use a hash of IP + UserAgent to avoid double counting same person too much, 
        // but for "visits" typically we count every session or hit.

        await prisma.visita.create({
            data: {
                referente: referente || 'direct',
                path: path || '/',
                userAgent: userAgent,
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error tracking visit:', error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
