'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PromotionalPopup() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // Check if popup has been seen in this session
        const hasSeenPopup = sessionStorage.getItem('promo_seen')
        if (!hasSeenPopup) {
            // Small delay to ensure smooth entrance
            const timer = setTimeout(() => {
                setIsOpen(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const closePopup = () => {
        setIsOpen(false)
        sessionStorage.setItem('promo_seen', 'true')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closePopup}
            />

            {/* Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-[min(384px,95vw)] w-full overflow-hidden animate-scale-up border border-lemon-100">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-lemon-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 z-10 p-2 text-warm-400 hover:text-red-500 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8 pb-6 flex flex-col items-center text-center">
                    <span className="badge badge-lemon mb-4">Temporada 2026</span>

                    <h2 className="text-3xl font-bold text-warm-800 mb-3 leading-tight">
                        Taller de <br />
                        <span className="text-gradient">Verano</span>
                    </h2>

                    <p className="text-warm-600 text-sm leading-relaxed mb-8 max-w-[240px]">
                        Dibujo, pintura y creatividad.
                        Para niñas y niños de 5 a 12 años en Ushuaia.
                    </p>

                    <Link
                        href="/taller-verano"
                        onClick={closePopup}
                        className="btn-primary w-full py-4 text-base shadow-lg hover:shadow-glow-lemon"
                    >
                        ¡Reservar mi lugar!
                    </Link>

                    <p className="text-[10px] text-warm-400 mt-4 uppercase tracking-widest font-medium">
                        Cupos limitados • Edición Especial
                    </p>
                </div>
            </div>
        </div>
    )
}
