'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Slide {
    id: string
    titulo: string
    subtitulo: string | null
    descripcion: string | null
    tags: string[]
    badgeTexto: string | null
    textoBoton: string | null
    enlace: string | null
    imagenUrl: string
    estiloOverlay: string
    orden: number
}

// Default slides for when database is empty
const defaultSlides: Slide[] = [
    {
        id: 'default-1',
        titulo: 'Taller de Verano',
        subtitulo: 'Limoné | Edición 2026',
        descripcion: 'Más que una colonia, un taller de arte especializado para crear y divertirse.',
        tags: ['📅 6 Ene - 28 Feb', '🧒 5 a 12 años', '🎨 Materiales Incluidos'],
        badgeTexto: null,
        textoBoton: 'Inscribirse Ahora',
        enlace: '/taller-verano',
        imagenUrl: '/slider-bg.png',
        estiloOverlay: 'light',
        orden: 0,
    },
    {
        id: 'default-2',
        titulo: 'Tu Primera Clase Es Gratis',
        subtitulo: null,
        descripcion: 'Vení a conocer Taller Limoné. Probá materiales, conocé el espacio y descubrí tu potencial artístico.',
        tags: ['✨ Experiencia Real', '👩‍🎨 Docentes Especializados', '🎨 Todos los niveles'],
        badgeTexto: '¡Probá sin costo!',
        textoBoton: 'Agendar Clase Gratis',
        enlace: '/inscripcion?mode=nivelacion',
        imagenUrl: '/taller-aula.png',
        estiloOverlay: 'dark',
        orden: 1,
    },
]

export default function MainHero() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [slides, setSlides] = useState<Slide[]>(defaultSlides)
    const [loading, setLoading] = useState(true)

    // Fetch slides from API
    const fetchSlides = useCallback(async () => {
        try {
            const res = await fetch('/api/slides')
            if (res.ok) {
                const data = await res.json()
                if (data.length > 0) {
                    setSlides(data)
                }
            }
        } catch (error) {
            console.error('Error fetching slides:', error)
            // Keep default slides on error
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSlides()
    }, [fetchSlides])

    // Auto-play
    useEffect(() => {
        if (slides.length <= 1) return

        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length)
        }, 8000) // 8 seconds per slide
        return () => clearInterval(timer)
    }, [slides.length])

    const renderSlide = (slide: Slide, index: number) => {
        const isActive = currentSlide === index
        const isDark = slide.estiloOverlay === 'dark'

        return (
            <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-10 z-0'
                    }`}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={slide.imagenUrl}
                        alt={slide.titulo}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    {/* Overlay based on style */}
                    <div className={`absolute inset-0 ${isDark
                            ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 backdrop-blur-[3px]'
                            : 'bg-white/30 backdrop-blur-[2px]'
                        }`}></div>
                </div>

                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isDark ? 'text-white' : ''}`}>
                        {/* Badge */}
                        {slide.badgeTexto && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                <div className="inline-block bg-lemon-400 text-lemon-900 font-black px-4 py-1.5 rounded-full uppercase tracking-wider text-xs md:text-sm mb-4 shadow-lg transform -rotate-2">
                                    {slide.badgeTexto}
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight ${isDark
                                    ? 'text-white drop-shadow-lg'
                                    : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 drop-shadow-sm'
                                }`}>
                                {slide.titulo}
                            </h1>
                            {slide.subtitulo && (
                                <div className="flex items-center justify-center gap-3">
                                    {slide.subtitulo.includes('|') ? (
                                        <>
                                            <span className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-warm-800'}`}>
                                                {slide.subtitulo.split('|')[0].trim()}
                                            </span>
                                            <span className={`text-xl md:text-2xl font-medium border-l-2 pl-3 ${isDark ? 'text-white/80 border-white/30' : 'text-warm-600 border-warm-300'}`}>
                                                {slide.subtitulo.split('|')[1].trim()}
                                            </span>
                                        </>
                                    ) : (
                                        <span className={`text-xl md:text-2xl font-medium ${isDark ? 'text-white/80' : 'text-warm-600'}`}>
                                            {slide.subtitulo}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {slide.descripcion && (
                            <p className={`text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed mt-4 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 ${isDark ? 'text-white/90 drop-shadow-md' : 'text-warm-700'
                                }`}>
                                {slide.descripcion}
                            </p>
                        )}

                        {/* Tags */}
                        {slide.tags && slide.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                                {slide.tags.map((tag, tagIndex) => (
                                    <div
                                        key={tagIndex}
                                        className={`backdrop-blur-md px-4 py-2 rounded-xl shadow-sm ${isDark
                                                ? 'bg-white/20 border border-white/30'
                                                : 'bg-white/80 border border-white/50'
                                            }`}
                                    >
                                        <span className={`block font-bold text-sm md:text-base ${isDark ? 'text-white' : 'text-warm-900'}`}>
                                            {tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA Button */}
                        {slide.textoBoton && slide.enlace && (
                            <div className="animate-in fade-in zoom-in duration-700 delay-700">
                                <Link
                                    href={slide.enlace}
                                    className={`inline-flex items-center gap-2 px-8 py-3 font-bold text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all group/btn ${isDark
                                            ? 'bg-lemon-400 text-lemon-900 hover:bg-lemon-300'
                                            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                                        }`}
                                >
                                    <span className="text-xl">{isDark ? '👩‍🎨' : '☀️'}</span>
                                    {slide.textoBoton}
                                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section className="relative w-full h-[600px] md:h-[700px] lg:h-[80vh] flex items-center overflow-hidden bg-warm-50 group">
            {/* Slides */}
            {slides.map((slide, index) => renderSlide(slide, index))}

            {/* --- CONTROLS --- */}
            {slides.length > 1 && (
                <>
                    {/* Arrows */}
                    <button
                        onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all duration-500 shadow-sm ${currentSlide === index
                                        ? 'w-12 bg-lemon-500'
                                        : 'w-2 bg-warm-300/50 hover:bg-warm-300'
                                    }`}
                                aria-label={`Ver slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    )
}
