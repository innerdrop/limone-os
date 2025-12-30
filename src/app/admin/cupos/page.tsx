import Link from 'next/link'

// Datos de ejemplo
const talleres = [
    { id: 1, nombre: 'Pintura al Óleo', cupoMaximo: 8, inscritos: 8, horario: 'Lun y Mié 18:00', precio: 28000 },
    { id: 2, nombre: 'Acuarela Creativa', cupoMaximo: 10, inscritos: 7, horario: 'Mar y Jue 16:00', precio: 25000 },
    { id: 3, nombre: 'Dibujo Artístico', cupoMaximo: 12, inscritos: 11, horario: 'Vie 17:00', precio: 22000 },
    { id: 4, nombre: 'Técnicas Mixtas', cupoMaximo: 8, inscritos: 8, horario: 'Sáb 10:00', precio: 28000 },
]

export default function CuposPage() {
    const totalCupos = talleres.reduce((sum, t) => sum + t.cupoMaximo, 0)
    const totalInscritos = talleres.reduce((sum, t) => sum + t.inscritos, 0)
    const cuposDisponibles = totalCupos - totalInscritos

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Control de Cupos
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Visualización en tiempo real de la ocupación de cada taller
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-6 text-center">
                    <p className="text-4xl font-bold text-warm-800">{totalInscritos}</p>
                    <p className="text-warm-500">Alumnos inscritos</p>
                </div>
                <div className="card p-6 text-center">
                    <p className="text-4xl font-bold text-lemon-600">{cuposDisponibles}</p>
                    <p className="text-warm-500">Cupos disponibles</p>
                </div>
                <div className="card p-6 text-center">
                    <p className="text-4xl font-bold text-leaf-600">{Math.round((totalInscritos / totalCupos) * 100)}%</p>
                    <p className="text-warm-500">Ocupación total</p>
                </div>
            </div>

            {/* Capacity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {talleres.map((taller) => {
                    const ocupacion = (taller.inscritos / taller.cupoMaximo) * 100
                    const disponibles = taller.cupoMaximo - taller.inscritos

                    return (
                        <div key={taller.id} className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-warm-800">{taller.nombre}</h3>
                                    <p className="text-sm text-warm-500">{taller.horario}</p>
                                </div>
                                <span className={`badge ${disponibles === 0 ? 'badge-error' :
                                        disponibles <= 2 ? 'badge-warning' : 'badge-success'
                                    }`}>
                                    {disponibles === 0 ? 'Lleno' : `${disponibles} cupos`}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-warm-600">{taller.inscritos} / {taller.cupoMaximo} alumnos</span>
                                    <span className="font-medium text-warm-800">{Math.round(ocupacion)}%</span>
                                </div>
                                <div className="h-3 bg-canvas-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${ocupacion >= 100 ? 'bg-red-500' :
                                                ocupacion >= 80 ? 'bg-amber-500' : 'bg-leaf-500'
                                            }`}
                                        style={{ width: `${Math.min(ocupacion, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-canvas-200">
                                <span className="text-sm text-warm-500">
                                    ${taller.precio.toLocaleString('es-AR')}/mes
                                </span>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/talleres/${taller.id}`}
                                        className="text-sm text-lemon-600 hover:text-lemon-700 font-medium"
                                    >
                                        Ver alumnos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Quick Info */}
            <div className="card p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm text-warm-500">Leyenda:</span>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-leaf-500" />
                        <span className="text-sm text-warm-600">Disponible (&lt;80%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-500" />
                        <span className="text-sm text-warm-600">Casi lleno (80-99%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span className="text-sm text-warm-600">Lleno (100%)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
