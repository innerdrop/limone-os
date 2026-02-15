import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

const CONFIG_KEYS = [
    'promo_popup_active',
    'promo_popup_badge',
    'promo_popup_title',
    'promo_popup_subtitle',
    'promo_popup_text',
    'promo_popup_btn_text',
    'promo_popup_btn_link',
    'promo_popup_footer'
]

export async function GET() {
    try {
        const configs = await prisma.configuracion.findMany({
            where: {
                clave: { in: CONFIG_KEYS }
            }
        })

        const configObj: Record<string, string> = {}
        configs.forEach(c => {
            configObj[c.clave] = c.valor
        })

        // Default values
        return NextResponse.json({
            active: configObj.promo_popup_active === 'true',
            badge: configObj.promo_popup_badge || 'Temporada 2026',
            title: configObj.promo_popup_title || 'Taller de',
            subtitle: configObj.promo_popup_subtitle || 'Verano',
            text: configObj.promo_popup_text || 'Dibujo, pintura y creatividad. Para niñas y niños de 5 a 12 años en Ushuaia.',
            btnText: configObj.promo_popup_btn_text || '¡Reservar mi lugar!',
            btnLink: configObj.promo_popup_btn_link || '/taller-verano',
            footer: configObj.promo_popup_footer || 'Cupos limitados • Edición Especial'
        })
    } catch (error) {
        console.error('Error fetching popup config:', error)
        return NextResponse.json({ error: 'Error al cargar configuración' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await req.json()
        const { active, badge, title, subtitle, text, btnText, btnLink, footer } = body

        const updates = [
            { clave: 'promo_popup_active', valor: active ? 'true' : 'false' },
            { clave: 'promo_popup_badge', valor: badge || '' },
            { clave: 'promo_popup_title', valor: title || '' },
            { clave: 'promo_popup_subtitle', valor: subtitle || '' },
            { clave: 'promo_popup_text', valor: text || '' },
            { clave: 'promo_popup_btn_text', valor: btnText || '' },
            { clave: 'promo_popup_btn_link', valor: btnLink || '' },
            { clave: 'promo_popup_footer', valor: footer || '' }
        ]

        await Promise.all(updates.map(u =>
            prisma.configuracion.upsert({
                where: { clave: u.clave },
                update: { valor: u.valor },
                create: { clave: u.clave, valor: u.valor }
            })
        ))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating popup config:', error)
        return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 })
    }
}
