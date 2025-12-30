'use client'

import { useState } from 'react'

// Datos de ejemplo
const alumnosConGaleria = [
    { id: '1', nombre: 'María García', obras: 5 },
    { id: '2', nombre: 'Carlos Rodríguez', obras: 3 },
    { id: '3', nombre: 'Ana Martínez', obras: 8 },
    { id: '4', nombre: 'Lucía Fernández', obras: 2 },
]

export default function ContenidoPage() {
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('')
    const [uploading, setUploading] = useState(false)

    const handleUpload = () => {
        setUploading(true)
        setTimeout(() => {
            setUploading(false)
            alert('¡Foto subida correctamente!')
        }, 1500)
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Gestión de Contenido
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Subí fotos a las galerías y gestioná el contenido del sitio
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-warm-800 mb-4">
                        Subir Foto a Galería de Alumno
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="label">Seleccionar Alumno</label>
                            <select
                                className="input-field"
                                value={alumnoSeleccionado}
                                onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                            >
                                <option value="">Elegí un alumno...</option>
                                {alumnosConGaleria.map((alumno) => (
                                    <option key={alumno.id} value={alumno.id}>
                                        {alumno.nombre} ({alumno.obras} obras)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Título de la obra</label>
                            <input type="text" className="input-field" placeholder="Ej: Atardecer en los Andes" />
                        </div>

                        <div>
                            <label className="label">Descripción (opcional)</label>
                            <textarea
                                className="input-field min-h-[80px] resize-none"
                                placeholder="Breve descripción de la obra..."
                            />
                        </div>

                        <div>
                            <label className="label">Técnica</label>
                            <select className="input-field">
                                <option value="">Seleccionar técnica...</option>
                                <option value="oleo">Óleo</option>
                                <option value="acuarela">Acuarela</option>
                                <option value="acrilico">Acrílico</option>
                                <option value="dibujo">Dibujo</option>
                                <option value="mixta">Técnica Mixta</option>
                            </select>
                        </div>

                        {/* Drop Zone */}
                        <div className="border-2 border-dashed border-canvas-300 rounded-xl p-8 text-center hover:border-lemon-400 transition-colors cursor-pointer">
                            <div className="flex flex-col items-center">
                                <svg className="w-12 h-12 text-lemon-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-warm-600 font-medium mb-1">
                                    Arrastrá la imagen aquí
                                </p>
                                <p className="text-sm text-warm-400">
                                    o hacé click para seleccionar
                                </p>
                                <p className="text-xs text-warm-400 mt-2">
                                    PNG, JPG hasta 10MB
                                </p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" />
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!alumnoSeleccionado || uploading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Subiendo...
                                </span>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Subir Foto
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    {/* Manage Workshops */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-warm-800 mb-4">
                            Gestionar Talleres
                        </h2>
                        <div className="space-y-3">
                            {[
                                { nombre: 'Pintura al Óleo', horario: 'Lun y Mié 18:00' },
                                { nombre: 'Acuarela Creativa', horario: 'Mar y Jue 16:00' },
                                { nombre: 'Dibujo Artístico', horario: 'Vie 17:00' },
                                { nombre: 'Técnicas Mixtas', horario: 'Sáb 10:00' },
                            ].map((taller, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-canvas-50 border border-canvas-200">
                                    <div>
                                        <p className="font-medium text-warm-800">{taller.nombre}</p>
                                        <p className="text-sm text-warm-500">{taller.horario}</p>
                                    </div>
                                    <button className="text-sm text-lemon-600 hover:text-lemon-700 font-medium">
                                        Editar
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="btn-outline w-full mt-4">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Agregar Taller
                        </button>
                    </div>

                    {/* Site Settings */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-warm-800 mb-4">
                            Configuración del Sitio
                        </h2>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas-50 border border-canvas-200 hover:border-lemon-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">📝</span>
                                    <span className="text-warm-700">Editar Testimonios</span>
                                </div>
                                <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas-50 border border-canvas-200 hover:border-lemon-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">📸</span>
                                    <span className="text-warm-700">Galería Principal</span>
                                </div>
                                <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas-50 border border-canvas-200 hover:border-lemon-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">⚙️</span>
                                    <span className="text-warm-700">Datos de Contacto</span>
                                </div>
                                <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
