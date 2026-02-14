import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import PlacementCard from '@/components/portal/PlacementCard'
import PendingPaymentCard from '@/components/portal/PendingPaymentCard'
import { startOfMonth, subDays } from 'date-fns'

const DAYS_MAP: Record<string, number> = {
    'DOMINGO': 0, 'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5, 'SABADO': 6
}

export const dynamic = 'force-dynamic'

export default async function PortalDashboard({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedSearchParams = await searchParams
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return null

    const now = new Date()
    const last30Days = subDays(now, 30)

    const [students, notificaciones] = await Promise.all([
        prisma.alumno.findMany({
            where: {
                usuarioId: session.user.id,
                OR: [
                    { nombre: { not: null } },
                    { perfilCompleto: true }
                ] as any
            },
            include: {
                inscripciones: {
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
        }),
        prisma.notificacion.findMany({
            where: { usuarioId: session.user.id, leida: false },
            orderBy: { fechaEnvio: 'desc' },
            take: 5
        })
    ])

    const userName = session?.user?.name?.split(' ')[0] || 'Tutor'

    // Aggregate data from all students
    const allEnrollments = (students as any[]).flatMap((s: any) =>
        (s.inscripciones as any[] || []).map((ins: any) => ({
            ...ins,
            studentName: `${(s as any).nombre || ''} ${(s as any).apellido || ''}`.trim() || 'Sin nombre'
        }))
    )

    const enrollments = allEnrollments.filter((ins: any) => ins.pagado && ins.estado === 'ACTIVA')
    const pendingEnrollments = allEnrollments.filter((ins: any) =>
        (ins.estado === 'CANCELADA' && new Date(ins.actualizadoEn) > last30Days) ||
        (!ins.pagado && ins.estado !== 'CANCELADA')
    )

    const upcomingPlacements = (students as any[]).flatMap((s: any) =>
        (s.citasNivelacion as any[] || []).map((c: any) => ({
            ...c,
            studentName: `${(s as any).nombre || ''} ${(s as any).apellido || ''}`.trim() || 'Sin nombre'
        }))
    )

    const totalObras = students.reduce((acc: number, s: any) => acc + (s.obras?.length || 0), 0)
    const totalTalleres = enrollments.length

    // Calculate Upcoming Classes (Top 5 candidates to mix with placements)
    let upcomingClasses: any[] = []

    if (enrollments.length > 0) {
        const currentDay = now.getDay()

        enrollments.forEach(ins => {
            if ((ins.fase === 'Taller de Verano' || ins.dia === 'VERANO') && ins.notas) {
                // Handle Summer Workshop
                const startDateMatch = ins.notas.match(/Inicio: (\d{4}-\d{2}-\d{2})/)
                const frequencyMatch = ins.notas.match(/Frecuencia: (\d)x/)

                if (startDateMatch) {
                    const [y, m, dNum] = startDateMatch[1].split('-').map(Number)
                    const startDate = new Date(y, m - 1, dNum)
                    const freq = frequencyMatch ? parseInt(frequencyMatch[1]) : 1

                    const endDate = new Date(startDate)
                    endDate.setDate(startDate.getDate() + (freq * 7))

                    let found = 0
                    let d = new Date(now)
                    d.setHours(0, 0, 0, 0)
                    if (d < startDate) d = new Date(startDate)

                    let checks = 0
                    while (found < 2 && checks < 60 && d < endDate) {
                        const dayOfWeek = d.getDay()
                        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                            const sessionDate = new Date(d)
                            sessionDate.setHours(17, 0, 0, 0)

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
                const diasInscripcion = (ins.dia || '').split(',').map((d: string) => d.trim().toUpperCase())
                for (const diaText of diasInscripcion) {
                    const targetDay = DAYS_MAP[diaText]
                    if (targetDay !== undefined) {
                        let daysUntil = (targetDay - currentDay + 7) % 7
                        if (ins.horario) {
                            const firstHorario = ins.horario.split('/')[0].trim()
                            const [startHour] = firstHorario.split('-')[0].split(':')
                            if (daysUntil === 0 && now.getHours() >= parseInt(startHour)) {
                                daysUntil = 7
                            }
                        }

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
                                taller: ins.taller.nombre,
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

    const allActivities = [
        ...upcomingPlacements.map((p: any) => ({
            type: 'placement' as const,
            id: p.id,
            cita: p,
            date: p.fecha,
            studentName: (p as any).studentName
        })),
        ...upcomingClasses
    ].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 2)

    const estadisticas = [
        { label: 'Talleres activos', value: totalTalleres.toString(), icon: '📚' },
        { label: 'Obras creadas', value: totalObras.toString(), icon: '🎨' },
        { label: 'Alumnos', value: students.length.toString(), icon: '👥' },
        { label: 'Estado cuenta', value: pendingEnrollments.length > 0 ? 'Pendiente' : 'Al día', icon: '💳' },
    ]

    return (
        <div className="space-y-8 animate-fade-in">
            {resolvedSearchParams.inscripcion === 'exitosa' && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">✨</div>
                    <div>
                        <h3 className="font-bold">¡Inscripción registrada con éxito!</h3>
                        <p className="text-sm">Tu orden de pago ha sido generada. Podés verla abajo para completar la inscripción.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">¡Hola, {userName}! 👋</h1>
                    <p className="text-warm-500 mt-1">Bienvenido a tu portal del Taller Limoné</p>
                </div>
                <Link href="/portal/inscripcion" className="btn-primary">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {students.some(s => s.perfilCompleto) ? 'Nueva Inscripción' : 'Inscribir menor'}
                </Link>
            </div>

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

            {pendingEnrollments.length > 0 && (
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <span className="text-xl">💳</span>
                        </div>
                        <h2 className="text-lg font-semibold text-warm-800">Pagos Pendientes / Avisos</h2>
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
                                                <h3 className="text-xl font-bold text-warm-800">{activity.taller}</h3>
                                                <span className="text-xs font-bold bg-lemon-100 text-lemon-700 px-2 py-1 rounded-lg">{activity.studentName}</span>
                                            </div>
                                            <div className="space-y-2 text-warm-600">
                                                <div className="flex items-center gap-2">
                                                    <span>{activity.dia.toUpperCase()} {activity.date.getDate()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
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
                                <Link href="/portal/inscripcion" className="text-lemon-600 font-medium hover:underline">Inscribite a un taller ahora →</Link>
                            </div>
                        )}
                    </div>
                </div>

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
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="text-lg font-semibold text-warm-800 mb-4">Accesos rápidos</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Inscribirme', href: '/portal/inscripcion', icon: '🎨', color: 'bg-lemon-100' },
                        { label: 'Clase Única', href: '/portal/inscripcion?type=single-class', icon: '✨', color: 'bg-purple-100' },
                        { label: 'Mis Pagos', href: '/portal/pagos', icon: '💳', color: 'bg-green-100' },
                        { label: 'Mi calendario', href: '/portal/calendario', icon: '📅', color: 'bg-blue-100' },
                    ].map((action: any, index: number) => (
                        <Link key={index} href={action.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-canvas-200 hover:border-lemon-300 hover:shadow-soft transition-all">
                            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-2xl`}>{action.icon}</div>
                            <span className="text-sm font-medium text-warm-700">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
