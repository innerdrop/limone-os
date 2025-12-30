'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NuevoAlumnoPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        taller: '',
        nivel: 'PRINCIPIANTE',
        contactoEmergencia: '',
        telefonoEmergencia: '',
        alergias: '',
        notas: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simular guardado
        setTimeout(() => {
            setLoading(false)
            alert('¡Alumno registrado correctamente!')
            router.push('/admin/alumnos')
        }, 1500)
    }

    return (
        <div className="max-w-3xl animate-fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-warm-500 mb-6">
                <Link href="/admin/alumnos" className="hover:text-lemon-600">Alumnos</Link>
                <span>/</span>
                <span className="text-warm-800">Nuevo Alumno</span>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                    Registrar Nuevo Alumno
                </h1>
                <p className="text-warm-500 mt-1">
                    Completá los datos para inscribir un nuevo alumno
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Datos Personales */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-warm-800 mb-4">Datos Personales</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label">Nombre completo *</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="Nombre y apellido"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Email *</label>
                            <input
                                type="email"
                                required
                                className="input-field"
                                placeholder="email@ejemplo.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Teléfono *</label>
                            <input
                                type="tel"
                                required
                                className="input-field"
                                placeholder="+54 9 2901 ..."
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Fecha de nacimiento</label>
                            <input
                                type="date"
                                className="input-field"
                                value={formData.fechaNacimiento}
                                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Inscripción */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-warm-800 mb-4">Inscripción</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Taller *</label>
                            <select
                                required
                                className="input-field"
                                value={formData.taller}
                                onChange={(e) => setFormData({ ...formData, taller: e.target.value })}
                            >
                                <option value="">Seleccionar taller...</option>
                                <option value="1">Pintura al Óleo - Lun y Mié 18:00</option>
                                <option value="2">Acuarela Creativa - Mar y Jue 16:00</option>
                                <option value="3">Dibujo Artístico - Vie 17:00</option>
                                <option value="4">Técnicas Mixtas - Sáb 10:00</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Nivel</label>
                            <select
                                className="input-field"
                                value={formData.nivel}
                                onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                            >
                                <option value="PRINCIPIANTE">Principiante</option>
                                <option value="INTERMEDIO">Intermedio</option>
                                <option value="AVANZADO">Avanzado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contacto de Emergencia */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-warm-800 mb-4">Contacto de Emergencia</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Nombre del contacto</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Nombre del familiar/tutor"
                                value={formData.contactoEmergencia}
                                onChange={(e) => setFormData({ ...formData, contactoEmergencia: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Teléfono de emergencia</label>
                            <input
                                type="tel"
                                className="input-field"
                                placeholder="+54 9 2901 ..."
                                value={formData.telefonoEmergencia}
                                onChange={(e) => setFormData({ ...formData, telefonoEmergencia: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Información Adicional */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-warm-800 mb-4">Información Adicional</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Alergias o condiciones médicas</label>
                            <textarea
                                className="input-field min-h-[80px] resize-none"
                                placeholder="Indicar cualquier alergia o condición relevante..."
                                value={formData.alergias}
                                onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Notas internas</label>
                            <textarea
                                className="input-field min-h-[80px] resize-none"
                                placeholder="Notas adicionales (solo visibles para admin)..."
                                value={formData.notas}
                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href="/admin/alumnos"
                        className="flex-1 py-3 px-4 text-center border border-canvas-300 text-warm-600 rounded-xl font-medium hover:bg-canvas-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 btn-primary disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Guardando...
                            </span>
                        ) : (
                            'Registrar Alumno'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
