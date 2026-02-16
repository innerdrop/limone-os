import Link from 'next/link'
import prisma from '@/lib/prisma'
import { startOfMonth, subDays } from 'date-fns'
import DeleteTaskButton from '@/components/admin/DeleteTaskButton'

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
            where: { fecha: { gte: now } },
            include: { alumno: { include: { usuario: true } } },
            orderBy: { fecha: 'asc' },
            take: 10
        }),
        prisma.clase.findMany({
            where: { fechaHora: { gte: now } },
            include: { taller: true },
            orderBy: { fechaHora: 'asc' },
            take: 10
        }),
        prisma.tarea.findMany({
            where: {
                OR: [
                    { completada: false },
                    { fecha: { gte: last30Days } }
                ]
            },
            orderBy: { fecha: 'asc' },
            take: 10
        }),
        prisma.inscripcion.findMany({
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

                {/* Próximas Actividades (Agenda) */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-warm-800">Próximas Actividades</h2>
                        <Link href="/admin/agenda" className="text-xs font-bold text-lemon-600 hover:underline">Ver Agenda →</Link>
                    </div>
                    <div className="space-y-3">
                        {(() => {
                            const daysMap: { [key: string]: number } = {
                                'DOMINGO': 0, 'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'MIÉRCOLES': 3,
                                'JUEVES': 4, 'VIERNES': 5, 'SABADO': 6, 'SÁBADO': 6
                            };

                            const getNextOccurrence = (dayName: string, timeStr: string) => {
                                const targetDay = daysMap[dayName.toUpperCase().trim()] ?? 1;
                                const result = new Date();
                                result.setDate(result.getDate() + (targetDay + 7 - result.getDay()) % 7);

                                // Try to parse time from "18:00-19:30" or "18:00"
                                const timeMatch = timeStr?.match(/(\d{1,2}):(\d{2})/);
                                if (timeMatch) {
                                    result.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
                                }

                                // If it's today but the time passed, move to next week
                                if (result < now) {
                                    result.setDate(result.getDate() + 7);
                                }
                                return result;
                            };

                            type Activity = { id: string; type: 'clase' | 'tarea' | 'nivelacion'; title: string; subtitle: string; date: Date; icon: string; color: string; badgeText: string; badgeClass: string; completada?: boolean }

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
                                    color: t.completada ? 'bg-canvas-200' : (t.prioridad === 'ALTA' ? 'bg-red-100' : t.prioridad === 'MEDIA' ? 'bg-amber-100' : 'bg-blue-100'),
                                    badgeText: t.completada ? 'Hecha' : (t.prioridad === 'ALTA' ? 'Urgente' : 'Tarea'),
                                    badgeClass: t.completada ? 'bg-canvas-300 text-warm-500' : (t.prioridad === 'ALTA' ? 'badge badge-warning' : 'badge badge-lemon'),
                                    completada: t.completada
                                })),
                                ...latestCitas.map(c => ({
                                    id: c.id,
                                    type: 'nivelacion' as const,
                                    title: `Nivelación: ${c.alumno.usuario.nombre}`,
                                    subtitle: (c.alumno.nombre || 'Alumno') + ' ' + (c.alumno.apellido || ''),
                                    date: c.fecha,
                                    icon: '🧐',
                                    color: 'bg-purple-100',
                                    badgeText: 'Nivelación',
                                    badgeClass: 'badge badge-lemon'
                                })),
                                ...inscripcionesRecientes.filter(i => i.estado === 'ACTIVA').map(i => {
                                    const nextDate = i.dia ? getNextOccurrence(i.dia, i.horario || '') : i.creadoEn;
                                    const badgeType = i.fase?.toLowerCase().includes('verano') ? 'Verano' :
                                        i.fase?.toLowerCase().includes('unica') ? 'Unica' : 'Regular';

                                    return {
                                        id: `insc-${i.id}`,
                                        type: 'clase' as const,
                                        title: `${i.taller.nombre}: ${i.alumno.nombre || 'Alumno'}`,
                                        subtitle: `${i.dia || ''} ${i.horario || ''}`,
                                        date: nextDate,
                                        icon: '🎨',
                                        color: badgeType === 'Verano' ? 'bg-leaf-100' : badgeType === 'Unica' ? 'bg-blue-100' : 'bg-lemon-100',
                                        badgeText: i.fase || 'Clase',
                                        badgeClass: badgeType === 'Verano' ? 'badge badge-success' : badgeType === 'Unica' ? 'badge badge-info' : 'badge badge-lemon'
                                    };
                                })
                            ].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5)

                            if (activities.length === 0) {
                                return <p className="text-sm text-warm-400 italic py-4 text-center">No hay actividades próximas</p>
                            }

                            return activities.map((act) => (
                                <div key={act.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors group ${act.completada ? 'bg-canvas-50/50 border-transparent opacity-60' : 'bg-canvas-50 border-canvas-100 hover:bg-canvas-100 hover:border-canvas-300'}`}>
                                    <div className={`w-9 h-9 rounded-xl ${act.color} flex items-center justify-center text-lg flex-shrink-0 mt-0.5 shadow-sm`}>
                                        {act.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className={`font-bold text-warm-800 text-sm truncate ${act.completada ? 'line-through' : ''}`}>{act.title}</p>
                                            <span className={`${act.badgeClass} text-[9px] whitespace-nowrap px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter`}>
                                                {act.badgeText}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 mt-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-medium text-lemon-700">
                                                    {act.date.toLocaleString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                </p>
                                                <span className="text-[10px] text-warm-300">•</span>
                                                <p className="text-xs text-warm-500 font-bold">
                                                    {act.date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                                                </p>
                                            </div>

                                            {act.type === 'tarea' && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <DeleteTaskButton taskId={act.id} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        })()}
                    </div>
                </div>

                {/* Inscripciones Recientes (Avisos) */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-warm-800">Inscripciones Recientes</h2>
                    </div>
                    <div className="space-y-3">
                        {inscripcionesRecientes.length > 0 ? inscripcionesRecientes.map((insc) => {
                            const studentName = `${insc.alumno.nombre || 'Alumno'} ${insc.alumno.apellido || ''}`.trim();
                            const parentName = insc.alumno.usuario.nombre || 'Un usuario';
                            const classOption = insc.fase || insc.taller.nombre;

                            return (
                                <div key={insc.id} className={`flex items-start gap-3 p-3 bg-canvas-50 rounded-xl border border-canvas-100 transition-opacity ${insc.estado === 'CANCELADA' ? 'opacity-50 grayscale' : ''}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${insc.estado === 'CANCELADA' ? 'bg-canvas-200' : 'bg-green-100'}`}>
                                        <svg className={`w-4 h-4 ${insc.estado === 'CANCELADA' ? 'text-canvas-500' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {insc.estado === 'CANCELADA' ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            )}
                                        </svg>
                                    </div>
                                    <div className="flex-1 flex justify-between items-start gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm text-warm-700 leading-relaxed">
                                                <span className="font-bold text-warm-900">{parentName}</span>
                                                <span className="mx-1">{insc.estado === 'CANCELADA' ? 'había inscripto a' : 'inscribió a'}</span>
                                                <span className="font-bold text-warm-900">{studentName}</span>
                                                <span className="mx-1">a</span>
                                                <span className="italic font-medium text-lemon-700">{classOption}</span>
                                            </p>
                                            <p className="text-[10px] text-warm-400 mt-1 font-medium">
                                                {insc.creadoEn.toLocaleDateString('es-AR')}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {insc.estado === 'CANCELADA' ? (
                                                <span className="badge bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5">Cancelada</span>
                                            ) : insc.pagos.some(p => p.estado === 'PENDIENTE' || p.estado === 'PENDIENTE_VERIFICACION') ? (
                                                <span className="badge badge-warning text-[9px] whitespace-nowrap px-1.5 py-0.5">Pendiente Pago</span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
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


