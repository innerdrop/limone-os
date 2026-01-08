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

const menuItems = [
    {
        label: 'Dashboard',
        href: '/portal',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: 'Calendario',
        href: '/portal/calendario',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: 'Inscribirme',
        href: '/portal/inscripcion',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        label: 'Mis Pagos',

        href: '/portal/pagos',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
    },
    {
        label: 'Mi Galería',
        href: '/portal/galeria',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: 'Mi Perfil',
        href: '/portal/perfil',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
]

export default function PortalSidebar({ user }: { user: User }) {
    const pathname = usePathname()

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-canvas-200 pt-5 pb-4 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 mb-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex items-center gap-3 px-2">
                                <Image
                                    src="/colores.png"
                                    alt="Taller Limoné Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                                <span className="font-gigi text-xl font-bold text-warm-800">
                                    Limoné
                                </span>
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
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-brand-purple/10 text-brand-purple'
                                        : 'text-warm-600 hover:bg-canvas-100 hover:text-warm-800'
                                        }`}
                                >
                                    <span className={isActive ? 'text-brand-purple' : 'text-warm-400'}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Info */}
                    <div className="px-4 mt-6">
                        <div className="p-4 rounded-xl bg-canvas-50 border border-canvas-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center">
                                    <span className="text-brand-orange font-semibold">
                                        {user.name?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-warm-800 truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-warm-400 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Menu Button - Will be handled by Header */}
        </>
    )
}
