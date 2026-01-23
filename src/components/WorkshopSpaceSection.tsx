'use client'

import Image from 'next/image'
import Link from 'next/link'

interface WorkshopImage {
    src: string
    alt: string
}

interface WorkshopSpaceSectionProps {
    images?: WorkshopImage[]
}

export default function WorkshopSpaceSection({ images }: WorkshopSpaceSectionProps) {
    // Imágenes del taller mejoradas profesionalmente
    const defaultImages: WorkshopImage[] = images || [
        { src: '/taller-aula.png', alt: 'Aula del taller con luz natural y rosales' },
        { src: '/taller-mesa.png', alt: 'Mesa de trabajo rodeada de rosas' },
        { src: '/taller-jardin.png', alt: 'Jardín natural del taller' },
    ]

    return (
        <section id="espacio" className="section bg-gradient-to-b from-white to-canvas-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf-100 text-leaf-700 text-sm font-medium mb-4">
                        <span className="text-lg">🌹</span>
                        Nuestro Espacio
                    </span>
                    <h2 className="section-title">Un Rincón Mágico para Crear</h2>
                    <p className="section-subtitle max-w-3xl mx-auto mt-4">
                        Ubicado en un entorno único, nuestro taller ofrece la inspiración perfecta para desarrollar el talento artístico
                    </p>
                </div>

                {/* Main content grid */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Features */}
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <span className="text-2xl">🌹</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-warm-800 mb-2">Rodeado de Rosales</h3>
                                <p className="text-warm-600">
                                    Un jardín lleno de rosales que inspira y conecta a los alumnos con la naturaleza mientras crean sus obras.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <span className="text-2xl">🌿</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-warm-800 mb-2">Patio Natural</h3>
                                <p className="text-warm-600">
                                    Contamos con un hermoso patio al aire libre donde los días lindos se pueden realizar actividades y disfrutar del entorno.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <span className="text-2xl">☀️</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-warm-800 mb-2">Luz Natural Abundante</h3>
                                <p className="text-warm-600">
                                    El aula cuenta con amplios ventanales que permiten el ingreso de luz natural, ideal para apreciar los colores reales y trabajar con comodidad.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <span className="text-2xl">🎨</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-warm-800 mb-2">Equipamiento Completo</h3>
                                <p className="text-warm-600">
                                    Todos los materiales incluidos: caballetes, pinturas, pinceles, lienzos y herramientas profesionales para cada técnica.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Single Hero Image */}
                    <div className="relative">
                        <div className="aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/taller-aula.png"
                                alt="Aula del taller rodeada de rosales con luz natural"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-rose-200 rounded-full blur-2xl opacity-50" />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-leaf-200 rounded-full blur-2xl opacity-50" />
                    </div>
                </div>

                {/* Space Rental Card */}
                <div className="relative">
                    <div className="bg-gradient-to-r from-warm-800 to-warm-900 rounded-3xl p-8 md:p-12 overflow-hidden relative">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-lemon-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lemon-500/20 text-lemon-300 text-sm font-medium mb-4">
                                    <span>✨</span>
                                    Nuevo
                                </span>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    ¿Buscás un espacio único para tu evento?
                                </h3>
                                <p className="text-warm-200 mb-6 leading-relaxed">
                                    Nuestro taller está disponible para alquiler a terceros. Un ambiente acogedor,
                                    rodeado de naturaleza, ideal para talleres, reuniones creativas, sesiones de fotos,
                                    cumpleaños artísticos u otros eventos especiales.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 bg-white/10 rounded-lg text-warm-200 text-sm">
                                        🎨 Talleres
                                    </span>
                                    <span className="px-3 py-1 bg-white/10 rounded-lg text-warm-200 text-sm">
                                        👥 Reuniones
                                    </span>
                                    <span className="px-3 py-1 bg-white/10 rounded-lg text-warm-200 text-sm">
                                        🎤 Charlas
                                    </span>
                                    <span className="px-3 py-1 bg-white/10 rounded-lg text-warm-200 text-sm">
                                        💻 CoWorking
                                    </span>
                                    <span className="px-3 py-1 bg-white/10 rounded-lg text-warm-200 text-sm">
                                        ☕ Hora de Té
                                    </span>
                                    <span className="px-3 py-1 bg-white/10 rounded-lg text-warm-200 text-sm">
                                        ✨ Y más...
                                    </span>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-warm-300 mb-4">
                                    Para consultas sobre disponibilidad y precios:
                                </p>
                                <Link
                                    href="#contacto"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-lemon-400 to-lemon-500 text-warm-900 font-bold rounded-2xl hover:from-lemon-300 hover:to-lemon-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Contactanos
                                </Link>
                                <p className="text-warm-400 text-sm mt-4">
                                    Respondemos a la brevedad
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
