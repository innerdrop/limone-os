'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import SignatureCanvas from 'react-signature-canvas'

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']
const HORARIOS = [
    { label: '16:00 a 17:20', value: '16:00-17:20' },
    { label: '17:30 a 18:50', value: '17:30-18:50' },
    { label: '19:10 a 20:30', value: '19:10-20:30' }
]

export default function ClaseUnicaPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [precio, setPrecio] = useState(15000)

    // Student selection
    const [existingStudents, setExistingStudents] = useState<any[]>([])
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
    const [step, setStep] = useState(-2) // -2: select student, 1: select schedule, 2: confirm

    // Schedule selection
    const [selectedDia, setSelectedDia] = useState('')
    const [selectedHorario, setSelectedHorario] = useState('')
    const [selectedAsiento, setSelectedAsiento] = useState<number | null>(null)
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([])

    // Load students and price
    useEffect(() => {
        setLoading(true)
        Promise.all([
            fetch('/api/portal/perfil').then(res => res.json()),
            fetch('/api/admin/precios').then(res => res.json()).catch(() => ({ precio_clase_unica: 15000 }))
        ])
            .then(([perfilData, preciosData]) => {
                const alumnos = perfilData.students || []
                setExistingStudents(alumnos)
                setPrecio(preciosData.precio_clase_unica || 15000)

                if (alumnos.length === 0) {
                    setError('Debes completar el perfil de al menos un alumno antes de inscribirte.')
                }
            })
            .catch(() => {
                setError('Error al cargar datos')
            })
            .finally(() => setLoading(false))
    }, [])

    // Load availability when day/time selected
    useEffect(() => {
        if (selectedDia && selectedHorario) {
            setLoading(true)
            fetch(`/api/portal/inscripcion/disponibilidad?dia=${selectedDia}&horario=${selectedHorario}`)
                .then(res => res.json())
                .then(data => {
                    setOccupiedSeats(data.occupiedSeats || [])
                })
                .catch(err => console.error('Error fetching availability:', err))
                .finally(() => setLoading(false))
        }
    }, [selectedDia, selectedHorario])

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/portal/inscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'single-class',
                    studentId: selectedStudentId,
                    dia: selectedDia,
                    horario: selectedHorario,
                    asiento: selectedAsiento
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Error al procesar la inscripción')
            }

            const data = await response.json()

            // Redirect to WhatsApp or success page
            if (data.whatsappUrl) {
                window.location.href = data.whatsappUrl
            } else {
                router.push('/portal?inscripcion=exitosa')
            }
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    if (loading && existingStudents.length === 0) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 animate-fade-in pb-24">
            <header className="text-center space-y-2">
                <h1 className="text-4xl font-serif font-black text-warm-900 tracking-tight">
                    Clase Única
                </h1>
                <p className="text-warm-500 text-lg">
                    Inscribite para una clase individual de arte
                </p>
            </header>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                    <span className="text-xl">⚠️</span>
                    <div>{error}</div>
                </div>
            )}

            <main>
                {/* Step -2: Select Student */}
                {step === -2 && (
                    <div className="card max-w-2xl mx-auto space-y-8 animate-slide-up">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-warm-800">¿Quién asistirá a la clase?</h2>
                            <p className="text-warm-500">Seleccioná uno de tus hijos.</p>
                        </div>

                        <div className="grid gap-4">
                            {existingStudents.map((s: any) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setSelectedStudentId(s.id)
                                        setStep(1)
                                    }}
                                    className="p-4 rounded-xl border-2 border-canvas-200 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                                            👤
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-warm-800">{s.nombre} {s.apellido}</p>
                                            <p className="text-sm text-warm-500">{s.edad} años</p>
                                        </div>
                                    </div>
                                    <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">Elegir →</span>
                                </button>
                            ))}

                            <button
                                onClick={() => router.push('/portal/inscripcion?type=single-class')}
                                className="p-4 rounded-xl border-2 border-dashed border-canvas-200 hover:border-leaf-400 hover:bg-leaf-50 transition-all flex items-center gap-4 group text-left"
                            >
                                <div className="w-12 h-12 rounded-full bg-leaf-100 flex items-center justify-center text-xl text-leaf-600">
                                    +
                                </div>
                                <div>
                                    <p className="font-bold text-warm-800">Inscribir a otro niño/a</p>
                                    <p className="text-sm text-warm-500">Agregar un nuevo perfil a tu cuenta</p>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={() => router.push('/portal')}
                            className="w-full py-3 border border-canvas-300 rounded-xl text-warm-600 font-medium hover:bg-canvas-50"
                        >
                            Volver al Portal
                        </button>
                    </div>
                )}

                {/* Step 1: Select Schedule */}
                {step === 1 && (
                    <div className="card max-w-2xl mx-auto space-y-8 animate-slide-up">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-warm-800">Elegí día y horario</h2>
                            <p className="text-warm-500">Seleccioná cuándo querés asistir a la clase</p>
                        </div>

                        {/* Day Selection */}
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">Día de la semana</label>
                            <div className="flex flex-wrap gap-2">
                                {DIAS.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setSelectedDia(d)}
                                        className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${selectedDia === d ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white border-warm-100 text-warm-600'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Selection */}
                        {selectedDia && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-bold text-warm-700 mb-2">Horario</label>
                                <div className="flex flex-wrap gap-2">
                                    {HORARIOS.map(h => (
                                        <button
                                            key={h.value}
                                            onClick={() => setSelectedHorario(h.value)}
                                            className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${selectedHorario === h.value ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white border-warm-100 text-warm-600'}`}
                                        >
                                            {h.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Seat Selection */}
                        {selectedDia && selectedHorario && (
                            <div className="animate-fade-in space-y-4">
                                <div className="text-center"><p className="text-sm font-bold text-warm-500">Elegí tu asiento</p></div>
                                <div className="flex flex-wrap justify-center gap-4 bg-warm-50 p-6 rounded-3xl border-2 border-warm-100">
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
                                        const occupied = occupiedSeats.includes(num)
                                        return (
                                            <button
                                                key={num}
                                                disabled={occupied}
                                                onClick={() => setSelectedAsiento(num)}
                                                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all ${occupied ? 'bg-warm-200 border-warm-300 text-warm-400 cursor-not-allowed' : selectedAsiento === num ? 'bg-purple-500 border-purple-500 text-white scale-110' : 'bg-white border-warm-200 text-warm-600 hover:border-purple-400'}`}
                                            >
                                                {num}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Price Display */}
                        {selectedDia && selectedHorario && selectedAsiento && (
                            <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-warm-700 font-bold">Precio de la Clase Única:</span>
                                    <span className="text-2xl font-black text-purple-600">${precio.toLocaleString('es-AR')}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(-2)}
                                className="px-6 py-3 border border-canvas-300 rounded-xl text-warm-600 font-medium hover:bg-canvas-50"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedStudentId || !selectedDia || !selectedHorario || !selectedAsiento || loading}
                                className="flex-1 py-3 bg-purple-600 text-white font-black rounded-xl disabled:opacity-50 hover:bg-purple-700 transition-colors"
                            >
                                {loading ? 'Procesando...' : 'Confirmar Inscripción'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
