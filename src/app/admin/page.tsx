import Link from 'next/link'

// Datos de ejemplo (en producción vendrían de la BD)
const stats = {
    alumnosActivos: 42,
    alumnosNuevosMes: 5,
    ingresosMes: 1250000,
    clasesEsteMes: 24,
    morosos: 3,
    cuposDisponibles: 12,
}

const proximasClases = [
    { id: 1, taller: 'Pintura al Óleo', fecha: 'Hoy 18:00', alumnos: 8 },
    { id: 2, taller: 'Acuarela Creativa', fecha: 'Mañana 16:00', alumnos: 10 },
    { id: 3, taller: 'Dibujo Artístico', fecha: 'Viernes 17:00', alumnos: 11 },
]

const actividadReciente = [
    { id: 1, tipo: 'inscripcion', mensaje: 'María García se inscribió a Pintura al Óleo', tiempo: 'Hace 2 horas' },
    { id: 2, tipo: 'pago', mensaje: 'Carlos Rodríguez pagó cuota de Enero', tiempo: 'Hace 3 horas' },
    { id: 3, tipo: 'inasistencia', mensaje: 'Ana Martínez avisó inasistencia para mañana', tiempo: 'Hace 5 horas' },
]

export default function AdminDashboard() {
    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Dashboard
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Bienvenida, Natalia. Aquí está el resumen de tu taller.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/alumnos/nuevo" className="btn-primary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nuevo Alumno
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-lemon-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{stats.alumnosActivos}</p>
                            <p className="text-xs text-warm-500">Alumnos activos</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">+{stats.alumnosNuevosMes}</p>
                            <p className="text-xs text-warm-500">Nuevos este mes</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-leaf-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-leaf-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-warm-800">{formatMoney(stats.ingresosMes)}</p>
                            <p className="text-xs text-warm-500">Ingresos del mes</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{stats.clasesEsteMes}</p>
                            <p className="text-xs text-warm-500">Clases este mes</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">{stats.morosos}</p>
                            <p className="text-xs text-warm-500">Morosos</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{stats.cuposDisponibles}</p>
                            <p className="text-xs text-warm-500">Cupos disponibles</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Próximas Clases */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-warm-800">Próximas Clases</h2>
                        <Link href="/admin/talleres" className="text-sm text-lemon-600 hover:text-lemon-700 font-medium">
                            Ver todas
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {proximasClases.map((clase) => (
                            <div key={clase.id} className="flex items-center justify-between p-3 rounded-xl bg-canvas-50 border border-canvas-200">
                                <div>
                                    <p className="font-medium text-warm-800">{clase.taller}</p>
                                    <p className="text-sm text-warm-500">{clase.fecha}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-lemon">{clase.alumnos} alumnos</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actividad Reciente */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-warm-800">Actividad Reciente</h2>
                    </div>
                    <div className="space-y-3">
                        {actividadReciente.map((actividad) => (
                            <div key={actividad.id} className="flex items-start gap-3 p-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${actividad.tipo === 'inscripcion' ? 'bg-green-100' :
                                        actividad.tipo === 'pago' ? 'bg-lemon-100' : 'bg-amber-100'
                                    }`}>
                                    {actividad.tipo === 'inscripcion' && (
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    )}
                                    {actividad.tipo === 'pago' && (
                                        <svg className="w-4 h-4 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {actividad.tipo === 'inasistencia' && (
                                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-warm-700">{actividad.mensaje}</p>
                                    <p className="text-xs text-warm-400 mt-1">{actividad.tiempo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-lg font-semibold text-warm-800 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Nuevo Alumno', href: '/admin/alumnos/nuevo', icon: '👤', color: 'bg-lemon-100' },
                        { label: 'Subir Fotos', href: '/admin/contenido', icon: '📷', color: 'bg-leaf-100' },
                        { label: 'Registrar Pago', href: '/admin/finanzas', icon: '💳', color: 'bg-blue-100' },
                        { label: 'Ver Morosos', href: '/admin/finanzas', icon: '⚠️', color: 'bg-red-100' },
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
