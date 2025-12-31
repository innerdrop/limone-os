'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface User {
    name?: string | null
    email?: string | null
    role: string
    image?: string | null
}

export default function PortalHeader({ user }: { user: User }) {
    const [showMenu, setShowMenu] = useState(false)
    const [showMobileNav, setShowMobileNav] = useState(false)

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-canvas-200">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setShowMobileNav(!showMobileNav)}
                    className="lg:hidden p-2 rounded-lg hover:bg-canvas-100"
                >
                    <svg className="w-6 h-6 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Page Title - Dynamic based on route */}
                <h1 className="text-lg font-semibold text-warm-800 hidden lg:block">
                    Mi Portal
                </h1>

                {/* Mobile Logo */}
                <Link href="/portal" className="lg:hidden flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/logo.jpg"
                            alt="Logo Taller Limoné"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-canvas-100 transition-colors">
                        <svg className="w-6 h-6 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-canvas-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-lemon-200 flex items-center justify-center">
                                <span className="text-lemon-700 font-semibold text-sm">
                                    {user.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <svg className="w-4 h-4 text-warm-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-canvas-200 py-2 z-50">
                                <div className="px-4 py-2 border-b border-canvas-100">
                                    <p className="text-sm font-medium text-warm-800">{user.name}</p>
                                    <p className="text-xs text-warm-400">{user.email}</p>
                                </div>
                                <Link
                                    href="/portal/perfil"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-warm-600 hover:bg-canvas-50"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Mi Perfil
                                </Link>
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-warm-600 hover:bg-canvas-50"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Ir al Inicio
                                </Link>
                                <hr className="my-2 border-canvas-100" />
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {showMobileNav && (
                <div className="lg:hidden border-t border-canvas-200 bg-white py-4 px-4">
                    <nav className="space-y-1">
                        {[
                            { label: 'Dashboard', href: '/portal' },
                            { label: 'Calendario', href: '/portal/calendario' },
                            { label: 'Mis Pagos', href: '/portal/pagos' },
                            { label: 'Mi Galería', href: '/portal/galeria' },
                            { label: 'Mi Perfil', href: '/portal/perfil' },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block px-4 py-2 rounded-lg text-warm-600 hover:bg-canvas-100"
                                onClick={() => setShowMobileNav(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}
