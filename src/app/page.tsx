import Link from 'next/link'
import Image from 'next/image'
import PromotionalPopup from '@/components/PromotionalPopup'

// ==================== HERO SECTION ====================
function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-lemon">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-64 h-64 bg-lemon-300/30 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-leaf-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lemon-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-lemon-200 mb-8 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-leaf-500 animate-pulse" />
                    <span className="text-sm font-medium text-warm-600">Arte en Ushuaia, Tierra del Fuego</span>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
                    <span className="block text-warm-800">Taller</span>
                    <span className="text-gradient">Limoné</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-warm-600 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    Descubrí tu potencial artístico en un espacio único,
                    donde cada trazo cuenta una historia.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <Link href="/inscripcion" className="btn-primary text-lg px-8 py-4">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Inscribite Ahora
                    </Link>
                    <Link href="#talleres" className="btn-outline text-lg px-8 py-4">
                        Ver Talleres
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    {[
                        { value: '10+', label: 'Años de experiencia' },
                        { value: '500+', label: 'Alumnos formados' },
                        { value: '15', label: 'Talleres activos' },
                        { value: '100%', label: 'Pasión por el arte' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-lemon-600">{stat.value}</div>
                            <div className="text-sm text-warm-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    )
}

// ==================== METHODOLOGY SECTION ====================
function MethodologySection() {
    return (
        <section className="section bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="badge badge-lemon mb-4">Nuestra Propuesta</span>
                    <h2 className="section-title">Metodología Limoné</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-lg text-warm-600 leading-relaxed">
                        <p>
                            <span className="font-bold text-warm-800">Limoné</span> es un taller de Dibujo y Pintura para
                            <span className="text-lemon-600 font-bold"> niños de 7 a 15 años</span>.
                        </p>
                        <p>
                            Nuestro objetivo es la construcción de una metodología para el desarrollo de la creatividad y la expresión
                            a partir del manejo de diferentes técnicas de las artes plásticas.
                        </p>
                        <p>
                            Partimos de supuestos como que la <span className="italic">sensibilidad estética es educable</span>,
                            que la creatividad creadora atrae otras formas de pensamiento y genera placer en su realización.
                        </p>
                        <div className="bg-lemon-50 p-6 rounded-2xl border border-lemon-100 mt-8">
                            <h4 className="font-bold text-warm-800 mb-2">Atención Personalizada</h4>
                            <p className="text-base">
                                El desarrollo de las clases se realiza de manera personalizada en
                                <span className="font-semibold"> grupos reducidos (máximo 8 niños)</span>,
                                facilitando el aprendizaje y estimulando la creatividad del alumno,
                                promoviendo su comprensión y disfrute de la actividad artística.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-[3/4] rounded-2xl bg-canvas-200 relative overflow-hidden transform translate-y-8">
                            <Image src="/talleres/acuarela.svg" alt="Clase de arte" fill className="object-cover" />
                        </div>
                        <div className="aspect-[3/4] rounded-2xl bg-canvas-200 relative overflow-hidden">
                            <Image src="/talleres/oleo.svg" alt="Alumnos pintando" fill className="object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ==================== TECHNIQUES SECTION ====================
function TechniquesSection() {
    const techniques = [
        'Grafito', 'Pintura Fluo', 'Carbonilla', 'Lápices de Colores',
        'Fibras', 'Tinta China', 'Guache', 'Aguada',
        'Tiza Pastel', 'Óleo Pastel', 'Témpera', 'Acuarela', 'Acrílico'
    ]

    return (
        <section className="section bg-canvas-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="section-title">Técnicas que Exploramos</h2>
                    <p className="section-subtitle mx-auto mt-4">
                        Exploramos cada una de ellas siguiendo el programa, profundizando en aquellas que más interesen a cada integrante.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {techniques.map((tech, index) => (
                        <span
                            key={index}
                            className="px-6 py-3 bg-white border border-canvas-200 rounded-xl text-warm-700 font-medium hover:border-lemon-400 hover:text-lemon-700 hover:shadow-lg transition-all cursor-default"
                        >
                            {tech}
                        </span>
                    ))}
                    <span className="px-6 py-3 bg-lemon-100 border border-lemon-200 rounded-xl text-lemon-700 font-medium">
                        ¡Y muchas más!
                    </span>
                </div>
            </div>
        </section>
    )
}

// ==================== SPECIAL MOMENTS SECTION ====================
function SpecialMomentsSection() {
    return (
        <section className="section bg-warm-900 text-white overflow-hidden relative">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lemon-500/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="badge bg-white/10 text-white border-white/20 mb-4">Momentos Especiales</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Dos grandes hitos del año</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Fluo Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                            <span className="text-3xl">✨</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-purple-300">Agosto: Técnica Fluo</h3>
                        <p className="text-warm-100 leading-relaxed">
                            Consiste en trabajar con <strong>luz ultravioleta y pintura acrílica fluorescente</strong>.
                            Los participantes ingresan a un ambiente oscuro iluminado por la luz UV, donde se divierten
                            experimentando y creando. Estos trabajos formarán parte de la muestra de fin de año.
                        </p>
                    </div>

                    {/* End of Year Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                        <div className="w-16 h-16 rounded-2xl bg-lemon-500/20 flex items-center justify-center mb-6">
                            <span className="text-3xl">🎨</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-lemon-300">Diciembre: Cuadro Final</h3>
                        <p className="text-warm-100 leading-relaxed">
                            Los alumnos pintan un cuadro en acrílico donde plasman los conceptos aprendidos.
                            Esta obra se exhibe en la <strong>muestra de fin de año</strong> y luego se la llevan a casa
                            como recuerdo de su evolución artística. También hacemos entrega de diplomas.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ==================== ABOUT SECTION ====================
function AboutSection() {
    return (
        <section id="sobre" className="section bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="relative">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative z-10">
                            <Image
                                src="/foto-natalia.jpg"
                                alt="Natalia Fusari"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-10 -left-10 w-24 h-24 bg-lemon-200 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-leaf-200 rounded-full blur-2xl" />
                    </div>

                    {/* Content */}
                    <div>
                        <span className="badge badge-lemon mb-4">La Profesora</span>
                        <h2 className="section-title mb-6">Hola, soy Natalia</h2>
                        <div className="space-y-6 text-lg text-warm-600 leading-relaxed">
                            <p>
                                Soy artista plástica y docente con más de 10 años de experiencia guiando a niños
                                y adolescentes en su camino creativo.
                            </p>
                            <p>
                                Mi pasión es crear un ambiente seguro y estimulante donde cada alumno pueda
                                expresarse libremente, descubrir sus talentos únicos y ganar confianza a través del arte.
                            </p>
                            <p>
                                En <strong>Taller Limoné</strong>, no solo enseñamos técnicas; cultivamos la mirada artística
                                y el amor por la creación que acompañará a tus hijos toda la vida.
                            </p>

                            <div className="pt-6 border-t border-canvas-200 flex gap-8">
                                <div>
                                    <div className="text-3xl font-bold text-lemon-600">Docente</div>
                                    <div className="text-sm text-warm-500">Certificada</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-lemon-600">Artista</div>
                                    <div className="text-sm text-warm-500">Plástica</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ==================== TESTIMONIALS SECTION ====================
function TestimonialsSection() {
    const testimonials = [
        {
            text: "A mi hija le encanta ir al taller. Ha mejorado muchísimo su técnica y siempre vuelve feliz contándome lo que aprendió.",
            author: "María L.",
            role: "Mamá de Sofía (9 años)"
        },
        {
            text: "El ambiente es hermoso y Natalia tiene una paciencia infinita. Es el lugar perfecto para que los chicos desarrollen su creatividad.",
            author: "Pablo R.",
            role: "Papá de Lucas (11 años)"
        },
        {
            text: "Lo que más me gusta es que aprendemos técnicas reales pero de forma super divertida. ¡Es mi momento favorito de la semana!",
            author: "Valentina",
            role: "Alumna (13 años)"
        }
    ]

    return (
        <section id="testimonios" className="section bg-canvas-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="badge badge-leaf mb-4">Testimonios</span>
                    <h2 className="section-title">Lo que dicen las familias</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="card p-8 hover:transform hover:-translate-y-1 transition-all">
                            {/* Quote icon */}
                            <div className="w-10 h-10 rounded-full bg-lemon-100 flex items-center justify-center text-lemon-600 mb-6">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V3H19.017C20.6739 3 22.017 4.34315 22.017 6V15C22.017 16.6569 20.6739 18 19.017 18H16.017C15.4647 18 15.017 18.4477 15.017 19V21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 7.55228 5.0166 7V3H10.0166C11.6735 3 13.0166 4.34315 13.0166 6V15C13.0166 16.6569 11.6735 18 10.0166 18H7.0166C6.46432 18 6.0166 18.4477 6.0166 19V21H5.0166Z" />
                                </svg>
                            </div>
                            <p className="text-warm-600 mb-6 italic">"{t.text}"</p>
                            <div>
                                <div className="font-bold text-warm-800">{t.author}</div>
                                <div className="text-sm text-warm-400">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ==================== CONTACT SECTION ====================
function ContactSection() {
    return (
        <section id="contacto" className="section bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <span className="badge badge-leaf mb-4">Contacto</span>
                        <h2 className="section-title mb-4">¿Tenés alguna consulta?</h2>
                        <p className="section-subtitle mb-8">
                            Escribinos y te respondemos a la brevedad.
                        </p>

                        <form className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Nombre</label>
                                    <input type="text" className="input-field" placeholder="Tu nombre" />
                                </div>
                                <div>
                                    <label className="label">Email</label>
                                    <input type="email" className="input-field" placeholder="tu@email.com" />
                                </div>
                            </div>

                            <div>
                                <label className="label">Teléfono (opcional)</label>
                                <input type="tel" className="input-field" placeholder="+54 9 2901 ..." />
                            </div>

                            <div>
                                <label className="label">Mensaje</label>
                                <textarea
                                    className="input-field min-h-[120px] resize-none"
                                    placeholder="Contanos en qué podemos ayudarte..."
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full sm:w-auto">
                                Enviar mensaje
                            </button>
                        </form>
                    </div>

                    {/* Map & Info */}
                    <div className="space-y-6">
                        {/* Map Placeholder */}
                        <div className="aspect-video rounded-2xl overflow-hidden bg-canvas-200 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <svg className="w-12 h-12 text-lemon-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-warm-500">Alem 4611</p>
                                    <p className="text-sm text-warm-400">Ushuaia, Tierra del Fuego</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="card p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-lemon-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-warm-400">Teléfono</p>
                                        <p className="font-medium text-warm-800">+54 9 2901 XXX-XXX</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-leaf-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-leaf-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-warm-400">Email</p>
                                        <p className="font-medium text-warm-800">hola@limone.usev.app</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-lemon-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-lemon-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-warm-400">Dirección</p>
                                        <p className="font-medium text-warm-800">Alem 4611, Ushuaia</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-leaf-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-leaf-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-warm-400">Horario</p>
                                        <p className="font-medium text-warm-800">Lun - Sáb</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ==================== HEADER ====================
function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-canvas-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo.jpg"
                            alt="Taller Limoné Logo"
                            width={50}
                            height={50}
                            className="rounded-lg object-contain"
                        />
                        <span className="font-serif text-xl font-bold text-warm-800">
                            Taller Limoné
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#talleres" className="text-warm-600 hover:text-lemon-600 transition-colors">
                            Talleres
                        </Link>
                        <Link href="#sobre" className="text-warm-600 hover:text-lemon-600 transition-colors">
                            Sobre Natalia
                        </Link>
                        <Link href="#testimonios" className="text-warm-600 hover:text-lemon-600 transition-colors">
                            Testimonios
                        </Link>
                        <Link href="#contacto" className="text-warm-600 hover:text-lemon-600 transition-colors">
                            Contacto
                        </Link>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 border border-lemon-600 rounded-xl text-sm font-medium text-lemon-700 hover:bg-lemon-50 transition-colors mr-2">
                            Iniciar sesión
                        </Link>
                        <Link href="/inscripcion" className="hidden sm:inline-flex btn-primary py-2.5 px-5 text-sm">
                            Inscribirme
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

// ==================== FOOTER ====================
function Footer() {
    return (
        <footer className="bg-warm-800 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/logo.jpg"
                                alt="Taller Limoné Logo"
                                width={50}
                                height={50}
                                className="rounded-lg object-contain"
                            />
                            <span className="font-serif text-xl font-bold">Taller Limoné</span>
                        </div>
                        <p className="text-warm-300 max-w-md">
                            Arte en el fin del mundo. Clases de pintura, dibujo y técnicas mixtas
                            para todas las edades en Ushuaia, Tierra del Fuego.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Enlaces</h4>
                        <ul className="space-y-2 text-warm-300">
                            <li><Link href="#talleres" className="hover:text-lemon-400 transition-colors">Talleres</Link></li>
                            <li><Link href="#sobre" className="hover:text-lemon-400 transition-colors">Sobre Natalia</Link></li>
                            <li><Link href="#contacto" className="hover:text-lemon-400 transition-colors">Contacto</Link></li>
                            <li><Link href="/login" className="hover:text-lemon-400 transition-colors">Portal Alumnos</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-semibold mb-4">Seguinos</h4>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 rounded-xl bg-warm-700 hover:bg-lemon-500 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-warm-700 hover:bg-lemon-500 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-warm-700 hover:bg-lemon-500 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-warm-700 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-warm-400 text-sm">
                        © {new Date().getFullYear()} Taller Limoné. Todos los derechos reservados.
                    </p>
                    <p className="text-warm-400 text-sm">
                        Desarrollado por <a href="https://usev.app" className="text-lemon-400 hover:underline">V Technologies</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

// ==================== MAIN PAGE ====================
export default function HomePage() {
    return (
        <>
            <Header />
            <PromotionalPopup />
            <main className="pt-16 md:pt-20">
                <HeroSection />
                <MethodologySection />
                <TechniquesSection />
                <SpecialMomentsSection />
                <AboutSection />
                <TestimonialsSection />
                <ContactSection />
            </main>
            <Footer />
        </>
    )
}
