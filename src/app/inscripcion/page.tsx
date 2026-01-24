'use client'

import { useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import SignatureCanvas from 'react-signature-canvas'

// ==================== TYPES ====================
// ==================== LISTS ====================
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

// ==================== TYPES ====================
interface StudentData {
    nombre: string
    apellido: string
    dni: string
    fechaNacimiento: string
    edad: string
    domicilio: string
    colegio: string
    grado: string
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

interface AuthorizationData {
    autorizacionParticipacion: boolean
    autorizacionMedica: boolean
    autorizacionRetiro: string // "NO" or Name of person
    autorizacionImagenes: boolean
    aceptacionReglamento: boolean
    aclaracionFirma: string
    dniFirma: string
}

// ==================== MAIN COMPONENT ====================
function InscripcionContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialModeParam = searchParams.get('mode')
    const initialMode = (initialModeParam === 'inscripcion' || initialModeParam === 'nivelacion') ? initialModeParam : 'choice'
    const initialStep = initialMode === 'inscripcion' ? 1 : 0

    const sigCanvas = useRef<SignatureCanvas>(null)
    const [step, setStep] = useState(initialStep) // 0 = choice, 1-4 = inscription steps
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showRegulations, setShowRegulations] = useState(false)
    const [mode, setMode] = useState<'choice' | 'inscripcion' | 'nivelacion'>(initialMode)

    // Leveling form data
    const [levelingData, setLevelingData] = useState({
        nombreAlumno: '',
        edadAlumno: '',
        nombreTutor: '',
        telefonoTutor: '',
        emailTutor: '',
        fechaPreferida: '',
        horaPreferida: ''
    })

    // Form data
    const [studentData, setStudentData] = useState<StudentData>({
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '',
        edad: '',
        domicilio: '',
        colegio: '',
        grado: ''
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

    const [authData, setAuthData] = useState<AuthorizationData>({
        autorizacionParticipacion: false,
        autorizacionMedica: false,
        autorizacionRetiro: 'NO',
        autorizacionImagenes: false,
        aceptacionReglamento: false,
        aclaracionFirma: '',
        dniFirma: '' // Defaults to tutor DNI usually
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

    // Handle inputs
    const handleStudentChange = (field: keyof StudentData, value: string) => {
        setStudentData(prev => ({ ...prev, [field]: value }))
        if (field === 'fechaNacimiento') {
            const age = calculateAge(value)
            setStudentData(prev => ({ ...prev, edad: age }))
        }
    }

    const handleGuardianChange = (field: keyof GuardianData, value: string) => {
        setGuardianData(prev => ({ ...prev, [field]: value }))
        // Auto-fill DNI Firma if DNI Tutor changes and empty
        if (field === 'tutorDni') {
            setAuthData(prev => ({ ...prev, dniFirma: value }))
        }
    }

    const handleAuthChange = (field: keyof AuthorizationData, value: any) => {
        setAuthData(prev => ({ ...prev, [field]: value }))
    }

    const clearSignature = () => {
        sigCanvas.current?.clear()
    }

    // VALIDATION
    const validateStep1 = () => {
        if (!studentData.nombre || !studentData.apellido || !studentData.dni || !studentData.fechaNacimiento || !studentData.domicilio || !studentData.colegio || !studentData.grado) {
            setError('Por favor completá todos los campos obligatorios (*)')
            return false
        }
        setError('')
        return true
    }

    const validateStep2 = () => {
        if (!guardianData.tutorNombre || !guardianData.tutorDni || !guardianData.tutorRelacion ||
            !guardianData.tutorTelefonoPrincipal || !guardianData.tutorEmail) {
            setError('Por favor completá todos los campos obligatorios (*)')
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(guardianData.tutorEmail)) {
            setError('Por favor ingresá un email válido')
            return false
        }
        setError('')
        return true
    }

    const validateStep3 = () => {
        if (!authData.autorizacionParticipacion || !authData.autorizacionMedica) {
            setError('Debes autorizar la participación y la atención médica de emergencia.')
            return false
        }
        if (!authData.autorizacionRetiro) {
            setError('Debes especificar quién retira al alumno.')
            return false
        }
        setError('')
        return true
    }

    const validateStep4 = () => {
        if (!authData.aceptacionReglamento) {
            setError('Debes aceptar el reglamento.')
            return false
        }
        if (sigCanvas.current?.isEmpty()) {
            setError('Por favor firmá en el recuadro.')
            return false
        }
        if (!authData.aclaracionFirma || !authData.dniFirma) {
            setError('Faltan datos de la firma.')
            return false
        }
        return true
    }

    // Navigation
    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2)
        else if (step === 2 && validateStep2()) setStep(3)
        else if (step === 3 && validateStep3()) setStep(4)
    }

    const handlePrevious = () => {
        if (step === 1) {
            setMode('choice')
            setStep(0)
        } else {
            setStep(step - 1)
        }
        setError('')
    }

    // Submit
    const handleSubmit = async () => {
        if (!validateStep4()) return

        setLoading(true)
        setError('')

        // Get signature image
        const signatureImage = sigCanvas.current?.getCanvas().toDataURL('image/png')

        try {
            const response = await fetch('/api/inscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...studentData,
                    nombre: `${studentData.nombre} ${studentData.apellido}`, // Combine name
                    ...guardianData,
                    ...authData,
                    firmaResponsable: signatureImage
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la inscripción')
            }

            // Success
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
            <header className="bg-white/80 backdrop-blur-md border-b border-canvas-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3">
                            <Image src="/colores.png" alt="Logo" width={50} height={30} className="object-contain" />
                            <span className="font-gigi text-xl font-bold text-warm-800">Limoné</span>
                        </Link>
                        <div className="text-sm font-medium text-warm-600">
                            {mode === 'nivelacion' ? 'Agendar Nivelación' : step > 0 ? `Paso ${step} de 4` : 'Elegí tu camino'}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Progress Bar - only show for inscription */}
                {mode === 'inscripcion' && step > 0 && (
                    <div className="w-full bg-canvas-200 h-2 rounded-full mb-8 overflow-hidden shadow-inner">
                        <div
                            className="bg-brand-yellow h-full transition-all duration-500 ease-out shadow-glow-lemon"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                )}

                <div className="card max-w-none">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                            <span className="text-xl">⚠️</span>
                            <div>{error}</div>
                        </div>
                    )}

                    {/* STEP 0: Initial Choice */}
                    {step === 0 && mode === 'choice' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-warm-800 mb-2">¡Bienvenido a Taller Limoné!</h2>
                                <p className="text-warm-500">¿Qué te gustaría hacer?</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => { setMode('inscripcion'); setStep(1); }}
                                    className="p-8 rounded-3xl border-2 border-warm-200 hover:border-lemon-400 hover:bg-lemon-50/50 transition-all group flex flex-col items-center text-center shadow-sm hover:shadow-md"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-lemon-100 mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">📝</div>
                                    <h3 className="text-xl font-black text-warm-800 mb-2">Inscribirme</h3>
                                    <p className="text-warm-500 text-sm">Ya sé en qué nivel quiero inscribir a mi hijo/a.</p>
                                </button>

                                <button
                                    onClick={() => { setMode('nivelacion'); }}
                                    className="p-8 rounded-3xl border-2 border-warm-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group flex flex-col items-center text-center shadow-sm hover:shadow-md"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-blue-100 mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">🤔</div>
                                    <h3 className="text-xl font-black text-warm-800 mb-2">Clase Gratuita Única</h3>
                                    <p className="text-warm-500 text-sm">Quiero agendar una clase de prueba sin cargo para conocer el taller.</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* NIVELACION FORM */}
                    {mode === 'nivelacion' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center">
                                <button onClick={() => { setMode('choice'); setError(''); }} className="text-sm text-lemon-600 hover:underline mb-4">← Volver</button>
                                <h2 className="text-2xl font-bold text-warm-800">Agendar Clase de Prueba</h2>
                                <p className="text-warm-500 mt-2">Completá el formulario y te contactaremos para coordinar tu clase gratuita.</p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Nombre del Alumno *</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={levelingData.nombreAlumno}
                                        onChange={e => setLevelingData({ ...levelingData, nombreAlumno: e.target.value })}
                                        placeholder="Nombre y apellido del niño/a"
                                    />
                                </div>
                                <div>
                                    <label className="label">Edad del Alumno *</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={levelingData.edadAlumno}
                                        onChange={e => setLevelingData({ ...levelingData, edadAlumno: e.target.value })}
                                        placeholder="Ej: 10"
                                        min="5"
                                        max="18"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Nombre del Tutor *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={levelingData.nombreTutor}
                                    onChange={e => setLevelingData({ ...levelingData, nombreTutor: e.target.value })}
                                    placeholder="Nombre y apellido del padre/madre/tutor"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Teléfono / WhatsApp *</label>
                                    <input
                                        type="tel"
                                        className="input-field"
                                        value={levelingData.telefonoTutor}
                                        onChange={e => setLevelingData({ ...levelingData, telefonoTutor: e.target.value })}
                                        placeholder="+54 9 2901 xxxxxx"
                                    />
                                </div>
                                <div>
                                    <label className="label">Email *</label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        value={levelingData.emailTutor}
                                        onChange={e => setLevelingData({ ...levelingData, emailTutor: e.target.value })}
                                        placeholder="email@ejemplo.com"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Fecha Preferida (opcional)</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={levelingData.fechaPreferida}
                                        onChange={e => setLevelingData({ ...levelingData, fechaPreferida: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Hora Preferida (opcional)</label>
                                    <select
                                        className="input-field"
                                        value={levelingData.horaPreferida}
                                        onChange={e => setLevelingData({ ...levelingData, horaPreferida: e.target.value })}
                                    >
                                        <option value="">Cualquier horario</option>
                                        <option value="16:00">16:00 hs</option>
                                        <option value="17:00">17:00 hs</option>
                                        <option value="18:00">18:00 hs</option>
                                        <option value="19:00">19:00 hs</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-sm text-blue-800">
                                    <strong>¿Qué es la clase de prueba?</strong><br />
                                    Es una clase única y gratuita donde el alumno participa de la actividad para conocer el taller y definimos su grupo ideal.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    // Validate required fields
                                    if (!levelingData.nombreAlumno || !levelingData.edadAlumno || !levelingData.nombreTutor || !levelingData.telefonoTutor || !levelingData.emailTutor) {
                                        setError('Por favor completá todos los campos obligatorios (*)')
                                        return
                                    }
                                    setError('')
                                    // Send to WhatsApp
                                    const message = `Hola Natalia! 👋

Quiero agendar una *Clase de Prueba Gratuita* para mi hijo/a:

👧 *Alumno:* ${levelingData.nombreAlumno}
📅 *Edad:* ${levelingData.edadAlumno} años
👤 *Tutor:* ${levelingData.nombreTutor}
📱 *Teléfono:* ${levelingData.telefonoTutor}
📧 *Email:* ${levelingData.emailTutor}
${levelingData.fechaPreferida ? `🗓️ *Fecha preferida:* ${levelingData.fechaPreferida}` : ''}
${levelingData.horaPreferida ? `⏰ *Hora preferida:* ${levelingData.horaPreferida}` : ''}

¡Gracias!`
                                    window.location.href = `https://wa.me/5492901588969?text=${encodeURIComponent(message)}`
                                }}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-colors shadow-lg"
                            >
                                Contactar por WhatsApp
                            </button>
                        </div>
                    )}

                    {/* STEP 1: Alumno */}
                    {mode === 'inscripcion' && step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-warm-800">1. Datos del Alumno</h2>

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
                                    <input type="text" className="input-field bg-gray-50" value={studentData.edad} readOnly />
                                </div>
                                <div>
                                    <label className="label">Domicilio *</label>
                                    <input type="text" className="input-field"
                                        value={studentData.domicilio} onChange={e => handleStudentChange('domicilio', e.target.value)} required />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Colegio *</label>
                                    <select
                                        className="input-field"
                                        value={studentData.colegio}
                                        onChange={e => handleStudentChange('colegio', e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        {SCHOOLS.map(school => (
                                            <option key={school} value={school}>{school}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Grado / Año *</label>
                                    <select
                                        className="input-field"
                                        value={studentData.grado}
                                        onChange={e => handleStudentChange('grado', e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        {GRADES.map(grade => (
                                            <option key={grade} value={grade}>{grade}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Tutor */}
                    {mode === 'inscripcion' && step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-warm-800">2. Datos del Tutor</h2>
                            <p className="text-sm text-warm-600 -mt-4">Padre, Madre o Tutor Legal</p>

                            <div>
                                <label className="label">Nombre y Apellido *</label>
                                <input type="text" className="input-field"
                                    value={guardianData.tutorNombre} onChange={e => handleGuardianChange('tutorNombre', e.target.value)} required />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">DNI *</label>
                                    <input type="text" className="input-field"
                                        value={guardianData.tutorDni} onChange={e => handleGuardianChange('tutorDni', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="label">Relación *</label>
                                    <select className="input-field"
                                        value={guardianData.tutorRelacion} onChange={e => handleGuardianChange('tutorRelacion', e.target.value)} required>
                                        <option value="">Seleccionar...</option>
                                        <option value="Padre">Padre</option>
                                        <option value="Madre">Madre</option>
                                        <option value="Tutor">Tutor Legal</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Teléfono Principal *</label>
                                    <input type="tel" className="input-field" placeholder="wsp/cel"
                                        value={guardianData.tutorTelefonoPrincipal} onChange={e => handleGuardianChange('tutorTelefonoPrincipal', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="label">Email *</label>
                                    <input type="email" className="input-field"
                                        value={guardianData.tutorEmail} onChange={e => handleGuardianChange('tutorEmail', e.target.value)} required />
                                </div>
                            </div>

                            <div>
                                <label className="label">Domicilio del Tutor ({'Igual al alumno'}?)</label>
                                <input type="text" className="input-field"
                                    value={guardianData.tutorDomicilio} onChange={e => handleGuardianChange('tutorDomicilio', e.target.value)} />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Autorizaciones */}
                    {mode === 'inscripcion' && step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-warm-800">3. Autorizaciones</h2>

                            <div className="space-y-4">
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" className="mt-1 w-5 h-5 text-brand-purple rounded border-canvas-300 focus:ring-brand-purple"
                                            checked={authData.autorizacionParticipacion}
                                            onChange={e => handleAuthChange('autorizacionParticipacion', e.target.checked)} />
                                        <span className="text-sm text-warm-800">
                                            <strong>Participación:</strong> Autorizo a mi hijo/a a participar de las actividades en Taller Limoné.
                                        </span>
                                    </label>
                                </div>

                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" className="mt-1 w-5 h-5 text-lemon-600 rounded"
                                            checked={authData.autorizacionMedica}
                                            onChange={e => handleAuthChange('autorizacionMedica', e.target.checked)} />
                                        <span className="text-sm text-warm-800">
                                            <strong>Atención Médica:</strong> En caso de urgencia, autorizo a realizar las consultas médicas necesarias.
                                        </span>
                                    </label>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-canvas-200">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" className="mt-1 w-5 h-5 text-lemon-600 rounded"
                                            checked={authData.autorizacionImagenes}
                                            onChange={e => handleAuthChange('autorizacionImagenes', e.target.checked)} />
                                        <span className="text-sm text-warm-800">
                                            <strong>Uso de Imagen:</strong> Autorizo la publicación de fotos/videos de las actividades en redes sociales del taller.
                                        </span>
                                    </label>
                                </div>

                                <div className="pt-4 border-t border-canvas-200">
                                    <label className="label mb-2">¿Quién retira al alumno?</label>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="retiro" className="text-lemon-600"
                                                    checked={authData.autorizacionRetiro === 'SOLO'}
                                                    onChange={() => handleAuthChange('autorizacionRetiro', 'SOLO')} />
                                                <span>Se retira solo/a</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="retiro" className="text-lemon-600"
                                                    checked={authData.autorizacionRetiro !== 'SOLO' && authData.autorizacionRetiro !== 'NO'}
                                                    onChange={() => handleAuthChange('autorizacionRetiro', '')} />
                                                <span>Lo retira un adulto</span>
                                            </label>
                                        </div>

                                        {(authData.autorizacionRetiro !== 'SOLO') && (
                                            <input type="text" className="input-field mt-2"
                                                placeholder="Nombre y DNI de personas autorizadas (o 'Padres')"
                                                value={authData.autorizacionRetiro === 'NO' ? '' : authData.autorizacionRetiro}
                                                onChange={e => handleAuthChange('autorizacionRetiro', e.target.value)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Firma */}
                    {mode === 'inscripcion' && step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-warm-800">4. Confirmación y Firma</h2>

                            <button
                                type="button"
                                onClick={() => setShowRegulations(true)}
                                className="w-full text-left bg-blue-50 hover:bg-blue-100 p-4 rounded-xl text-blue-700 font-medium flex items-center justify-between group transition-colors"
                            >
                                <span>📄 Leer Reglamento completo del Taller</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                <input type="checkbox" className="w-5 h-5 text-lemon-600 rounded"
                                    checked={authData.aceptacionReglamento}
                                    onChange={e => handleAuthChange('aceptacionReglamento', e.target.checked)} />
                                <span className="font-medium text-warm-900">He leído y acepto el reglamento y condiciones.</span>
                            </label>

                            <div className="border-t border-canvas-200 pt-6">
                                <label className="label mb-2">Firma del Responsable (Dibujar aquí)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white overflow-hidden relative">
                                    <SignatureCanvas
                                        ref={sigCanvas}
                                        penColor="black"
                                        canvasProps={{
                                            className: 'w-full h-40 cursor-crosshair'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="absolute top-2 right-2 text-xs text-red-500 bg-white px-2 py-1 rounded border border-red-100 hover:bg-red-50"
                                    >
                                        Borrar
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-canvas-200">
                                <Image
                                    src="/colores.png"
                                    alt="Taller Limoné Logo"
                                    width={80}
                                    height={50}
                                    className="mx-auto object-contain"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Aclaración (Nombre Completo) *</label>
                                    <input type="text" className="input-field"
                                        value={authData.aclaracionFirma} onChange={e => handleAuthChange('aclaracionFirma', e.target.value)} />
                                </div>
                                <div>
                                    <label className="label">DNI *</label>
                                    <input type="text" className="input-field"
                                        value={authData.dniFirma} onChange={e => handleAuthChange('dniFirma', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BUTTONS */}
                    {mode === 'inscripcion' && step > 0 && (
                        <div className="flex justify-between gap-4 pt-8 border-t border-canvas-200 mt-8">
                            <button type="button" onClick={handlePrevious} className="btn-outline">
                                Volver
                            </button>

                            {step < 4 ? (
                                <button type="button" onClick={handleNext} className="btn-primary">
                                    Siguiente
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="btn-primary bg-lemon-600 hover:bg-lemon-700"
                                    disabled={loading}
                                >
                                    {loading ? 'Enviando...' : 'Finalizar Inscripción'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Regulations Modal */}
            {showRegulations && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95">
                        <div className="p-6 border-b border-canvas-200 flex justify-between items-center bg-canvas-50 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-warm-800">Reglamento del Taller</h3>
                            <button onClick={() => setShowRegulations(false)} className="text-warm-500 hover:text-warm-800 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6 text-warm-700 leading-relaxed text-sm">
                            <section>
                                <h4 className="font-bold text-warm-900 border-b border-canvas-100 pb-1 mb-3 bg-lemon-50 px-2 rounded">1. Inscripción y Reinscripción</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Matrícula Anual:</strong> Se abona una matrícula anual para nuevos ingresantes de <strong>$30.000</strong> (correspondiente al 60% del valor de la cuota vigente).</li>
                                    <li><strong>Reinscripción:</strong> Para alumnos actuales, se cobra una reinscripción del 50% de la cuota vigente. Se otorga un <strong>10% de descuento</strong> si se abona en diciembre o enero para asegurar el lugar (cupos limitados).</li>
                                    <li><strong>A partir de Febrero:</strong> Las inscripciones y reinscripciones corresponden al 60% del valor de la cuota vigente, sujeto a disponibilidad.</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-warm-900 border-b border-canvas-100 pb-1 mb-3 bg-lemon-50 px-2 rounded">2. Aranceles y Pagos</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Plazo de Pago:</strong> Los aranceles deben abonarse del <strong>1 al 10 de cada mes</strong>. Pasado dicho plazo, se aplicará un recargo del 5%.</li>
                                    <li><strong>Actualizaciones:</strong> Los aranceles pueden modificarse en función de las variaciones del IPC (Índice de Precios al Consumidor).</li>
                                    <li><strong>Clases Mensuales:</strong> Son 4 clases al mes. Algunos meses incluyen una clase extra sin costo adicional para mantener la continuidad (no recuperable).</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-warm-900 border-b border-canvas-100 pb-1 mb-3 bg-lemon-50 px-2 rounded">3. Recuperaciones y Feriados</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Aviso Previo:</strong> Las clases son recuperables únicamente con aviso previo de <strong>mínimo 24 horas</strong>. El no dar aviso implica la pérdida de la clase sin excepción (salvo casos de fuerza mayor).</li>
                                    <li><strong>Compensaciones:</strong> Las clases extras mencionadas se utilizan para compensar días feriados del calendario anual.</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-warm-900 border-b border-canvas-100 pb-1 mb-3 bg-lemon-50 px-2 rounded">4. Materiales</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Cuota de Materiales Básicos:</strong> Valor de <strong>$50.000</strong> (puede abonarse en dos veces). Cubre técnicas básicas: grafito, aguada, tinta china, óleos pastel, tiza pastel, crayones, marcadores, lápices de colores, etc.</li>
                                    <li><strong>Materiales Especiales:</strong> (Flúo, acuarela y acrílico) Se realizan tres colectas anuales de bajo monto, siempre con aviso previo.</li>
                                    <li><strong>Obligatorio:</strong> Es requisito concurrir siempre con carpeta y hojas apropiadas. No se permiten hojas de computadora.</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-warm-900 border-b border-canvas-100 pb-1 mb-3 bg-lemon-50 px-2 rounded">5. Carpeta y Hojas N° 5</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Carpeta:</strong> N° 5 con elástico. Deberá contener únicamente trabajos del taller. Se puede dejar en el taller durante el año.</li>
                                    <li><strong>Hojas:</strong> Usamos un máximo de dos hojas por clase. Se recomienda comprar 2 blocks de 24 si se deja la carpeta en el taller.</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-warm-900 border-b border-canvas-100 pb-1 mb-3 bg-lemon-50 px-2 rounded">6. Recesos y Finalización</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Vacaciones de Invierno:</strong> Del 14 al 25 de julio. El taller continúa actividades normales; quienes tomen el receso deben dar aviso previo. La cuota se abona completa para mantener el lugar.</li>
                                    <li><strong>Cierre de Ciclo:</strong> Las clases terminan el 19 de diciembre. Este mes se abona completo, ya que las clases faltantes se compensan con las clases extras (Septiembre y Octubre).</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-warm-900 border-b border-canvas-100 pb-1 mb-3 bg-lemon-50 px-2 rounded">7. Normas de Convivencia</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Horarios:</strong> Respetar puntualmente entrada y salida. El taller cuenta con 10 min entre grupos para acondicionar el espacio.</li>
                                    <li><strong>Celulares:</strong> Permitido solo para consulta de imágenes artísticas (red Wi-Fi disponible).</li>
                                    <li><strong>Baja del Taller:</strong> Se requiere aviso con <strong>2 semanas de antelación</strong> para organizar el cronograma y reasignar el cupo.</li>
                                    <li><strong>Patrimonio:</strong> Los trabajos no retirados tras 1 año de permanencia pasarán a ser patrimonio del taller.</li>
                                </ul>
                            </section>
                        </div>
                        <div className="p-6 border-t border-canvas-200 bg-canvas-50 rounded-b-2xl flex justify-end">
                            <button
                                onClick={() => {
                                    setShowRegulations(false)
                                    handleAuthChange('aceptacionReglamento', true)
                                }}
                                className="btn-primary"
                            >
                                Entendido y Acepto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function InscripcionPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-lemon flex items-center justify-center">
                <div className="text-xl font-bold text-warm-600 animate-pulse">Cargando...</div>
            </div>
        }>
            <InscripcionContent />
        </Suspense>
    )
}
