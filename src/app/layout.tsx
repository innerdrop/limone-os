import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import AnalyticsTracker from '@/components/AnalyticsTracker'

export const metadata: Metadata = {
    title: {
        default: 'Taller Limoné | Arte en Ushuaia',
        template: '%s | Taller Limoné'
    },
    description: 'Taller de arte en Ushuaia dirigido por Natalia Fusari. Clases de pintura, dibujo y técnicas mixtas para todas las edades.',
    keywords: ['taller de arte', 'Ushuaia', 'Natalia Fusari', 'pintura', 'dibujo', 'arte', 'clases'],
    authors: [{ name: 'Natalia Fusari' }],
    creator: 'Taller Limoné',
    openGraph: {
        type: 'website',
        locale: 'es_AR',
        url: 'https://tallerlimone.com',
        siteName: 'Taller Limoné',
        title: 'Taller Limoné | Arte en Ushuaia',
        description: 'Taller de arte en Ushuaia dirigido por Natalia Fusari. Clases de pintura, dibujo y técnicas mixtas para todas las edades.',
        images: [
            {
                url: '/logo.png',
                width: 800,
                height: 800,
                alt: 'Taller Limoné Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Taller Limoné | Arte en Ushuaia',
        description: 'Taller de arte en Ushuaia dirigido por Natalia Fusari. Clases de pintura, dibujo y técnicas mixtas para todas las edades.',
        images: ['/logo.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
}

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import { unstable_noStore as noStore } from 'next/cache'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    noStore()
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || '/'

    // Check maintenance mode
    let isMaintenance = false
    try {
        const config = await prisma.configuracion.findUnique({
            where: { clave: 'mantenimiento_activado' }
        })
        isMaintenance = config?.valor === 'true'
    } catch (error) {
        console.error('Error fetching maintenance mode in RootLayout:', error)
        // Default to false if DB is not ready
        isMaintenance = false
    }

    // Exclude paths
    const isExcluded =
        pathname === '/mantenimiento' ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/_next') ||
        pathname.includes('favicon.ico') ||
        /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i.test(pathname)

    if (isMaintenance && !isExcluded) {
        // Check if user is admin - they can bypass maintenance
        const session = await getServerSession(authOptions)
        if (!session || session.user?.role !== 'ADMIN') {
            redirect('/mantenimiento')
        }
    }

    return (
        <html lang="es" className="scroll-smooth">
            <head>
                <meta charSet="utf-8" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link href="https://fonts.googleapis.com/css2?family=Gigi&display=swap" rel="stylesheet" />
            </head>
            <body className="min-h-screen bg-canvas-100 text-warm-800 antialiased">
                <Providers>
                    <AnalyticsTracker />
                    {children}
                </Providers>
            </body>
        </html>
    )
}

