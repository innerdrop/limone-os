import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function GET(request: Request) {
    // Basic security check - could be improved, but this is for a one-time setup
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    if (secret !== 'limone-2026-setup') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const email = 'natalia@tallerlimone.com'
        const password = '2026Limon3*'
        const nombre = 'Natalia Fusari'

        const hashedPassword = await hash(password, 12)

        const admin = await prisma.usuario.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                nombre,
                rol: 'ADMIN',
                activo: true,
                debeCambiarPassword: false,
            },
            create: {
                email,
                password: hashedPassword,
                nombre,
                rol: 'ADMIN',
                activo: true,
                debeCambiarPassword: false,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Admin user configured successfully',
            email: admin.email
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
