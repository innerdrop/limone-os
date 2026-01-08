'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegistrarPagoManual() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [busquedaAlumno, setBusquedaAlumno] = useState('')
    const [alumnos, setAlumnos] = useState<any[]>([])
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<any>(null)
    const [inscripciones, setInscripciones] = useState<any[]>([])
    const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState<string>('')
    const [monto, setMonto] = useState<number>(0)
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])

    // Search students
    useEffect(() => {
        if (busquedaAlumno.length > 2) {
            const delayDebounceFn = setTimeout(async () => {
                const res = await fetch(`/api/admin/alumnos?busqueda=${busquedaAlumno}`)
                if (res.ok) {
                    const data = await res.json()
                    setAlumnos(data.alumnos || [])
                }
            }, 300)
            return () => clearTimeout(delayDebounceFn)
        } else {
            setAlumnos([])
        }
    }, [busquedaAlumno])

    // Fetch enrollments when student is selected
    useEffect(() => {
        if (alumnoSeleccionado) {
            fetch(`/api/admin/inscripciones?alumnoId=${alumnoSeleccionado.id}&pagado=false`)
                .then(res => res.json())
                .then(data => {
                    setInscripciones(data || [])
                    if (data.length > 0) {
                        setInscripcionSeleccionada(data[0].id)
                        setMonto(data[0].taller.precio)
                    }
                })
        }
    }, [alumnoSeleccionado])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!alumnoSeleccionado || !inscripcionSeleccionada) return

        setLoading(true)
        try {
            const res = await fetch('/api/admin/pagos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alumnoId: alumnoSeleccionado.id,
                    inscripcionId: inscripcionSeleccionada,
                    monto: Number(monto),
                    fecha: new Date(fecha),
                    metodo: 'MANUAL',
                    mes: new Date(fecha).getMonth() + 1,
                    anio: new Date(fecha).getFullYear()
                })
            })

            if (res.ok) {
                setIsOpen(false)
                resetForm()
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setAlumnoSeleccionado(null)
        setBusquedaAlumno('')
        setInscripciones([])
        setInscripcionSeleccionada('')
        setMonto(0)
    }

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="btn-primary">
                Registrar Pago Manual
            </button>
        )
    }

    return (
        <div className="fixed inset-0 bg-warm-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-slide-in">
                <div className="p-6 border-b border-canvas-100 flex justify-between items-center">
                    <h3 className="text-xl font-serif font-bold text-warm-800 italic">Registrar Pago Manual</h3>
                    <button onClick={() => setIsOpen(false)} className="text-warm-400 hover:text-warm-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Alumno Search */}
                    <div>
                        <label className="label">Buscar Alumno</label>
                        {!alumnoSeleccionado ? (
                            <div className="relative">
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Nombre del alumno..."
                                    value={busquedaAlumno}
                                    onChange={(e) => setBusquedaAlumno(e.target.value)}
                                />
                                {alumnos.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-canvas-200 rounded-lg shadow-lg mt-1 z-10 max-h-48 overflow-y-auto">
                                        {alumnos.map(a => (
                                            <button
                                                key={a.id}
                                                type="button"
                                                onClick={() => setAlumnoSeleccionado(a)}
                                                className="w-full text-left px-4 py-2 hover:bg-canvas-50 text-sm italic"
                                            >
                                                {a.usuario.nombre} ({a.usuario.email})
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-lemon-50 border border-lemon-200 rounded-lg italic font-bold text-warm-800">
                                <div>
                                    <div className="text-sm">{alumnoSeleccionado.usuario.nombre}</div>
                                    <div className="text-[10px] text-warm-500">{alumnoSeleccionado.usuario.email}</div>
                                </div>
                                <button type="button" onClick={() => setAlumnoSeleccionado(null)} className="text-xs text-warm-500 underline">Cambiar</button>
                            </div>
                        )}
                    </div>

                    {alumnoSeleccionado && (
                        <>
                            <div>
                                <label className="label">Inscripción / Taller</label>
                                <select
                                    className="input-field italic"
                                    value={inscripcionSeleccionada}
                                    onChange={(e) => {
                                        setInscripcionSeleccionada(e.target.value)
                                        const ins = inscripciones.find(i => i.id === e.target.value)
                                        if (ins) setMonto(ins.taller.precio)
                                    }}
                                    required
                                >
                                    <option value="">Seleccionar Taller...</option>
                                    {inscripciones.length > 0 ? inscripciones.map(i => (
                                        <option key={i.id} value={i.id}>
                                            {i.taller.nombre} - {i.taller.diasSemana}
                                        </option>
                                    )) : (
                                        <option value="" disabled>No hay inscripciones pendientes</option>
                                    )}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Monto</label>
                                    <input
                                        type="number"
                                        className="input-field italic"
                                        value={monto}
                                        onChange={(e) => setMonto(Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Fecha</label>
                                    <input
                                        type="date"
                                        className="input-field italic"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="btn-outline flex-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !inscripcionSeleccionada}
                                    className="btn-primary flex-1"
                                >
                                    {loading ? 'Procesando...' : 'Confirmar Pago'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    )
}
