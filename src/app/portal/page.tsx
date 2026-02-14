import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import PlacementCard from '@/components/portal/PlacementCard'
import PendingPaymentCard from '@/components/portal/PendingPaymentCard'

const DAYS_MAP: Record<string, number> = {
    'DOMINGO': 0, 'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5, 'SABADO': 6
}

export const dynamic = 'force-dynamic'

export default async function PortalDashboard({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedSearchParams = await searchParams
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return null

    const students = await prisma.alumno.findMany({
        where: {
            usuarioId: session.user.id,
            OR: [
                { nombre: { not: null } },
                { perfilCompleto: true }
            ] as any
        },
        include: {
            inscripciones: {
                where: { estado: 'ACTIVA' },
                include: {
                    taller: true,
                    pagos: true
                }
            },
            asistencias: true,
            obras: true,
            citasNivelacion: {
                where: {
                    estado: 'PENDIENTE'
                },
                orderBy: { fecha: 'asc' },
                take: 5
            }
        }
    }) as any[]

    const notificaciones = await prisma.notificacion.findMany({
        where: { usuarioId: session.user.id, leida: false },
        orderBy: { fechaEnvio: 'desc' },
        take: 5
    })

    const userName = session?.user?.name?.split(' ')[0] || 'Tutor'

    // Aggregate data from all students
    const allEnrollments = (students as any[]).flatMap((s: any) =>
        (s.inscripciones as any[] || []).map((ins: any) => ({
            ...ins,
            studentName: `${(s as any).nombre || ''} ${(s as any).apellido || ''}`.trim() || 'Sin nombre'
        }))
    )

    const enrollments = allEnrollments.filter((ins: any) => ins.pagado)
    const pendingEnrollments = allEnrollments.filter((ins: any) => !ins.pagado)

    const upcomingPlacements = (students as any[]).flatMap((s: any) =>
        (s.citasNivelacion as any[] || []).map((c: any) => ({
            ...c,
            studentName: `${(s as any).nombre || ''} ${(s as any).apellido || ''}`.trim() || 'Sin nombre'
        }))
    )

    const totalObras = students.reduce((acc: number, s: any) => acc + (s.obras?.length || 0), 0)
    const totalTalleres = enrollments.length

    // Calculate Upcoming Classes (Top 5 candidates to mix with placements)
    let upcomingClasses: {
        type: 'class',
        id: string,
        taller: string,
        studentName: string,
        dia: string,
        horario: string,
        date: Date
    }[] = []

    if (enrollments.length > 0) {
        const now = new Date()
        const currentDay = now.getDay()

        enrollments.forEach(ins => {
            if ((ins.fase === 'Taller de Verano' || ins.dia === 'VERANO') && ins.notas) {
                // Handle Summer Workshop
                const startDateMatch = ins.notas.match(/Inicio: (\d{4}-\d{2}-\d{2})/)
                const frequencyMatch = ins.notas.match(/Frecuencia: (\d)x/)

                if (startDateMatch) {
                    const [y, m, dNum] = startDateMatch[1].split('-').map(Number)
                    const startDate = new Date(y, m - 1, dNum) // Local
                    const freq = frequencyMatch ? parseInt(frequencyMatch[1]) : 1

                    const mainDay = startDate.getDay()
                    const secondDay = (mainDay + 3) % 7

                    // Find next 2 occurrences
                    const weeksToShow = freq
                    const endDate = new Date(startDate)
                    endDate.setDate(startDate.getDate() + (weeksToShow * 7))

                    let found = 0
                    let d = new Date(now)
                    d.setHours(0, 0, 0, 0)
                    if (d < startDate) d = new Date(startDate)

                    let checks = 0
                    while (found < 2 && checks < 60 && d < endDate) {
                        const dayOfWeek = d.getDay()
                        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                            const sessionDate = new Date(d)
                            sessionDate.setHours(17, 0, 0, 0) // Fixed time for sorting

                            upcomingClasses.push({
                                type: 'class',
                                id: `${ins.id}-${d.getTime()}`,
                                taller: 'Taller de Verano',
                                studentName: ins.studentName || 'Alumno',
                                dia: 'Verano',
                                horario: '17:00',
                                date: sessionDate
                            })
                            found++
                        }
                        d.setDate(d.getDate() + 1)
                        checks++
                    }
                }
            } else {
                // Regular Logic (Split by comma if multiple days)
                const diasInscripcion = (ins.dia || '').split(',').map((d: string) => d.trim().toUpperCase())

                for (const diaText of diasInscripcion) {
                    const targetDay = DAYS_MAP[diaText]

                    if (targetDay !== undefined) {
                        let daysUntil = (targetDay - currentDay + 7) % 7

                        // If it's today, check time
                        if (ins.horario) {
                            // Split multi-horario if exists, otherwise take first
                            const firstHorario = ins.horario.split('/')[0].trim()
                            const [startHour] = firstHorario.split('-')[0].split(':')
                            if (daysUntil === 0 && now.getHours() >= parseInt(startHour)) {
                                daysUntil = 7
                            }
                        }

                        // Generate next 2 occurrences for each day in this enrollment
                        for (let i = 0; i < 2; i++) {
                            const classDate = new Date(now)
                            classDate.setDate(now.getDate() + daysUntil + (i * 7))

                            if (ins.horario) {
                                const horarioForSelf = ins.horario.includes('/') ? ins.horario.split('/')[diasInscripcion.indexOf(diaText)] || ins.horario.split('/')[0] : ins.horario
                                const [startTime] = horarioForSelf.split('-')
                                const [h, m] = startTime.split(':').map(Number)
                                classDate.setHours(h, m, 0, 0)
                            }

                            upcomingClasses.push({
                                type: 'class',
                                id: `${ins.id}-${diaText}-${i}`,
                                taller: 'Taller de Arte',
                                studentName: ins.studentName || 'Alumno',
                                dia: diaText,
                                horario: ins.horario || '',
                                date: classDate
                            })
                        }
                    }
                }
            }
        })
    }

    // Combine and Sort
    const allActivities = [
        ...upcomingPlacements.map((p: any) => ({
            type: 'placement' as const,
            id: p.id,
            cita: p,
            date: p.fecha,
            studentName: (p as any).studentName
        })),
        ...upcomingClasses
    ].sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 2)

    const estadisticas = [
        { label: 'Talleres activos', value: totalTalleres.toString(), icon: '📚' },
        { label: 'Obras creadas', value: totalObras.toString(), icon: '🎨' },
        { label: 'Alumnos', value: students.length.toString(), icon: '👥' },
        { label: 'Estado cuenta', value: pendingEnrollments.length > 0 ? 'Pendiente' : 'Al día', icon: '💳' },
    ]

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Success Alert */}
            {resolvedSearchParams.inscripcion === 'exitosa' && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                        ✨
                    </div>
                    <div>
                        <h3 className="font-bold">¡Inscripción registrada con éxito!</h3>
                        <p className="text-sm">Tu orden de pago ha sido generada. Podés verla abajo para completar la inscripción.</p>
                    </div>
                </div>
            )}

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
                <Link href="/portal/inscripcion" className="btn-primary">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {students.some(s => s.perfilCompleto) ? 'Nueva Inscripción' : 'Inscribir menor'}
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {estadisticas.map((stat: any, index: number) => (
                    <div key={index} className="card p-4 flex items-center gap-4">
                        <div className="text-3xl">{stat.icon}</div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{stat.value}</p>
                            <p className="text-sm text-warm-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending Payments Section */}
            {pendingEnrollments.length > 0 && (
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <span className="text-xl">💳</span>
                        </div>
                        <h2 className="text-lg font-semibold text-warm-800">Pagos Pendientes</h2>
                    </div>
                    <div className="space-y-4">
                        {pendingEnrollments.map((ins: any) => (
                            <PendingPaymentCard
                                key={ins.id}
                                inscripcion={{
                                    ...ins,
                                    dia: ins.dia || '',
                                    horario: ins.horario || '',
                                    fase: ins.fase || '',
                                    asiento: ins.asiento || '0',
                                    studentName: ins.studentName
                                } as any}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Próxima Clase / Evento */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-lemon-100 flex items-center justify-center">
                            <span className="text-xl">📅</span>
                        </div>
                        <h2 className="text-lg font-semibold text-warm-800">Próximas Actividades</h2>
                    </div>

                    <div className="space-y-4">
                        {allActivities.length > 0 ? (
                            allActivities.map((activity: any) => (
                                <div key={activity.id}>
                                    {activity.type === 'class' ? (
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-lemon-50 to-leaf-50 border border-lemon-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-warm-800">
                                                    {activity.taller}
                                                </h3>
                                                <span className="text-xs font-bold bg-lemon-100 text-lemon-700 px-2 py-1 rounded-lg">
                                                    {activity.studentName}
                                                </span>
                                            </div>
                                            <div className="space-y-2 text-warm-600">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{activity.dia.toUpperCase()} {activity.date.getDate()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{activity.horario}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <PlacementCard cita={activity.cita!} />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center border-2 border-dashed border-canvas-200 rounded-xl">
                                <p className="text-warm-400 mb-4">No tenés actividades programadas</p>
                                <Link href="/portal/inscripcion" className="text-lemon-600 font-medium hover:underline">
                                    Inscribite a un taller ahora →
                                </Link>
                            </div>
                        )}
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
                    </div>

                    <div className="space-y-3">
                        {/* Placement Test Notice */}
                        {upcomingPlacements.length > 0 && upcomingPlacements[0].estado === 'PENDIENTE' && (
                            <div className="p-4 rounded-xl border bg-lemon-50 border-lemon-200">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="font-medium text-warm-800">Prueba de Nivelación Pendiente</h4>
                                        <p className="text-sm text-warm-600 mt-1">
                                            Recordá que tenés una cita agendada para el {new Date(upcomingPlacements[0].fecha).toLocaleDateString()} a las {new Date(upcomingPlacements[0].fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}hs.
                                        </p>
                                    </div>
                                    <span className="text-xs text-lemon-600 font-bold whitespace-nowrap">Importante</span>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Dynamic Notifications */}
                    <div className="space-y-3 mt-3">
                        {notificaciones.map((notif: any) => (
                            <div key={notif.id} className={`p-4 rounded-xl border ${notif.tipo === 'SUCCESS' ? 'bg-green-50 border-green-200' : 'bg-canvas-50 border-canvas-200'}`}>
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="font-medium text-warm-800">{notif.titulo}</h4>
                                        <p className="text-sm text-warm-600 mt-1">{notif.mensaje}</p>
                                    </div>
                                    <span className="text-xs text-warm-400 whitespace-nowrap">{new Date(notif.fechaEnvio).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}

                        {(!upcomingPlacements.length && (!notificaciones || notificaciones.length === 0)) && (
                            <div className="p-4 rounded-xl border bg-canvas-50 border-canvas-200">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="font-medium text-warm-800">¡Bienvenido al portal!</h4>
                                        <p className="text-sm text-warm-500 mt-1">Acá verás tus avisos importantes.</p>
                                    </div>
                                    <span className="text-xs text-warm-400 whitespace-nowrap">Info</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-lg font-semibold text-warm-800 mb-4">Accesos rápidos</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Inscribirme', href: '/portal/inscripcion', icon: '🎨', color: 'bg-lemon-100' },
                        { label: 'Clase Única', href: '/portal/inscripcion?type=single-class', icon: '✨', color: 'bg-purple-100' },
                        { label: 'Mis Pagos', href: '/portal/pagos', icon: '💳', color: 'bg-green-100' },
                        { label: 'Mi calendario', href: '/portal/calendario', icon: '📅', color: 'bg-blue-100' },
                    ].map((action: any, index: number) => (
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
        </div >
    )
}

