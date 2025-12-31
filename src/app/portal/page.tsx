import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import prisma from '@/lib/prisma'

const DAYS_MAP: Record<string, number> = {
    'DOMINGO': 0, 'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5, 'SABADO': 6
}

export default async function PortalDashboard() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return null

    const student = await prisma.alumno.findUnique({
        where: { usuarioId: session.user.id },
        include: {
            inscripciones: {
                where: { pagado: true, estado: 'ACTIVA' },
                include: { taller: true }
            },
            asistencias: true,
            obras: true
        }
    })

    const userName = session?.user?.name?.split(' ')[0] || 'Alumno'
    const enrollments = student?.inscripciones || []

    // Calculate Next Class
    let nextClass = null
    if (enrollments.length > 0) {
        const now = new Date()
        const currentDay = now.getDay()

        const sortedClasses = enrollments.map(ins => {
            const targetDay = DAYS_MAP[ins.dia || ''] || 0
            let daysUntil = (targetDay - currentDay + 7) % 7

            // If it's today but the hour passed, go to next week
            if (daysUntil === 0) {
                const [startHour] = (ins.horario || '00:00').split(':')
                if (now.getHours() >= parseInt(startHour)) {
                    daysUntil = 7
                }
            }

            const classDate = new Date(now)
            classDate.setDate(now.getDate() + daysUntil)
            return {
                taller: ins.taller.nombre,
                dia: ins.dia,
                horario: ins.horario,
                date: classDate
            }
        }).sort((a, b) => a.date.getTime() - b.date.getTime())

        nextClass = sortedClasses[0]
    }

    const estadisticas = [
        { label: 'Talleres activos', value: enrollments.length.toString(), icon: '📚' },
        { label: 'Asistencia', value: student?.asistencias.length ? '100%' : '0%', icon: '✅' },
        { label: 'Obras creadas', value: student?.obras.length.toString() || '0', icon: '🎨' },
        { label: 'Estado cuenta', value: 'Al día', icon: '💳' },
    ]

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
                <Link href="/portal/inscripcion" className="btn-primary">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Inscripción
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

                    {nextClass ? (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-lemon-50 to-leaf-50 border border-lemon-100">
                            <h3 className="text-xl font-bold text-warm-800 mb-2">
                                {nextClass.taller}
                            </h3>
                            <div className="space-y-2 text-warm-600">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{nextClass.dia} {nextClass.date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{nextClass.horario}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Link
                                    href="/portal/calendario"
                                    className="flex-1 py-2 px-4 bg-lemon-500 text-warm-800 rounded-lg text-sm font-medium hover:bg-lemon-600 transition-colors text-center"
                                >
                                    Ver mi calendario
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center border-2 border-dashed border-canvas-200 rounded-xl">
                            <p className="text-warm-400 mb-4">No tenés clases programadas</p>
                            <Link href="/portal/inscripcion" className="text-lemon-600 font-medium hover:underline">
                                Inscribite a un taller ahora →
                            </Link>
                        </div>
                    )}
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
                        <div className="p-4 rounded-xl border bg-canvas-50 border-canvas-200">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h4 className="font-medium text-warm-800">¡Bienvenido al portal!</h4>
                                    <p className="text-sm text-warm-500 mt-1">Desde acá podrás gestionar tus inscripciones y seguir tu progreso artístico.</p>
                                </div>
                                <span className="text-xs text-warm-400 whitespace-nowrap">Hoy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-lg font-semibold text-warm-800 mb-4">Accesos rápidos</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Inscribirme', href: '/portal/inscripcion', icon: '🎨', color: 'bg-lemon-100' },
                        { label: 'Mis Pagos', href: '/portal/pagos', icon: '💳', color: 'bg-green-100' },
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

