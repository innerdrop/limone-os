'use client'

import { useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

// ==================== LISTS ====================
const COUNTRY_CODES = [
    { code: '+54', country: '🇦🇷 AR' },
    { code: '+56', country: '🇨🇱 CL' },
    { code: '+55', country: '🇧🇷 BR' },
    { code: '+598', country: '🇺🇾 UY' },
    { code: '+591', country: '🇧🇴 BO' },
    { code: '+51', country: '🇵🇪 PE' },
    { code: '+57', country: '🇨🇴 CO' },
    { code: '+58', country: '🇻🇪 VE' },
    { code: '+52', country: '🇲🇽 MX' },
    { code: '+34', country: '🇪🇸 ES' },
    { code: '+1', country: '🇺🇸 US' },
]

// ==================== MAIN COMPONENT ====================
function InscripcionContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialModeParam = searchParams.get('mode')
    const initialMode = (initialModeParam === 'inscripcion' || initialModeParam === 'nivelacion') ? initialModeParam : 'choice'
    const initialStep = initialMode === 'inscripcion' ? 1 : 0

    const [step, setStep] = useState(initialStep) // 0 = choice, 1 = registration, 2 = success
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [mode, setMode] = useState<'choice' | 'inscripcion' | 'nivelacion'>(initialMode)
    const [registrationResponse, setRegistrationResponse] = useState<{ email: string, tempPassword: string } | null>(null)

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

    // Registration data (Tutor focus)
    const [guardianData, setGuardianData] = useState({
        tutorNombre: '',
        tutorApellido: '',
        tutorDni: '',
        tutorTelefonoPrincipalCod: '+54',
        tutorTelefonoPrincipal: '',
        tutorEmail: ''
    })

    const handleGuardianChange = (field: string, value: string) => {
        setGuardianData(prev => ({ ...prev, [field]: value }))
    }

    // VALIDATION
    const validateRegistration = () => {
        if (!guardianData.tutorNombre || !guardianData.tutorApellido || !guardianData.tutorDni ||
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

    const handlePrevious = () => {
        setMode('choice')
        setStep(0)
        setError('')
    }

    // Submit Registration
    const handleSubmitRegistration = async () => {
        if (!validateRegistration()) return

        setLoading(true)
        setError('')

        try {
            const fullTutorPhone = `${guardianData.tutorTelefonoPrincipalCod} ${guardianData.tutorTelefonoPrincipal}`

            const response = await fetch('/api/inscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...guardianData,
                    tutorTelefonoPrincipal: fullTutorPhone,
                    registrationOnly: true
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar el registro')
            }

            // Success
            setRegistrationResponse(data.data)
            setStep(2)
        } catch (err: any) {
            setError(err.message || 'Error al procesar el registro')
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
                            {mode === 'nivelacion' ? 'Agendar Nivelación' : step > 0 ? `Paso 1 de 1` : 'Elegí tu camino'}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
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
                                    <h3 className="text-xl font-black text-warm-800 mb-2">Registrarme e Inscribirme</h3>
                                    <p className="text-warm-500 text-sm">Crea tu cuenta para comenzar a inscribir a tus hijos.</p>
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

                    {/* NIVELACION FORM (Keeping existing) */}
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
                                    if (!levelingData.nombreAlumno || !levelingData.edadAlumno || !levelingData.nombreTutor || !levelingData.telefonoTutor || !levelingData.emailTutor) {
                                        setError('Por favor completá todos los campos obligatorios (*)')
                                        return
                                    }
                                    setError('')
                                    const message = `Hola Natalia! 👋\n\nQuiero agendar una *Clase de Prueba Gratuita* para mi hijo/a:\n\n👧 *Alumno:* ${levelingData.nombreAlumno}\n📅 *Edad:* ${levelingData.edadAlumno} años\n👤 *Tutor:* ${levelingData.nombreTutor}\n📱 *Teléfono:* ${levelingData.telefonoTutor}\n📧 *Email:* ${levelingData.emailTutor}\n${levelingData.fechaPreferida ? `🗓️ *Fecha preferida:* ${levelingData.fechaPreferida}` : ''}\n${levelingData.horaPreferida ? `⏰ *Hora preferida:* ${levelingData.horaPreferida}` : ''}\n\n¡Gracias!`
                                    window.location.href = `https://wa.me/5492901588969?text=${encodeURIComponent(message)}`
                                }}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-colors shadow-lg"
                            >
                                Contactar por WhatsApp
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Registration Success */}
                    {step === 2 && registrationResponse && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner ring-8 ring-green-50">
                                    ✨
                                </div>
                                <h2 className="text-3xl font-black text-warm-800 mb-2">¡Registro Exitoso!</h2>
                                <p className="text-warm-500">Tu cuenta ha sido creada correctamente.</p>
                            </div>

                            <div className="bg-gradient-to-br from-warm-50 to-canvas-50 p-6 rounded-3xl border-2 border-canvas-200 space-y-4">
                                <h3 className="font-bold text-warm-800 flex items-center gap-2">
                                    <span className="text-lemon-500">🔑</span> Tus credenciales de acceso:
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-canvas-200">
                                        <span className="text-sm text-warm-600">Email:</span>
                                        <span className="font-mono font-bold text-warm-800">{registrationResponse.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-warm-600">Contraseña temporal:</span>
                                        <span className="font-mono font-bold text-warm-800 bg-lemon-200 px-3 py-1 rounded-lg">
                                            {registrationResponse.tempPassword}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-warm-400 text-center uppercase tracking-widest font-bold">
                                    (Son los primeros 4 dígitos de tu DNI)
                                </p>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                                <span className="text-2xl">ℹ️</span>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    Al ingresar por primera vez, el sistema te pedirá <strong>cambiar tu contraseña</strong> por seguridad. Luego podrás inscribir a tus hijos desde el portal.
                                </p>
                            </div>

                            <button
                                onClick={() => router.push('/login')}
                                className="w-full py-4 btn-primary text-xl shadow-xl hover:shadow-lemon-400/30 transition-shadow"
                            >
                                Ir al Inicio de Sesión
                            </button>
                        </div>
                    )}

                    {/* REGISTRATION FORM (TUTOR DATA ONLY) */}
                    {mode === 'inscripcion' && step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-center border-b border-canvas-100 pb-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-warm-800">Datos del Padre/Madre o Tutor</h2>
                                    <p className="text-sm text-warm-600">Completa tus datos para crear tu perfil.</p>
                                </div>
                                <span className="text-xs text-warm-500 font-medium bg-canvas-50 px-2 py-1 rounded-md">(*) Obligatorio</span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Nombre *</label>
                                    <input type="text" className="input-field"
                                        value={guardianData.tutorNombre} onChange={e => handleGuardianChange('tutorNombre', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="label">Apellido *</label>
                                    <input type="text" className="input-field"
                                        value={guardianData.tutorApellido} onChange={e => handleGuardianChange('tutorApellido', e.target.value)} required />
                                </div>
                            </div>

                            <div>
                                <label className="label">DNI *</label>
                                <input type="text" className="input-field"
                                    value={guardianData.tutorDni} onChange={e => handleGuardianChange('tutorDni', e.target.value)} required />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="label">Teléfono *</label>
                                    <div className="flex gap-2">
                                        <select
                                            className="input-field w-24 text-sm"
                                            value={guardianData.tutorTelefonoPrincipalCod}
                                            onChange={e => handleGuardianChange('tutorTelefonoPrincipalCod', e.target.value)}
                                        >
                                            {COUNTRY_CODES.map(c => (
                                                <option key={c.code} value={c.code}>{c.country} ({c.code})</option>
                                            ))}
                                        </select>
                                        <input type="tel" className="input-field flex-1" placeholder="Solo números"
                                            value={guardianData.tutorTelefonoPrincipal} onChange={e => handleGuardianChange('tutorTelefonoPrincipal', e.target.value)} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Email *</label>
                                    <input type="email" className="input-field"
                                        value={guardianData.tutorEmail} onChange={e => handleGuardianChange('tutorEmail', e.target.value)} required />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-canvas-100 flex gap-4">
                                <button
                                    onClick={handlePrevious}
                                    className="px-6 py-3 border border-canvas-300 rounded-xl text-warm-600 font-medium hover:bg-canvas-50 transition-colors"
                                >
                                    Volver
                                </button>
                                <button
                                    onClick={handleSubmitRegistration}
                                    disabled={loading}
                                    className="flex-1 py-3 btn-primary text-lg"
                                >
                                    {loading ? 'Procesando...' : 'Completar Registro'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default function InscripcionPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <InscripcionContent />
        </Suspense>
    )
}
