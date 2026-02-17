import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
    title: 'Sitio en Mantenimiento | Limoné',
    description: 'Estamos trabajando para mejorar tu experiencia. Volveremos pronto.',
}

export default function MantenimientoPage() {
    return (
        <div className="min-h-screen bg-canvas-50 flex flex-col items-center justify-center py-10 px-4">
            <div className="max-w-3xl w-full flex flex-col items-center justify-center space-y-8 md:space-y-10">
                {/* Logo Area */}
                <div className="relative animate-fade-in shrink-0">
                    <div className="absolute inset-0 bg-lemon-200/40 blur-[60px] rounded-full scale-150 -z-10 animate-pulse"></div>
                    <div className="w-32 h-32 md:w-52 md:h-52 relative mx-auto">
                        <Image
                            src="/logo.png"
                            alt="Limoné"
                            fill
                            className="object-contain animate-float drop-shadow-lg"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="text-center space-y-4 px-2">
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-warm-900 leading-tight">
                        Estamos pincelando <br />
                        <span className="text-brand-purple italic">algo nuevo</span>
                    </h1>

                    <p className="text-base md:text-xl text-warm-600 max-w-lg mx-auto leading-relaxed">
                        Nuestro taller digital recibe una mano de pintura. <br className="hidden sm:block" />
                        Volvemos muy pronto con todo listo.
                    </p>
                </div>

                {/* Status Indicator */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full border border-warm-200 shadow-sm transition-shadow">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lemon-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-lemon-500"></span>
                    </span>
                    <span className="text-[10px] md:text-xs font-bold text-warm-500 uppercase tracking-[0.2em]">
                        Trabajando en el sitio
                    </span>
                </div>

                {/* Social/Contact Info */}
                <div className="w-full pt-8 border-t border-warm-200 max-w-2xl text-center">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-2">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-warm-400 uppercase tracking-widest">Seguinos</p>
                            <a
                                href="https://instagram.com/taller_de_arte_limone"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm md:text-base text-warm-800 hover:text-brand-purple transition-all font-bold block"
                            >
                                @taller_de_arte_limone
                            </a>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-warm-400 uppercase tracking-widest">Escribinos</p>
                            <a
                                href="https://wa.me/5492901588969"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm md:text-base text-warm-800 hover:text-brand-purple transition-all font-bold block"
                            >
                                WhatsApp
                            </a>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-warm-400 uppercase tracking-widest">Ubicación</p>
                            <p className="text-sm md:text-base text-warm-800 font-bold">Ushuaia, Argentina</p>
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="pt-4">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-warm-400 hover:text-warm-800 text-[10px] md:text-xs transition-colors border-b border-transparent hover:border-warm-200"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Acceso Administrador
                    </Link>
                </div>
            </div>
        </div>
    )
}
