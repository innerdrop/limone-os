'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function MainHero() {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev === 0 ? 1 : 0))
        }, 8000) // 8 seconds per slide
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative w-full h-[600px] md:h-[700px] lg:h-[80vh] flex items-center overflow-hidden bg-warm-50 group">

            {/* --- SLIDE 1: SUMMER WORKSHOP --- */}
            <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${currentSlide === 0 ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-10 z-0'}`}>
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/slider-bg.png"
                        alt="Fondo artístico"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        {/* Title */}
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 drop-shadow-sm">
                                    Taller de Verano
                                </span>
                            </h1>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl md:text-4xl font-bold text-warm-800">Limoné</span>
                                <span className="text-xl md:text-2xl font-medium text-warm-600 border-l-2 border-warm-300 pl-3">Edición 2026</span>
                            </div>
                        </div>

                        {/* Tagline */}
                        <p className="text-lg md:text-2xl text-warm-700 font-medium max-w-3xl mx-auto leading-relaxed mt-4 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            Más que una colonia, un <span className="font-bold text-orange-600">taller de arte especializado</span> para crear y divertirse.
                        </p>

                        {/* Key info badges */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                            <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/50">
                                <span className="block font-bold text-warm-900 text-sm md:text-base">📅 6 Ene - 28 Feb</span>
                            </div>
                            <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/50">
                                <span className="block font-bold text-warm-900 text-sm md:text-base">🧒 5 a 12 años</span>
                            </div>
                            <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/50">
                                <span className="block font-bold text-warm-900 text-sm md:text-base">🎨 Materiales Incluidos</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="animate-in fade-in zoom-in duration-700 delay-700">
                            <Link
                                href="/taller-verano"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all group/btn"
                            >
                                <span className="text-xl">☀️</span>
                                Inscribirse Ahora
                                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SLIDE 2: FREE TRIAL CLASS --- */}
            <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${currentSlide === 1 ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-10 z-0'}`}>
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/taller-aula.png"
                        alt="Aula del taller"
                        fill
                        className="object-cover"
                        priority={false}
                    />
                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 backdrop-blur-[3px]"></div>
                </div>

                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        {/* Title */}
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            <div className="inline-block bg-lemon-400 text-lemon-900 font-black px-4 py-1.5 rounded-full uppercase tracking-wider text-xs md:text-sm mb-2 shadow-lg transform -rotate-2">
                                ¡Probá sin costo!
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight drop-shadow-lg">
                                Tu Primera Clase <br />
                                <span className="text-lemon-300">Es Gratis</span>
                            </h1>
                        </div>

                        {/* Tagline */}
                        <p className="text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-md text-white/90 mt-4 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            Vení a conocer Taller Limoné. Probá materiales, conocé el espacio y descubrí tu potencial artístico.
                        </p>

                        {/* Key info badges */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
                                <span className="block font-bold text-sm md:text-base">✨ Experiencia Real</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
                                <span className="block font-bold text-sm md:text-base">👩‍🎨 Docentes Especializados</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
                                <span className="block font-bold text-sm md:text-base">🎨 Todos los niveles</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="animate-in fade-in zoom-in duration-700 delay-700">
                            <Link
                                href="/inscripcion?mode=nivelacion"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-lemon-400 text-lemon-900 font-black text-lg md:text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:bg-lemon-300 hover:scale-105 hover:-translate-y-1 transition-all group/btn"
                            >
                                <span className="text-xl">👩‍🎨</span>
                                Agendar Clase Gratis
                                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTROLS --- */}

            {/* Arrows */}
            <button
                onClick={() => setCurrentSlide(prev => (prev === 0 ? 1 : 0))}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
                onClick={() => setCurrentSlide(prev => (prev === 0 ? 1 : 0))}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
                <button
                    onClick={() => setCurrentSlide(0)}
                    className={`h-2 rounded-full transition-all duration-500 shadow-sm ${currentSlide === 0 ? 'w-12 bg-lemon-500' : 'w-2 bg-warm-300/50 hover:bg-warm-300'}`}
                    aria-label="Ver Taller de Verano"
                />
                <button
                    onClick={() => setCurrentSlide(1)}
                    className={`h-2 rounded-full transition-all duration-500 shadow-sm ${currentSlide === 1 ? 'w-12 bg-lemon-500' : 'w-2 bg-warm-300/50 hover:bg-warm-300'}`}
                    aria-label="Ver Clase de Prueba"
                />
            </div>
        </section>
    )
}
