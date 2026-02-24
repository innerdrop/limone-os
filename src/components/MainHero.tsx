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
    colorTitulo?: string
    colorSubtitulo?: string
    colorDescripcion?: string
    colorBadge?: string
    colorBoton?: string
    colorFondoBoton?: string
    orden: number
    aplicarBlur?: boolean
    botonOffset?: number
}

// Default slides for when database is empty
const defaultSlides: Slide[] = [
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
        colorTitulo: '#FFFFFF',
        colorSubtitulo: '#FFFFFF',
        colorDescripcion: '#FFFFFF',
        colorBadge: '#FFFFFF',
        colorBoton: '#2D2D2D',
        colorFondoBoton: '#F1C40F',
        orden: 1,
    },
]

export default function MainHero() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [slides, setSlides] = useState<Slide[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch slides from API
    const fetchSlides = useCallback(async () => {
        try {
            const res = await fetch('/api/slides')
            if (res.ok) {
                const data = await res.json()
                if (data.length > 0) {
                    setSlides(data)
                } else {
                    // Fallback to default slides if no slides are configured in admin
                    setSlides(defaultSlides)
                }
            } else {
                setSlides(defaultSlides)
            }
        } catch (error) {
            console.error('Error fetching slides:', error)
            setSlides(defaultSlides)
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
                        alt={slide.titulo || 'Slide'}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    {/* Overlay based on style */}
                    <div className={`absolute inset-0 ${slide.estiloOverlay === 'dark'
                        ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40'
                        : slide.estiloOverlay === 'light'
                            ? 'bg-white/30'
                            : ''
                        } ${slide.aplicarBlur !== false
                            ? (isDark ? 'backdrop-blur-[3px]' : 'backdrop-blur-[2px]')
                            : ''
                        }`}></div>
                </div>

                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isDark ? 'text-white' : ''}`}>
                        {/* Badge */}
                        {slide.badgeTexto && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                <div
                                    className="inline-block font-black px-4 py-1.5 rounded-full uppercase tracking-wider text-xs md:text-sm mb-4 shadow-lg transform -rotate-2"
                                    style={{ backgroundColor: slide.colorBadge || '#F1C40F', color: slide.estiloOverlay === 'dark' ? '#000' : '#fff' }}
                                >
                                    {slide.badgeTexto}
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            {slide.titulo && (
                                <h1
                                    className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight drop-shadow-md"
                                    style={{ color: slide.colorTitulo || (isDark ? '#FFFFFF' : '#2D2D2D') }}
                                >
                                    {slide.titulo}
                                </h1>
                            )}
                            {slide.subtitulo && (
                                <div className="flex items-center justify-center gap-3">
                                    {slide.subtitulo.includes('|') ? (
                                        <>
                                            <span
                                                className="text-3xl md:text-4xl font-bold"
                                                style={{ color: slide.colorSubtitulo || (isDark ? '#FFFFFF' : '#8E44AD') }}
                                            >
                                                {slide.subtitulo.split('|')[0].trim()}
                                            </span>
                                            <span
                                                className={`text-xl md:text-2xl font-medium border-l-2 pl-3 ${isDark ? 'border-white/30' : 'border-warm-300'}`}
                                                style={{ color: slide.colorSubtitulo || (isDark ? 'rgba(255,255,255,0.8)' : '#57534E') }}
                                            >
                                                {slide.subtitulo.split('|')[1].trim()}
                                            </span>
                                        </>
                                    ) : (
                                        <span
                                            className="text-xl md:text-2xl font-medium"
                                            style={{ color: slide.colorSubtitulo || (isDark ? 'rgba(255,255,255,0.8)' : '#8E44AD') }}
                                        >
                                            {slide.subtitulo}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {slide.descripcion && (
                            <p
                                className="text-base sm:text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed mt-3 mb-5 sm:mt-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 drop-shadow-md"
                                style={{ color: slide.colorDescripcion || (isDark ? 'rgba(255,255,255,0.9)' : '#57534E') }}
                            >
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
                                    className="inline-flex items-center gap-2 px-8 py-3 font-bold text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all group/btn"
                                    style={{
                                        backgroundColor: slide.colorFondoBoton || '#F1C40F',
                                        color: slide.colorBoton || '#2D2D2D',
                                        transform: slide.botonOffset ? `translateY(${slide.botonOffset}px)` : undefined
                                    }}
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

    if (loading) {
        return (
            <section className="relative w-full h-[600px] md:h-[700px] lg:h-[80vh] flex items-center overflow-hidden bg-warm-100 animate-pulse">
                <div className="w-full max-w-6xl mx-auto px-4 text-center">
                    <div className="h-4 w-32 bg-warm-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-12 w-3/4 bg-warm-200 rounded-2xl mx-auto mb-6"></div>
                    <div className="h-6 w-1/2 bg-warm-200 rounded-xl mx-auto"></div>
                </div>
            </section>
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
