'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import SignatureCanvas from 'react-signature-canvas'

interface Taller {
    id: string
    nombre: string
    descripcion: string
    precio: number
    imagen?: string
}

interface OpcionInscripcion {
    id: string
    nombre: string
    descripcion: string
    emoji: string
    colorFondo: string
    colorBorde: string
    colorHoverBg: string
    tipo: string
    redirigirUrl: string | null
    esNuevo: boolean
    orden: number
    activo: boolean
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

const SCHOOLS = [
    'Escuela N° 1 "Domingo Faustino Sarmiento"',
    'Escuela N° 3 "Monseñor Fagnano"',
    'Escuela N° 9 "Comandante Luis Piedrabuena"',
    'Escuela N° 13 "Almirante Guillermo Brown"',
    'Escuela N° 15 "Centenario de Ushuaia"',
    'Escuela N° 16 "Dr. Arturo Mateo Bas"',
    'Escuela N° 22 "Bahía Golondrina"',
    'Escuela N° 24 "Juan Ruiz Galán"',
    'Escuela N° 30 "Oshovia"',
    'Escuela N° 31 "Juana Manso"',
    'Escuela N° 39 "Mirador del Olivia"',
    'Escuela N° 41 "Mario Benedetti"',
    'Escuela N° 47',
    'Escuela N° 48',
    'Colegio Polivalente de Arte de Ushuaia',
    'Colegio Provincial "José Martí"',
    'Colegio Provincial "Klokedten"',
    'Colegio Provincial "Los Andes"',
    'Colegio Provincial de Educación Tecnológica (CPET)',
    'Colegio Integral de Educación Ushuaia (CIEU)',
    'Colegio del Sur',
    'Colegio Julio Verne',
    'Colegio Monseñor Aleman',
    'Escuela Modelo de Educación Integral (EMEI)',
    'Colegio Nacional de Ushuaia',
    'Otro'
]

const GRADES = [
    'Sala de 3', 'Sala de 4', 'Sala de 5',
    '1° Grado Primaria', '2° Grado Primaria', '3° Grado Primaria',
    '4° Grado Primaria', '5° Grado Primaria', '6° Grado Primaria',
    '1° Año Secundaria', '2° Año Secundaria', '3° Año Secundaria',
    '4° Año Secundaria', '5° Año Secundaria', '6° Año Secundaria'
]

const SUMMER_HORARIOS_BASE = [
    { label: '16:00 a 17:20 (1h 20m)', value: '16:00-17:20' },
    { label: '17:30 a 18:50 (1h 20m)', value: '17:30-18:50' },
    { label: '19:10 a 20:30 (1h 20m)', value: '19:10-20:30' }
]

const SUMMER_HORARIOS_EXTENDED = [
    { label: '16:00 a 18:00 (2h + Merienda)', value: '16:00-18:00' },
    { label: '18:30 a 20:30 (2h + Merienda)', value: '18:30-20:30' }
]

// Summer workshop: Jan 6 to Feb 28 = 8 weeks total
// Prices: BASE = $75,000/month, EXTENDED = $145,000/month
// For 2 months = BASE: $150,000 total, EXTENDED: $290,000 total
const SUMMER_END_DATE = new Date(2026, 1, 28) // Feb 28, 2026
const SUMMER_START_DATE = new Date(2026, 0, 6) // Jan 6, 2026
const SUMMER_TOTAL_WEEKS = 8

const calculateSummerPrice = (startDate: string, modality: 'BASE' | 'EXTENDED', frequency: '1x' | '2x') => {
    if (!startDate) return 0

    const start = new Date(startDate)

    // Monthly Rates
    const RATES = {
        'BASE': { '1x': 75000, '2x': 130000 },
        'EXTENDED': { '1x': 145000, '2x': 210000 }
    }

    // Full Season Promo Caps (Jan+Feb)
    const PROMOS = {
        'BASE': { '1x': 150000, '2x': 260000 },
        'EXTENDED': { '1x': 260000, '2x': 380000 }
    }

    const monthlyRate = RATES[modality][frequency]
    const promoPrice = PROMOS[modality][frequency]

    // Calculate weeks remaining from start date to end of summer
    const msPerWeek = 7 * 24 * 60 * 60 * 1000
    const weeksRemaining = Math.max(1, Math.ceil((SUMMER_END_DATE.getTime() - start.getTime()) / msPerWeek))

    // Standard weekly price derived from monthly rate (approx 4 weeks/month)
    const pricePerWeek = monthlyRate / 4

    const calculatedPrice = Math.round(weeksRemaining * pricePerWeek)

    // If calculated partial price exceeds the full season promo (unlikely unless starting very early), cap it.
    // Also, if weeksRemaining is near full duration (e.g. 7-8 weeks), we should probably respect the promo price logic if it's cheaper than raw calculation.

    // For simplicity: If starting in first 2 weeks of Jan, use Promo Price logic if cheaper.
    // Otherwise use proportional.

    return Math.min(calculatedPrice, promoPrice)
}

export default function EnrollmentPage() {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)
    // Steps:
    // -2: Student Selection
    // -1: Student Data
    // 1: Enrollment Options / Level / Placement Test
    // 2: Schedule (Regular or Summer) OR Confirm Test
    // 3: Permisos y Firma
    // 4: Payment Summary

    // State for Decision
    const [knowsLevel, setKnowsLevel] = useState<boolean | null>(null) // null = not decided
    const [isSummer, setIsSummer] = useState(false)
    const [isClaseUnica, setIsClaseUnica] = useState(false)
    const [precioClaseUnica, setPrecioClaseUnica] = useState(15000)

    // State for Student Profile Completion
    const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null)
    const [studentData, setStudentData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '',
        edad: '',
        domicilioCalle: '',
        domicilioNumero: '',
        domicilioTira: '',
        domicilioPiso: '',
        domicilioDepto: '',
        colegio: '',
        grado: ''
    })

    const [authData, setAuthData] = useState({
        autorizacionParticipacion: false,
        autorizacionMedica: false,
        autorizacionRetiro: 'NO',
        autorizacionImagenes: false,
        aceptacionReglamento: false,
        aclaracionFirma: '',
        dniFirma: ''
    })

    const [showRules, setShowRules] = useState(false)
    const [leavesAlone, setLeavesAlone] = useState<boolean | null>(null)
    const [authorizedPersons, setAuthorizedPersons] = useState([{
        nombre: '',
        apellido: '',
        dni: ''
    }])

    const addAuthorizedPerson = () => {
        setAuthorizedPersons([...authorizedPersons, { nombre: '', apellido: '', dni: '' }])
    }

    const removeAuthorizedPerson = (index: number) => {
        if (authorizedPersons.length > 1) {
            setAuthorizedPersons(authorizedPersons.filter((_, i) => i !== index))
        }
    }

    const handleAuthorizedPersonChange = (index: number, field: string, value: string) => {
        const newPersons = [...authorizedPersons]
        newPersons[index] = { ...newPersons[index], [field]: (value as any) }
        setAuthorizedPersons(newPersons)
    }

    const sigCanvas = useRef<SignatureCanvas>(null)

    // NEW: Multi-student support
    const [existingStudents, setExistingStudents] = useState<any[]>([])
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

    // Enrollment options from admin
    const [opcionesInscripcion, setOpcionesInscripcion] = useState<OpcionInscripcion[]>([])
    const [talleres, setTalleres] = useState<any[]>([])

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [step, knowsLevel])

    // Reset step if navigating to this page (ensure it always starts at step 1)
    useEffect(() => {
        setLoading(true)
        Promise.all([
            fetch('/api/portal/perfil').then(res => res.json()),
            fetch('/api/admin/opciones-inscripcion').then(res => res.json()).catch(() => []),
            fetch('/api/admin/precios').then(res => res.json()).catch(() => ({ precio_clase_unica: 15000 })),
            fetch('/api/talleres').then(res => res.json()).catch(() => [])
        ])
            .then(([data, opciones, precios, workshops]) => {
                const alumnos = data.students || []
                setExistingStudents(alumnos)
                if (Array.isArray(opciones)) setOpcionesInscripcion(opciones)
                if (Array.isArray(workshops)) setTalleres(workshops)
                if (precios?.precio_clase_unica) setPrecioClaseUnica(precios.precio_clase_unica)

                if (alumnos.length === 0) {
                    setIsProfileComplete(false)
                    setSelectedStudentId('new')
                    const params = new URLSearchParams(window.location.search)
                    if (params.get('type') === 'single-class') {
                        setKnowsLevel(true)
                        setIsClaseUnica(true)
                        setStep(2)
                    } else {
                        setStep(-1) // Start at student data
                    }
                } else {
                    // Start at selection
                    setIsProfileComplete(true)
                    const params = new URLSearchParams(window.location.search)
                    if (params.get('type') === 'single-class') {
                        setKnowsLevel(true)
                        setIsClaseUnica(true)
                        // Stay at setStep(-2) to choose WHICH student
                    }
                    setStep(-2)
                }
            })
            .catch(() => {
                setIsProfileComplete(false)
                setSelectedStudentId('new')
                setStep(-1)
            })
            .finally(() => setLoading(false))

        setKnowsLevel(null)
        setIsSummer(false)
        setIsClaseUnica(false)
        setSlots([])
        setSelectedFase('')
    }, [pathname])

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return ''
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
        }
        return age.toString()
    }

    const handleStudentChange = (field: string, value: string) => {
        setStudentData(prev => ({ ...prev, [field]: value }))
        if (field === 'fechaNacimiento') {
            const age = calculateAge(value)
            setStudentData(prev => ({ ...prev, edad: age }))
        }
    }

    // State for Regular Enrollment
    const [selectedFase, setSelectedFase] = useState('')

    // State for Summer Workshop
    const [summerModality, setSummerModality] = useState<'BASE' | 'EXTENDED'>('BASE')
    const [summerFrequency, setSummerFrequency] = useState<'1x' | '2x'>('1x')
    const [summerStartDate, setSummerStartDate] = useState('')
    const [summerDays, setSummerDays] = useState<string[]>([]) // Array of days
    const [summerTime, setSummerTime] = useState('')

    // Reset details when modality changes
    useEffect(() => {
        setSummerTime('')
        setSummerFrequency('1x')
        setSummerDays([])
    }, [summerModality])

    // Reset days if frequency changes (to avoid having 2 days selected when switching to 1x)
    useEffect(() => {
        setSummerDays([])
    }, [summerFrequency])

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
                    type: isClaseUnica ? 'single-class' : 'enrollment',
                    fase: isClaseUnica ? 'Clase Única' : isSummer ? 'Taller de Verano' : selectedFase,
                    isSummer,
                    isClaseUnica,
                    dia: isClaseUnica ? tempDia : undefined,
                    horario: isClaseUnica ? tempHorario : undefined,
                    asiento: isClaseUnica ? tempAsiento : undefined,
                    summerModality,
                    summerDays,
                    summerFrequency,
                    summerTime,
                    summerStartDate,
                    slots: isClaseUnica ? [{ id: 'unica', dia: tempDia, horario: tempHorario, asiento: tempAsiento }] : isSummer ? [] : slots,
                    studentId: selectedStudentId,
                    studentData: selectedStudentId === 'new' ? studentData : null,
                    // Construct final authData with latest values
                    authData: selectedStudentId === 'new' ? {
                        ...authData,
                        autorizacionRetiro: leavesAlone
                            ? 'SÍ, SE RETIRA SOLO'
                            : authorizedPersons.map(p => `${p.nombre} ${p.apellido} (DNI: ${p.dni})`).join(', ')
                    } : null,
                    signature: selectedStudentId === 'new' ? sigCanvas.current?.getCanvas().toDataURL('image/png') : null
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
                    studentId: selectedStudentId,
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
    const totalSteps = 4

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => {
        if (step === 1 && knowsLevel !== null) {
            setKnowsLevel(null)
            setIsSummer(false)
            setSelectedFase('')
            return
        }
        if (step === 2 && isSummer) {
            // From summer config, go back to 3 options
            setKnowsLevel(null)
            setIsSummer(false)
            setStep(1)
            return
        }
        setStep(prev => prev - 1)
    }

    const getStepLabel = (s: number) => {
        if (knowsLevel === false) return s === 1 ? 'Nivelación' : s === 2 ? 'Confirmar' : s === 3 ? 'Permisos' : 'Fin'
        if (isClaseUnica) return s === 1 ? 'Tipo' : s === 2 ? 'Horario' : s === 3 ? 'Permisos' : 'Pago'
        return s === 1 ? 'Nivel' : s === 2 ? (isSummer ? 'Fecha' : 'Cursada') : s === 3 ? 'Permisos' : 'Pago'
    }

    if (isProfileComplete === null) {
        return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>
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

                {/* STEP -2: Student Selection */}
                {step === -2 && (
                    <div className="card max-w-2xl mx-auto space-y-8 animate-slide-up">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-warm-800">¿A quién vas a inscribir?</h2>
                            <p className="text-warm-500">Seleccioná uno de tus hijos o agregá uno nuevo.</p>
                        </div>

                        <div className="grid gap-4">
                            {existingStudents.map((s: any) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setSelectedStudentId(s.id)
                                        setIsProfileComplete(true)
                                        setStep(1)
                                    }}
                                    className="p-4 rounded-xl border-2 border-canvas-200 hover:border-lemon-400 hover:bg-lemon-50 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-lemon-100 flex items-center justify-center text-xl">
                                            👤
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-warm-800">{s.nombre} {s.apellido}</p>
                                            <p className="text-sm text-warm-500">{s.perfilCompleto ? 'Perfil Completo' : 'Perfil Incompleto'}</p>
                                        </div>
                                    </div>
                                    <span className="text-lemon-600 font-bold group-hover:translate-x-1 transition-transform">Elegir →</span>
                                </button>
                            ))}

                            <button
                                onClick={() => {
                                    setSelectedStudentId('new')
                                    setIsProfileComplete(false)
                                    setStep(-1)
                                }}
                                className="p-4 rounded-xl border-2 border-dashed border-canvas-200 hover:border-leaf-400 hover:bg-leaf-50 transition-all flex items-center gap-4 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-leaf-100 flex items-center justify-center text-xl text-leaf-600">
                                    +
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-warm-800">Inscribir a otro niño/a</p>
                                    <p className="text-sm text-warm-500">Agregar un nuevo perfil a tu cuenta</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP -1: Student Data */}
                {step === -1 && (
                    <div className="card max-w-2xl mx-auto space-y-6 animate-slide-up">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-warm-800">1. Datos del Alumno</h2>
                            <p className="text-warm-500">Completá los datos de tu hijo/a para comenzar.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Nombre *</label>
                                <input type="text" className="input-field"
                                    value={studentData.nombre} onChange={e => handleStudentChange('nombre', e.target.value)} required />
                            </div>
                            <div>
                                <label className="label">Apellido *</label>
                                <input type="text" className="input-field"
                                    value={studentData.apellido} onChange={e => handleStudentChange('apellido', e.target.value)} required />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">DNI *</label>
                                <input type="text" className="input-field"
                                    value={studentData.dni} onChange={e => handleStudentChange('dni', e.target.value)} required />
                            </div>
                            <div>
                                <label className="label">Fecha de Nacimiento *</label>
                                <input type="date" className="input-field"
                                    value={studentData.fechaNacimiento} onChange={e => handleStudentChange('fechaNacimiento', e.target.value)} required />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Edad</label>
                                <input type="text" className="input-field bg-canvas-50" value={studentData.edad} readOnly />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="label">Calle *</label>
                                    <input type="text" className="input-field"
                                        value={studentData.domicilioCalle} onChange={e => handleStudentChange('domicilioCalle', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="label">N° *</label>
                                    <input type="text" className="input-field"
                                        value={studentData.domicilioNumero} onChange={e => handleStudentChange('domicilioNumero', e.target.value)} required />
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Colegio *</label>
                                <select className="input-field"
                                    value={studentData.colegio} onChange={e => handleStudentChange('colegio', e.target.value)} required>
                                    <option value="">Seleccionar...</option>
                                    {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Grado/Año *</label>
                                <select className="input-field"
                                    value={studentData.grado} onChange={e => handleStudentChange('grado', e.target.value)} required>
                                    <option value="">Seleccionar...</option>
                                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => {
                                    if (!studentData.nombre || !studentData.apellido || !studentData.dni || !studentData.fechaNacimiento || !studentData.domicilioCalle || !studentData.domicilioNumero || !studentData.colegio || !studentData.grado) {
                                        setError('Por favor completá todos los campos obligatorios (*)')
                                        return
                                    }
                                    setError('')
                                    setStep(1)
                                }}
                                className="w-full btn-primary py-4 text-lg"
                            >
                                Siguiente: Elegir Taller
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Authorizations (Permisos y Firma) */}
                {step === 3 && (
                    <div className="card max-w-2xl mx-auto space-y-6 animate-slide-up">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-warm-800">Permisos y Firma</h2>
                            <p className="text-warm-500">Necesitamos tu autorización legal como tutor.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-start gap-3 p-3 rounded-xl border border-canvas-200 hover:bg-canvas-50 cursor-pointer">
                                <input type="checkbox" className="mt-1" checked={authData.autorizacionParticipacion} onChange={e => setAuthData({ ...authData, autorizacionParticipacion: e.target.checked })} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-warm-800">Autorizo la participación en el taller *</span>
                                    <span className="text-[11px] text-warm-500">Permite que el niño/a realice las actividades artísticas programadas.</span>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 p-3 rounded-xl border border-canvas-200 hover:bg-canvas-50 cursor-pointer">
                                <input type="checkbox" className="mt-1" checked={authData.autorizacionMedica} onChange={e => setAuthData({ ...authData, autorizacionMedica: e.target.checked })} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-warm-800">Autorizo atención médica de emergencia *</span>
                                    <span className="text-[11px] text-warm-500">Permite actuar rápidamente ante cualquier imprevisto de salud.</span>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 p-3 rounded-xl border border-canvas-200 hover:bg-canvas-50 cursor-pointer">
                                <input type="checkbox" className="mt-1" checked={authData.autorizacionImagenes} onChange={e => setAuthData({ ...authData, autorizacionImagenes: e.target.checked })} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-warm-800">Autorizo uso de imágenes con fines educativos</span>
                                    <span className="text-[11px] text-warm-500">Para compartir fotos de las obras y el proceso creativo en nuestras redes.</span>
                                </div>
                            </label>

                            <div className="p-3 rounded-xl border border-canvas-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" className="mt-1" checked={authData.aceptacionReglamento} onChange={e => setAuthData({ ...authData, aceptacionReglamento: e.target.checked })} />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-warm-800">Acepto el reglamento interno *</span>
                                            <span className="text-[11px] text-warm-500">Normas de convivencia, pagos y asistencia para un mejor funcionamiento.</span>
                                        </div>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowRules(true)}
                                        className="text-xs font-bold text-lemon-600 hover:text-lemon-700 underline"
                                    >
                                        Leer Reglamento
                                    </button>
                                </div>
                            </div>

                            {/* Rules Modal */}
                            {showRules && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-sm animate-fade-in">
                                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
                                        <div className="p-8 border-b border-canvas-100 flex justify-between items-center bg-canvas-50">
                                            <h3 className="text-xl font-serif font-black text-warm-800">Reglamento Interno</h3>
                                            <button onClick={() => setShowRules(false)} className="text-warm-400 hover:text-red-500 transition-colors">✕</button>
                                        </div>
                                        <div className="p-8 max-h-[60vh] overflow-y-auto text-warm-700 space-y-4 text-sm leading-relaxed">
                                            <p className="font-bold">1. Asistencia y Puntualidad</p>
                                            <p>Se ruega puntualidad tanto en el ingreso como en el retiro de los niños para garantizar su seguridad. Fuera de los horarios de clase, la supervisión de los alumnos queda bajo responsabilidad de sus tutores.</p>

                                            <p className="font-bold">2. Materiales</p>
                                            <p>Todos los materiales básicos están incluidos, a menos que se especifique lo contrario para proyectos especiales.</p>

                                            <p className="font-bold">3. Comportamiento</p>
                                            <p>Buscamos mantener un ambiente de respeto y creatividad. Comportamientos que afecten la integridad física o emocional de otros niños no serán tolerados.</p>

                                            <p className="font-bold">4. Salud</p>
                                            <p>Si el alumno presenta síntomas de malestar o enfermedad, se solicita no asistir a clase para preservar la salud del grupo.</p>

                                            <p className="font-bold">5. Pagos</p>
                                            <p>La cuota debe abonarse del 1 al 10 de cada mes. Los pagos realizados fuera de este término tendrán un recargo por mora del 1% diario. La falta de pago puede resultar en la pérdida de la vacante.</p>
                                        </div>
                                        <div className="p-6 bg-canvas-50 border-t border-canvas-100 flex justify-center">
                                            <button
                                                onClick={() => { setAuthData({ ...authData, aceptacionReglamento: true }); setShowRules(false); }}
                                                className="btn-primary px-8"
                                            >
                                                Entendido y Acepto
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-canvas-100">
                                <label className="label">¿El alumno se retira solo? *</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => { setLeavesAlone(true); setAuthData({ ...authData, autorizacionRetiro: 'SÍ, SE RETIRA SOLO' }); }}
                                        className={`p-4 rounded-2xl border-2 font-bold transition-all ${leavesAlone === true ? 'border-lemon-500 bg-lemon-50 text-lemon-700' : 'border-canvas-200 text-warm-400'}`}
                                    >
                                        SÍ, se retira solo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLeavesAlone(false)}
                                        className={`p-4 rounded-2xl border-2 font-bold transition-all ${leavesAlone === false ? 'border-lemon-500 bg-lemon-50 text-lemon-700' : 'border-canvas-200 text-warm-400'}`}
                                    >
                                        NO, lo retiran
                                    </button>
                                </div>

                                {leavesAlone === false && (
                                    <div className="space-y-4">
                                        {authorizedPersons.map((person, index) => (
                                            <div key={index} className="animate-fade-in p-6 bg-canvas-50 rounded-3xl border-2 border-canvas-200 space-y-4 relative">
                                                {authorizedPersons.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAuthorizedPerson(index)}
                                                        className="absolute top-4 right-4 text-red-400 hover:text-red-500 text-sm font-bold"
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                                <h4 className="text-sm font-bold text-warm-700">Persona autorizada {authorizedPersons.length > 1 ? index + 1 : ''}</h4>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-warm-400 ml-1">Nombre</label>
                                                        <input
                                                            type="text"
                                                            className="input-field"
                                                            value={person.nombre}
                                                            onChange={e => handleAuthorizedPersonChange(index, 'nombre', e.target.value)}
                                                            placeholder="Ej: María"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-warm-400 ml-1">Apellido</label>
                                                        <input
                                                            type="text"
                                                            className="input-field"
                                                            value={person.apellido}
                                                            onChange={e => handleAuthorizedPersonChange(index, 'apellido', e.target.value)}
                                                            placeholder="Ej: Garcia"
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label className="text-[10px] font-bold uppercase text-warm-400 ml-1">DNI</label>
                                                        <input
                                                            type="text"
                                                            className="input-field"
                                                            value={person.dni}
                                                            onChange={e => handleAuthorizedPersonChange(index, 'dni', e.target.value)}
                                                            placeholder="Número de documento"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addAuthorizedPerson}
                                            className="w-full py-4 border-2 border-dashed border-lemon-300 rounded-2xl text-lemon-600 font-bold hover:bg-lemon-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="text-xl">+</span> Agregar otra persona autorizada
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-canvas-100 pt-4">
                                <h4 className="font-bold text-warm-800 mb-2">Firma Digital</h4>
                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="label">Aclaración *</label>
                                        <input type="text" className="input-field"
                                            value={authData.aclaracionFirma} onChange={e => setAuthData({ ...authData, aclaracionFirma: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="label">DNI del Firmante *</label>
                                        <input type="text" className="input-field"
                                            value={authData.dniFirma} onChange={e => setAuthData({ ...authData, dniFirma: e.target.value })} />
                                    </div>
                                </div>
                                <div className="border border-warm-300 rounded-xl bg-white overflow-hidden">
                                    <SignatureCanvas ref={sigCanvas} canvasProps={{ className: 'w-full h-40' }} />
                                </div>
                                <button type="button" onClick={() => sigCanvas.current?.clear()} className="text-xs text-lemon-600 mt-2">Limpiar Firma</button>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button onClick={() => setStep(2)} className="px-6 py-4 border border-canvas-300 rounded-xl text-warm-600 font-medium hover:bg-canvas-50">Volver</button>
                            <button
                                onClick={() => {
                                    if (!authData.autorizacionParticipacion || !authData.autorizacionMedica || !authData.aceptacionReglamento || !authData.aclaracionFirma || !authData.dniFirma || sigCanvas.current?.isEmpty() || leavesAlone === null) {
                                        setError('Por favor completá todos los campos obligatorios y firmá.')
                                        return
                                    }
                                    if (leavesAlone === false && (authorizedPersons.some(p => !p.nombre || !p.apellido || !p.dni))) {
                                        setError('Debes ingresar los datos de todas las personas autorizadas.')
                                        return
                                    }

                                    // Prepare autorizacionRetiro string if NOT leavesAlone
                                    if (leavesAlone === false) {
                                        setAuthData({
                                            ...authData,
                                            autorizacionRetiro: authorizedPersons.map(p => `${p.nombre} ${p.apellido} (DNI: ${p.dni})`).join(', ')
                                        })
                                    }

                                    setError('')
                                    setStep(4)
                                }}
                                className="flex-1 btn-primary py-4 text-lg"
                            >
                                Siguiente: Confirmación
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 1: Level Decision */}
                {step === 1 && (
                    <div className="animate-slide-up">
                        {knowsLevel === null ? (
                            <div className="max-w-4xl mx-auto space-y-8 text-center pt-8">
                                <button onClick={() => setStep(-2)} className="text-sm text-lemon-600 hover:underline mb-2">← Volver a selección de alumno</button>
                                <h2 className="text-2xl font-bold text-warm-800">Elegí tu camino</h2>
                                <div className={`grid gap-6 ${opcionesInscripcion.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                                    {opcionesInscripcion.length > 0 ? opcionesInscripcion.filter(op => {
                                        if (op.tipo === 'regular') {
                                            const selectedStudent = existingStudents.find(s => s.id === selectedStudentId)
                                            return selectedStudent?.claseUnicaAprobada
                                        }
                                        return true
                                    }).map(op => (
                                        <button
                                            key={op.id}
                                            onClick={() => {
                                                if (op.tipo === 'clase-unica' || (op.redirigirUrl && op.redirigirUrl.includes('clase-unica')) || op.tipo === 'clase_unica') {
                                                    setKnowsLevel(true); setIsClaseUnica(true); setIsSummer(false); setStep(2);
                                                } else if (op.redirigirUrl) {
                                                    window.location.href = op.redirigirUrl;
                                                } else if (op.tipo === 'verano') {
                                                    setKnowsLevel(true); setIsSummer(true); setIsClaseUnica(false); setStep(2);
                                                } else {
                                                    setKnowsLevel(true); setIsSummer(false); setIsClaseUnica(false);
                                                }
                                            }}
                                            className={`p-8 rounded-3xl border-2 border-warm-200 hover:${op.colorBorde} hover:${op.colorHoverBg} transition-all group relative overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-md`}
                                        >
                                            {op.esNuevo && (
                                                <div className="absolute top-0 right-0 bg-purple-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">NUEVO</div>
                                            )}
                                            <div className={`w-16 h-16 rounded-2xl ${op.colorFondo} mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner`}>
                                                {op.emoji}
                                            </div>
                                            <h3 className="text-xl font-black text-warm-800 mb-2">{op.nombre}</h3>
                                            <p className="text-warm-500 text-sm">{op.descripcion}</p>
                                        </button>
                                    )) : (
                                        <>
                                            {(existingStudents.find(s => s.id === selectedStudentId)?.claseUnicaAprobada) && (
                                                <button onClick={() => { setKnowsLevel(true); setIsSummer(false); setIsClaseUnica(false); }} className="p-8 rounded-3xl border-2 border-warm-200 hover:border-lemon-400 hover:bg-lemon-50/50 transition-all group flex flex-col items-center text-center shadow-sm hover:shadow-md">
                                                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">🎨</div>
                                                    <h3 className="text-xl font-black text-warm-800 mb-2">Taller Regular</h3>
                                                    <p className="text-warm-500 text-sm">Curso anual completo de arte.</p>
                                                </button>
                                            )}
                                            <button onClick={() => { setKnowsLevel(true); setIsSummer(true); setIsClaseUnica(false); setStep(2); }} className="p-8 rounded-3xl border-2 border-warm-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all group relative overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-md">
                                                <div className="w-16 h-16 rounded-2xl bg-orange-100 mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">☀️</div>
                                                <h3 className="text-xl font-black text-warm-800 mb-2">Taller de Verano</h3>
                                                <p className="text-warm-500 text-sm">Enero y Febrero. Modalidades especiales.</p>
                                            </button>
                                            <button onClick={() => { setKnowsLevel(true); setIsClaseUnica(true); setIsSummer(false); setStep(2); }} className="p-8 rounded-3xl border-2 border-warm-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all group relative overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-md">
                                                <div className="absolute top-0 right-0 bg-purple-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">NUEVO</div>
                                                <div className="w-16 h-16 rounded-2xl bg-purple-100 mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">✨</div>
                                                <h3 className="text-xl font-black text-warm-800 mb-2">Clase Única</h3>
                                                <p className="text-warm-500 text-sm">Una clase individual para probar.</p>
                                            </button>
                                        </>
                                    )}
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
                {step === 2 && knowsLevel === true && !isSummer && !isClaseUnica && (
                    <div className="max-w-4xl mx-auto animate-slide-up space-y-8">
                        {/* ... Existing Slot UI ... */}
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-warm-800">{'Armá tu Horario'}</h2>
                            <button onClick={() => { setKnowsLevel(null); setSelectedFase(''); setStep(1); }} className="text-sm text-lemon-600 hover:underline mt-2">{'← Volver'}</button>
                            <p className="text-warm-500">{'Podés elegir hasta 2 días de cursada semanal.'}</p>
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
                        {
                            isAddingSlot && (
                                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border-2 border-lemon-200 shadow-xl space-y-8 animate-fade-in relative">
                                    <button onClick={() => setIsAddingSlot(false)} className="absolute top-6 right-6 text-warm-400 hover:text-red-500">✕</button>
                                    <h3 className="text-xl font-bold text-warm-800 text-center">Nuevo Turno</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-warm-700 mb-2">Día</label>
                                            <div className="flex flex-wrap gap-2">
                                                {(talleres.find(t => t.nombre === 'Taller Regular')?.diasSemana?.split(',') || DIAS).map((d: string) => (
                                                    <button key={d} onClick={() => setTempDia(d.trim())} className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${tempDia === d.trim() ? 'bg-lemon-500 border-lemon-500 text-white' : 'bg-white border-warm-100 text-warm-600'}`}>{d.trim()}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {tempDia && (
                                            <div className="animate-fade-in">
                                                <label className="block text-sm font-bold text-warm-700 mb-2">Horario</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {(talleres.find(t => t.nombre === 'Taller Regular')?.horarios || HORARIOS).map((h: any) => (
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
                            )
                        }
                        <div className="flex justify-center pt-8">
                            <button disabled={slots.length === 0 || isAddingSlot} onClick={() => setStep(3)} className="px-12 py-4 bg-warm-900 text-white font-black rounded-2xl shadow-xl disabled:opacity-50 hover:bg-black transition-colors">Continuar con {slots.length} {slots.length === 1 ? 'día' : 'días'}</button>
                        </div>
                    </div >
                )
                }

                {/* STEP 2: Clase Única Schedule */}
                {step === 2 && isClaseUnica && (
                    <div className="card max-w-2xl mx-auto space-y-8 animate-slide-up">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-warm-800">{'Elegí día y horario'}</h2>
                            <button onClick={() => { setKnowsLevel(null); setIsClaseUnica(false); setStep(1); }} className="text-sm text-lemon-600 hover:underline mt-2">{'← Volver'}</button>
                            <p className="text-warm-500">{'Seleccioná cuándo querés asistir a tu clase.'}</p>
                        </div>

                        {/* Day Selection */}
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">Día de la semana</label>
                            <div className="flex flex-wrap gap-2">
                                {(talleres.find(t => t.nombre === 'Clase Única')?.diasSemana?.split(',') || DIAS).map((d: string) => (
                                    <button
                                        key={d}
                                        onClick={() => { setTempDia(d.trim()); setTempAsiento(null); }}
                                        className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${tempDia === d.trim() ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white border-warm-100 text-warm-600 hover:border-purple-300'}`}
                                    >
                                        {d.trim()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Selection */}
                        {tempDia && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-bold text-warm-700 mb-2">Horario</label>
                                <div className="flex flex-wrap gap-2">
                                    {(talleres.find(t => t.nombre === 'Clase Única')?.horarios || HORARIOS).map((h: any) => (
                                        <button
                                            key={h.value}
                                            onClick={() => { setTempHorario(h.value); setTempAsiento(null); }}
                                            className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${tempHorario === h.value ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white border-warm-100 text-warm-600 hover:border-purple-300'}`}
                                        >
                                            {h.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Seat Selection */}
                        {tempDia && tempHorario && (
                            <div className="animate-fade-in space-y-4">
                                <div className="text-center"><p className="text-sm font-bold text-warm-500">{'Elegí tu asiento'}</p></div>
                                <div className="flex flex-wrap justify-center gap-4 bg-warm-50 p-6 rounded-3xl border-2 border-warm-100">
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
                                        const occupied = occupiedSeats.includes(num)
                                        return (
                                            <button
                                                key={num}
                                                disabled={occupied}
                                                onClick={() => setTempAsiento(num)}
                                                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all ${occupied ? 'bg-warm-200 border-warm-300 text-warm-400 cursor-not-allowed' : tempAsiento === num ? 'bg-purple-500 border-purple-500 text-white scale-110' : 'bg-white border-warm-200 text-warm-600 hover:border-purple-400'}`}
                                            >
                                                {num}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Price + Continue */}
                        {tempDia && tempHorario && tempAsiento && (
                            <div className="animate-fade-in space-y-4">
                                <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-warm-700 font-bold">Precio Clase Única:</span>
                                        <span className="text-2xl font-black text-purple-600">${precioClaseUnica.toLocaleString('es-AR')}</span>
                                    </div>
                                </div>
                                <button onClick={() => setStep(3)} className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl hover:bg-purple-700 transition-colors">
                                    Continuar
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 2: Summer Workshop Configuration */}
                {
                    step === 2 && isSummer && (
                        <div className="max-w-2xl mx-auto space-y-8 animate-slide-up">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-serif font-bold text-warm-800">Taller de Verano 2026</h2>
                                <button onClick={() => { setKnowsLevel(null); setIsSummer(false); setStep(1); }} className="text-sm text-lemon-600 hover:underline mt-2">← Volver</button>
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
                                            className={`p-4 rounded-xl border-2 font-bold transition-all text-center ${summerFrequency === '1x' ? 'border-lemon-500 bg-lemon-500 text-white shadow-lg' : 'border-warm-200 text-warm-600 hover:border-lemon-300'}`}
                                        >
                                            1 vez por semana
                                        </button>
                                        <button
                                            onClick={() => setSummerFrequency('2x')}
                                            className={`p-4 rounded-xl border-2 font-bold transition-all text-center ${summerFrequency === '2x' ? 'border-lemon-500 bg-lemon-500 text-white shadow-lg' : 'border-warm-200 text-warm-600 hover:border-lemon-300'}`}
                                        >
                                            2 veces por semana
                                        </button>
                                    </div>
                                </div>

                                {/* 3. Select Days */}
                                <div>
                                    <label className="block text-sm font-bold text-warm-700 mb-4 uppercase tracking-wider">3. Día{summerFrequency === '2x' ? 's' : ''} de Cursada</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {['MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'].map(dia => {
                                            const isSelected = summerDays.includes(dia)
                                            return (
                                                <button
                                                    key={dia}
                                                    onClick={() => {
                                                        if (summerFrequency === '1x') {
                                                            setSummerDays([dia])
                                                        } else {
                                                            // 2x logic
                                                            if (isSelected) {
                                                                setSummerDays(summerDays.filter(d => d !== dia))
                                                            } else {
                                                                if (summerDays.length < 2) {
                                                                    setSummerDays([...summerDays, dia])
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    className={`p-4 rounded-xl border-2 font-bold transition-all text-center ${isSelected ? 'border-orange-500 bg-orange-500 text-white shadow-lg' : 'border-warm-200 text-warm-600 hover:border-orange-300'} ${summerFrequency === '2x' && !isSelected && summerDays.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {dia.charAt(0) + dia.slice(1).toLowerCase()}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <p className="text-xs text-warm-400 mt-2 px-2">
                                        {summerFrequency === '2x' && summerDays.length < 2 ? `* Elegí 2 días para tu cursada.` : '* Tu clase será siempre el mismo día cada semana.'}
                                    </p>
                                </div>

                                {/* 4. Select Time */}
                                <div>
                                    <label className="block text-sm font-bold text-warm-700 mb-4 uppercase tracking-wider">4. Elegí el Horario</label>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {(summerModality === 'BASE' ? SUMMER_HORARIOS_BASE : SUMMER_HORARIOS_EXTENDED).map((h) => (
                                            <button
                                                key={h.value}
                                                onClick={() => setSummerTime(h.value)}
                                                className={`p-4 rounded-xl border-2 font-bold transition-all text-center ${summerTime === h.value ? 'border-lemon-500 bg-lemon-500 text-white shadow-lg' : 'border-warm-200 text-warm-600 hover:border-lemon-300'}`}
                                            >
                                                {h.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 5. Date Selection */}
                                <div>
                                    <label className="block text-sm font-bold text-warm-700 mb-2 uppercase tracking-wider">5. Fecha de Inicio</label>
                                    <input
                                        type="date"
                                        className="w-full p-4 rounded-xl border-2 border-warm-200 font-bold text-warm-800 focus:border-lemon-500 focus:ring-4 focus:ring-lemon-100 outline-none transition-all"
                                        value={summerStartDate}
                                        onChange={(e) => setSummerStartDate(e.target.value)}
                                        min="2026-01-06"
                                        max="2026-02-28"
                                    />
                                    <p className="text-xs text-warm-400 mt-2 px-2">
                                        * Seleccioná la fecha de tu primera clase. El precio se ajusta según las semanas restantes.
                                    </p>
                                </div>

                                <button
                                    disabled={!summerStartDate || summerDays.length === 0 || (summerFrequency === '2x' && summerDays.length < 2) || !summerTime}
                                    onClick={() => setStep(3)}
                                    className="w-full py-4 bg-lemon-500 text-white font-black rounded-xl hover:bg-lemon-600 disabled:opacity-50 disabled:hover:bg-lemon-500 transition-colors shadow-lg shadow-lemon-200"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* STEP 2 (Placement Test) */}
                {
                    step === 2 && knowsLevel === false && (
                        <div className="max-w-md mx-auto space-y-6 text-center animate-slide-up">
                            <h2 className="text-2xl font-bold">Confirmar Cita</h2>
                            <p className="text-xl">Fecha: {placementDate} {placementTime}</p>
                            <button onClick={handlePlacementTest} disabled={processing} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">{processing ? 'Confirmando...' : 'Confirmar'}</button>
                        </div>
                    )
                }

                {/* STEP 4: Payment/Summary (Unified) */}
                {
                    step === 4 && knowsLevel === true && (
                        <div className="max-w-md mx-auto space-y-8 animate-scale-up">
                            <div className="bg-white rounded-[2.5rem] border-2 border-warm-100 overflow-hidden shadow-2xl p-8 space-y-6">
                                <h2 className="text-2xl font-black text-warm-900 text-center">Resumen de Inscripción</h2>
                                <div className="space-y-4">
                                    {isClaseUnica ? (
                                        <>
                                            <div className="p-4 bg-purple-50 rounded-2xl">
                                                <p className="text-xs uppercase font-bold text-purple-600 mb-1">Programa</p>
                                                <p className="font-bold text-warm-800">Clase Única</p>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-warm-100 pb-2">
                                                <p className="text-xs uppercase font-bold text-warm-400">Día</p>
                                                <p className="font-bold text-warm-800">{tempDia}</p>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-warm-100 pb-2">
                                                <p className="text-xs uppercase font-bold text-warm-400">Horario</p>
                                                <p className="font-bold text-warm-800">{tempHorario}</p>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-warm-100 pb-2">
                                                <p className="text-xs uppercase font-bold text-warm-400">Asiento</p>
                                                <p className="font-bold text-warm-800">#{tempAsiento}</p>
                                            </div>
                                        </>
                                    ) : isSummer ? (
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
                                                <p className="text-xs uppercase font-bold text-warm-400">Días ({summerFrequency})</p>
                                                <p className="font-bold text-warm-800 text-right">
                                                    {summerDays.map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(' y ')}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-warm-100 pb-2">
                                                <p className="text-xs uppercase font-bold text-warm-400">Horario</p>
                                                <p className="font-bold text-warm-800 text-right">{summerTime}</p>
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
                                            {isClaseUnica
                                                ? `$${precioClaseUnica.toLocaleString('es-AR')}`
                                                : isSummer
                                                    ? `$${calculateSummerPrice(summerStartDate, summerModality, summerFrequency).toLocaleString('es-AR')}`
                                                    : `$${(slots.length * 25000).toLocaleString('es-AR')}`
                                            }
                                        </span>
                                    </div>
                                    {isSummer && summerStartDate && (
                                        <p className="text-xs text-warm-400 text-right mt-2">
                                            Precio proporcional según semanas restantes
                                        </p>
                                    )}
                                </div>
                            </div>
                            {error && <div className="p-4 bg-red-100 text-red-600 rounded-xl font-bold text-center">{error}</div>}
                            <button onClick={handleEnroll} disabled={processing} className="w-full py-4 bg-warm-900 text-white font-black rounded-2xl shadow-xl hover:bg-black">{processing ? 'Procesando...' : 'Confirmar Inscripción'}</button>
                        </div>
                    )
                }
            </main >

            {/* Back button */}
            {
                step > 1 && step !== 3 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-warm-100 px-6 py-3 rounded-full shadow-2xl z-50">
                        <button onClick={prevStep} className="flex items-center gap-2 text-warm-500 hover:text-warm-900 transition-colors font-bold uppercase text-[10px] tracking-widest">
                            <span>←</span> Anterior
                        </button>
                        <div className="h-4 w-px bg-warm-100"></div>
                        <span className="text-[10px] font-black text-warm-300 tracking-[0.3em] uppercase">
                            Paso {step} de {totalSteps}
                        </span>
                    </div>
                )
            }
        </div >
    )
}
