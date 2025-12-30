import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

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
        url: 'https://limone.usev.app',
        siteName: 'Taller Limoné',
        title: 'Taller Limoné | Arte en Ushuaia',
        description: 'Taller de arte en Ushuaia dirigido por Natalia Fusari. Clases de pintura, dibujo y técnicas mixtas para todas las edades.',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" className="scroll-smooth">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </head>
            <body className="min-h-screen bg-canvas-100 text-warm-800 antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}

