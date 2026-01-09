import Link from 'next/link'
import Image from 'next/image'

export default function TallerVeranoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-lemon-50 via-white to-leaf-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-canvas-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/colores.png"
                                alt="Limoné Colors"
                                width={50}
                                height={30}
                                className="object-contain"
                            />
                            <span className="font-gigi text-3xl font-bold text-warm-800">
                                Limoné
                            </span>
                        </Link>
                        <Link href="/" className="text-warm-600 hover:text-lemon-600 transition-colors">
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-20 right-10 w-64 h-64 bg-lemon-300/30 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-leaf-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="badge badge-lemon mb-6 text-base px-6 py-2">Temporada 2026</span>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-warm-800 mb-6">
                        Taller de <span className="text-gradient font-gigi">Verano</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-warm-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Un espacio creativo donde el arte cobra vida durante el verano en Ushuaia
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/inscripcion" className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-glow-lemon">
                            ¡Inscribirme Ahora!
                        </Link>
                        <Link href="#detalles" className="btn-outline text-lg px-8 py-4">
                            Ver Detalles
                        </Link>
                    </div>
                </div>
            </section>

            {/* What is it Section */}
            <section id="detalles" className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="font-artistic text-2xl text-brand-purple mb-2 block">Descubrí</span>
                            <h2 className="text-4xl font-bold text-warm-800 mb-6">
                                ¿Qué es el Taller de Verano?
                            </h2>
                            <div className="space-y-4 text-lg text-warm-600 leading-relaxed">
                                <p>
                                    El <strong className="text-warm-800">Taller de Verano Limoné - Edición 2026</strong> es mucho más que una colonia, es un taller de arte especializado diseñado para niñas y niños de <strong className="text-lemon-600">5 a 12 años</strong>.
                                </p>
                                <p>
                                    Durante las vacaciones de verano, los participantes explorarán diversas técnicas artísticas con <strong className="text-warm-800">materiales profesionales incluidos</strong>, en un ambiente creativo y estimulante.
                                </p>
                                <p>
                                    Cada sesión está cuidadosamente planificada para estimular la creatividad, fomentar la expresión personal y garantizar que cada alumno disfrute del proceso artístico con atención personalizada.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-lemon-100 to-leaf-100 p-8 shadow-xl">
                                <div className="h-full flex flex-col justify-center space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl">🎨</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-warm-800 mb-1">Grupos Reducidos</h4>
                                            <p className="text-sm text-warm-600">Máximo 8 alumnos por grupo</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-purple flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl">✨</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-warm-800 mb-1">Atención Personalizada</h4>
                                            <p className="text-sm text-warm-600">Seguimiento individual del progreso</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl">🖌️</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-warm-800 mb-1">Materiales Profesionales</h4>
                                            <p className="text-sm text-warm-600">Todos los materiales incluidos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Schedule Section */}
            <section className="py-16 bg-canvas-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="font-artistic text-2xl text-brand-green mb-2 block">Organización</span>
                        <h2 className="text-4xl font-bold text-warm-800 mb-4">Horarios y Fechas</h2>
                        <p className="text-lg text-warm-600 max-w-2xl mx-auto">
                            Flexibilidad para que encuentres el horario perfecto
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-lemon-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-warm-800">Período</h3>
                            </div>
                            <p className="text-warm-600 mb-2">
                                <strong>6 de Enero - 28 de Febrero 2026</strong>
                            </p>
                            <p className="text-sm text-warm-500">
                                Consultar fechas específicas de inicio según modalidad
                            </p>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-leaf-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-leaf-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-warm-800">Horarios</h3>
                            </div>
                            <div className="space-y-2 text-warm-600">
                                <p><strong>Turno Mañana:</strong> 10:00 - 12:00 hs</p>
                                <p><strong>Turno Tarde:</strong> 15:00 - 17:00 hs</p>
                            </div>
                            <p className="text-sm text-warm-500 mt-2">
                                Diferentes modalidades disponibles: 1x o 2x por semana
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What they'll learn */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="font-artistic text-2xl text-brand-orange mb-2 block">Aprendizaje</span>
                        <h2 className="text-4xl font-bold text-warm-800 mb-4">¿Qué aprenderán?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: 'Dibujo Artístico', icon: '✏️', items: ['Grafito', 'Carbonilla', 'Lápices de colores', 'Tinta china'] },
                            { title: 'Pintura', icon: '🎨', items: ['Acuarela', 'Témpera', 'Acrílico', 'Guache'] },
                            { title: 'Técnicas Mixtas', icon: '🖼️', items: ['Collage', 'Texturas', 'Composición', 'Color'] }
                        ].map((category, idx) => (
                            <div key={idx} className="card hover:shadow-xl transition-shadow">
                                <div className="text-4xl mb-4">{category.icon}</div>
                                <h3 className="text-xl font-bold text-warm-800 mb-4">{category.title}</h3>
                                <ul className="space-y-2">
                                    {category.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-warm-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-lemon-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 bg-warm-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <span className="font-artistic text-2xl text-brand-yellow mb-2 block">Ventajas</span>
                        <h2 className="text-4xl font-bold mb-4">Beneficios del Taller</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '👥', title: 'Grupos Reducidos', desc: 'Atención personalizada en cada sesión' },
                            { icon: '🎨', title: 'Materiales Profesionales', desc: 'Todos los materiales artísticos incluidos' },
                            { icon: '🍪', title: 'Merienda Incluida', desc: 'En modalidades extendidas' },
                            { icon: '🏆', title: 'Proyecto Final', desc: 'Cada alumno crea su obra para llevar a casa' }
                        ].map((benefit, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-5xl mb-4">{benefit.icon}</div>
                                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                                <p className="text-sm text-warm-100">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-16 bg-gradient-to-br from-lemon-50 to-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="font-artistic text-2xl text-brand-red mb-2 block">Inversión</span>
                        <h2 className="text-4xl font-bold text-warm-800 mb-4">Modalidades y Precios</h2>
                        <p className="text-lg text-warm-600">Elegí la opción que mejor se adapte a tus necesidades</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Modalidad Base */}
                        <div className="card">
                            <div className="text-center mb-4">
                                <h3 className="text-2xl font-bold text-warm-800 mb-2">Modalidad BASE</h3>
                                <p className="text-sm text-warm-500">Corta duración - 1h 20m</p>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-lemon-50 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-warm-800">Base (1x sem)</span>
                                        <span className="text-xl font-bold text-lemon-600">$100.000</span>
                                    </div>
                                    <p className="text-sm text-warm-500">/mes</p>
                                </div>
                                <div className="p-4 bg-leaf-50 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-warm-800">Base Plus (2x sem)</span>
                                        <span className="text-xl font-bold text-leaf-600">$130.000</span>
                                    </div>
                                    <p className="text-sm text-warm-500">/mes</p>
                                </div>
                            </div>
                        </div>

                        {/* Modalidad Extendida */}
                        <div className="card border-2 border-brand-purple relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-purple text-white text-xs font-bold rounded-full">
                                INCLUYE MERIENDA
                            </div>
                            <div className="text-center mb-4 mt-2">
                                <h3 className="text-2xl font-bold text-warm-800 mb-2">Modalidad EXTENDIDA</h3>
                                <p className="text-sm text-warm-500">2h, Merienda incluida</p>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-purple-50 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-warm-800">Extended (1x sem)</span>
                                        <span className="text-xl font-bold text-brand-purple">$145.000</span>
                                    </div>
                                    <p className="text-sm text-warm-500">/mes</p>
                                    <div className="mt-2 pt-2 border-t border-purple-200">
                                        <p className="text-sm font-semibold text-brand-orange">Promo Ene+Feb: $260.000</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-warm-800">Extended Plus (2x sem)</span>
                                        <span className="text-xl font-bold text-brand-orange">$210.000</span>
                                    </div>
                                    <p className="text-sm text-warm-500">/mes</p>
                                    <div className="mt-2 pt-2 border-t border-orange-200">
                                        <p className="text-sm font-semibold text-brand-orange">Promo Ene+Feb: $380.000</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Opción Clubes */}
                    <div className="card-glass max-w-2xl mx-auto text-center p-6">
                        <h4 className="text-lg font-bold text-warm-800 mb-2">Media jornada en clubes</h4>
                        <p className="text-3xl font-bold text-brand-green mb-2">$245.000</p>
                        <p className="text-sm text-warm-600 mb-4">Para no socios</p>
                        <p className="text-xs text-warm-500">
                            ¡Nuestro plan más completo es más accesible!
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-8">
                        <Link href="/inscripcion" className="btn-primary text-lg px-10 py-4 shadow-lg">
                            Consultar e Inscribirme
                        </Link>
                        <p className="text-sm text-warm-500 mt-4">
                            ¡Cupos limitados! Reservá tu lugar ahora.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-warm-800 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        ¡No te quedes sin tu lugar!
                    </h2>
                    <p className="text-xl text-warm-100 mb-8 max-w-2xl mx-auto">
                        Los cupos son limitados y se agotan rápido. Asegurá el lugar de tu hijo/a en el mejor taller de arte de Ushuaia.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/inscripcion" className="btn-primary text-lg px-10 py-4">
                            Inscribirme Ahora
                        </Link>
                        <a href="#contacto" className="inline-flex items-center justify-center px-10 py-4 border-2 border-white bg-transparent text-white font-semibold rounded-full transition-all duration-300 ease-out hover:bg-white hover:text-warm-800">
                            Hacer una Consulta
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section id="contacto" className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-warm-800 mb-4">¿Tenés dudas?</h2>
                        <p className="text-lg text-warm-600">Contactanos y te responderemos a la brevedad</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="card text-center">
                            <div className="w-16 h-16 rounded-full bg-lemon-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-warm-800 mb-2">Email</h3>
                            <a href="mailto:limonetaller@gmail.com" className="text-lemon-600 hover:text-lemon-700">
                                limonetaller@gmail.com
                            </a>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 rounded-full bg-leaf-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-leaf-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-warm-800 mb-2">WhatsApp</h3>
                            <a href="https://wa.me/5492901588969" className="text-leaf-600 hover:text-leaf-700">
                                +54 9 2901 588969
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-warm-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Image
                            src="/footerlogo.png"
                            alt="Taller Limoné Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                        <span className="font-gigi text-2xl font-bold">Limoné</span>
                    </div>
                    <p className="text-warm-300 text-sm">
                        © 2026 Taller Limoné - Arte en el fin del mundo
                    </p>
                </div>
            </footer>
        </div>
    )
}
