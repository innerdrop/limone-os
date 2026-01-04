import Link from 'next/link'
import Image from 'next/image'

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

// ==================== TALLERES SECTION ====================
function TalleresSection() {
    const talleres = [
        {
            id: 1,
            nombre: 'Pintura al Óleo',
            descripcion: 'Domina las técnicas clásicas de los grandes maestros.',
            horario: 'Lunes y Miércoles 18:00',
            cupos: 8,
            cuposDisponibles: 3,
            imagen: '/talleres/oleo.svg',
            nivel: 'Todos los niveles'
        },
        {
            id: 2,
            nombre: 'Acuarela Creativa',
            descripcion: 'Explora la transparencia y fluidez de la acuarela.',
            horario: 'Martes y Jueves 16:00',
            cupos: 10,
            cuposDisponibles: 5,
            imagen: '/talleres/acuarela.svg',
            nivel: 'Principiantes'
        },
        {
            id: 3,
            nombre: 'Dibujo Artístico',
            descripcion: 'Desarrollá tu trazo y dominio del lápiz.',
            horario: 'Viernes 17:00',
            cupos: 12,
            cuposDisponibles: 2,
            imagen: '/talleres/dibujo.svg',
            nivel: 'Todos los niveles'
        },
        {
            id: 4,
            nombre: 'Técnicas Mixtas',
            descripcion: 'Combina materiales y libera tu creatividad.',
            horario: 'Sábados 10:00',
            cupos: 8,
            cuposDisponibles: 0,
            imagen: '/talleres/mixtas.svg',
            nivel: 'Intermedio'
        },
    ]

    return (
        <section id="talleres" className="section bg-canvas-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="badge badge-lemon mb-4">Nuestros Talleres</span>
                    <h2 className="section-title">Encontrá tu espacio creativo</h2>
                    <p className="section-subtitle mx-auto mt-4">
                        Cada taller está diseñado para inspirarte y ayudarte a desarrollar tu potencial artístico.
                    </p>
                </div>

                {/* Talleres Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {talleres.map((taller) => (
                        <div
                            key={taller.id}
                            className="group card overflow-hidden hover:shadow-glow-lemon"
                        >
                            {/* Image */}
                            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-canvas-200">
                                <Image
                                    src={taller.imagen}
                                    alt={taller.nombre}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-warm-900/10" />
                                {/* Cupos Badge */}
                                <div className={`absolute top-4 right-4 badge ${taller.cuposDisponibles === 0
                                    ? 'badge-error'
                                    : taller.cuposDisponibles <= 2
                                        ? 'badge-warning'
                                        : 'badge-success'
                                    }`}>
                                    {taller.cuposDisponibles === 0
                                        ? 'Sin cupos'
                                        : `${taller.cuposDisponibles} cupos`}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <span className="text-xs font-medium text-leaf-600 uppercase tracking-wide">
                                    {taller.nivel}
                                </span>
                                <h3 className="text-xl font-bold text-warm-800 group-hover:text-lemon-700 transition-colors">
                                    {taller.nombre}
                                </h3>
                                <p className="text-warm-500 text-sm line-clamp-2">
                                    {taller.descripcion}
                                </p>

                                {/* Schedule */}
                                <div className="flex items-center gap-2 text-sm text-warm-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {taller.horario}
                                </div>

                                {/* CTA */}
                                <Link
                                    href={`/inscripcion?taller=${taller.id}`}
                                    className={`mt-4 w-full inline-flex items-center justify-center py-2.5 rounded-xl font-medium transition-all ${taller.cuposDisponibles === 0
                                        ? 'bg-warm-200 text-warm-400 cursor-not-allowed'
                                        : 'bg-lemon-100 text-lemon-700 hover:bg-lemon-200'
                                        }`}
                                >
                                    {taller.cuposDisponibles === 0 ? 'Lista de espera' : 'Inscribirme'}
                                </Link>
                            </div>
                        </div>
                    ))}
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
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image Side */}
                    <div className="relative">
                        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-canvas-200">
                            <Image
                                src="/natalia.jpg"
                                alt="Natalia Fusari"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-lemon-200 rounded-3xl -z-10" />
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-leaf-100 rounded-2xl -z-10" />
                    </div>

                    {/* Content Side */}
                    <div className="space-y-6">
                        <span className="badge badge-leaf">Sobre la Artista</span>

                        <h2 className="section-title">Natalia Fusari</h2>

                        <div className="space-y-4 text-warm-600 leading-relaxed">
                            <p>
                                Con más de 10 años de experiencia en la enseñanza artística,
                                Natalia ha dedicado su vida a compartir su pasión por el arte
                                en el fin del mundo.
                            </p>
                            <p>
                                Formada en las mejores academias del país, su enfoque pedagógico
                                combina técnicas tradicionales con una visión contemporánea,
                                adaptándose a las necesidades y el ritmo de cada alumno.
                            </p>
                            <p>
                                <span className="font-semibold text-warm-800">"El arte no se trata de perfección,
                                    sino de expresión"</span> — es la filosofía que guía cada clase
                                en Taller Limoné.
                            </p>
                        </div>

                        {/* Achievements */}
                        <div className="grid grid-cols-2 gap-4 pt-6">
                            {[
                                { icon: '🎨', label: 'Artista Plástica' },
                                { icon: '📚', label: 'Profesora de Artes' },
                                { icon: '🏆', label: 'Premios Nacionales' },
                                { icon: '🌍', label: 'Exposiciones Internacionales' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-canvas-50">
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-sm font-medium text-warm-600">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ==================== TESTIMONIALS SECTION ====================
function TestimonialsSection() {
    const testimonios = [
        {
            id: 1,
            nombre: 'María García',
            texto: 'Taller Limoné cambió mi perspectiva del arte. Natalia tiene una paciencia increíble y sabe cómo sacar lo mejor de cada uno.',
            imagen: null,
        },
        {
            id: 2,
            nombre: 'Carlos Rodríguez',
            texto: 'Nunca pensé que podría pintar algo tan lindo. El ambiente del taller es súper acogedor y las clases son muy entretenidas.',
            imagen: null,
        },
        {
            id: 3,
            nombre: 'Ana Martínez',
            texto: 'Mi hija ama ir al taller. Ver cómo desarrolló su creatividad en pocos meses fue increíble. Muy recomendado para niños.',
            imagen: null,
        },
    ]

    return (
        <section id="testimonios" className="section bg-gradient-lemon">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="badge badge-lemon mb-4">Testimonios</span>
                    <h2 className="section-title">Lo que dicen nuestros alumnos</h2>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonios.map((testimonio) => (
                        <div key={testimonio.id} className="card-glass">
                            {/* Quote Icon */}
                            <svg className="w-10 h-10 text-lemon-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                            </svg>

                            {/* Text */}
                            <p className="text-warm-600 mb-6 italic">
                                "{testimonio.texto}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-lemon-200 flex items-center justify-center">
                                    <span className="text-lemon-700 font-semibold">
                                        {testimonio.nombre.charAt(0)}
                                    </span>
                                </div>
                                <span className="font-medium text-warm-800">{testimonio.nombre}</span>
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
                                    <p className="text-warm-500">Mapa de Ushuaia</p>
                                    <p className="text-sm text-warm-400">Tierra del Fuego, Argentina</p>
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
                                        <p className="font-medium text-warm-800">Ushuaia, TDF</p>
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
                        <Link href="/login" className="hidden sm:inline-flex text-warm-600 hover:text-lemon-600 font-medium transition-colors">
                            Iniciar sesión
                        </Link>
                        <Link href="/inscripcion" className="btn-primary py-2.5 px-5 text-sm">
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
            <main className="pt-16 md:pt-20">
                <HeroSection />
                <TalleresSection />
                <AboutSection />
                <TestimonialsSection />
                <ContactSection />
            </main>
            <Footer />
        </>
    )
}
