'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Student {
    id: string
    nombre: string
    obras: number
}

export default function UploadObraForm({ students }: { students: Student[] }) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' })
    const [preview, setPreview] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        alumnoId: '',
        titulo: '',
        descripcion: '',
        tecnica: '',
        file: null as File | null
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.file || !formData.alumnoId) {
            setMessage({ text: 'Por favor seleccioná un alumno y una imagen', type: 'error' })
            return
        }

        setLoading(true)
        setMessage({ text: '', type: '' })

        const data = new FormData()
        data.append('file', formData.file)
        data.append('alumnoId', formData.alumnoId)
        data.append('titulo', formData.titulo)
        data.append('descripcion', formData.descripcion)
        data.append('tecnica', formData.tecnica)

        try {
            const response = await fetch('/api/admin/obras', {
                method: 'POST',
                body: data
            })

            const result = await response.json()

            if (response.ok) {
                setMessage({ text: 'Obra subida con éxito!', type: 'success' })
                setFormData({
                    alumnoId: '',
                    titulo: '',
                    descripcion: '',
                    tecnica: '',
                    file: null
                })
                setPreview(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
                router.refresh()
            } else {
                throw new Error(result.error || 'Error al subir la obra')
            }
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message.text && (
                <div className={`p-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div>
                <label className="label">Seleccionar Alumno</label>
                <select
                    className="input-field"
                    value={formData.alumnoId}
                    onChange={(e) => setFormData({ ...formData, alumnoId: e.target.value })}
                    required
                >
                    <option value="">Elegí un alumno...</option>
                    {students.map((alumno) => (
                        <option key={alumno.id} value={alumno.id}>
                            {alumno.nombre} ({alumno.obras} obras)
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="label">Título de la obra</label>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Ej: Atardecer en los Andes"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                />
            </div>

            <div>
                <label className="label">Descripción (opcional)</label>
                <textarea
                    className="input-field min-h-[80px] resize-none"
                    placeholder="Breve descripción de la obra..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
            </div>

            <div>
                <label className="label">Técnica</label>
                <select
                    className="input-field"
                    value={formData.tecnica}
                    onChange={(e) => setFormData({ ...formData, tecnica: e.target.value })}
                >
                    <option value="">Seleccionar técnica...</option>
                    <option value="oleo">Óleo</option>
                    <option value="acuarela">Acuarela</option>
                    <option value="acrilico">Acrílico</option>
                    <option value="dibujo">Dibujo</option>
                    <option value="mixta">Técnica Mixta</option>
                </select>
            </div>

            {/* Drop Zone / File Input */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer overflow-hidden ${preview ? 'border-lemon-400 bg-lemon-50/30' : 'border-canvas-300 hover:border-lemon-400'
                    }`}
            >
                {preview ? (
                    <div className="flex flex-col items-center">
                        <img src={preview} alt="Vista previa" className="max-h-48 rounded-lg shadow-md mb-3 object-contain" />
                        <p className="text-xs text-warm-500">Haz click para cambiar la imagen</p>
                    </div>
                ) : (
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
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
        </form>
    )
}
