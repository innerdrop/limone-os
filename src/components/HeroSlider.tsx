'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface SlideImage {
    id: string
    imagenUrl: string
    titulo?: string
    descripcion?: string
    enlace?: string
}

interface HeroSliderProps {
    images: SlideImage[]
    autoPlayInterval?: number
}

export default function HeroSlider({ images, autoPlayInterval = 5000 }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const goToNext = useCallback(() => {
        if (isTransitioning || images.length <= 1) return
        setIsTransitioning(true)
        setCurrentIndex((prev) => (prev + 1) % images.length)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [images.length, isTransitioning])

    const goToPrev = useCallback(() => {
        if (isTransitioning || images.length <= 1) return
        setIsTransitioning(true)
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [images.length, isTransitioning])

    const goToSlide = (index: number) => {
        if (isTransitioning || index === currentIndex) return
        setIsTransitioning(true)
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 500)
    }

    // Auto-play
    useEffect(() => {
        if (images.length <= 1) return
        const interval = setInterval(goToNext, autoPlayInterval)
        return () => clearInterval(interval)
    }, [goToNext, autoPlayInterval, images.length])

    if (images.length === 0) {
        return (
            <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-br from-lemon-100 to-leaf-100 flex items-center justify-center shadow-2xl">
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-2xl font-bold text-warm-800 mb-2">Taller Limoné</h3>
                    <p className="text-warm-600">Próximamente: Publicidad del Taller de Verano</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Main Slider Container */}
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-warm-900">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === currentIndex
                                ? 'opacity-100 scale-100 z-10'
                                : 'opacity-0 scale-105 z-0'
                            }`}
                    >
                        <Image
                            src={image.imagenUrl}
                            alt={image.titulo || 'Slide'}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Overlay with gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* Content overlay */}
                        {(image.titulo || image.descripcion) && (
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                {image.titulo && (
                                    <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                                        {image.titulo}
                                    </h3>
                                )}
                                {image.descripcion && (
                                    <p className="text-sm md:text-base text-white/90 drop-shadow-md">
                                        {image.descripcion}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all flex items-center justify-center group"
                            aria-label="Anterior"
                        >
                            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all flex items-center justify-center group"
                            aria-label="Siguiente"
                        >
                            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Dots Indicator */}
            {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'w-8 bg-lemon-500'
                                    : 'w-2 bg-warm-300 hover:bg-warm-400'
                                }`}
                            aria-label={`Ir a slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Progress bar */}
            {images.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-3xl overflow-hidden">
                    <div
                        className="h-full bg-lemon-400 transition-all ease-linear"
                        style={{
                            width: '100%',
                            animation: `progress ${autoPlayInterval}ms linear infinite`
                        }}
                    />
                </div>
            )}

            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    )
}
