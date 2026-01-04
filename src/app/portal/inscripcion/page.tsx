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

const FASES = [
    { id: 'Fase 1', nombre: 'Principiante', desc: 'Introducción al arte y dibujo.', color: 'from-emerald-400 to-emerald-600' },
    { id: 'Fase 2', nombre: 'Intermedio', desc: 'Perfeccionamiento de técnicas.', color: 'from-blue-400 to-blue-600' },
    { id: 'Fase 3', nombre: 'Avanzado', desc: 'Maestría y proyectos personales.', color: 'from-purple-400 to-purple-600' }
]

const DIAS = ['MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']
const HORARIOS = [
    { label: '16:00 a 17:20', value: '16:00-17:20' },
    { label: '17:30 a 18:50', value: '17:30-18:50' },
    { label: '19:10 a 20:30', value: '19:10-20:30' }
]

export default function EnrollmentPage() {
    const router = useRouter()
    const [talleres, setTalleres] = useState<Taller[]>([])
    const [loading, setLoading] = useState(true)
    const [step, setStep] = useState(1) // 1: Fase, 2: Taller, 3: Día/Horario, 4: Asiento, 5: Pago

    const [selectedFase, setSelectedFase] = useState('')
    const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null)
    const [selectedDia, setSelectedDia] = useState('')
    const [selectedHorario, setSelectedHorario] = useState('')
    const [selectedAsiento, setSelectedAsiento] = useState<number | null>(null)
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([])

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

    useEffect(() => {
        if (selectedDia && selectedHorario) {
            fetch(`/api/portal/inscripcion/disponibilidad?dia=${selectedDia}&horario=${selectedHorario}`)
                .then(res => res.json())
                .then(data => {
                    setOccupiedSeats(data.occupiedSeats || [])
                })
                .catch(err => console.error('Error fetching availability:', err))
        }
    }, [selectedDia, selectedHorario])

    const handleEnroll = async () => {
        setProcessingPayment(true)
        setError('')

        try {
            const response = await fetch('/api/portal/inscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tallerId: selectedTaller?.id,
                    fase: selectedFase,
                    dia: selectedDia,
                    horario: selectedHorario,
                    asiento: selectedAsiento
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

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lemon-500"></div>
            <p className="mt-4 text-warm-600 font-medium">Cargando experiencia de inscripción...</p>
        </div>
    )

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-12 animate-fade-in pb-24">
            <header className="text-center space-y-2">
                <h1 className="text-4xl font-serif font-black text-warm-900 tracking-tight">Nueva Inscripción</h1>
                <p className="text-warm-500 text-lg">Personalizá tu camino artístico en 5 pasos</p>
            </header>

            {/* Premium Stepper */}
            <div className="relative flex items-center justify-between max-w-3xl mx-auto px-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-warm-100 -translate-y-1/2 z-0"></div>
                {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 border-4 ${step === s ? 'bg-white border-lemon-500 text-lemon-600 scale-125 shadow-lg shadow-lemon-100' :
                                step > s ? 'bg-lemon-500 border-lemon-500 text-white' :
                                    'bg-white border-warm-100 text-warm-300'
                            }`}>
                            {step > s ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : s}
                        </div>
                        <span className={`text-[10px] font-bold uppercase mt-2 tracking-widest ${step >= s ? 'text-lemon-600' : 'text-warm-300'}`}>
                            {s === 1 ? 'Fase' : s === 2 ? 'Curso' : s === 3 ? 'Fecha' : s === 4 ? 'Asiento' : 'Pago'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <main className="min-h-[400px]">
                {/* Step 1: Fase */}
                {step === 1 && (
                    <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
                        {FASES.map((fase) => (
                            <button
                                key={fase.id}
                                onClick={() => { setSelectedFase(fase.id); nextStep(); }}
                                className={`group relative p-8 rounded-3xl border-2 text-left transition-all hover:scale-105 ${selectedFase === fase.id ? 'border-lemon-500 bg-lemon-50/50 ring-4 ring-lemon-50' : 'border-warm-100 bg-white hover:border-lemon-200'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${fase.color} mb-6 shadow-lg transform group-hover:rotate-12 transition-transform`}></div>
                                <h3 className="text-2xl font-black text-warm-800 mb-2">{fase.nombre}</h3>
                                <p className="text-warm-500 font-medium leading-relaxed">{fase.desc}</p>
                                <div className="mt-8 flex items-center text-lemon-600 font-black uppercase text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Seleccionar <span className="ml-2">→</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Taller */}
                {step === 2 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                        {talleres.map((taller) => (
                            <div
                                key={taller.id}
                                className={`group card overflow-hidden border-2 cursor-pointer transition-all ${selectedTaller?.id === taller.id ? 'border-lemon-500 ring-4 ring-lemon-50' : 'border-warm-100 hover:border-lemon-200'
                                    }`}
                                onClick={() => { setSelectedTaller(taller); nextStep(); }}
                            >
                                <div className="h-40 bg-warm-100 relative overflow-hidden">
                                    {taller.imagen ? (
                                        <img src={taller.imagen} alt={taller.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200">
                                            <span className="text-4xl">🎨</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-warm-800 shadow-sm">
                                        ${taller.precio}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-warm-800 mb-2">{taller.nombre}</h3>
                                    <p className="text-warm-500 text-sm line-clamp-2 mb-4">{taller.descripcion}</p>
                                    <button className="w-full py-3 rounded-xl bg-warm-50 text-warm-800 font-bold group-hover:bg-lemon-500 group-hover:text-white transition-colors">
                                        Elegir este curso
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 3: Día y Horario */}
                {step === 3 && (
                    <div className="max-w-2xl mx-auto space-y-10 animate-slide-up">
                        <div className="space-y-4 text-center">
                            <h2 className="text-2xl font-bold text-warm-800">¿Cuándo querés venir?</h2>
                            <p className="text-warm-500">Seleccioná un día y uno de los turnos fijos.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {DIAS.map(dia => (
                                    <button
                                        key={dia}
                                        className={`p-4 rounded-2xl border-2 font-black transition-all ${selectedDia === dia ? 'bg-lemon-500 border-lemon-500 text-white shadow-lg shadow-lemon-200' : 'bg-white border-warm-100 hover:border-lemon-200 text-warm-600'
                                            }`}
                                        onClick={() => setSelectedDia(dia)}
                                    >
                                        {dia}
                                    </button>
                                ))}
                            </div>

                            <div className="grid gap-4">
                                {HORARIOS.map(h => (
                                    <button
                                        key={h.value}
                                        className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${selectedHorario === h.value ? 'bg-lemon-500 border-lemon-500 text-white shadow-lg shadow-lemon-200' : 'bg-white border-warm-100 hover:border-lemon-200 text-warm-800'
                                            }`}
                                        onClick={() => setSelectedHorario(h.value)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedHorario === h.value ? 'bg-white/20' : 'bg-warm-50 text-warm-400'}`}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-lg font-bold">{h.label}</span>
                                        </div>
                                        {selectedHorario === h.value && (
                                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-lemon-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center pt-8">
                            <button
                                disabled={!selectedDia || !selectedHorario}
                                onClick={nextStep}
                                className="px-12 py-4 bg-lemon-500 text-white font-black rounded-2xl shadow-xl shadow-lemon-200 disabled:opacity-50 hover:bg-lemon-600 transition-colors"
                            >
                                Siguiente: Elegir Asiento
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Asiento */}
                {step === 4 && (
                    <div className="max-w-4xl mx-auto space-y-12 animate-slide-up">
                        <div className="space-y-4 text-center">
                            <h2 className="text-2xl font-bold text-warm-800">Seleccioná tu lugar</h2>
                            <p className="text-warm-500">Haz clic en un asiento disponible en la mesa.</p>
                        </div>

                        {/* Interactive Table Map */}
                        <div className="relative p-12 bg-warm-50 rounded-[4rem] border-4 border-dashed border-warm-200 overflow-x-auto">
                            <div className="min-w-[600px] flex flex-col items-center gap-8">
                                {/* Seats Row 1 (1-5) */}
                                <div className="flex gap-6">
                                    {[1, 2, 3, 4, 5].map(num => {
                                        const occupied = occupiedSeats.includes(num)
                                        const selected = selectedAsiento === num
                                        return (
                                            <button
                                                key={num}
                                                disabled={occupied}
                                                onClick={() => setSelectedAsiento(num)}
                                                className={`w-14 h-14 rounded-2xl border-4 flex flex-col items-center justify-center transition-all ${occupied ? 'bg-warm-200 border-warm-300 text-warm-400 cursor-not-allowed opacity-50' :
                                                        selected ? 'bg-lemon-500 border-lemon-400 text-white scale-110 shadow-xl' :
                                                            'bg-white border-warm-100 hover:border-lemon-400 text-warm-600 hover:scale-105'
                                                    }`}
                                            >
                                                <span className="text-xs font-black mb-1">A{num}</span>
                                                {occupied ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                ) : selected ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-warm-200"></div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* The Table */}
                                <div className="w-[450px] h-48 bg-white border-8 border-warm-100 rounded-[2rem] shadow-2xl flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,_#ccc_1px,_transparent_0)] bg-[size:24px_24px]"></div>
                                    <div className="text-center z-10">
                                        <p className="text-warm-200 font-serif italic text-4xl select-none">LIMONE</p>
                                        <p className="text-[10px] text-warm-300 font-bold uppercase tracking-[0.3em]">Arte & Diseño</p>
                                    </div>
                                </div>

                                {/* Seats Row 2 (6-10) */}
                                <div className="flex gap-6">
                                    {[6, 7, 8, 9, 10].map(num => {
                                        const occupied = occupiedSeats.includes(num)
                                        const selected = selectedAsiento === num
                                        return (
                                            <button
                                                key={num}
                                                disabled={occupied}
                                                onClick={() => setSelectedAsiento(num)}
                                                className={`w-14 h-14 rounded-2xl border-4 flex flex-col items-center justify-center transition-all ${occupied ? 'bg-warm-200 border-warm-300 text-warm-400 cursor-not-allowed opacity-50' :
                                                        selected ? 'bg-lemon-500 border-lemon-400 text-white scale-110 shadow-xl' :
                                                            'bg-white border-warm-100 hover:border-lemon-400 text-warm-600 hover:scale-105'
                                                    }`}
                                            >
                                                <span className="text-xs font-black mb-1">A{num}</span>
                                                {occupied ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                ) : selected ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-warm-200"></div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-white border-2 border-warm-100"></div>
                                <span className="text-xs font-bold text-warm-500 uppercase tracking-widest">Disponible</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-warm-200 border-2 border-warm-300"></div>
                                <span className="text-xs font-bold text-warm-500 uppercase tracking-widest">Ocupado</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-lemon-500 border-2 border-lemon-400"></div>
                                <span className="text-xs font-bold text-warm-500 uppercase tracking-widest">Tu Lugar</span>
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                disabled={selectedAsiento === null}
                                onClick={nextStep}
                                className="px-12 py-4 bg-lemon-500 text-white font-black rounded-2xl shadow-xl shadow-lemon-200 disabled:opacity-50 hover:bg-lemon-600 transition-colors"
                            >
                                Confirmar y Continuar
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Pago */}
                {step === 5 && selectedTaller && (
                    <div className="max-w-md mx-auto space-y-8 animate-scale-up">
                        <div className="bg-white rounded-[2.5rem] border-2 border-warm-100 overflow-hidden shadow-2xl">
                            <div className="bg-warm-900 p-8 text-white relative">
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-black mb-1">Resumen final</h2>
                                    <p className="text-warm-400 text-sm font-medium uppercase tracking-widest">Inscripción confirmada</p>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-lemon-500 rounded-bl-full opacity-20 -mr-8 -mt-8"></div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-y-6">
                                    <div>
                                        <p className="text-[10px] text-warm-400 uppercase tracking-widest font-black mb-1">Fase</p>
                                        <p className="font-bold text-warm-800">{selectedFase}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-warm-400 uppercase tracking-widest font-black mb-1">Curso</p>
                                        <p className="font-bold text-warm-800">{selectedTaller.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-warm-400 uppercase tracking-widest font-black mb-1">Día y Hora</p>
                                        <p className="font-bold text-warm-800 uppercase">{selectedDia} • {selectedHorario}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-warm-400 uppercase tracking-widest font-black mb-1">Tu Asiento</p>
                                        <p className="font-bold text-warm-800">Mesa Central • {selectedAsiento}</p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-dashed border-warm-100 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-warm-400 uppercase tracking-widest font-black mb-1">Total a Pagar</p>
                                        <p className="text-4xl font-black text-warm-900">${selectedTaller.precio}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Pago Protegido
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-sm font-bold flex gap-3">
                                <span>❌</span> {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={handleEnroll}
                                disabled={processingPayment}
                                className="w-full bg-warm-900 text-white py-5 rounded-2xl text-lg font-black shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {processingPayment ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Confirmando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Pagar y Finalizar
                                    </>
                                )}
                            </button>
                            <button
                                onClick={prevStep}
                                disabled={processingPayment}
                                className="w-full py-4 text-warm-400 font-bold hover:text-warm-600 transition-colors uppercase tracking-widest text-xs"
                            >
                                Volver y corregir
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Back button (Only for steps after 1) */}
            {step > 1 && step < 5 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-warm-100 px-6 py-3 rounded-full shadow-2xl z-50">
                    <button onClick={prevStep} className="flex items-center gap-2 text-warm-500 hover:text-warm-900 transition-colors font-bold uppercase text-[10px] tracking-widest">
                        <span>←</span> Anterior
                    </button>
                    <div className="h-4 w-px bg-warm-100"></div>
                    <span className="text-[10px] font-black text-warm-300 tracking-[0.3em] uppercase">Paso {step} de 5</span>
                </div>
            )}
        </div>
    )
}
