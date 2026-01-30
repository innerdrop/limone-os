import Link from 'next/link'
import Image from 'next/image'
import PromotionalPopup from '@/components/PromotionalPopup'
import Header from '@/components/Header'
import MainHero from '@/components/MainHero'
import TechniquesGalaxy from '@/components/TechniquesGalaxy'
import WorkshopSpaceSection from '@/components/WorkshopSpaceSection'
import FAQSection from '@/components/FAQSection'
import ContactForm from '@/components/ContactForm'

// ==================== METHODOLOGY SECTION ====================
function MethodologySection() {
    return (
        <section className="section bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="font-artistic text-2xl text-brand-green mb-2 block">Nuestra Propuesta</span>
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
                                <span className="font-semibold"> grupos reducidos (máximo 10 niños)</span>,
                                facilitando el aprendizaje y estimulando la creatividad del alumno,
                                promoviendo su comprensión y disfrute de la actividad artística.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-[3/4] rounded-2xl bg-canvas-200 relative overflow-hidden transform translate-y-8 shadow-xl">
                            <Image src="/talleres/acuarela-v2.png" alt="Técnica de Acuarela" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="aspect-[3/4] rounded-2xl bg-canvas-200 relative overflow-hidden shadow-xl">
                            <Image src="/talleres/oleo-v2.png" alt="Técnica de Óleo" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>
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
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="font-artistic text-2xl text-brand-yellow mb-2 block animate-pulse">Momentos Especiales</span>
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
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative z-10 shadow-2xl">
                            <Image
                                src="/natalia.jpg"
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
                        <span className="font-artistic text-3xl text-brand-orange mb-4 block">La Profesora</span>
                        <h2 className="section-title mb-6">Hola, soy Natalia</h2>
                        <div className="space-y-6 text-lg text-brand-charcoal/80 leading-relaxed">
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
                                    <div className="text-3xl font-bold text-brand-yellow font-artistic">Docente</div>
                                    <div className="text-sm text-warm-500">Certificada</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-brand-purple font-artistic">Artista</div>
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

                        <ContactForm />
                    </div>

                    {/* FAQ & Info */}
                    <div className="space-y-12">
                        <FAQSection />

                        <div className="space-y-6">
                            {/* Real Map */}
                            <div className="aspect-video rounded-2xl overflow-hidden bg-canvas-200 relative shadow-inner border border-canvas-200">
                                <iframe
                                    src="https://maps.google.com/maps?q=Av.%20Alem%204611%2C%20Ushuaia%2C%20Tierra%20del%20Fuego&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-700"
                                ></iframe>
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
                                            <p className="font-medium text-warm-800">+54 9 2901 588969</p>
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
                                            <p className="font-medium text-warm-800">limonetaller@gmail.com</p>
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
                                            <p className="font-medium text-warm-800">Mar - Vie, 16:00 - 20:30</p>
                                        </div>
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
                                src="/colores.png"
                                alt="Taller Limoné Logo"
                                width={50}
                                height={30}
                                className="object-contain"
                            />
                            <span className="font-gigi text-2xl font-bold">Taller Limoné</span>
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
                            <li><Link href="#espacio" className="hover:text-lemon-400 transition-colors">Nuestro Espacio</Link></li>
                            <li><Link href="#sobre" className="hover:text-lemon-400 transition-colors">Sobre Natalia</Link></li>
                            <li><Link href="#contacto" className="hover:text-lemon-400 transition-colors">Contacto</Link></li>
                            <li><Link href="/login" className="hover:text-lemon-400 transition-colors">Portal Alumnos</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-semibold mb-4">Seguinos</h4>
                        <div className="flex gap-3">
                            <a href="https://instagram.com/taller_de_arte_limone" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-warm-700 hover:bg-lemon-500 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M18,5A1,1 0 0,1 19,6A1,1 0 0,1 18,7A1,1 0 0,1 17,6A1,1 0 0,1 18,5Z" />
                                </svg>
                            </a>
                            <a href="https://wa.me/5492901588969" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-warm-700 hover:bg-lemon-500 flex items-center justify-center transition-colors">
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
                    <div className="flex items-center gap-2 text-warm-400 text-sm">
                        <span>Desarrollado por</span>
                        <a href="https://usev.app" className="block w-14 h-14 relative hover:opacity-80 transition-opacity" title="V Technologies">
                            <Image
                                src="/v-logo-final.png"
                                alt="V Technologies"
                                fill
                                className="object-contain"
                            />
                        </a>
                    </div>
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
                <MainHero />
                <MethodologySection />
                <TechniquesGalaxy />
                <WorkshopSpaceSection />
                <SpecialMomentsSection />
                <AboutSection />
                <TestimonialsSection />
                <ContactSection />
            </main>
            <Footer />
        </>
    )
}
