import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
    title: 'Sitio en Mantenimiento | Limoné',
    description: 'Estamos trabajando para mejorar tu experiencia. Volveremos pronto.',
}

export default function MantenimientoPage() {
    return (
        <div className="min-h-screen bg-canvas-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-2xl w-full">
                {/* Logo and Animation Area */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-lemon-200/50 blur-3xl rounded-full scale-150 -z-10 animate-pulse"></div>
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 relative">
                            <Image
                                src="/colores.png"
                                alt="Limoné"
                                width={128}
                                height={128}
                                className="object-contain animate-float"
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-warm-800 mb-6 leading-tight">
                    Estamos pincelando <br />
                    <span className="text-brand-purple italic">algo nuevo</span>
                </h1>

                <p className="text-xl text-warm-600 mb-10 max-w-lg mx-auto leading-relaxed">
                    Nuestro taller digital está recibiendo una mano de pintura.
                    Volveremos muy pronto con todas las herramientas listas.
                </p>

                {/* Status Indicator */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-warm-200 shadow-sm mb-12">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lemon-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-lemon-500"></span>
                    </span>
                    <span className="text-sm font-medium text-warm-500 uppercase tracking-wider">
                        Trabajando en el sitio
                    </span>
                </div>

                {/* Social/Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-warm-200">
                    <div>
                        <p className="text-xs font-bold text-warm-400 uppercase tracking-widest mb-2">Seguinos</p>
                        <a
                            href="https://instagram.com/limone.taller"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-warm-700 hover:text-brand-purple transition-colors font-medium"
                        >
                            @limone.taller
                        </a>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-warm-400 uppercase tracking-widest mb-2">Escribinos</p>
                        <a
                            href="https://wa.me/5491112345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-warm-700 hover:text-brand-purple transition-colors font-medium"
                        >
                            WhatsApp
                        </a>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-warm-400 uppercase tracking-widest mb-2">Ubicación</p>
                        <p className="text-warm-700 font-medium">Ushuaia, Argentina</p>
                    </div>
                </div>

                <div className="mt-16">
                    <Link
                        href="/login"
                        className="text-warm-400 hover:text-warm-600 text-sm transition-colors"
                    >
                        Acceso Administrador
                    </Link>
                </div>
            </div>

        </div>
    )
}
