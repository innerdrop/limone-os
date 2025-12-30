'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// ==================== TYPES ====================
interface StudentData {
    nombre: string
    dni: string
    fechaNacimiento: string
    edad: string
    domicilio: string
}

interface GuardianData {
    tutorNombre: string
    tutorDni: string
    tutorRelacion: string
    tutorDomicilio: string
    tutorTelefonoPrincipal: string
    tutorTelefonoAlternativo: string
    tutorEmail: string
    tutorProfesion: string
}

// ==================== MAIN COMPONENT ====================
export default function InscripcionPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form data
    const [studentData, setStudentData] = useState<StudentData>({
        nombre: '',
        dni: '',
        fechaNacimiento: '',
        edad: '',
        domicilio: ''
    })

    const [guardianData, setGuardianData] = useState<GuardianData>({
        tutorNombre: '',
        tutorDni: '',
        tutorRelacion: '',
        tutorDomicilio: '',
        tutorTelefonoPrincipal: '',
        tutorTelefonoAlternativo: '',
        tutorEmail: '',
        tutorProfesion: ''
    })

    // Calculate age from birth date
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

    // Handle student data change
    const handleStudentChange = (field: keyof StudentData, value: string) => {
        setStudentData(prev => ({ ...prev, [field]: value }))
        if (field === 'fechaNacimiento') {
            const age = calculateAge(value)
            setStudentData(prev => ({ ...prev, edad: age }))
        }
    }

    // Handle guardian data change
    const handleGuardianChange = (field: keyof GuardianData, value: string) => {
        setGuardianData(prev => ({ ...prev, [field]: value }))
    }

    // Validate step 1
    const validateStep1 = () => {
        if (!studentData.nombre || !studentData.dni || !studentData.fechaNacimiento || !studentData.domicilio) {
            setError('Por favor completá todos los campos obligatorios')
            return false
        }
        setError('')
        return true
    }

    // Validate step 2
    const validateStep2 = () => {
        if (!guardianData.tutorNombre || !guardianData.tutorDni || !guardianData.tutorRelacion ||
            !guardianData.tutorTelefonoPrincipal || !guardianData.tutorEmail) {
            setError('Por favor completá todos los campos obligatorios')
            return false
        }
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(guardianData.tutorEmail)) {
            setError('Por favor ingresá un email válido')
            return false
        }
        setError('')
        return true
    }

    // Handle next step
    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2)
        }
    }

    // Handle previous step
    const handlePrevious = () => {
        setStep(step - 1)
        setError('')
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateStep2()) return

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/inscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...studentData,
                    ...guardianData
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la inscripción')
            }

            // Success - redirect to login or confirmation page
            router.push('/login?inscripcion=exitosa')
        } catch (err: any) {
            setError(err.message || 'Error al procesar la inscripción')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-lemon">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-canvas-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/logo.jpg"
                                alt="Taller Limoné Logo"
                                width={50}
                                height={50}
                                className="rounded-lg object-contain"
                            />
                            <span className="font-serif text-xl font-bold text-warm-800">
                                Taller Limoné
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-warm-800 mb-4">
                        Inscripción al Taller
                    </h1>
                    <p className="text-lg text-warm-600">
                        Completá el formulario para inscribirte
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-lemon-600' : 'text-warm-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-lemon-500 text-white' : 'bg-warm-200'
                                }`}>
                                1
                            </div>
                            <span className="hidden sm:inline font-medium">Datos del Alumno</span>
                        </div>
                        <div className={`h-1 w-12 ${step >= 2 ? 'bg-lemon-500' : 'bg-warm-200'}`} />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-lemon-600' : 'text-warm-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-lemon-500 text-white' : 'bg-warm-200'
                                }`}>
                                2
                            </div>
                            <span className="hidden sm:inline font-medium">Datos del Tutor</span>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Student Data */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-warm-800 mb-6">
                                    📝 Datos del Alumno
                                </h2>

                                <div>
                                    <label className="label">Nombre y Apellido *</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={studentData.nombre}
                                        onChange={(e) => handleStudentChange('nombre', e.target.value)}
                                        placeholder="Juan Pérez"
                                        required
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">DNI *</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={studentData.dni}
                                            onChange={(e) => handleStudentChange('dni', e.target.value)}
                                            placeholder="12345678"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Fecha de Nacimiento *</label>
                                        <input
                                            type="date"
                                            className="input-field"
                                            value={studentData.fechaNacimiento}
                                            onChange={(e) => handleStudentChange('fechaNacimiento', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Edad</label>
                                        <input
                                            type="text"
                                            className="input-field bg-canvas-100"
                                            value={studentData.edad}
                                            readOnly
                                            placeholder="Se calcula automáticamente"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Domicilio *</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={studentData.domicilio}
                                            onChange={(e) => handleStudentChange('domicilio', e.target.value)}
                                            placeholder="Calle 123, Ushuaia"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-end gap-4 pt-4">
                                    <Link href="/" className="btn-outline">
                                        Cancelar
                                    </Link>
                                    <button type="button" onClick={handleNext} className="btn-primary">
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Guardian Data */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-warm-800 mb-6">
                                    👨‍👩‍👧 Datos del Padre / Madre / Tutor Legal
                                </h2>

                                <div>
                                    <label className="label">Nombre y Apellido *</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={guardianData.tutorNombre}
                                        onChange={(e) => handleGuardianChange('tutorNombre', e.target.value)}
                                        placeholder="María González"
                                        required
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">DNI *</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={guardianData.tutorDni}
                                            onChange={(e) => handleGuardianChange('tutorDni', e.target.value)}
                                            placeholder="87654321"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Relación con el menor *</label>
                                        <select
                                            className="input-field"
                                            value={guardianData.tutorRelacion}
                                            onChange={(e) => handleGuardianChange('tutorRelacion', e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Padre">Padre</option>
                                            <option value="Madre">Madre</option>
                                            <option value="Tutor">Tutor Legal</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Domicilio</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={guardianData.tutorDomicilio}
                                        onChange={(e) => handleGuardianChange('tutorDomicilio', e.target.value)}
                                        placeholder="Calle 123, Ushuaia"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Teléfono Principal *</label>
                                        <input
                                            type="tel"
                                            className="input-field"
                                            value={guardianData.tutorTelefonoPrincipal}
                                            onChange={(e) => handleGuardianChange('tutorTelefonoPrincipal', e.target.value)}
                                            placeholder="+54 9 2901 123456"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Teléfono Alternativo</label>
                                        <input
                                            type="tel"
                                            className="input-field"
                                            value={guardianData.tutorTelefonoAlternativo}
                                            onChange={(e) => handleGuardianChange('tutorTelefonoAlternativo', e.target.value)}
                                            placeholder="+54 9 2901 654321"
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Email *</label>
                                        <input
                                            type="email"
                                            className="input-field"
                                            value={guardianData.tutorEmail}
                                            onChange={(e) => handleGuardianChange('tutorEmail', e.target.value)}
                                            placeholder="email@ejemplo.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Profesión / Ocupación</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={guardianData.tutorProfesion}
                                            onChange={(e) => handleGuardianChange('tutorProfesion', e.target.value)}
                                            placeholder="Docente"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-between gap-4 pt-4">
                                    <button type="button" onClick={handlePrevious} className="btn-outline">
                                        Anterior
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Procesando...' : 'Completar Inscripción'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-lemon-200">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-lemon-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-warm-800 mb-2">Información Importante</h3>
                            <p className="text-sm text-warm-600">
                                Una vez completada la inscripción, recibirás un email con tus credenciales de acceso.
                                Al ingresar por primera vez al portal, deberás completar información adicional como
                                contacto de emergencia, datos de salud y autorizaciones necesarias.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
