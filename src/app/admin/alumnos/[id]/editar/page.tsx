'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AlumnoData {
    id: string
    usuario: {
        nombre: string
        email: string
        telefono: string | null
    }
    dni: string | null
    fechaNacimiento: string | null
    edad: number | null
    domicilio: string | null
    colegio: string | null
    grado: string | null
    tutorNombre: string | null
    tutorDni: string | null
    tutorRelacion: string | null
    tutorDomicilio: string | null
    tutorTelefonoPrincipal: string | null
    tutorTelefonoAlternativo: string | null
    tutorEmail: string | null
    tutorProfesion: string | null
    emergenciaNombre: string | null
    emergenciaTelefono: string | null
    emergenciaRelacion: string | null
    obraSocial: string | null
    numeroAfiliado: string | null
    hospitalReferencia: string | null
    alergias: string | null
    medicacionHabitual: string | null
    condicionesMedicas: string | null
    restriccionesFisicas: string | null
    autorizacionParticipacion: boolean
    autorizacionMedica: boolean
    autorizacionRetiro: string | null
    autorizacionImagenes: boolean
    aceptacionReglamento: boolean
    nivel: string
    notas: string | null
}

export default function EditarAlumnoPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [alumno, setAlumno] = useState<AlumnoData | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchAlumno()
    }, [])

    const fetchAlumno = async () => {
        try {
            const res = await fetch(`/api/admin/alumnos/${resolvedParams.id}`)
            if (!res.ok) throw new Error('Error al cargar datos')
            const data = await res.json()
            setAlumno(data)
        } catch (err) {
            setError('Error al cargar los datos del alumno')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSaving(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data: any = {}

        // Datos del usuario
        data.nombre = formData.get('nombre')
        data.email = formData.get('email')
        data.telefono = formData.get('telefono')

        // Datos del alumno
        data.dni = formData.get('dni')
        data.fechaNacimiento = formData.get('fechaNacimiento')
        data.edad = formData.get('edad')
        data.domicilio = formData.get('domicilio')
        data.colegio = formData.get('colegio')
        data.grado = formData.get('grado')

        // Datos del tutor
        data.tutorNombre = formData.get('tutorNombre')
        data.tutorDni = formData.get('tutorDni')
        data.tutorRelacion = formData.get('tutorRelacion')
        data.tutorDomicilio = formData.get('tutorDomicilio')
        data.tutorTelefonoPrincipal = formData.get('tutorTelefonoPrincipal')
        data.tutorTelefonoAlternativo = formData.get('tutorTelefonoAlternativo')
        data.tutorEmail = formData.get('tutorEmail')
        data.tutorProfesion = formData.get('tutorProfesion')

        // Contacto de emergencia
        data.emergenciaNombre = formData.get('emergenciaNombre')
        data.emergenciaTelefono = formData.get('emergenciaTelefono')
        data.emergenciaRelacion = formData.get('emergenciaRelacion')

        // Información médica
        data.obraSocial = formData.get('obraSocial')
        data.numeroAfiliado = formData.get('numeroAfiliado')
        data.hospitalReferencia = formData.get('hospitalReferencia')
        data.alergias = formData.get('alergias')
        data.medicacionHabitual = formData.get('medicacionHabitual')
        data.condicionesMedicas = formData.get('condicionesMedicas')
        data.restriccionesFisicas = formData.get('restriccionesFisicas')

        // Autorizaciones
        data.autorizacionParticipacion = formData.get('autorizacionParticipacion') === 'on'
        data.autorizacionMedica = formData.get('autorizacionMedica') === 'on'
        data.autorizacionRetiro = formData.get('autorizacionRetiro')
        data.autorizacionImagenes = formData.get('autorizacionImagenes') === 'on'
        data.aceptacionReglamento = formData.get('aceptacionReglamento') === 'on'

        // Nivel y notas
        data.nivel = formData.get('nivel')
        data.notas = formData.get('notas')

        try {
            const res = await fetch(`/api/admin/alumnos/${resolvedParams.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Error al guardar')
            }

            router.push(`/admin/alumnos/${resolvedParams.id}`)
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Error al guardar los cambios')
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lemon-500 mx-auto"></div>
                    <p className="mt-4 text-warm-600">Cargando datos...</p>
                </div>
            </div>
        )
    }

    if (!alumno) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600">Error al cargar el alumno</p>
                    <Link href="/admin/alumnos" className="text-lemon-600 hover:underline mt-4 inline-block">
                        Volver a la lista
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-canvas-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-canvas-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-warm-500 mb-2">
                        <Link href="/admin/alumnos" className="hover:text-warm-800">Alumnos</Link>
                        <span>/</span>
                        <Link href={`/admin/alumnos/${resolvedParams.id}`} className="hover:text-warm-800">
                            {alumno.usuario.nombre}
                        </Link>
                        <span>/</span>
                        <span>Editar</span>
                    </div>
                    <h1 className="text-2xl font-bold text-warm-800 flex items-center gap-3">
                        <span>✏️</span>
                        Editar Perfil de {alumno.usuario.nombre}
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Datos del Alumno */}
                    <section className="card">
                        <h2 className="text-xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                            <span>👤</span> Datos del Alumno
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Nombre Completo *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    defaultValue={alumno.usuario.nombre}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">DNI</label>
                                <input
                                    type="text"
                                    name="dni"
                                    defaultValue={alumno.dni || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    name="fechaNacimiento"
                                    defaultValue={alumno.fechaNacimiento ? alumno.fechaNacimiento.split('T')[0] : ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Edad</label>
                                <input
                                    type="number"
                                    name="edad"
                                    defaultValue={alumno.edad || ''}
                                    className="input-field"
                                    min="0"
                                    max="120"
                                />
                            </div>
                            <div>
                                <label className="label">Colegio</label>
                                <input
                                    type="text"
                                    name="colegio"
                                    defaultValue={alumno.colegio || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Grado</label>
                                <input
                                    type="text"
                                    name="grado"
                                    defaultValue={alumno.grado || ''}
                                    className="input-field"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Domicilio</label>
                                <input
                                    type="text"
                                    name="domicilio"
                                    defaultValue={alumno.domicilio || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={alumno.usuario.email}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    defaultValue={alumno.usuario.telefono || ''}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 2. Datos del Tutor */}
                    <section className="card">
                        <h2 className="text-xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                            <span>👨‍👩‍👧</span> Datos del Tutor
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Nombre</label>
                                <input
                                    type="text"
                                    name="tutorNombre"
                                    defaultValue={alumno.tutorNombre || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">DNI</label>
                                <input
                                    type="text"
                                    name="tutorDni"
                                    defaultValue={alumno.tutorDni || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Relación</label>
                                <select name="tutorRelacion" defaultValue={alumno.tutorRelacion || ''} className="input-field">
                                    <option value="">Seleccionar...</option>
                                    <option value="Madre">Madre</option>
                                    <option value="Padre">Padre</option>
                                    <option value="Tutor Legal">Tutor Legal</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Profesión</label>
                                <input
                                    type="text"
                                    name="tutorProfesion"
                                    defaultValue={alumno.tutorProfesion || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Teléfono Principal</label>
                                <input
                                    type="tel"
                                    name="tutorTelefonoPrincipal"
                                    defaultValue={alumno.tutorTelefonoPrincipal || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Teléfono Alternativo</label>
                                <input
                                    type="tel"
                                    name="tutorTelefonoAlternativo"
                                    defaultValue={alumno.tutorTelefonoAlternativo || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    name="tutorEmail"
                                    defaultValue={alumno.tutorEmail || ''}
                                    className="input-field"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Domicilio</label>
                                <input
                                    type="text"
                                    name="tutorDomicilio"
                                    defaultValue={alumno.tutorDomicilio || ''}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 3. Contacto de Emergencia */}
                    <section className="card">
                        <h2 className="text-xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                            <span>🚨</span> Contacto de Emergencia
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="label">Nombre</label>
                                <input
                                    type="text"
                                    name="emergenciaNombre"
                                    defaultValue={alumno.emergenciaNombre || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Teléfono</label>
                                <input
                                    type="tel"
                                    name="emergenciaTelefono"
                                    defaultValue={alumno.emergenciaTelefono || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Relación</label>
                                <input
                                    type="text"
                                    name="emergenciaRelacion"
                                    defaultValue={alumno.emergenciaRelacion || ''}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 4. Información Médica */}
                    <section className="card">
                        <h2 className="text-xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                            <span>🏥</span> Información Médica
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Obra Social</label>
                                <input
                                    type="text"
                                    name="obraSocial"
                                    defaultValue={alumno.obraSocial || ''}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Número de Afiliado</label>
                                <input
                                    type="text"
                                    name="numeroAfiliado"
                                    defaultValue={alumno.numeroAfiliado || ''}
                                    className="input-field"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Hospital de Referencia</label>
                                <input
                                    type="text"
                                    name="hospitalReferencia"
                                    defaultValue={alumno.hospitalReferencia || ''}
                                    className="input-field"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Alergias</label>
                                <textarea
                                    name="alergias"
                                    defaultValue={alumno.alergias || ''}
                                    className="input-field"
                                    rows={2}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Medicación Habitual</label>
                                <textarea
                                    name="medicacionHabitual"
                                    defaultValue={alumno.medicacionHabitual || ''}
                                    className="input-field"
                                    rows={2}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Condiciones Médicas</label>
                                <textarea
                                    name="condicionesMedicas"
                                    defaultValue={alumno.condicionesMedicas || ''}
                                    className="input-field"
                                    rows={2}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Restricciones Físicas</label>
                                <textarea
                                    name="restriccionesFisicas"
                                    defaultValue={alumno.restriccionesFisicas || ''}
                                    className="input-field"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </section>

                    {/* 5. Autorizaciones */}
                    <section className="card">
                        <h2 className="text-xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                            <span>✍️</span> Autorizaciones
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="autorizacionParticipacion"
                                    id="autorizacionParticipacion"
                                    defaultChecked={alumno.autorizacionParticipacion}
                                    className="w-5 h-5 text-lemon-600 rounded"
                                />
                                <label htmlFor="autorizacionParticipacion" className="font-medium text-warm-800">
                                    Autorización de Participación
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="autorizacionMedica"
                                    id="autorizacionMedica"
                                    defaultChecked={alumno.autorizacionMedica}
                                    className="w-5 h-5 text-lemon-600 rounded"
                                />
                                <label htmlFor="autorizacionMedica" className="font-medium text-warm-800">
                                    Autorización Médica
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="autorizacionImagenes"
                                    id="autorizacionImagenes"
                                    defaultChecked={alumno.autorizacionImagenes}
                                    className="w-5 h-5 text-lemon-600 rounded"
                                />
                                <label htmlFor="autorizacionImagenes" className="font-medium text-warm-800">
                                    Uso de Imagen
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="aceptacionReglamento"
                                    id="aceptacionReglamento"
                                    defaultChecked={alumno.aceptacionReglamento}
                                    className="w-5 h-5 text-lemon-600 rounded"
                                />
                                <label htmlFor="aceptacionReglamento" className="font-medium text-warm-800">
                                    Aceptación de Reglamento
                                </label>
                            </div>
                            <div className="pt-4">
                                <label className="label">Autorización de Retiro</label>
                                <textarea
                                    name="autorizacionRetiro"
                                    defaultValue={alumno.autorizacionRetiro || ''}
                                    className="input-field"
                                    rows={3}
                                    placeholder="Ej: SÍ, SE RETIRA SOLO, o los nombres y DNI de las personas autorizadas."
                                />
                            </div>
                        </div>
                    </section>

                    {/* 6. Nivel y Notas */}
                    <section className="card">
                        <h2 className="text-xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                            <span>📊</span> Nivel y Notas
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Nivel</label>
                                <select name="nivel" defaultValue={alumno.nivel} className="input-field">
                                    <option value="PRINCIPIANTE">Principiante</option>
                                    <option value="INTERMEDIO">Intermedio</option>
                                    <option value="AVANZADO">Avanzado</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Notas Adicionales</label>
                                <textarea
                                    name="notas"
                                    defaultValue={alumno.notas || ''}
                                    className="input-field"
                                    rows={4}
                                    placeholder="Observaciones, características especiales, etc."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Botones de acción */}
                    <div className="flex gap-4 justify-end">
                        <Link
                            href={`/admin/alumnos/${resolvedParams.id}`}
                            className="btn-outline"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
