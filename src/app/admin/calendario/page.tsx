'use client'

import { useState, useEffect } from 'react'

interface DiaNoLaborable {
    id: string
    fecha: string
    motivo: string | null
}

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function AdminCalendarioPage() {
    const [fechaActual, setFechaActual] = useState(new Date())
    const [diasCargados, setDiasCargados] = useState<DiaNoLaborable[]>([])
    const [loading, setLoading] = useState(true)
    const [motivoTemp, setMotivoTemp] = useState('')
    const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null)
    const [isTransferEnabled, setIsTransferEnabled] = useState(false)
    const [trasladarA, setTrasladarA] = useState('')
    const [processing, setProcessing] = useState(false)
    const [sendEmail, setSendEmail] = useState(true)
    const [addCredit, setAddCredit] = useState(true)

    const fetchDias = async () => {
        try {
            const res = await fetch('/api/admin/calendario')
            const data = await res.json()
            setDiasCargados(data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchDias() }, [])

    const toggleDia = async (fecha: Date, esQuitar: boolean) => {
        setProcessing(true)
        try {
            const res = await fetch('/api/admin/calendario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha: fecha.toISOString(),
                    motivo: esQuitar ? undefined : motivoTemp,
                    esLaborable: esQuitar,
                    sendEmail: esQuitar ? false : sendEmail,
                    addCredit: esQuitar ? false : addCredit,
                    trasladarA: (isTransferEnabled && trasladarA) ? trasladarA : null
                })
            })
            if (res.ok) {
                const data = await res.json()
                if (!esQuitar) {
                    let msg = `✅ Día no laborable guardado.\n\nAlumnos afectados: ${data.affectedCount || 0}\nCorreos enviados: ${data.emailsSent || 0}`
                    if (data.creditsCreated) msg += `\nCréditos otorgados: ${data.creditsCreated}`
                    if (data.transfersCreated) msg += `\nClases trasladadas: ${data.transfersCreated}`
                    alert(msg)
                }
                await fetchDias()
                setDiaSeleccionado(null)
                setMotivoTemp('')
                setIsTransferEnabled(false)
                setTrasladarA('')
            } else {
                const data = await res.json()
                alert(data.error || 'Error al actualizar el calendario')
            }
        } catch (error) {
            console.error(error)
            alert('Error de conexión al actualizar el calendario')
        } finally {
            setProcessing(false)
        }
    }

    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0)
    const diasEnMes = ultimoDiaMes.getDate()
    const primerDiaSemana = primerDiaMes.getDay()

    const mesAnterior = () => setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1))
    const mesSiguiente = () => setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1))

    if (loading) return <div className="p-8 text-center text-warm-500">Cargando calendario...</div>

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-warm-900">Configuración Calendario</h1>
                <p className="text-warm-500 mt-1">Seleccioná los días no laborables. Esto notificará a los alumnos afectados.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Calendar Grid */}
                <div className="card">
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={mesAnterior} className="p-2 hover:bg-warm-100 rounded-lg">←</button>
                        <h2 className="text-xl font-bold text-warm-800">{meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}</h2>
                        <button onClick={mesSiguiente} className="p-2 hover:bg-warm-100 rounded-lg">→</button>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {diasSemana.map(d => <div key={d} className="text-center text-xs font-bold text-warm-400 py-2">{d}</div>)}
                        {Array.from({ length: primerDiaSemana }).map((_, i) => <div key={i} />)}
                        {Array.from({ length: diasEnMes }).map((_, i) => {
                            const dia = i + 1
                            const d = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia)
                            const isNoLaborable = diasCargados.some(x => new Date(x.fecha).toDateString() === d.toDateString())

                            return (
                                <button
                                    key={dia}
                                    onClick={() => setDiaSeleccionado(d)}
                                    className={`aspect-square p-2 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center ${isNoLaborable
                                        ? 'bg-red-50 border-red-200 text-red-600'
                                        : 'bg-white border-warm-50 text-warm-700 hover:border-lemon-300'
                                        }`}
                                >
                                    {dia}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Management Panel */}
                <div className="space-y-6">
                    {diaSeleccionado ? (
                        <div className="card p-8 animate-slide-up bg-white">
                            {diasCargados.some(x => new Date(x.fecha).toDateString() === diaSeleccionado.toDateString()) ? (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-warm-800">Día No Laborable</h3>
                                    <p className="text-warm-500">
                                        Fecha: <span className="font-bold text-warm-900">{diaSeleccionado.toLocaleDateString()}</span>
                                    </p>
                                    <p className="text-sm bg-red-50 p-4 rounded-xl text-red-700 border border-red-100">
                                        Motivo: {diasCargados.find(x => new Date(x.fecha).toDateString() === diaSeleccionado.toDateString())?.motivo || 'No especificado'}
                                    </p>
                                    <button
                                        onClick={() => toggleDia(diaSeleccionado, true)}
                                        disabled={processing}
                                        className="w-full py-4 bg-warm-100 text-warm-700 font-bold rounded-2xl hover:bg-warm-200"
                                    >
                                        Marcar como Laborable
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-warm-800">Marcar como No Laborable</h3>
                                    <p className="text-warm-500">
                                        Fecha: <span className="font-bold text-warm-900">{diaSeleccionado.toLocaleDateString()}</span>
                                    </p>
                                    <div>
                                        <label className="label">Comentario / Motivo</label>
                                        <input
                                            type="text"
                                            value={motivoTemp}
                                            onChange={e => setMotivoTemp(e.target.value)}
                                            placeholder="Ej: Feriado Nacional, Reforma..."
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-3 rounded-xl border border-warm-100 bg-canvas-50 cursor-pointer hover:bg-canvas-100 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={sendEmail}
                                                onChange={(e) => setSendEmail(e.target.checked)}
                                                className="w-5 h-5 accent-lemon-500"
                                            />
                                            <span className="text-sm font-medium text-warm-700">Enviar aviso por mail a alumnos</span>
                                        </label>

                                        <label className="flex items-center gap-3 p-3 rounded-xl border border-warm-100 bg-canvas-50 cursor-pointer hover:bg-canvas-100 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={addCredit}
                                                onChange={(e) => setAddCredit(e.target.checked)}
                                                className="w-5 h-5 accent-lemon-500"
                                            />
                                            <span className="text-sm font-medium text-warm-700">Agregar crédito de clase extra a alumnos</span>
                                        </label>

                                        <div className="space-y-2">
                                            <label className="flex items-center gap-3 p-3 rounded-xl border border-warm-100 bg-canvas-50 cursor-pointer hover:bg-canvas-100 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={isTransferEnabled}
                                                    onChange={(e) => setIsTransferEnabled(e.target.checked)}
                                                    className="w-5 h-5 accent-lemon-500"
                                                />
                                                <span className="text-sm font-medium text-warm-700">Trasladar a:</span>
                                            </label>

                                            {isTransferEnabled && (
                                                <div className="pl-8 animate-fade-in">
                                                    <input
                                                        type="date"
                                                        value={trasladarA}
                                                        onChange={(e) => setTrasladarA(e.target.value)}
                                                        className="input-field"
                                                        min={new Date().toISOString().split('T')[0]}
                                                    />
                                                    <p className="text-xs text-warm-400 mt-1 mt-1">
                                                        Los alumnos verán esta fecha en su calendario automáticamente.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleDia(diaSeleccionado, false)}
                                        disabled={processing || (isTransferEnabled && !trasladarA)}
                                        className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Confirmar No Laborable
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="card p-12 flex flex-col items-center justify-center text-center text-warm-400 italic">
                            Seleccioná un día del calendario para gestionarlo.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
