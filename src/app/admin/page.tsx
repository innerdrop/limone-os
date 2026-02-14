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
        ingresosMesData,
        citasNivelacionCount,
        latestCitas,
        latestClases,
        latestTareas,
        inscripcionesRecientes,
        pagosPendientes
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
        prisma.citaNivelacion.count({ where: { fecha: { gte: now } } }),
        prisma.citaNivelacion.findMany({
            include: { alumno: { include: { usuario: true } } },
            orderBy: { fecha: 'desc' },
            take: 6
        }),
        prisma.clase.findMany({
            include: { taller: true },
            orderBy: { fechaHora: 'desc' },
            take: 6
        }),
        prisma.tarea.findMany({
            where: { completada: false },
            orderBy: { fecha: 'desc' },
            take: 6
        }),
        prisma.inscripcion.findMany({
            where: { creadoEn: { gte: last30Days } },
            include: {
                alumno: { include: { usuario: true } },
                taller: true,
                pagos: true
            },
            orderBy: { creadoEn: 'desc' },
            take: 5
        }),
        prisma.pago.findMany({
            where: { estado: 'PENDIENTE_VERIFICACION' },
            include: {
                alumno: { include: { usuario: true } }
            },
            orderBy: { fechaPago: 'desc' },
            take: 5
        })
    ])

    const stats = {
        alumnosActivos: totalAlumnos,
        alumnosNuevosMes: nuevosAlumnos,
        ingresosMes: ingresosMesData._sum.monto || 0,
        citasPendientes: citasNivelacionCount,
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
                        <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-brand-charcoal">{stats.alumnosActivos}</p>
                            <p className="text-xs text-warm-500">Alumnos totales</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-brand-charcoal">+{stats.alumnosNuevosMes}</p>
                            <p className="text-xs text-warm-500">Nuevos este mes</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-brand-charcoal">{formatMoney(stats.ingresosMes)}</p>
                            <p className="text-xs text-warm-500">Recaudación mes</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-brand-charcoal">{stats.citasPendientes}</p>
                            <p className="text-xs text-warm-500">Pruebas pendientes</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pagos por Verificar (ALERTA) */}
                {pagosPendientes.length > 0 && (
                    <div className="card border-2 border-amber-200 bg-amber-50 lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">💰</span>
                                <h2 className="text-lg font-bold text-amber-800">Pagos Pendientes de Verificación</h2>
                            </div>
                            <Link href="/admin/finanzas" className="text-sm font-bold text-amber-600 hover:underline">Ver todos →</Link>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pagosPendientes.map((pago) => (
                                <div key={pago.id} className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-warm-800">{pago.alumno.usuario.nombre}</p>
                                        <p className="text-xs text-warm-500">{pago.concepto}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-black text-warm-900">{formatMoney(pago.monto)}</span>
                                        <Link
                                            href={`/admin/alumnos/${pago.alumno.id}`}
                                            className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Próximas Actividades */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-warm-800">Próximas Actividades</h2>
                        <Link href="/admin/agenda" className="text-xs font-bold text-lemon-600 hover:underline">Ver Agenda →</Link>
                    </div>
                    <div className="space-y-3">
                        {(() => {
                            type Activity = { id: string; type: 'clase' | 'tarea' | 'nivelacion'; title: string; subtitle: string; date: Date; icon: string; color: string; badgeText: string; badgeClass: string }
                            const activities: Activity[] = [
                                ...latestClases.map(c => ({
                                    id: c.id,
                                    type: 'clase' as const,
                                    title: c.taller.nombre,
                                    subtitle: c.notas || 'Clase programada',
                                    date: c.fechaHora,
                                    icon: '🎨',
                                    color: 'bg-lemon-100',
                                    badgeText: 'Clase',
                                    badgeClass: 'badge badge-lemon'
                                })),
                                ...latestTareas.map(t => ({
                                    id: t.id,
                                    type: 'tarea' as const,
                                    title: t.titulo,
                                    subtitle: t.descripcion || (t.hora ? `a las ${t.hora}` : 'Sin hora definida'),
                                    date: t.fecha,
                                    icon: '✅',
                                    color: t.prioridad === 'ALTA' ? 'bg-red-100' : t.prioridad === 'MEDIA' ? 'bg-amber-100' : 'bg-blue-100',
                                    badgeText: t.prioridad === 'ALTA' ? 'Urgente' : 'Tarea',
                                    badgeClass: t.prioridad === 'ALTA' ? 'badge badge-warning' : 'badge badge-lemon'
                                })),
                                ...latestCitas.map(c => ({
                                    id: c.id,
                                    type: 'nivelacion' as const,
                                    title: `Nivelación: ${c.alumno.usuario.nombre}`,
                                    subtitle: c.alumno.nombre + ' ' + c.alumno.apellido,
                                    date: c.fecha,
                                    icon: '🧐',
                                    color: 'bg-purple-100',
                                    badgeText: 'Nivelación',
                                    badgeClass: 'badge badge-lemon'
                                }))
                            ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4)

                            if (activities.length === 0) {
                                return <p className="text-sm text-warm-400 italic py-4 text-center">No hay actividades próximas</p>
                            }

                            return activities.map((act) => (
                                <div key={act.id} className="flex items-center gap-3 p-3 rounded-xl bg-canvas-50 border border-canvas-200 hover:bg-canvas-100 transition-colors">
                                    <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center text-lg flex-shrink-0`}>
                                        {act.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-warm-800 text-sm truncate">{act.title}</p>
                                        <p className="text-xs text-warm-500">{act.date.toLocaleString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <span className={act.badgeClass + ' text-[10px] whitespace-nowrap'}>{act.badgeText}</span>
                                </div>
                            ))
                        })()}
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
                                <div className="flex-1 flex justify-between items-start gap-2">
                                    <div>
                                        <p className="text-sm text-warm-700">
                                            <span className="font-bold">{insc.alumno.usuario.nombre}</span> se inscribió a <span className="italic">{insc.taller.nombre}</span>
                                        </p>
                                        <p className="text-xs text-warm-400 mt-1">{insc.creadoEn.toLocaleDateString()}</p>
                                    </div>
                                    {insc.pagos.some(p => p.estado === 'PENDIENTE' || p.estado === 'PENDIENTE_VERIFICACION') && (
                                        <span className="badge badge-warning text-[10px] whitespace-nowrap">Pendiente Pago</span>
                                    )}
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


