'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Credito {
    id: string
    motivo: string | null
    usado: boolean
    fechaProgramada: string | null
    horarioProgramado: string | null
    alumno: {
        nombre: string
        apellido: string
        inscripciones?: any[]
    }
    taller: {
        id: string
        nombre: string
        horarios: any
        diasSemana: string
    } | null
}

const DIAS_MAP: Record<number, string> = {
    0: 'DOMINGO', 1: 'LUNES', 2: 'MARTES', 3: 'MIERCOLES', 4: 'JUEVES', 5: 'VIERNES', 6: 'SABADO'
}

const DEFAULT_HORARIOS = [
    { label: '16:00 a 17:20', value: '16:00-17:20' },
    { label: '17:30 a 18:50', value: '17:30-18:50' },
    { label: '19:10 a 20:30', value: '19:10-20:30' }
]

function normalizeDay(str: string) {
    return str.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/I/g, "I"); // Simple MIERCOLES/MIÉRCOLES fix
}

export default function ClasesExtraPage() {
    const [creditos, setCreditos] = useState<Credito[]>([])
    const [diasNoLaborables, setDiasNoLaborables] = useState<any[]>([])
    const [talleres, setTalleres] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCred, setSelectedCred] = useState<Credito | null>(null)
    const [fecha, setFecha] = useState('')
    const [horario, setHorario] = useState('')
    const [processing, setProcessing] = useState(false)
    const [errorFecha, setErrorFecha] = useState<string | null>(null)
    const [horariosDisponibles, setHorariosDisponibles] = useState<any[]>([])

    const fetchCreditos = async () => {
        try {
            const res = await fetch('/api/portal/creditos-extra')
            const data = await res.json()
            setCreditos(data.creditos || [])
            setDiasNoLaborables(data.diasNoLaborables || [])
            setTalleres(data.talleres || [])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchCreditos() }, [])

    const handleSchedule = async () => {
        if (!selectedCred || !fecha || !horario) return
        setProcessing(true)
        try {
            const res = await fetch('/api/portal/creditos-extra', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ creditoId: selectedCred.id, fecha, horario })
            })
            if (res.ok) {
                alert('¡Clase extra agendada con éxito!')
                setSelectedCred(null)
                fetchCreditos()
            }
        } finally {
            setProcessing(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-warm-500">Cargando tus créditos...</div>

    const disponibles = creditos.filter(c => !c.usado)
    const historial = creditos.filter(c => c.usado)

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-warm-900">Clases Extra Disponibles</h1>
                <p className="text-warm-500 mt-1">Acá podés agendar tus clases compensatorias por días feriados o cancelados.</p>
            </div>

            {/* Disponibles */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-warm-800">Créditos a Usar</h2>
                {disponibles.length === 0 ? (
                    <div className="card p-12 text-center text-warm-400 italic">No tenés créditos de clase extra disponibles.</div>
                ) : (
                    <div className="grid gap-4">
                        {disponibles.map(c => (
                            <div key={c.id} className="card p-6 flex items-center justify-between bg-white hover:border-lemon-400 transition-all">
                                <div>
                                    <p className="text-sm font-bold text-lemon-600 mb-1">CLASE EXTRA</p>
                                    <h3 className="font-bold text-warm-900 text-lg">Para {c.alumno.nombre}</h3>
                                    <p className="text-sm text-warm-500">{c.motivo}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedCred(c)}
                                    className="btn-primary"
                                >
                                    Agendar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Historial */}
            {historial.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-warm-800">Clases ya Agendadas</h2>
                    <div className="grid gap-4">
                        {historial.map(c => (
                            <div key={c.id} className="card p-6 bg-warm-50 border-warm-100 flex items-center justify-between opacity-80">
                                <div>
                                    <h3 className="font-bold text-warm-800">Para {c.alumno.nombre}</h3>
                                    <p className="text-xs text-warm-500">{c.motivo}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-warm-900">
                                        {(() => {
                                            const d = new Date(c.fechaProgramada!)
                                            return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
                                        })()}
                                    </p>
                                    <p className="text-xs text-warm-500">{c.horarioProgramado}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal de Agendamiento */}
            {selectedCred && (
                <div className="fixed inset-0 bg-warm-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-slide-up">
                        <button onClick={() => setSelectedCred(null)} className="float-right text-warm-400 hover:text-warm-600">✕</button>
                        <h3 className="text-2xl font-bold text-warm-900 mb-6">Agendar Clase Extra</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="label">¿Qué día venís?</label>
                                <input
                                    type="date"
                                    value={fecha}
                                    onChange={e => {
                                        const val = e.target.value
                                        setFecha(val)
                                        setHorario('')

                                        if (!val) {
                                            setErrorFecha(null)
                                            setHorariosDisponibles([])
                                            return
                                        }

                                        const [y, m, d_val] = val.split('-').map(Number)
                                        const selectedDate = new Date(y, m - 1, d_val)
                                        const dayName = DIAS_MAP[selectedDate.getDay()]

                                        // 1. Check Non-working day
                                        const dnl = diasNoLaborables.find(d =>
                                            new Date(d.fecha).toISOString().split('T')[0] === val
                                        )
                                        if (dnl) {
                                            setErrorFecha(`Ese día no hay clases: ${dnl.motivo || 'Día no laborable'}`)
                                            setHorariosDisponibles([])
                                            return
                                        }

                                        // 2. Filter logic
                                        let t = (selectedCred as any).taller
                                        if (!t && (selectedCred as any).tallerId) {
                                            t = talleres.find(tall => tall.id === (selectedCred as any).tallerId)
                                        }

                                        // Fallback 1: Guess by student's active inscriptions
                                        if (!t && selectedCred.alumno.inscripciones?.length) {
                                            const matchesDay = selectedCred.alumno.inscripciones.find(i =>
                                                normalizeDay(i.taller.diasSemana || '').includes(dayName)
                                            )
                                            t = matchesDay?.taller || selectedCred.alumno.inscripciones[0].taller
                                        }

                                        if (t) {
                                            const normalizedWorkshopDays = normalizeDay(t.diasSemana || '')
                                            const daysArray = normalizedWorkshopDays.split(/[\s,]+/).filter(Boolean)
                                            const occursOnDay = daysArray.includes(dayName)

                                            if (!occursOnDay) {
                                                setErrorFecha(`El taller "${t.nombre}" no tiene clases configuradas los días ${dayName.toLowerCase()}. Intentá con un día en que funcione el taller (ej: ${t.diasSemana}).`)
                                                setHorariosDisponibles([])
                                            } else {
                                                setErrorFecha(null)
                                                // 1. Try workshop options
                                                if (Array.isArray(t.horarios) && t.horarios.length > 0) {
                                                    setHorariosDisponibles(t.horarios)
                                                }
                                                // 2. Fallback: Use standard System blocks (the 3 blocks mentioned)
                                                else {
                                                    setHorariosDisponibles(DEFAULT_HORARIOS)
                                                }
                                            }
                                        } else {
                                            // Fallback 2: General workshops for that day
                                            const talleresEseDia = talleres.filter(w =>
                                                normalizeDay(w.diasSemana || '').split(/[\s,]+/).includes(dayName)
                                            )

                                            if (talleresEseDia.length === 0) {
                                                setErrorFecha(`No hay talleres registrados los días ${dayName.toLowerCase()}.`)
                                                setHorariosDisponibles([])
                                            } else {
                                                setErrorFecha(null)
                                                const uniqueHorarios = new Set<string>()
                                                const formattedHorarios: any[] = []
                                                talleresEseDia.forEach(w => {
                                                    const hData = w.horarios as any[] || []
                                                    hData.forEach(h => {
                                                        const key = `${h.label}-${h.value}`
                                                        if (!uniqueHorarios.has(key)) {
                                                            uniqueHorarios.add(key)
                                                            formattedHorarios.push(h)
                                                        }
                                                    })
                                                })
                                                setHorariosDisponibles(formattedHorarios)
                                            }
                                        }
                                    }}
                                    className={`input-field ${errorFecha ? 'border-red-500 ring-2 ring-red-100' : ''}`}
                                />
                                {errorFecha && (
                                    <p className="text-red-600 text-xs font-bold mt-2 flex items-center gap-1">
                                        ⚠️ {errorFecha}
                                    </p>
                                )}
                            </div>

                            {horariosDisponibles.length > 0 ? (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="label text-lemon-600">Horarios disponibles para este día</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {horariosDisponibles.map(h => (
                                            <button
                                                key={h.value}
                                                type="button"
                                                onClick={() => setHorario(h.value)}
                                                className={`px-4 py-3 text-sm font-bold rounded-2xl border-2 transition-all flex items-center justify-between ${horario === h.value ? 'bg-lemon-500 border-lemon-500 text-white shadow-lg' : 'bg-white border-canvas-200 text-warm-600 hover:border-lemon-300'}`}
                                            >
                                                <span>{h.label}</span>
                                                {horario === h.value && <span>✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : fecha && !errorFecha && (
                                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-orange-700 text-sm">
                                    No se encontraron horarios configurados para el taller los días {fecha.split('-')[2]}/{fecha.split('-')[1]}.
                                </div>
                            )}

                            <button
                                onClick={handleSchedule}
                                disabled={processing || !fecha || !horario || !!errorFecha}
                                className="w-full py-4 bg-lemon-600 text-white font-black rounded-2xl shadow-lg disabled:opacity-50 disabled:grayscale hover:bg-lemon-700 transition-all"
                            >
                                {processing ? 'Procesando...' : 'Confirmar Clase Extra'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
