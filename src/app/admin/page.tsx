import Link from 'next/link'
import prisma from '@/lib/prisma'
import { startOfMonth, subDays } from 'date-fns'

export default async function AdminDashboard() {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const last30Days = subDays(now, 30)

    // 1. Fetch Stats
    const [
        totalAlumnos,
        nuevosAlumnos,
        ingresosMes,
        citasNivelacion,
        inscripcionesRecientes
    ] = await Promise.all([
        prisma.alumno.count(),
        prisma.alumno.count({
            where: { creadoEn: { gte: monthStart } }
        }),
        prisma.pago.aggregate({
            _sum: { monto: true },
            where: {
                estado: 'APROBADO',
                fechaPago: { gte: monthStart }
            }
        }),
        prisma.citaNivelacion.findMany({
            where: { fecha: { gte: now } },
            include: {
                alumno: {
                    include: {
                        usuario: true
                    }
                }
            },
            orderBy: { fecha: 'asc' },
            take: 5
        }),
        prisma.inscripcion.findMany({
            where: { creadoEn: { gte: last30Days } },
            include: {
                alumno: { include: { usuario: true } },
                taller: true
            },
            orderBy: { creadoEn: 'desc' },
            take: 5
        })
    ])

    const stats = {
        alumnosActivos: totalAlumnos,
        alumnosNuevosMes: nuevosAlumnos,
        ingresosMes: ingresosMes._sum.monto || 0,
        citasPendientes: citasNivelacion.length,
    }

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
                        Tablero de Control
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Bienvenida, Natalia. Aquí está el resumen real de tu taller.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/alumnos" className="btn-primary">
                        Ver Lista de Alumnos
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-lemon-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{stats.alumnosActivos}</p>
                            <p className="text-xs text-warm-500">Alumnos totales</p>
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
                            <p className="text-xs text-warm-500">Recaudación mes</p>
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
                            <p className="text-2xl font-bold text-warm-800">{stats.citasPendientes}</p>
                            <p className="text-xs text-warm-500">Pruebas pendientes</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Próximas Citas de Nivelación */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-warm-800">Pruebas de Nivelación</h2>
                        <span className="text-xs text-warm-400">Próximas programadas</span>
                    </div>
                    <div className="space-y-3">
                        {citasNivelacion.length > 0 ? citasNivelacion.map((cita) => (
                            <div key={cita.id} className="flex items-center justify-between p-3 rounded-xl bg-canvas-50 border border-canvas-200">
                                <div>
                                    <p className="font-medium text-warm-800">{cita.alumno.usuario.nombre}</p>
                                    <p className="text-sm text-warm-500">{cita.fecha.toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-lemon">Pendiente</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-warm-400 italic py-4 text-center">No hay pruebas programadas</p>
                        )}
                    </div>
                </div>

                {/* Actividad Reciente (Inscripciones) */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-warm-800">Inscripciones Recientes</h2>
                    </div>
                    <div className="space-y-3">
                        {inscripcionesRecientes.length > 0 ? inscripcionesRecientes.map((insc) => (
                            <div key={insc.id} className="flex items-start gap-3 p-3">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-warm-700">
                                        <span className="font-bold">{insc.alumno.usuario.nombre}</span> se inscribió a <span className="italic">{insc.taller.nombre}</span>
                                    </p>
                                    <p className="text-xs text-warm-400 mt-1">{insc.creadoEn.toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-warm-400 italic py-4 text-center">No hay inscripciones recientes</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-lg font-semibold text-warm-800 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Lista de Alumnos', href: '/admin/alumnos', icon: '👤', color: 'bg-lemon-100' },
                        { label: 'Ver Agenda', href: '/admin/agenda', icon: '📅', color: 'bg-leaf-100' },
                        { label: 'Control Pagos', href: '/admin/finanzas', icon: '💳', color: 'bg-blue-100' },
                        { label: 'Config. Talleres', href: '/admin/talleres', icon: '⚙️', color: 'bg-red-100' },
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


