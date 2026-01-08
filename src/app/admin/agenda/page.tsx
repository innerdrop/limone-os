import Link from 'next/link'
import prisma from '@/lib/prisma'
import { startOfDay, endOfDay, addDays, format, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import QuickTaskForm from '@/components/admin/QuickTaskForm'

export default async function AgendaPage() {
    const today = startOfDay(new Date())
    const next7Days = endOfDay(addDays(today, 7))

    const [citas, tareas, talleres] = await Promise.all([
        prisma.citaNivelacion.findMany({
            where: { fecha: { gte: today, lte: next7Days } },
            include: { alumno: { include: { usuario: true } } },
            orderBy: { fecha: 'asc' }
        }),
        // Avoid crash if Prisma client hasn't updated its types yet due to EPERM lock
        (prisma as any).tarea ? (prisma as any).tarea.findMany({
            where: { fecha: { gte: today, lte: next7Days }, completada: false },
            orderBy: { fecha: 'asc' }
        }) : Promise.resolve([]),
        prisma.taller.findMany({
            where: { activo: true }
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
                // Combine date with time
                const [hours, minutes] = (taller.horaInicio || '16:00').split(':')
                const sessionDate = new Date(currentDate)
                sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

                tallerSessions.push({
                    id: `taller-${taller.id}-${i}`,
                    tipo: taller.nombre.toLowerCase().includes('verano') ? 'Taller de Verano' : 'Taller Regular',
                    fecha: sessionDate,
                    titulo: taller.nombre,
                    detalle: `Horario: ${taller.horaInicio} hs`,
                    color: taller.nombre.toLowerCase().includes('verano') ? 'bg-orange-100 text-orange-700' : 'bg-leaf-100 text-leaf-700',
                    link: `/admin/talleres`
                })
            }
        })
    }

    const agendaItems = [
        ...citas.map(cita => ({
            id: cita.id,
            tipo: 'Prueba de Nivelación',
            fecha: cita.fecha,
            titulo: cita.alumno.usuario.nombre,
            detalle: cita.notas || 'Cita de nivelación programada',
            color: 'bg-lemon-100 text-lemon-700',
            link: `/admin/alumnos/${cita.alumnoId}`
        })),
        ...tareas.map(tarea => ({
            id: tarea.id,
            tipo: 'Tarea / Recordatorio',
            fecha: tarea.fecha,
            titulo: tarea.titulo,
            detalle: tarea.descripcion || 'Sin descripción',
            color: tarea.prioridad === 'ALTA' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700',
            link: '#'
        })),
        ...tallerSessions
    ]

    // Sort all items by date
    agendaItems.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())

    // Group by day string
    const groupedItems: { [key: string]: typeof agendaItems } = {}
    agendaItems.forEach(item => {
        const dayKey = format(item.fecha, "EEEE d 'de' MMMM", { locale: es })
        if (!groupedItems[dayKey]) groupedItems[dayKey] = []
        groupedItems[dayKey].push(item)
    })

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Agenda Global
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Vista completa de talleres, citas y tareas
                    </p>
                </div>
                <QuickTaskForm />
            </div>

            <div className="space-y-8">
                {Object.keys(groupedItems).length > 0 ? Object.entries(groupedItems).map(([day, items]) => (
                    <div key={day} className="space-y-4">
                        <h2 className="text-lg font-bold text-leaf-700 border-b border-leaf-100 pb-2 capitalize">
                            {day}
                        </h2>
                        <div className="grid gap-4">
                            {items.map((item) => (
                                <div key={item.id} className={`card p-4 flex items-start gap-4 hover:shadow-soft transition-all border-l-4 ${item.color.split(' ')[0].replace('bg-', 'border-')}`}>
                                    <div className="flex-shrink-0 w-16 text-center">
                                        <p className="text-xl font-bold text-warm-800">
                                            {format(item.fecha, 'HH:mm')}
                                        </p>
                                        <p className="text-xs text-warm-400 uppercase">hs</p>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                                                {item.tipo}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-warm-800">{item.titulo}</h3>
                                        <p className="text-sm text-warm-500 mt-1">{item.detalle}</p>
                                    </div>
                                    {item.link !== '#' && (
                                        <Link
                                            href={item.link}
                                            className="btn-outline text-xs px-3 py-1 self-center"
                                        >
                                            Ver más
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="card py-12 text-center">
                        <p className="text-warm-500 italic">No hay actividades programadas para los próximos 7 días.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
