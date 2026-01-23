'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function SummerWorkshopSlider() {
    return (
        <section className="relative w-full min-h-[70vh] flex items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/slider-bg.png"
                    alt="Fondo artístico"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
                {/* Main Content - Text Only, Full Width Distribution */}
                <div className="text-center space-y-8">
                    {/* Title */}
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                                Taller de Verano
                            </span>
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-4xl md:text-5xl font-bold text-warm-800">Limoné</span>
                            <span className="text-2xl md:text-3xl font-medium text-warm-600 border-l-2 border-warm-300 pl-4">Edición 2026</span>
                        </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-xl md:text-2xl lg:text-3xl text-warm-600 font-medium max-w-3xl mx-auto">
                        Más que una colonia, un taller de arte especializado.
                    </p>

                    {/* Key info - Horizontal distribution */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto py-6">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-sm">
                            <p className="text-warm-800 font-bold text-lg">Del 6 de enero</p>
                            <p className="text-warm-600">al 28 de febrero</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-sm">
                            <p className="text-warm-800 font-bold text-lg">Niñas y niños</p>
                            <p className="text-warm-600">de 5 a 12 años</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-sm">
                            <p className="text-warm-800 font-bold text-lg">Materiales</p>
                            <p className="text-warm-600">profesionales incluidos</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-sm">
                            <p className="text-warm-800 font-bold text-lg">Grupos reducidos</p>
                            <p className="text-warm-600">Atención personalizada</p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                        <Link
                            href="/inscripcion"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl hover:from-amber-400 hover:to-orange-400 transform hover:-translate-y-1 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Reservá tu lugar ahora
                        </Link>
                    </div>

                    <p className="text-warm-500 font-medium">
                        ¡Cupos limitados!
                    </p>
                </div>
            </div>
        </section>
    )
}
