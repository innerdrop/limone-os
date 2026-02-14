'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Días de la semana en español
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

interface Clase {
    id: string
    fecha: string | Date
    taller: string
    hora: string
    estado: string
}

export default function CalendarioPage() {
    const [fechaActual, setFechaActual] = useState(new Date())
    const [clases, setClases] = useState<Clase[]>([])
    const [loading, setLoading] = useState(true)
    const [claseSeleccionada, setClaseSeleccionada] = useState<Clase | null>(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetch('/api/portal/calendario')
            .then(res => res.json())
            .then(data => {
                // Convert string dates to Date objects
                const formatted = data.classes.map((c: any) => ({
                    ...c,
                    fecha: new Date(c.fecha),
                    taller: c.tipo === 'nivelacion' || c.tipo === 'verano' ? c.taller : 'Taller de Arte'
                }))
                setClases(formatted)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0)
    const diasEnMes = ultimoDiaMes.getDate()
    const primerDiaSemana = primerDiaMes.getDay()

    const mesAnterior = () => {
        setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1))
    }

    const mesSiguiente = () => {
        setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1))
    }

    const getClasesDelDia = (dia: number) => {
        return clases.filter(clase => {
            const f = new Date(clase.fecha)
            return f.getDate() === dia &&
                f.getMonth() === fechaActual.getMonth() &&
                f.getFullYear() === fechaActual.getFullYear()
        })
    }

    const handleAvisarInasistencia = (clase: Clase) => {
        setClaseSeleccionada(clase)
        setShowModal(true)
    }

    if (loading) return <div className="p-8 text-center">Cargando calendario...</div>

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Mi Calendario
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Visualizá tus clases programadas
                    </p>
                </div>
            </div>

            {/* Calendar Card */}
            <div className="card">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={mesAnterior}
                        className="p-2 rounded-lg hover:bg-canvas-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-semibold text-warm-800">
                        {meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
                    </h2>
                    <button
                        onClick={mesSiguiente}
                        className="p-2 rounded-lg hover:bg-canvas-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Day Headers */}
                    {diasSemana.map((dia: string) => (
                        <div key={dia} className="text-center text-sm font-medium text-warm-500 py-2">
                            {dia}
                        </div>
                    ))}

                    {/* Empty cells before first day */}
                    {Array.from({ length: primerDiaSemana }).map((_: any, index: number) => (
                        <div key={`empty-${index}`} className="aspect-square p-1" />
                    ))}

                    {/* Day cells */}
                    {Array.from({ length: diasEnMes }).map((_: any, index: number) => {
                        const dia = index + 1
                        const clasesDelDia = getClasesDelDia(dia)
                        const esHoy =
                            dia === new Date().getDate() &&
                            fechaActual.getMonth() === new Date().getMonth() &&
                            fechaActual.getFullYear() === new Date().getFullYear()

                        const tieneClases = clasesDelDia.length > 0

                        return (
                            <div
                                key={dia}
                                className={`min-h-[60px] sm:aspect-square p-1 rounded-xl border transition-all overflow-hidden flex flex-col ${esHoy
                                    ? 'border-lemon-400 bg-lemon-50 ring-2 ring-lemon-200 ring-inset'
                                    : tieneClases
                                        ? 'border-warm-100 bg-white shadow-soft ring-1 ring-warm-50 sm:ring-0 active:bg-lemon-50 transition-colors'
                                        : 'border-transparent hover:border-canvas-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1 px-1">
                                    <span className={`text-xs sm:text-sm font-bold ${esHoy ? 'text-lemon-700 bg-lemon-200/50 w-6 h-6 rounded-full flex items-center justify-center' : 'text-warm-600'
                                        }`}>
                                        {dia}
                                    </span>
                                    {tieneClases && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-lemon-500 sm:hidden animate-pulse" />
                                    )}
                                </div>

                                {clasesDelDia.length > 0 && (
                                    <div className="flex-1 space-y-0.5 overflow-y-auto no-scrollbar">
                                        {clasesDelDia.slice(0, 3).map((clase: any) => (
                                            <button
                                                key={clase.id}
                                                onClick={() => clase.tipo !== 'nivelacion' && handleAvisarInasistencia(clase)}
                                                disabled={clase.tipo === 'nivelacion'}
                                                className={`w-full text-[9px] sm:text-[10px] px-1.5 py-1 rounded-lg truncate text-left border shadow-sm transition-all active:scale-95 ${clase.tipo === 'nivelacion'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-100 font-bold'
                                                    : clase.tipo === 'verano'
                                                        ? 'bg-orange-50 text-orange-700 border-orange-100 font-bold'
                                                        : clase.tipo === 'extra'
                                                            ? 'bg-purple-50 text-purple-700 border-purple-100 font-bold'
                                                            : clase.estado === 'completada'
                                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                                : clase.estado === 'ausente'
                                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                                    : 'bg-lemon-50 text-lemon-800 border-lemon-200 hover:bg-lemon-100'
                                                    }`}
                                            >
                                                <span className="opacity-70 font-bold mr-1">{clase.hora}</span>
                                                <span className="hidden sm:inline">{clase.taller}</span>
                                                <span className="sm:hidden">{clase.tipo === 'extra' ? '✨' : (clase.tipo === 'verano' ? '☀️' : '🎨')}</span>
                                            </button>
                                        ))}
                                        {clasesDelDia.length > 3 && (
                                            <div className="text-[8px] text-center text-warm-400 font-bold">+{clasesDelDia.length - 3}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-canvas-200 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded bg-lemon-100 border border-lemon-300" />
                        <span className="text-warm-600">Programada</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
                        <span className="text-warm-600">Asistió</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded bg-purple-100 border border-purple-300" />
                        <span className="text-warm-600">Clase Extra</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-lemon-500" />
                        <span className="text-warm-600">Tiene talleres</span>
                    </div>
                </div>
            </div>

            {/* Próximas Clases List */}
            <div className="card">
                <h3 className="text-lg font-semibold text-warm-800 mb-4">Próximas Clases</h3>
                <div className="space-y-3">
                    {clases
                        .filter(c => new Date(c.fecha) >= new Date() && (c.estado === 'programada' || c.estado === 'pendiente'))
                        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                        .slice(0, 5)
                        .map((clase: any) => {
                            const f = new Date(clase.fecha)
                            const isNivelacion = clase.tipo === 'nivelacion'
                            return (
                                <div key={clase.id} className="flex items-center justify-between p-4 rounded-xl bg-canvas-50 border border-canvas-200">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${isNivelacion ? 'bg-blue-100 text-blue-700' : 'bg-lemon-100 text-lemon-700'}`}>
                                            <span className={`text-xs font-medium ${isNivelacion ? 'text-blue-600' : 'text-lemon-600'}`}>
                                                {f.toLocaleDateString('es-AR', { weekday: 'short' })}
                                            </span>
                                            <span className="text-lg font-bold">
                                                {f.getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-warm-800">{clase.taller}</h4>
                                            <p className="text-sm text-warm-500">{clase.hora} hs</p>
                                        </div>
                                    </div>
                                    {!isNivelacion && (
                                        <button
                                            onClick={() => handleAvisarInasistencia(clase)}
                                            className="px-4 py-2 text-sm font-medium text-warm-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            Avisar inasistencia
                                        </button>
                                    )}
                                    {isNivelacion && (
                                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                            Nivelación
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                </div>
            </div>

            {/* Modal Avisar Inasistencia */}
            {showModal && claseSeleccionada && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-slide-up">
                        <h3 className="text-xl font-semibold text-warm-800 mb-4">
                            Avisar Inasistencia
                        </h3>
                        <p className="text-warm-600 mb-4">
                            ¿Estás seguro que querés avisar que no podrás asistir a la clase de{' '}
                            <strong>{claseSeleccionada.taller}</strong> del día{' '}
                            <strong>{new Date(claseSeleccionada.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>?
                        </p>

                        <div className="mb-4">
                            <label className="label">Motivo (opcional)</label>
                            <textarea
                                className="input-field min-h-[80px] resize-none"
                                placeholder="Contanos por qué no podés asistir..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 px-4 border border-canvas-300 text-warm-600 rounded-xl font-medium hover:bg-canvas-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    const motivo = (document.querySelector('textarea') as HTMLTextAreaElement).value;
                                    try {
                                        const res = await fetch('/api/portal/inasistencia', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                classId: claseSeleccionada.id,
                                                motivo,
                                                fechaClase: claseSeleccionada.fecha
                                            })
                                        });
                                        if (res.ok) {
                                            alert('¡Aviso enviado! Natalia será notificada.');
                                            setShowModal(false);
                                        } else {
                                            alert('Error al enviar el aviso.');
                                        }
                                    } catch (err) {
                                        alert('Error de conexión.');
                                    }
                                }}
                                className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

