import Link from 'next/link'
import prisma from '@/lib/prisma'
import DeleteWorkshopButton from '@/components/admin/DeleteWorkshopButton'

export default async function TalleresPage() {
    const talleres = await prisma.taller.findMany({
        include: {
            _count: {
                select: { inscripciones: { where: { estado: 'ACTIVA' } } }
            }
        },
        orderBy: { nombre: 'asc' }
    })

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Gestión de Talleres
                    </h1>
                    <p className="text-warm-500 mt-1">
                        {talleres.length} talleres configurados en el sistema
                    </p>
                </div>
                <button className="btn-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nuevo Taller
                </button>
            </div>

            {/* Talleres Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {talleres.map((taller) => {
                    const inscritos = taller._count.inscripciones
                    const ocupacion = (inscritos / taller.cupoMaximo) * 100

                    return (
                        <div key={taller.id} className="card flex flex-col h-full relative group/card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 pr-10">
                                    <h3 className="text-lg font-semibold text-warm-800">{taller.nombre}</h3>
                                    <p className="text-sm text-warm-500 mt-1 line-clamp-2">{taller.descripcion || 'Sin descripción'}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`badge ${taller.activo ? 'badge-success' : 'badge-warning'}`}>
                                        {taller.activo ? 'Activo' : 'Pausado'}
                                    </span>
                                    <div className="mt-1">
                                        <DeleteWorkshopButton workshopId={taller.id} workshopName={taller.nombre} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 flex-1">
                                <div className="flex items-center gap-2 text-sm text-warm-600">
                                    <svg className="w-4 h-4 text-lemon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {taller.diasSemana || 'Días no definidos'} {taller.horaInicio ? `- ${taller.horaInicio} hs` : ''}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-warm-600">
                                    <svg className="w-4 h-4 text-leaf-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Duración: {taller.duracion} min
                                </div>
                                <div className="flex items-center gap-2 text-sm text-warm-600">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatMoney(taller.precio)} / mes
                                </div>
                            </div>

                            {/* Capacity */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-warm-500">Ocupación</span>
                                    <span className="font-medium text-warm-700">{inscritos}/{taller.cupoMaximo}</span>
                                </div>
                                <div className="h-2 bg-canvas-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${ocupacion >= 100 ? 'bg-red-500' :
                                            ocupacion >= 80 ? 'bg-amber-500' : 'bg-leaf-500'
                                            }`}
                                        style={{ width: `${Math.min(ocupacion, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-canvas-200 mt-auto">
                                <Link
                                    href={`/admin/talleres/${taller.id}/alumnos`}
                                    className="flex-1 py-2 text-center text-sm font-medium text-lemon-600 hover:bg-lemon-50 rounded-lg transition-colors border border-lemon-200"
                                >
                                    Ver Alumnos
                                </Link>
                                <Link
                                    href={`/admin/talleres/${taller.id}/editar`}
                                    className="flex-1 py-2 text-center text-sm font-medium text-warm-600 hover:bg-canvas-100 rounded-lg transition-colors border border-canvas-200"
                                >
                                    Editar
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

