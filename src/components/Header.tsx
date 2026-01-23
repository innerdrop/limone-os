'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-canvas-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 relative z-50">
                            <Image
                                src="/colores.png"
                                alt="Taller Limoné Colors"
                                width={50}
                                height={30}
                                className="object-contain"
                            />
                            <span className="font-gigi text-3xl font-bold text-warm-800">
                                Limoné
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="/tienda" className="relative text-warm-600 hover:text-lemon-600 transition-colors">
                                Tienda
                                <span className="absolute -top-2 -right-8 bg-brand-purple text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    NUEVO
                                </span>
                            </Link>
                            <Link href="/#talleres" className="text-warm-600 hover:text-lemon-600 transition-colors">
                                Talleres
                            </Link>
                            <Link href="/#espacio" className="text-warm-600 hover:text-lemon-600 transition-colors">
                                Nuestro Espacio
                            </Link>
                            <Link href="/#sobre" className="text-warm-600 hover:text-lemon-600 transition-colors">
                                Sobre Natalia
                            </Link>
                            <Link href="/#testimonios" className="text-warm-600 hover:text-lemon-600 transition-colors">
                                Testimonios
                            </Link>
                            <Link href="/#contacto" className="text-warm-600 hover:text-lemon-600 transition-colors">
                                Contacto
                            </Link>
                        </nav>

                        {/* Desktop CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 border border-lemon-600 rounded-xl text-sm font-medium text-lemon-700 hover:bg-lemon-50 transition-colors mr-2">
                                Iniciar sesión
                            </Link>
                            <Link href="/inscripcion" className="inline-flex btn-primary py-2.5 px-5 text-sm">
                                Inscribirme
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden relative z-50 p-2 text-warm-800 hover:bg-lemon-50 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Overlay - Hoisted out of header for z-index safety */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-white z-[9999] md:hidden flex flex-col overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lemon-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    {/* Internal Header for Close Button */}
                    <div className="flex items-center justify-between p-4 border-b border-warm-100 relative z-20 bg-white/95 backdrop-blur-sm">
                        <span className="font-gigi text-2xl font-bold text-warm-800">Menú</span>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 text-warm-500 hover:bg-warm-100 rounded-full transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-4 text-center p-6 overflow-y-auto relative z-10 w-full h-full">
                        <Link
                            href="/tienda"
                            className="p-4 rounded-2xl bg-gradient-to-r from-lemon-50 to-white border border-lemon-100 text-warm-800 font-bold text-xl hover:shadow-md transition-all flex items-center justify-center gap-3 group shrink-0"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span className="text-2xl">🛍️</span>
                            Tienda
                            <span className="bg-brand-purple text-white text-xs font-bold px-2 py-1 rounded-full group-hover:scale-110 transition-transform">
                                NUEVO
                            </span>
                        </Link>

                        <div className="grid grid-cols-2 gap-3 shrink-0">
                            <Link href="/#talleres" className="p-3 rounded-xl bg-warm-50 text-warm-700 font-medium hover:bg-lemon-50 hover:text-lemon-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                🎨 Talleres
                            </Link>
                            <Link href="/#espacio" className="p-3 rounded-xl bg-warm-50 text-warm-700 font-medium hover:bg-lemon-50 hover:text-lemon-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                🏡 El Espacio
                            </Link>
                            <Link href="/#sobre" className="p-3 rounded-xl bg-warm-50 text-warm-700 font-medium hover:bg-lemon-50 hover:text-lemon-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                👩‍🎨 Sobre Natalia
                            </Link>
                            <Link href="/#contacto" className="p-3 rounded-xl bg-warm-50 text-warm-700 font-medium hover:bg-lemon-50 hover:text-lemon-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                💌 Contacto
                            </Link>
                        </div>
                        <Link href="/#testimonios" className="p-3 rounded-xl bg-warm-50 text-warm-700 font-medium hover:bg-lemon-50 hover:text-lemon-700 transition-colors shrink-0" onClick={() => setIsMenuOpen(false)}>
                            💬 Testimonios
                        </Link>

                        <div className="h-px bg-gradient-to-r from-transparent via-warm-200 to-transparent my-2 shrink-0" />

                        <div className="flex flex-col gap-3 shrink-0">
                            <Link
                                href="/login"
                                className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-lemon-400 rounded-xl text-lg font-bold text-lemon-700 hover:bg-lemon-50 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                href="/inscripcion"
                                className="w-full btn-primary py-3 px-5 text-lg shadow-lg hover:shadow-lemon-400/30"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Inscribirme
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </>
    )
}
