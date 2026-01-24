import Link from 'next/link'
import prisma from '@/lib/prisma'
import { startOfDay, endOfDay, addDays, format, getDay, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import QuickTaskForm from '@/components/admin/QuickTaskForm'
import TaskActions from '@/components/admin/TaskActions'

export const dynamic = 'force-dynamic'

export default async function AgendaPage() {
    const today = startOfDay(new Date())
    const next7Days = endOfDay(addDays(today, 7))

    const [citas, tareas, talleres, tareasPendientesTotal] = await Promise.all([
        prisma.citaNivelacion.findMany({
            where: { fecha: { gte: today, lte: next7Days } },
            include: { alumno: { include: { usuario: true } } },
            orderBy: { fecha: 'asc' }
        }),
        prisma.tarea.findMany({
            where: { fecha: { gte: today, lte: next7Days } },
            orderBy: [{ completada: 'asc' }, { prioridad: 'desc' }, { fecha: 'asc' }]
        }),
        // Mostrar TODOS los talleres activos (no solo los que tienen inscripciones)
        prisma.taller.findMany({
            where: { activo: true },
            include: {
                _count: {
                    select: {
                        inscripciones: {
                            where: { estado: 'ACTIVA' }
                        }
                    }
                }
            }
        }),
        prisma.tarea.count({
            where: { completada: false }
        })
    ])

    const dayMap: { [key: number]: string } = {
        0: 'DOMINGO',
        1: 'LUNES',
        2: 'MARTES',
        3: 'MIERCOLES',
        4: 'JUEVES',
        5: 'VIERNES',
        6: 'SABADO'
    }

    // Generate workshop sessions for the next 7 days
    const tallerSessions: any[] = []
    for (let i = 0; i <= 7; i++) {
        const currentDate = addDays(today, i)
        const dayOfWeekStr = dayMap[getDay(currentDate)]

        talleres.forEach(taller => {
            if (taller.diasSemana?.toUpperCase().includes(dayOfWeekStr)) {
                const [hours, minutes] = (taller.horaInicio || '16:00').split(':')
                const sessionDate = new Date(currentDate)
                sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

                const alumnosActivos = (taller as any)._count?.inscripciones || 0

                tallerSessions.push({
                    id: `taller-${taller.id}-${i}`,
                    tipo: 'TALLER',
                    tipoLabel: taller.nombre.toLowerCase().includes('verano') ? '☀️ Taller de Verano' : '🎨 Taller Regular',
                    fecha: sessionDate,
                    titulo: taller.nombre,
                    detalle: `${taller.horaInicio} hs • ${alumnosActivos} alumno${alumnosActivos !== 1 ? 's' : ''} inscripto${alumnosActivos !== 1 ? 's' : ''}`,
                    color: taller.nombre.toLowerCase().includes('verano') ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-leaf-100 text-leaf-700 border-leaf-300',
                    link: `/admin/talleres`
                })
            }
        })
    }


    // All agenda items
    const agendaItems = [
        ...citas.map(cita => ({
            id: cita.id,
            tipo: 'CITA',
            tipoLabel: 'Prueba de Nivelación',
            fecha: cita.fecha,
            titulo: cita.alumno.usuario.nombre,
            detalle: cita.notas || 'Cita de nivelación programada',
            color: 'bg-lemon-100 text-lemon-700 border-lemon-300',
            link: `/admin/alumnos/${cita.alumnoId}`,
            completada: false
        })),
        ...tareas.map((tarea: any) => ({
            id: tarea.id,
            tipo: 'TAREA',
            tipoLabel: tarea.categoria ? getCategoriaLabel(tarea.categoria) : 'Tarea',
            fecha: tarea.fecha,
            hora: tarea.hora,
            titulo: tarea.titulo,
            detalle: tarea.descripcion || '',
            color: tarea.completada
                ? 'bg-gray-100 text-gray-500 border-gray-300'
                : tarea.prioridad === 'ALTA'
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : tarea.prioridad === 'BAJA'
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : 'bg-blue-100 text-blue-700 border-blue-300',
            link: '#',
            completada: tarea.completada,
            prioridad: tarea.prioridad
        })),
        ...tallerSessions
    ]

    // Sort by date
    agendaItems.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())

    // Group by day
    const groupedItems: { [key: string]: typeof agendaItems } = {}
    agendaItems.forEach(item => {
        const dayKey = format(item.fecha, "EEEE d 'de' MMMM", { locale: es })
        if (!groupedItems[dayKey]) groupedItems[dayKey] = []
        groupedItems[dayKey].push(item)
    })

    // Stats for today
    const todayItems = agendaItems.filter(item => isToday(item.fecha))
    const todayTareas = todayItems.filter(i => i.tipo === 'TAREA' && !i.completada).length
    const todayTalleres = todayItems.filter(i => i.tipo === 'TALLER').length
    const todayCitas = todayItems.filter(i => i.tipo === 'CITA').length

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        📅 Agenda Global
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Vista completa de talleres, citas y tareas
                    </p>
                </div>
                <QuickTaskForm />
            </div>

            {/* Today Summary */}
            <div className="card p-6 bg-gradient-to-r from-leaf-50 via-lemon-50 to-orange-50 border-2 border-leaf-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-warm-500 uppercase font-bold tracking-wider">📍 Hoy</p>
                        <h2 className="text-xl font-bold text-warm-800 capitalize">
                            {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl">
                            <span className="text-2xl">📝</span>
                            <div>
                                <p className="text-lg font-bold text-warm-800">{todayTareas}</p>
                                <p className="text-xs text-warm-500">Tareas pendientes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl">
                            <span className="text-2xl">🎨</span>
                            <div>
                                <p className="text-lg font-bold text-warm-800">{todayTalleres}</p>
                                <p className="text-xs text-warm-500">Talleres</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl">
                            <span className="text-2xl">👤</span>
                            <div>
                                <p className="text-lg font-bold text-warm-800">{todayCitas}</p>
                                <p className="text-xs text-warm-500">Citas</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border-2 border-red-200">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="text-lg font-bold text-red-600">{tareasPendientesTotal}</p>
                                <p className="text-xs text-warm-500">Total pendientes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agenda Items */}
            <div className="space-y-8">
                {Object.keys(groupedItems).length > 0 ? Object.entries(groupedItems).map(([day, items]) => {
                    const dayDate = items[0]?.fecha
                    const isTodayGroup = dayDate && isToday(dayDate)

                    return (
                        <div key={day} className="space-y-4">
                            <h2 className={`text-lg font-bold border-b pb-2 capitalize flex items-center gap-2 ${isTodayGroup ? 'text-leaf-700 border-leaf-300' : 'text-warm-600 border-warm-200'
                                }`}>
                                {isTodayGroup && <span className="bg-leaf-500 text-white text-xs px-2 py-0.5 rounded-full">HOY</span>}
                                {day}
                            </h2>
                            <div className="grid gap-3">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`card p-4 flex items-start gap-4 hover:shadow-soft transition-all border-l-4 ${item.completada ? 'opacity-60 bg-gray-50' : ''
                                            } ${item.color.split(' ').find((c: string) => c.startsWith('border-')) || 'border-warm-300'}`}
                                    >
                                        {/* Time */}
                                        <div className="flex-shrink-0 w-16 text-center">
                                            <p className="text-xl font-bold text-warm-800">
                                                {item.hora || format(item.fecha, 'HH:mm')}
                                            </p>
                                            <p className="text-xs text-warm-400 uppercase">hs</p>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                                                    {item.tipoLabel}
                                                </span>
                                                {item.prioridad === 'ALTA' && !item.completada && (
                                                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                                                        🔴 URGENTE
                                                    </span>
                                                )}
                                                {item.completada && (
                                                    <span className="text-[10px] bg-gray-400 text-white px-2 py-0.5 rounded-full font-bold">
                                                        ✓ COMPLETADA
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className={`font-semibold ${item.completada ? 'line-through text-warm-500' : 'text-warm-800'}`}>
                                                {item.titulo}
                                            </h3>
                                            {item.detalle && (
                                                <p className="text-sm text-warm-500 mt-1">{item.detalle}</p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {item.tipo === 'TAREA' && (
                                                <TaskActions taskId={item.id} isCompleted={item.completada} />
                                            )}
                                            {item.link !== '#' && (
                                                <Link
                                                    href={item.link}
                                                    className="btn-outline text-xs px-3 py-1"
                                                >
                                                    Ver más
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }) : (
                    <div className="card py-12 text-center">
                        <p className="text-4xl mb-4">📭</p>
                        <p className="text-warm-500">No hay actividades programadas para los próximos 7 días.</p>
                        <p className="text-sm text-warm-400 mt-2">¡Usa el botón "Nueva Tarea" para agregar recordatorios!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function getCategoriaLabel(categoria: string): string {
    const labels: { [key: string]: string } = {
        'TALLER': '🎨 Taller',
        'ALUMNO': '👤 Alumno',
        'COMPRAS': '🛒 Compras',
        'CONTACTO': '📞 Contacto',
        'OTRO': '📋 Otro'
    }
    return labels[categoria] || 'Tarea'
}
