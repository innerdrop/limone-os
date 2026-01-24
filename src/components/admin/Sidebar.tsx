'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface User {
    name?: string | null
    email?: string | null
    role: string
    image?: string | null
}

export const menuItems = [
    {
        label: 'Tablero',
        href: '/admin',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
        ),
    },
    {
        label: 'Lista de Alumnos',
        href: '/admin/alumnos',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },
    {
        label: 'Agenda / Calendario',
        href: '/admin/agenda',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: 'Pagos y Cuotas',
        href: '/admin/finanzas',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        label: 'Galería de Obras',
        href: '/admin/contenido',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: 'Configuración Talleres',
        href: '/admin/talleres',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: 'Tienda',
        href: '/admin/tienda',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        ),
    },
    {
        label: 'Slider / Publicidad',
        href: '/admin/slider',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
        ),
        isNew: true,
    },
]

export default function AdminSidebar({ user }: { user: User }) {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
            <div className="flex flex-col flex-grow bg-warm-800 pt-5 pb-4 overflow-y-auto">
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 mb-8">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                            <Image
                                src="/colores.png"
                                alt="Limoné Logo"
                                width={48}
                                height={48}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <span className="font-gigi text-2xl font-bold text-white block">
                                Limoné
                            </span>
                            <span className="text-xs text-warm-400">Panel Admin</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${isActive
                                    ? 'bg-brand-yellow text-brand-charcoal shadow-glow-lemon'
                                    : 'text-warm-300 hover:bg-warm-700 hover:text-white'
                                    }`}
                            >
                                <span className={isActive ? 'text-brand-charcoal' : ''}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {(item as any).isNew && (
                                    <span className="absolute top-1 right-2 bg-brand-purple text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        NUEVO
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Info */}
                <div className="px-4 mt-6">
                    <div className="p-4 rounded-xl bg-warm-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center">
                                <span className="text-white font-semibold">
                                    {user.name?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-warm-400 truncate">
                                    Administrador
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Site */}
                <div className="px-4 mt-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-warm-400 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al sitio
                    </Link>
                </div>
            </div>
        </aside>
    )
}
