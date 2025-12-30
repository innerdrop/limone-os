import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

// Datos de ejemplo (en producción vendrían de la BD)
const proximaClase = {
    taller: 'Pintura al Óleo',
    fecha: 'Lunes 30 de Diciembre',
    hora: '18:00 - 19:30',
    ubicacion: 'Taller Limoné',
}

const avisos = [
    {
        id: 1,
        titulo: '¡Bienvenido al taller!',
        mensaje: 'Recordá traer tus materiales para la próxima clase.',
        fecha: '28 Dic',
        tipo: 'info',
    },
    {
        id: 2,
        titulo: 'Cuota de Enero',
        mensaje: 'Tu cuota de Enero está pendiente de pago.',
        fecha: '27 Dic',
        tipo: 'warning',
    },
]

const estadisticas = [
    { label: 'Clases este mes', value: '8', icon: '📚' },
    { label: 'Asistencia', value: '95%', icon: '✅' },
    { label: 'Obras creadas', value: '12', icon: '🎨' },
    { label: 'Meses activo', value: '6', icon: '⭐' },
]

export default async function PortalDashboard() {
    const session = await getServerSession(authOptions)
    const userName = session?.user?.name?.split(' ')[0] || 'Alumno'

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        ¡Hola, {userName}! 👋
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Bienvenido a tu portal del Taller Limoné
                    </p>
                </div>
                <Link href="/portal/calendario" className="btn-primary">
                    Ver mi calendario
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {estadisticas.map((stat, index) => (
                    <div key={index} className="card p-4 flex items-center gap-4">
                        <div className="text-3xl">{stat.icon}</div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{stat.value}</p>
                            <p className="text-sm text-warm-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Próxima Clase */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-lemon-100 flex items-center justify-center">
                            <span className="text-xl">📅</span>
                        </div>
                        <h2 className="text-lg font-semibold text-warm-800">Próxima Clase</h2>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-lemon-50 to-leaf-50 border border-lemon-100">
                        <h3 className="text-xl font-bold text-warm-800 mb-2">
                            {proximaClase.taller}
                        </h3>
                        <div className="space-y-2 text-warm-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{proximaClase.fecha}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{proximaClase.hora}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <span>{proximaClase.ubicacion}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button className="flex-1 py-2 px-4 bg-white text-warm-700 rounded-lg text-sm font-medium hover:bg-canvas-50 transition-colors border border-canvas-200">
                                Avisar inasistencia
                            </button>
                            <Link
                                href="/portal/calendario"
                                className="flex-1 py-2 px-4 bg-lemon-500 text-warm-800 rounded-lg text-sm font-medium hover:bg-lemon-600 transition-colors text-center"
                            >
                                Ver detalles
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Avisos */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-leaf-100 flex items-center justify-center">
                                <span className="text-xl">📢</span>
                            </div>
                            <h2 className="text-lg font-semibold text-warm-800">Avisos</h2>
                        </div>
                        <span className="badge badge-lemon">{avisos.length} nuevos</span>
                    </div>

                    <div className="space-y-3">
                        {avisos.map((aviso) => (
                            <div
                                key={aviso.id}
                                className={`p-4 rounded-xl border ${aviso.tipo === 'warning'
                                        ? 'bg-amber-50 border-amber-200'
                                        : 'bg-canvas-50 border-canvas-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="font-medium text-warm-800">{aviso.titulo}</h4>
                                        <p className="text-sm text-warm-500 mt-1">{aviso.mensaje}</p>
                                    </div>
                                    <span className="text-xs text-warm-400 whitespace-nowrap">{aviso.fecha}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-lg font-semibold text-warm-800 mb-4">Accesos rápidos</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Pagar cuota', href: '/portal/pagos', icon: '💳', color: 'bg-lemon-100' },
                        { label: 'Ver galería', href: '/portal/galeria', icon: '🖼️', color: 'bg-leaf-100' },
                        { label: 'Mi calendario', href: '/portal/calendario', icon: '📅', color: 'bg-blue-100' },
                        { label: 'Editar perfil', href: '/portal/perfil', icon: '👤', color: 'bg-purple-100' },
                    ].map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-canvas-200 hover:border-lemon-300 hover:shadow-soft transition-all"
                        >
                            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-2xl`}>
                                {action.icon}
                            </div>
                            <span className="text-sm font-medium text-warm-700">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
