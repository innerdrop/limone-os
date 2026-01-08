'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

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
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)
    // New Steps:
    // 1: Nivel (Decision: Conoce Nivel -> Fase OR No Conoce -> Test)
    // 2: Día/Horario (If Enroll) OR Confirm Test (If Test)
    // 3: Asiento (If Enroll)
    // 4: Pago (If Enroll)

    // State for Decision
    const [knowsLevel, setKnowsLevel] = useState<boolean | null>(null) // null = not decided
    const [isSummer, setIsSummer] = useState(false)

    // Reset step if navigating to this page (ensure it always starts at step 1)
    useEffect(() => {
        setStep(1)
        setKnowsLevel(null)
        setIsSummer(false)
        setSlots([])
        setSelectedFase('')
    }, [pathname])

    // State for Regular Enrollment
    const [selectedFase, setSelectedFase] = useState('')

    // State for Summer Workshop
    const [summerModality, setSummerModality] = useState<'BASE' | 'EXTENDED'>('BASE')
    const [summerFrequency, setSummerFrequency] = useState<'1x' | '2x'>('1x') // 1x or 2x per week
    const [summerStartDate, setSummerStartDate] = useState('')

    // State for Enrollment (Multi-slot)
    type EnrollmentSlot = {
        id: string
        dia: string
        horario: string
        asiento: number
    }
    const [slots, setSlots] = useState<EnrollmentSlot[]>([])
    const [isAddingSlot, setIsAddingSlot] = useState(false)

    // Temporary state for the slot being added
    const [tempDia, setTempDia] = useState('')
    const [tempHorario, setTempHorario] = useState('')
    const [tempAsiento, setTempAsiento] = useState<number | null>(null)
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([])

    // State for Placement Test
    const [placementDate, setPlacementDate] = useState('')
    const [placementTime, setPlacementTime] = useState('')

    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState('')

    // Fetch availability when Temp Day/Time changes
    useEffect(() => {
        if (tempDia && tempHorario) {
            setLoading(true)
            fetch(`/api/portal/inscripcion/disponibilidad?dia=${tempDia}&horario=${tempHorario}`)
                .then(res => res.json())
                .then(data => {
                    setOccupiedSeats(data.occupiedSeats || [])
                })
                .catch(err => console.error('Error fetching availability:', err))
                .finally(() => setLoading(false))
        }
    }, [tempDia, tempHorario])

    const handleAddSlot = () => {
        if (tempDia && tempHorario && tempAsiento) {
            // Check for duplicates
            const isDuplicate = slots.some(s => s.dia === tempDia)
            if (isDuplicate) {
                setError('Ya elegiste un turno para este día. Elegí otro día.')
                return
            }

            setSlots([...slots, {
                id: Date.now().toString(),
                dia: tempDia,
                horario: tempHorario,
                asiento: tempAsiento
            }])
            // Reset temp
            setTempDia('')
            setTempHorario('')
            setTempAsiento(null)
            setIsAddingSlot(false)
            setError('')
        }
    }

    const removeSlot = (id: string) => {
        setSlots(slots.filter(s => s.id !== id))
    }

    const handleEnroll = async () => {
        setProcessing(true)
        setError('')

        try {
            const response = await fetch('/api/portal/inscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'enrollment',
                    fase: isSummer ? 'Taller de Verano' : selectedFase,
                    isSummer,
                    summerModality,
                    summerFrequency,
                    summerStartDate,
                    slots: isSummer ? [] : slots
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Error al procesar la inscripción')
            }

            const data = await response.json()

            // Redirect to WhatsApp if URL is provided
            if (data.whatsappUrl) {
                window.location.href = data.whatsappUrl
            } else {
                router.push('/portal?inscripcion=exitosa')
            }
        } catch (err: any) {
            setError(err.message)
            setProcessing(false)
        }
    }

    const handlePlacementTest = async () => {
        setProcessing(true)
        setError('')

        try {
            const response = await fetch('/api/portal/inscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'placement',
                    date: placementDate,
                    time: placementTime
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Error al agendar cita')
            }

            router.push('/portal?nivelacion=agendada')
        } catch (err: any) {
            setError(err.message)
            setProcessing(false)
        }
    }

    // Logic to determine Total Steps based on path
    const totalSteps = 3 // Always 3 now (Step 2 is either Schedule or Date or Confirm)

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => {
        if (step === 1 && knowsLevel !== null) {
            if (isSummer) {
                // If backtracking from Summer step 1 (which is essentially step 1 content)
                // Actually step 1 is Decision.
                setIsSummer(false)
                setKnowsLevel(null)
            } else {
                setKnowsLevel(null)
            }
            setSelectedFase('')
            return
        }
        setStep(prev => prev - 1)
    }

    const getStepLabel = (s: number) => {
        if (knowsLevel === false) return s === 1 ? 'Nivelación' : 'Confirmar'
        return s === 1 ? 'Nivel' : s === 2 ? (isSummer ? 'Fecha' : 'Cursada') : 'Pago'
    }

    // ... (Loading state remains same)

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-12 animate-fade-in pb-24">
            <header className="text-center space-y-2">
                <h1 className="text-4xl font-serif font-black text-warm-900 tracking-tight">
                    {knowsLevel === false ? 'Agendar Nivelación' : isSummer ? 'Taller de Verano' : 'Nueva Inscripción'}
                </h1>
                <p className="text-warm-500 text-lg">
                    {knowsLevel === false ? 'Descubrí tu nivel artístico' : isSummer ? 'Disfrutá el arte en vacaciones' : 'Personalizá tu camino artístico'}
                </p>
            </header>

            {/* Stepper */}
            {knowsLevel !== null && (
                <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-warm-100 -translate-y-1/2 z-0"></div>
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
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
                                {getStepLabel(s)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <main className="min-h-[400px]">

                {/* STEP 1: Level Decision */}
                {step === 1 && (
                    <div className="animate-slide-up">
                        {knowsLevel === null ? (
                            <div className="max-w-5xl mx-auto space-y-8 text-center pt-8">
                                <h2 className="text-2xl font-bold text-warm-800">Elegí tu camino</h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <button onClick={() => setKnowsLevel(false)} className="p-8 rounded-3xl border-2 border-warm-200 hover:border-lemon-400 hover:bg-lemon-50/50 transition-all group flex flex-col items-center text-center shadow-sm hover:shadow-md">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-100 mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">🤔</div>
                                        <h3 className="text-xl font-black text-warm-800 mb-2">No estoy seguro</h3>
                                        <p className="text-warm-500 text-sm">Quiero realizar una prueba de nivelación.</p>
                                    </button>

                                    <button onClick={() => { setKnowsLevel(true); setIsSummer(false); }} className="p-8 rounded-3xl border-2 border-warm-200 hover:border-lemon-400 hover:bg-lemon-50/50 transition-all group flex flex-col items-center text-center shadow-sm hover:shadow-md">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">✅</div>
                                        <h3 className="text-xl font-black text-warm-800 mb-2">Curso Regular</h3>
                                        <p className="text-warm-500 text-sm">Ya sé en qué fase anual inscribirme.</p>
                                    </button>

                                    <button onClick={() => { setKnowsLevel(true); setIsSummer(true); setStep(2); }} className="p-8 rounded-3xl border-2 border-warm-200 hover:border-lemon-400 hover:bg-lemon-50/50 transition-all group relative overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-md">
                                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">NUEVO</div>
                                        <div className="w-16 h-16 rounded-2xl bg-orange-100 mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">☀️</div>
                                        <h3 className="text-xl font-black text-warm-800 mb-2">Taller de Verano</h3>
                                        <p className="text-warm-500 text-sm">Enero y Febrero. Propuestas intensivas.</p>
                                    </button>
                                </div>
                            </div>
                        ) : knowsLevel === true ? (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-warm-800">Seleccioná tu Fase</h2>
                                    <button onClick={() => setKnowsLevel(null)} className="text-sm text-lemon-600 hover:underline mt-2">← Volver</button>
                                </div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {FASES.map((fase) => (
                                        <button key={fase.id} onClick={() => { setSelectedFase(fase.id); nextStep(); }} className={`group relative p-8 rounded-3xl border-2 text-left transition-all hover:scale-105 ${selectedFase === fase.id ? 'border-lemon-500 bg-lemon-50/50 ring-4 ring-lemon-50' : 'border-warm-100 bg-white hover:border-lemon-200'}`}>
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${fase.color} mb-6 shadow-lg transform group-hover:rotate-12 transition-transform`}></div>
                                            <h3 className="text-2xl font-black text-warm-800 mb-2">{fase.nombre}</h3>
                                            <p className="text-warm-500 font-medium leading-relaxed">{fase.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Placement Test
                            <div className="max-w-md mx-auto space-y-8">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-warm-800">Agendar Nivelación</h2>
                                    <button onClick={() => setKnowsLevel(null)} className="text-sm text-lemon-600 hover:underline mt-2">← Volver</button>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border-2 border-warm-100 shadow-xl space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-warm-700 mb-2">Mes</label>
                                            <select className="w-full p-3 rounded-xl border-2 border-warm-100" value={placementDate ? placementDate.split('-')[1] : ''} onChange={(e) => { const month = e.target.value; setPlacementDate(`2026-${month}-01`); }}>
                                                {['01', '02', '03'].map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                        <input type="date" className="col-span-2 p-3 border-2 rounded-xl" value={placementDate} onChange={e => setPlacementDate(e.target.value)} />
                                        <select className="col-span-2 p-3 border-2 rounded-xl" value={placementTime} onChange={e => setPlacementTime(e.target.value)}>
                                            <option value="">Hora...</option>
                                            <option value="16:00">16:00</option>
                                            <option value="17:00">17:00</option>
                                        </select>
                                    </div>
                                    <button disabled={!placementDate || !placementTime} onClick={nextStep} className="w-full py-4 bg-lemon-500 text-white font-black rounded-xl hover:bg-lemon-600">Continuar</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 2: Configure Schedule (Regular Only) */}
                {step === 2 && knowsLevel === true && !isSummer && (
                    <div className="max-w-4xl mx-auto animate-slide-up space-y-8">
                        {/* ... Existing Slot UI ... */}
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-warm-800">Armá tu Horario</h2>
                            <p className="text-warm-500">Podés elegir hasta 2 días de cursada semanal.</p>
                        </div>
                        <div className="grid gap-4">
                            {slots.map((slot, idx) => (
                                <div key={slot.id} className="bg-white p-6 rounded-2xl border-2 border-lemon-100 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-lemon-100 flex items-center justify-center text-lemon-600 font-bold">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-warm-900">{slot.dia}</h3>
                                            <p className="text-warm-500 text-sm">{slot.horario} • Asiento A{slot.asiento}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeSlot(slot.id)} className="text-red-400 hover:text-red-600 p-2">Eliminar</button>
                                </div>
                            ))}
                            {!isAddingSlot && slots.length < 2 && (
                                <button onClick={() => setIsAddingSlot(true)} className="w-full py-6 border-2 border-dashed border-lemon-300 rounded-2xl text-lemon-600 font-bold hover:bg-lemon-50 transition-colors flex items-center justify-center gap-2">
                                    <span className="text-2xl">+</span> Agregar Cursada
                                </button>
                            )}
                        </div>

                        {/* Adding Slot Workflow */}
                        {isAddingSlot && (
                            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border-2 border-lemon-200 shadow-xl space-y-8 animate-fade-in relative">
                                <button onClick={() => setIsAddingSlot(false)} className="absolute top-6 right-6 text-warm-400 hover:text-red-500">✕</button>
                                <h3 className="text-xl font-bold text-warm-800 text-center">Nuevo Turno</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-warm-700 mb-2">Día</label>
                                        <div className="flex flex-wrap gap-2">
                                            {DIAS.map(d => (
                                                <button key={d} onClick={() => setTempDia(d)} className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${tempDia === d ? 'bg-lemon-500 border-lemon-500 text-white' : 'bg-white border-warm-100 text-warm-600'}`}>{d}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {tempDia && (
                                        <div className="animate-fade-in">
                                            <label className="block text-sm font-bold text-warm-700 mb-2">Horario</label>
                                            <div className="flex flex-wrap gap-2">
                                                {HORARIOS.map(h => (
                                                    <button key={h.value} onClick={() => setTempHorario(h.value)} className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${tempHorario === h.value ? 'bg-lemon-500 border-lemon-500 text-white' : 'bg-white border-warm-100 text-warm-600'}`}>{h.label}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {tempDia && tempHorario && (
                                    <div className="animate-fade-in space-y-4">
                                        <div className="text-center"><p className="text-sm font-bold text-warm-500">Elegí tu asiento</p></div>
                                        <div className="flex flex-wrap justify-center gap-4 bg-warm-50 p-6 rounded-3xl border-2 border-warm-100">
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
                                                const occupied = occupiedSeats.includes(num) || slots.some(s => s.dia === tempDia && s.horario === tempHorario && s.asiento === num)
                                                return (
                                                    <button key={num} disabled={occupied} onClick={() => setTempAsiento(num)} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all ${occupied ? 'bg-warm-200 border-warm-300 text-warm-400' : tempAsiento === num ? 'bg-lemon-500 border-lemon-500 text-white scale-110' : 'bg-white border-warm-200 text-warm-600 hover:border-lemon-400'}`}>{num}</button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                                <button disabled={!tempDia || !tempHorario || !tempAsiento} onClick={handleAddSlot} className="w-full py-4 bg-lemon-600 text-white font-black rounded-xl disabled:opacity-50 hover:bg-lemon-700 transition-colors">Confirmar Horario</button>
                                {error && <p className="text-red-500 text-center font-bold text-sm">{error}</p>}
                            </div>
                        )}
                        <div className="flex justify-center pt-8">
                            <button disabled={slots.length === 0 || isAddingSlot} onClick={nextStep} className="px-12 py-4 bg-warm-900 text-white font-black rounded-2xl shadow-xl disabled:opacity-50 hover:bg-black transition-colors">Continuar con {slots.length} {slots.length === 1 ? 'día' : 'días'}</button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Summer Workshop Configuration */}
                {step === 2 && isSummer && (
                    <div className="max-w-2xl mx-auto space-y-8 animate-slide-up">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-warm-800">Taller de Verano 2026</h2>
                            <p className="text-warm-500">Del 6 de Enero al 28 de Febrero • Niños de 5 a 12 años</p>
                        </div>

                        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border-2 border-warm-100 shadow-xl space-y-8">

                            {/* 1. Select Modality */}
                            <div>
                                <label className="block text-sm font-bold text-warm-700 mb-4 uppercase tracking-wider">1. Elegí la Modalidad</label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSummerModality('BASE')}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${summerModality === 'BASE' ? 'border-lemon-500 bg-lemon-50 ring-4 ring-lemon-100' : 'border-warm-100 hover:border-lemon-300'}`}
                                    >
                                        <h4 className="font-black text-warm-900 text-lg mb-1">Modalidad Base</h4>
                                        <p className="text-warm-500 text-sm mb-2">Corta duración (1h 20m)</p>
                                        <div className="text-xs font-bold bg-white/50 inline-block px-2 py-1 rounded text-warm-600">Materiales Incluidos</div>
                                    </button>

                                    <button
                                        onClick={() => setSummerModality('EXTENDED')}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${summerModality === 'EXTENDED' ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100' : 'border-warm-100 hover:border-orange-300'}`}
                                    >
                                        <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">POPULAR</div>
                                        <h4 className="font-black text-warm-900 text-lg mb-1">Extendida</h4>
                                        <p className="text-warm-500 text-sm mb-2">2 horas + Merienda</p>
                                        <div className="text-xs font-bold bg-white/50 inline-block px-2 py-1 rounded text-orange-600">Merienda Incluida</div>
                                    </button>
                                </div>
                            </div>

                            {/* 2. Select Frequency */}
                            <div>
                                <label className="block text-sm font-bold text-warm-700 mb-4 uppercase tracking-wider">2. Frecuencia Semanal</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSummerFrequency('1x')}
                                        className={`p-4 rounded-xl border-2 font-bold transition-all ${summerFrequency === '1x' ? 'border-warm-800 bg-warm-800 text-white shadow-lg' : 'border-warm-200 text-warm-600'}`}
                                    >
                                        1 vez x semana
                                        <span className="block text-xs font-normal opacity-80 mt-1">
                                            {summerModality === 'BASE' ? '$75.000/mes' : '$145.000/mes'}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setSummerFrequency('2x')}
                                        className={`p-4 rounded-xl border-2 font-bold transition-all ${summerFrequency === '2x' ? 'border-warm-800 bg-warm-800 text-white shadow-lg' : 'border-warm-200 text-warm-600'}`}
                                    >
                                        2 veces x semana
                                        <span className="block text-xs font-normal opacity-80 mt-1">
                                            {summerModality === 'BASE' ? '$130.000/mes' : '$210.000/mes'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* 3. Date Selection */}
                            <div>
                                <label className="block text-sm font-bold text-warm-700 mb-2 uppercase tracking-wider">3. Fecha de Inicio</label>
                                <input
                                    type="date"
                                    className="w-full p-4 rounded-xl border-2 border-warm-200 font-bold text-warm-800 focus:border-lemon-500 focus:ring-4 focus:ring-lemon-100 outline-none transition-all"
                                    value={summerStartDate}
                                    onChange={(e) => setSummerStartDate(e.target.value)}
                                    min="2026-01-06"
                                    max="2026-02-28"
                                />
                                <p className="text-xs text-warm-400 mt-2 px-2">
                                    * Seleccioná la fecha de tu primera clase. Podés inscribirte en cualquier momento entre el 6 de Enero y el 28 de Febrero.
                                </p>
                            </div>

                            <button
                                disabled={!summerStartDate}
                                onClick={nextStep}
                                className="w-full py-4 bg-lemon-500 text-white font-black rounded-xl hover:bg-lemon-600 disabled:opacity-50 disabled:hover:bg-lemon-500 transition-colors shadow-lg shadow-lemon-200"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2 (Placement Test) */}
                {step === 2 && knowsLevel === false && (
                    <div className="max-w-md mx-auto space-y-6 text-center animate-slide-up">
                        <h2 className="text-2xl font-bold">Confirmar Cita</h2>
                        <p className="text-xl">Fecha: {placementDate} {placementTime}</p>
                        <button onClick={handlePlacementTest} disabled={processing} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">{processing ? 'Confirmando...' : 'Confirmar'}</button>
                    </div>
                )}

                {/* STEP 3: Payment/Summary (Unified) */}
                {step === 3 && knowsLevel === true && (
                    <div className="max-w-md mx-auto space-y-8 animate-scale-up">
                        <div className="bg-white rounded-[2.5rem] border-2 border-warm-100 overflow-hidden shadow-2xl p-8 space-y-6">
                            <h2 className="text-2xl font-black text-warm-900 text-center">Resumen de Inscripción</h2>
                            <div className="space-y-4">
                                {isSummer ? (
                                    <>
                                        <div className="p-4 bg-orange-50 rounded-2xl">
                                            <p className="text-xs uppercase font-bold text-orange-600 mb-1">Programa</p>
                                            <p className="font-bold text-warm-800">Taller de Verano</p>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-warm-100 pb-2">
                                            <p className="text-xs uppercase font-bold text-warm-400">Técnica</p>
                                            <p className="font-bold text-warm-800 text-right">{summerModality === 'BASE' ? 'Base (1h 20m)' : 'Extendida (2h + Merienda)'}</p>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-warm-100 pb-2">
                                            <p className="text-xs uppercase font-bold text-warm-400">Frecuencia</p>
                                            <p className="font-bold text-warm-800 text-right">{summerFrequency === '1x' ? '1 vez' : '2 veces'} x semana</p>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-warm-100 pb-2">
                                            <p className="text-xs uppercase font-bold text-warm-400">Inicio</p>
                                            <p className="font-bold text-warm-800 text-right">{summerStartDate}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-lemon-50 rounded-2xl">
                                            <p className="text-xs uppercase font-bold text-lemon-600 mb-1">Fase</p>
                                            <p className="font-bold text-warm-800">{selectedFase}</p>
                                        </div>
                                        {slots.map((s, i) => (
                                            <div key={i} className="flex justify-between items-center border-b border-warm-100 pb-2 last:border-0">
                                                <div>
                                                    <p className="text-xs uppercase font-bold text-warm-400">Día {i + 1}</p>
                                                    <p className="font-bold text-warm-800">{s.dia}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-warm-800">{s.horario}</p>
                                                    <p className="text-xs font-bold text-lemon-600">Asiento {s.asiento}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            <div className="pt-6 border-t border-dashed border-warm-200">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-warm-500">Total</span>
                                    <span className="text-3xl font-black text-warm-900">
                                        {isSummer
                                            ? summerModality === 'BASE'
                                                ? (summerFrequency === '1x' ? '$75.000' : '$130.000')
                                                : (summerFrequency === '1x' ? '$145.000' : '$210.000')
                                            : `$${(slots.length * 25000).toLocaleString('es-AR')}`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        {error && <div className="p-4 bg-red-100 text-red-600 rounded-xl font-bold text-center">{error}</div>}
                        <button onClick={handleEnroll} disabled={processing} className="w-full py-4 bg-warm-900 text-white font-black rounded-2xl shadow-xl hover:bg-black">{processing ? 'Procesando...' : 'Confirmar Inscripción'}</button>
                    </div>
                )}
            </main>

            {/* Back button */}
            {step > 1 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-warm-100 px-6 py-3 rounded-full shadow-2xl z-50">
                    <button onClick={prevStep} className="flex items-center gap-2 text-warm-500 hover:text-warm-900 transition-colors font-bold uppercase text-[10px] tracking-widest">
                        <span>←</span> Anterior
                    </button>
                    <div className="h-4 w-px bg-warm-100"></div>
                    <span className="text-[10px] font-black text-warm-300 tracking-[0.3em] uppercase">
                        Paso {step} de {totalSteps}
                    </span>
                </div>
            )}
        </div>
    )
}
