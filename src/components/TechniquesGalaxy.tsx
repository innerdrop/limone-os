'use client'

import { useState } from 'react'

interface Technique {
    name: string
    description: string
    color: string
    size: 'sm' | 'md' | 'lg' | 'xl'
}

const techniques: Technique[] = [
    {
        name: 'Grafito',
        description: 'Técnica fundamental del dibujo que permite crear desde bocetos hasta obras detalladas con diferentes tonalidades de grises.',
        color: 'from-gray-400 to-gray-600',
        size: 'lg'
    },
    {
        name: 'Pintura Fluo',
        description: 'Pinturas fluorescentes que brillan bajo luz UV, creando efectos mágicos y experiencias únicas.',
        color: 'from-pink-400 to-purple-500',
        size: 'xl'
    },
    {
        name: 'Carbonilla',
        description: 'Material versátil para crear contrastes dramáticos y texturas expresivas en el dibujo.',
        color: 'from-neutral-600 to-neutral-800',
        size: 'md'
    },
    {
        name: 'Lápices de Colores',
        description: 'Herramienta ideal para aprender teoría del color y técnicas de sombreado con pigmentos vibrantes.',
        color: 'from-red-400 to-orange-500',
        size: 'lg'
    },
    {
        name: 'Fibras',
        description: 'Marcadores de colores intensos perfectos para ilustraciones y trabajos con líneas definidas.',
        color: 'from-blue-400 to-cyan-500',
        size: 'sm'
    },
    {
        name: 'Tinta China',
        description: 'Técnica milenaria que desarrolla el control del trazo y permite crear obras con personalidad única.',
        color: 'from-slate-700 to-slate-900',
        size: 'md'
    },
    {
        name: 'Guache',
        description: 'Pintura opaca y cubriente, ideal para aprender sobre capas y corrección de errores.',
        color: 'from-emerald-400 to-teal-600',
        size: 'lg'
    },
    {
        name: 'Aguada',
        description: 'Técnica de pintura diluida que crea efectos atmosféricos y degradados suaves.',
        color: 'from-sky-300 to-blue-500',
        size: 'sm'
    },
    {
        name: 'Tiza Pastel',
        description: 'Pigmentos suaves y aterciopelados que permiten difuminar y crear texturas delicadas.',
        color: 'from-rose-300 to-pink-400',
        size: 'md'
    },
    {
        name: 'Óleo Pastel',
        description: 'Crayones cremosos y vibrantes, excelentes para técnicas expresivas y colores intensos.',
        color: 'from-amber-400 to-yellow-500',
        size: 'lg'
    },
    {
        name: 'Témpera',
        description: 'Pintura versátil y de secado rápido, perfecta para experimentar con mezclas de colores.',
        color: 'from-violet-400 to-purple-600',
        size: 'md'
    },
    {
        name: 'Acuarela',
        description: 'Técnica delicada que enseña el control del agua y permite crear efectos de transparencia únicos.',
        color: 'from-cyan-300 to-blue-400',
        size: 'xl'
    },
    {
        name: 'Acrílico',
        description: 'Pintura profesional de secado rápido, base para la obra final de fin de año que se exhibe en la muestra.',
        color: 'from-lime-400 to-green-500',
        size: 'lg'
    }
]

const sizeClasses = {
    sm: 'w-16 h-16 md:w-20 md:h-20 text-xs',
    md: 'w-20 h-20 md:w-24 md:h-24 text-xs md:text-sm',
    lg: 'w-24 h-24 md:w-28 md:h-28 text-sm',
    xl: 'w-28 h-28 md:w-32 md:h-32 text-sm md:text-base'
}

export default function TechniquesGalaxy() {
    const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null)

    // Posiciones fijas de estrellas para evitar error de hidratación
    const starPositions = [
        { left: 5, top: 10, delay: 0.5, opacity: 0.6 },
        { left: 15, top: 25, delay: 1.2, opacity: 0.8 },
        { left: 25, top: 8, delay: 0.3, opacity: 0.5 },
        { left: 35, top: 45, delay: 2.1, opacity: 0.9 },
        { left: 45, top: 15, delay: 0.8, opacity: 0.4 },
        { left: 55, top: 60, delay: 1.5, opacity: 0.7 },
        { left: 65, top: 30, delay: 0.2, opacity: 0.6 },
        { left: 75, top: 70, delay: 2.5, opacity: 0.8 },
        { left: 85, top: 20, delay: 1.0, opacity: 0.5 },
        { left: 90, top: 50, delay: 0.7, opacity: 0.9 },
        { left: 8, top: 80, delay: 1.8, opacity: 0.6 },
        { left: 20, top: 65, delay: 2.3, opacity: 0.7 },
        { left: 30, top: 90, delay: 0.4, opacity: 0.5 },
        { left: 42, top: 75, delay: 1.1, opacity: 0.8 },
        { left: 58, top: 85, delay: 2.0, opacity: 0.6 },
        { left: 68, top: 5, delay: 0.9, opacity: 0.7 },
        { left: 78, top: 40, delay: 1.6, opacity: 0.5 },
        { left: 88, top: 88, delay: 2.2, opacity: 0.9 },
        { left: 12, top: 55, delay: 0.6, opacity: 0.4 },
        { left: 52, top: 35, delay: 1.4, opacity: 0.8 },
    ]

    return (
        <section className="section bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 overflow-hidden relative">
            {/* Stars background */}
            <div className="absolute inset-0">
                {starPositions.map((star, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            animationDelay: `${star.delay}s`,
                            opacity: star.opacity
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <span className="font-artistic text-2xl text-purple-300 mb-2 block">🌌 Universo Artístico</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Técnicas que Exploramos</h2>
                    <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
                        Hacé clic en cada planeta para descubrir más sobre cada técnica.
                        Profundizamos en las que más interesen a cada alumno.
                    </p>
                </div>

                {/* Galaxy of techniques */}
                <div className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center">
                    {/* Orbits decoration */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-purple-500/20 rounded-full" />
                        <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] border border-purple-500/15 rounded-full" />
                        <div className="absolute w-[100px] h-[100px] md:w-[200px] md:h-[200px] border border-purple-500/10 rounded-full" />
                    </div>

                    {/* Planets container - Organic Layout */}
                    <div className="relative w-full max-w-5xl mx-auto min-h-[600px] flex flex-wrap justify-center items-center content-center gap-8 md:gap-12 px-4 py-8 md:p-12">
                        {techniques.map((tech, index) => (
                            <button
                                key={tech.name}
                                onClick={() => setSelectedTechnique(selectedTechnique?.name === tech.name ? null : tech)}
                                className={`
                                    ${sizeClasses[tech.size]}
                                    rounded-full
                                    flex items-center justify-center
                                    relative
                                    transition-all duration-500 ease-out
                                    cursor-pointer
                                    group
                                    hover:z-20
                                    ${selectedTechnique?.name === tech.name ? 'scale-125 z-20' : 'hover:scale-110'}
                                    ${index % 2 === 0 ? 'mt-8' : '-mt-8'} 
                                    ${index % 3 === 0 ? 'ml-8' : ''}
                                `}
                                style={{
                                    animation: `float ${4 + (index % 3)}s ease-in-out infinite`,
                                    animationDelay: `${index * 0.5}s`
                                }}
                            >
                                {/* Planet Body (3D Sphere Effect) */}
                                <div
                                    className={`
                                        absolute inset-0 rounded-full 
                                        bg-gradient-to-br ${tech.color}
                                        shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),_0_0_20px_rgba(0,0,0,0.2)]
                                        group-hover:shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.6),_0_0_30px_rgba(255,255,255,0.4)]
                                        transition-shadow duration-500
                                    `}
                                >
                                    {/* Atmosphere/Glow */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/20 via-transparent to-white/30" />
                                </div>

                                {/* Ring Effect for some planets (random based on index) */}
                                {index % 4 === 0 && (
                                    <div className="absolute inset-[-20%] border-2 border-white/20 rounded-full rotate-45 scale-x-125 scale-y-10 group-hover:border-white/40 transition-colors" />
                                )}

                                {/* Label */}
                                <span className={`
                                    absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                                    text-sm md:text-base font-medium text-white/90 
                                    bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm
                                `}>
                                    {tech.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected technique popup */}
                {selectedTechnique && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedTechnique(null)}
                    >
                        <div
                            className={`
                                bg-gradient-to-br ${selectedTechnique.color}
                                rounded-3xl p-6 md:p-8 max-w-[min(448px,90vw)] w-full
                                shadow-2xl transform animate-scale-up
                                relative overflow-hidden
                            `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative circles */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                                        {selectedTechnique.name}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedTechnique(null)}
                                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-white/90 text-base md:text-lg leading-relaxed">
                                    {selectedTechnique.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Extra decoration */}
                <div className="text-center mt-8">
                    <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl text-purple-200 font-artistic text-xl">
                        ✨ ¡Y muchas más técnicas por descubrir!
                    </span>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `}</style>
        </section>
    )
}
