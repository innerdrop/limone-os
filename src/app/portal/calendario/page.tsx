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
                    taller: c.tipo === 'nivelacion' ? c.taller : 'Taller de Arte'
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
                    {diasSemana.map((dia) => (
                        <div key={dia} className="text-center text-sm font-medium text-warm-500 py-2">
                            {dia}
                        </div>
                    ))}

                    {/* Empty cells before first day */}
                    {Array.from({ length: primerDiaSemana }).map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square p-1" />
                    ))}

                    {/* Day cells */}
                    {Array.from({ length: diasEnMes }).map((_, index) => {
                        const dia = index + 1
                        const clasesDelDia = getClasesDelDia(dia)
                        const esHoy =
                            dia === new Date().getDate() &&
                            fechaActual.getMonth() === new Date().getMonth() &&
                            fechaActual.getFullYear() === new Date().getFullYear()

                        return (
                            <div
                                key={dia}
                                className={`aspect-square p-1 rounded-lg border transition-all overflow-hidden ${esHoy
                                    ? 'border-lemon-400 bg-lemon-50'
                                    : 'border-transparent hover:border-canvas-200'
                                    }`}
                            >
                                <div className={`text-sm font-medium ${esHoy ? 'text-lemon-700' : 'text-warm-600'}`}>
                                    {dia}
                                </div>
                                {clasesDelDia.length > 0 && (
                                    <div className="mt-1 space-y-0.5">
                                        {clasesDelDia.slice(0, 3).map((clase: any) => (
                                            <button
                                                key={clase.id}
                                                onClick={() => clase.tipo !== 'nivelacion' && handleAvisarInasistencia(clase)}
                                                disabled={clase.tipo === 'nivelacion'}
                                                className={`w-full text-[10px] sm:text-xs px-1 py-0.5 rounded truncate text-left ${clase.tipo === 'nivelacion'
                                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                                    : clase.estado === 'completada'
                                                        ? 'bg-green-100 text-green-700'
                                                        : clase.estado === 'ausente'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-lemon-100 text-lemon-700 hover:bg-lemon-200'
                                                    }`}
                                            >
                                                {clase.hora} {clase.taller}
                                            </button>
                                        ))}
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
                        <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
                        <span className="text-warm-600">Ausente</span>
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
                                onClick={() => {
                                    alert('¡Aviso enviado! Natalia será notificada.')
                                    setShowModal(false)
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

