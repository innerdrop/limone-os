'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Taller {
    id: string
    nombre: string
    descripcion: string
    precio: number
    imagen?: string
}

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']
const TURNOS = [
    { label: 'Mañana (09:00 - 13:00)', value: '09:00-13:00' },
    { label: 'Tarde (14:00 - 18:00)', value: '14:00-18:00' },
    { label: 'Noche (18:00 - 22:00)', value: '18:00-22:00' }
]

export default function EnrollmentPage() {
    const router = useRouter()
    const [talleres, setTalleres] = useState<Taller[]>([])
    const [loading, setLoading] = useState(true)
    const [step, setStep] = useState(1) // 1: Seleccionar Taller, 2: Seleccionar Horario, 3: Pago

    const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null)
    const [selectedDia, setSelectedDia] = useState('')
    const [selectedTurno, setSelectedTurno] = useState('')

    const [processingPayment, setProcessingPayment] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/talleres')
            .then(res => res.json())
            .then(data => {
                setTalleres(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const handleEnroll = async () => {
        setProcessingPayment(true)
        setError('')

        try {
            const response = await fetch('/api/portal/inscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tallerId: selectedTaller?.id,
                    dia: selectedDia,
                    horario: selectedTurno
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Error al procesar la inscripción')
            }

            router.push('/portal?inscripcion=exitosa')
        } catch (err: any) {
            setError(err.message)
            setProcessingPayment(false)
        }
    }

    if (loading) return <div className="p-8 text-center">Cargando talleres...</div>

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-warm-800">Inscribirme a un Taller</h1>
                <p className="text-warm-500">Seleccioná el curso y horario que prefieras</p>
            </header>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-4 mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-lemon-500 text-white' : 'bg-warm-200 text-warm-400'
                            }`}>
                            {s}
                        </div>
                        <span className={`text-sm hidden sm:inline ${step >= s ? 'text-warm-800' : 'text-warm-400'}`}>
                            {s === 1 ? 'Taller' : s === 2 ? 'Horario' : 'Pago'}
                        </span>
                        {s < 3 && <div className={`h-1 w-8 ${step > s ? 'bg-lemon-500' : 'bg-warm-200'}`} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Seleccionar Taller */}
            {step === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                    {talleres.map((taller) => (
                        <div
                            key={taller.id}
                            className={`card p-6 cursor-pointer transition-all border-2 ${selectedTaller?.id === taller.id ? 'border-lemon-500 ring-4 ring-lemon-50' : 'border-transparent hover:border-lemon-200'
                                }`}
                            onClick={() => setSelectedTaller(taller)}
                        >
                            <h3 className="text-xl font-bold text-warm-800 mb-2">{taller.nombre}</h3>
                            <p className="text-warm-500 text-sm mb-4 line-clamp-2">{taller.descripcion}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-lemon-600 font-bold text-lg">${taller.precio}</span>
                                <button
                                    className={`btn-primary py-2 px-4 shadow-none ${selectedTaller?.id === taller.id ? '' : 'btn-outline'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTaller(taller);
                                        setStep(2);
                                    }}
                                >
                                    Seleccionar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Step 2: Seleccionar Horario */}
            {step === 2 && selectedTaller && (
                <div className="space-y-8 animate-slide-up">
                    <div className="card p-6 bg-lemon-50">
                        <h2 className="font-bold text-warm-800">Taller seleccionado: {selectedTaller.nombre}</h2>
                        <button onClick={() => setStep(1)} className="text-sm text-lemon-600 hover:underline">Cambiar taller</button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="label text-lg">1. Seleccioná el día</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                                {DIAS.map(dia => (
                                    <button
                                        key={dia}
                                        className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${selectedDia === dia ? 'bg-lemon-500 border-lemon-500 text-white' : 'bg-white border-canvas-200 hover:border-lemon-200'
                                            }`}
                                        onClick={() => setSelectedDia(dia)}
                                    >
                                        {dia}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="label text-lg">2. Seleccioná el turno (3 disponibles)</label>
                            <div className="grid gap-3 mt-4">
                                {TURNOS.map(turno => (
                                    <button
                                        key={turno.value}
                                        className={`flex items-center justify-between py-4 px-6 rounded-xl border-2 font-medium transition-all ${selectedTurno === turno.value ? 'bg-lemon-500 border-lemon-500 text-white' : 'bg-white border-canvas-200 hover:border-lemon-200'
                                            }`}
                                        onClick={() => setSelectedTurno(turno.value)}
                                    >
                                        <span>{turno.label}</span>
                                        {selectedTurno === turno.value && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t">
                        <button onClick={() => setStep(1)} className="btn-outline">Anterior</button>
                        <button
                            disabled={!selectedDia || !selectedTurno}
                            onClick={() => setStep(3)}
                            className="btn-primary"
                        >
                            Continuar al Pago
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Pago */}
            {step === 3 && selectedTaller && (
                <div className="max-w-md mx-auto space-y-6 animate-scale-up">
                    <div className="card overflow-hidden">
                        <div className="bg-warm-800 p-6 text-white">
                            <h2 className="text-xl font-bold">Resumen de Inscripción</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <div>
                                    <p className="text-sm text-warm-400 uppercase tracking-wide">Taller</p>
                                    <p className="font-bold text-warm-800">{selectedTaller.nombre}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b">
                                <div>
                                    <p className="text-sm text-warm-400 uppercase tracking-wide">Día y Turno</p>
                                    <p className="font-bold text-warm-800">{selectedDia} - {selectedTurno}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-bold text-warm-800">Total a Pagar</span>
                                <span className="text-3xl font-bold text-lemon-600">${selectedTaller.precio}</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={handleEnroll}
                            disabled={processingPayment}
                            className={`w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 ${processingPayment ? 'opacity-70' : ''}`}
                        >
                            {processingPayment ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Simular Pago y Confirmar
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            disabled={processingPayment}
                            className="w-full btn-outline py-3"
                        >
                            Volver
                        </button>
                    </div>

                    <p className="text-xs text-center text-warm-400">
                        Al confirmar, autorizás el cargo de ${selectedTaller.precio} por el taller de {selectedTaller.nombre}.
                    </p>
                </div>
            )}
        </div>
    )
}
