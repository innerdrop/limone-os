'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Slide {
    id: string
    titulo: string | null
    subtitulo: string | null
    descripcion: string | null
    tags: string[]
    badgeTexto: string | null
    textoBoton: string | null
    enlace: string | null
    imagenUrl: string
    estiloOverlay: string
    colorTitulo: string
    colorSubtitulo: string
    colorDescripcion: string
    colorBadge: string
    colorBoton: string
    colorFondoBoton: string
    orden: number
    activo: boolean
}

const emptySlide = {
    titulo: '',
    subtitulo: '',
    descripcion: '',
    tags: [] as string[],
    badgeTexto: '',
    textoBoton: '',
    enlace: '',
    imagenUrl: '',
    estiloOverlay: 'light',
    colorTitulo: '#2D2D2D',
    colorSubtitulo: '#8E44AD',
    colorDescripcion: '#57534E',
    colorBadge: '#FFFFFF',
    colorBoton: '#2D2D2D',
    colorFondoBoton: '#F1C40F',
    activo: true,
}

export default function SliderAdminPage() {
    const [slides, setSlides] = useState<Slide[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Editing state
    const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState(emptySlide)
    const [newTag, setNewTag] = useState('')

    // Image upload
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const MAX_SLIDES = 7

    const fetchSlides = useCallback(async () => {
        try {
            const res = await fetch('/api/slides?admin=true')
            if (!res.ok) throw new Error('Error al cargar slides')
            const data = await res.json()
            setSlides(data.sort((a: Slide, b: Slide) => a.orden - b.orden))
        } catch (err) {
            setError('Error al cargar los slides')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSlides()
    }, [fetchSlides])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setError('Formato no válido. Usa JPG, PNG o WebP.')
            return
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('La imagen es demasiado grande. Máximo 2MB.')
            return
        }

        setUploading(true)
        setError(null)

        try {
            const uploadData = new FormData()
            uploadData.append('file', file)

            const res = await fetch('/api/admin/slider/upload', {
                method: 'POST',
                body: uploadData,
            })

            if (!res.ok) throw new Error('Error al subir imagen')

            const { url } = await res.json()
            setFormData(prev => ({ ...prev, imagenUrl: url }))
            setPreviewUrl(url)
        } catch (err) {
            setError('Error al subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    const startCreate = () => {
        setEditingSlide(null)
        setIsCreating(true)
        setFormData(emptySlide)
        setPreviewUrl(null)
    }

    const startEdit = (slide: Slide) => {
        setEditingSlide(slide)
        setIsCreating(false)
        setFormData({
            titulo: slide.titulo,
            subtitulo: slide.subtitulo || '',
            descripcion: slide.descripcion || '',
            tags: slide.tags || [],
            badgeTexto: slide.badgeTexto || '',
            textoBoton: slide.textoBoton || '',
            enlace: slide.enlace || '',
            imagenUrl: slide.imagenUrl,
            estiloOverlay: slide.estiloOverlay,
            colorTitulo: slide.colorTitulo || '#2D2D2D',
            colorSubtitulo: slide.colorSubtitulo || '#8E44AD',
            colorDescripcion: slide.colorDescripcion || '#57534E',
            colorBadge: slide.colorBadge || '#FFFFFF',
            colorBoton: slide.colorBoton || '#2D2D2D',
            colorFondoBoton: slide.colorFondoBoton || '#F1C40F',
            activo: slide.activo,
        })
        setPreviewUrl(slide.imagenUrl)
    }

    const cancelEdit = () => {
        setEditingSlide(null)
        setIsCreating(false)
        setFormData(emptySlide)
        setPreviewUrl(null)
    }

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
            setNewTag('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Use previewUrl as fallback for imagenUrl
        const imagenUrlFinal = formData.imagenUrl || previewUrl || ''
        const tituloFinal = formData.titulo.trim()

        console.log('Form submission:', { titulo: tituloFinal, imagenUrl: imagenUrlFinal, formData })

        if (!imagenUrlFinal) {
            setError('La imagen es requerida')
            return
        }

        setSaving(true)
        setError(null)

        try {
            const url = isCreating ? '/api/slides' : `/api/slides/${editingSlide?.id}`
            const method = isCreating ? 'POST' : 'PUT'

            // Ensure imagenUrl is set correctly
            const dataToSend = {
                ...formData,
                titulo: tituloFinal,
                imagenUrl: imagenUrlFinal,
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.error || 'Error al guardar')
            }

            setSuccess(isCreating ? '✅ Slide creado exitosamente' : '✅ Slide actualizado')
            cancelEdit()
            fetchSlides()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err: any) {
            setError(err.message || 'Error al guardar el slide')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás segura de eliminar este slide?')) return

        try {
            const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Error al eliminar')
            setSuccess('✅ Slide eliminado')
            fetchSlides()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            setError('Error al eliminar el slide')
        }
    }

    const handleToggleActive = async (slide: Slide) => {
        try {
            await fetch(`/api/slides/${slide.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activo: !slide.activo }),
            })
            fetchSlides()
        } catch (err) {
            setError('Error al actualizar estado')
        }
    }

    const handleMoveUp = async (index: number) => {
        if (index === 0) return
        await swapOrder(index, index - 1)
    }

    const handleMoveDown = async (index: number) => {
        if (index === slides.length - 1) return
        await swapOrder(index, index + 1)
    }

    const swapOrder = async (index1: number, index2: number) => {
        const slide1 = slides[index1]
        const slide2 = slides[index2]

        try {
            await Promise.all([
                fetch(`/api/slides/${slide1.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orden: slide2.orden }),
                }),
                fetch(`/api/slides/${slide2.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orden: slide1.orden }),
                }),
            ])
            fetchSlides()
        } catch (err) {
            setError('Error al reordenar')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
            </div>
        )
    }

    // Form editing view
    if (isCreating || editingSlide) {
        return (
            <div className="p-4 lg:p-8 max-w-4xl mx-auto">
                <div className="mb-6 flex items-center gap-4">
                    <button onClick={cancelEdit} className="text-warm-600 hover:text-warm-900">
                        ← Volver
                    </button>
                    <h1 className="text-2xl font-bold text-warm-900">
                        {isCreating ? 'Crear Nuevo Slide' : 'Editar Slide'}
                    </h1>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Preview */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-warm-200">
                        <h2 className="text-lg font-semibold mb-4">Vista Previa</h2>
                        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-warm-100">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-warm-400">
                                    Sin imagen
                                </div>
                            )}
                            {/* Overlay preview */}
                            <div className={`absolute inset-0 ${formData.estiloOverlay === 'dark'
                                ? 'bg-gradient-to-r from-warm-900/50 to-warm-800/40'
                                : 'bg-white/30'
                                }`}></div>
                            {/* Content preview */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center p-4">
                                    {formData.badgeTexto && (
                                        <span
                                            className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
                                            style={{ backgroundColor: formData.colorBadge, color: formData.estiloOverlay === 'dark' ? '#000' : '#fff' }}
                                        >
                                            {formData.badgeTexto}
                                        </span>
                                    )}
                                    <h3
                                        className="text-xl md:text-2xl font-bold"
                                        style={{ color: formData.colorTitulo }}
                                    >
                                        {formData.titulo || 'Título del slide'}
                                    </h3>
                                    {formData.subtitulo && (
                                        <p
                                            className="text-xs opacity-90"
                                            style={{ color: formData.colorSubtitulo }}
                                        >
                                            {formData.subtitulo}
                                        </p>
                                    )}
                                    {formData.textoBoton && (
                                        <div
                                            className="mt-3 inline-block px-4 py-1.5 rounded-lg text-xs font-bold"
                                            style={{ backgroundColor: formData.colorFondoBoton, color: formData.colorBoton }}
                                        >
                                            {formData.textoBoton}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-warm-200">
                        <h2 className="text-lg font-semibold mb-4">📷 Imagen de Fondo</h2>
                        <label className="block">
                            <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${previewUrl ? 'border-brand-purple bg-brand-purple/5' : 'border-warm-300 hover:border-brand-purple'
                                }`}>
                                {uploading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="animate-spin w-5 h-5 border-2 border-brand-purple border-t-transparent rounded-full"></span>
                                        Subiendo...
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-3xl mb-2">🖼️</div>
                                        <p className="text-warm-600">
                                            {previewUrl ? 'Cambiar imagen' : 'Arrastra o haz clic para subir'}
                                        </p>
                                        <p className="text-xs text-warm-500 mt-1">JPG, PNG o WebP • Máx. 2MB • 1920x1080 recomendado</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </label>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-warm-700 mb-1">O ingresa URL directa:</label>
                            <input
                                type="text"
                                value={formData.imagenUrl}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, imagenUrl: e.target.value }))
                                    setPreviewUrl(e.target.value)
                                }}
                                placeholder="/slider-bg.png o https://..."
                                className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-warm-200">
                        <h2 className="text-lg font-semibold mb-4">✏️ Contenido del Slide</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-warm-700">
                                        Título Principal *
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-warm-500 uppercase font-bold">Color:</span>
                                        <input
                                            type="color"
                                            value={formData.colorTitulo}
                                            onChange={(e) => setFormData(prev => ({ ...prev, colorTitulo: e.target.value }))}
                                            className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                        />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                                    placeholder="Ej: Taller de Verano"
                                    className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-warm-700">
                                        Subtítulo
                                    </label>
                                    <input
                                        type="color"
                                        value={formData.colorSubtitulo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, colorSubtitulo: e.target.value }))}
                                        className="w-5 h-5 rounded cursor-pointer border-none p-0"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={formData.subtitulo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subtitulo: e.target.value }))}
                                    placeholder="Ej: Limoné | Edición 2026"
                                    className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-warm-700">
                                        Badge Superior
                                    </label>
                                    <input
                                        type="color"
                                        value={formData.colorBadge}
                                        onChange={(e) => setFormData(prev => ({ ...prev, colorBadge: e.target.value }))}
                                        className="w-5 h-5 rounded cursor-pointer border-none p-0"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={formData.badgeTexto}
                                    onChange={(e) => setFormData(prev => ({ ...prev, badgeTexto: e.target.value }))}
                                    placeholder="Ej: ¡Probá sin costo!"
                                    className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-warm-700">
                                        Descripción
                                    </label>
                                    <input
                                        type="color"
                                        value={formData.colorDescripcion}
                                        onChange={(e) => setFormData(prev => ({ ...prev, colorDescripcion: e.target.value }))}
                                        className="w-5 h-5 rounded cursor-pointer border-none p-0"
                                    />
                                </div>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                                    placeholder="Descripción breve del slide..."
                                    rows={2}
                                    className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-brand-purple resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-warm-200">
                        <h2 className="text-lg font-semibold mb-4">🏷️ Tags / Palabras Clave</h2>

                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="Ej: 📅 6 Ene - 28 Feb"
                                className="flex-1 px-4 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/90"
                            >
                                Agregar
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-warm-100 border border-warm-200 rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="text-warm-500 hover:text-red-500"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                            {formData.tags.length === 0 && (
                                <span className="text-sm text-warm-500">
                                    Sin tags. Agrega algunos como "📅 Fechas", "🧒 Edades", etc.
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Button & Style */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-warm-200">
                        <h2 className="text-lg font-semibold mb-4">🔘 Botón y Estilo</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-warm-700">
                                        Texto del Botón
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[9px] text-warm-500 uppercase font-bold">Texto:</span>
                                            <input
                                                type="color"
                                                value={formData.colorBoton}
                                                onChange={(e) => setFormData(prev => ({ ...prev, colorBoton: e.target.value }))}
                                                className="w-5 h-5 rounded cursor-pointer border-none p-0"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[9px] text-warm-500 uppercase font-bold">Fondo:</span>
                                            <input
                                                type="color"
                                                value={formData.colorFondoBoton}
                                                onChange={(e) => setFormData(prev => ({ ...prev, colorFondoBoton: e.target.value }))}
                                                className="w-5 h-5 rounded cursor-pointer border-none p-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={formData.textoBoton}
                                    onChange={(e) => setFormData(prev => ({ ...prev, textoBoton: e.target.value }))}
                                    placeholder="Ej: Inscribirse Ahora"
                                    className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-warm-700 mb-1">
                                    Enlace del Botón
                                </label>
                                <input
                                    type="text"
                                    value={formData.enlace}
                                    onChange={(e) => setFormData(prev => ({ ...prev, enlace: e.target.value }))}
                                    placeholder="Ej: /taller-verano"
                                    className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                    Estilo de Overlay
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="estiloOverlay"
                                            value="light"
                                            checked={formData.estiloOverlay === 'light'}
                                            onChange={(e) => setFormData(prev => ({ ...prev, estiloOverlay: e.target.value }))}
                                            className="text-brand-purple"
                                        />
                                        <span className="text-sm">☀️ Claro (texto oscuro)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="estiloOverlay"
                                            value="dark"
                                            checked={formData.estiloOverlay === 'dark'}
                                            onChange={(e) => setFormData(prev => ({ ...prev, estiloOverlay: e.target.value }))}
                                            className="text-brand-purple"
                                        />
                                        <span className="text-sm">🌙 Oscuro (texto blanco)</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer mt-6">
                                    <input
                                        type="checkbox"
                                        checked={formData.activo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                                        className="w-5 h-5 text-brand-purple rounded"
                                    />
                                    <span className="font-medium">Slide activo (visible en la web)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="flex-1 py-3 border border-warm-300 text-warm-700 font-semibold rounded-xl hover:bg-warm-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 bg-brand-purple text-white font-semibold rounded-xl hover:bg-brand-purple/90 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    Guardando...
                                </>
                            ) : (
                                <>💾 {isCreating ? 'Crear Slide' : 'Guardar Cambios'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    // List view
    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-warm-900">Slider / Publicidad</h1>
                    <p className="text-warm-600 mt-1">
                        Gestiona los slides del hero principal. Máximo {MAX_SLIDES} slides.
                    </p>
                </div>
                {slides.length < MAX_SLIDES && (
                    <button
                        onClick={startCreate}
                        className="px-6 py-3 bg-brand-purple text-white font-semibold rounded-xl hover:bg-brand-purple/90 hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <span className="text-xl">+</span>
                        Nuevo Slide
                    </button>
                )}
            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                    ❌ {error}
                    <button onClick={() => setError(null)} className="ml-auto">✕</button>
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
                    {success}
                </div>
            )}

            {/* Slides List */}
            <div className="bg-white rounded-2xl shadow-lg border border-warm-200">
                {slides.length === 0 ? (
                    <div className="text-center py-16 text-warm-500">
                        <div className="text-6xl mb-4">🎠</div>
                        <p className="text-lg font-medium">No hay slides configurados</p>
                        <p className="text-sm">Crea tu primer slide para el hero de la página principal.</p>
                        <button
                            onClick={startCreate}
                            className="mt-6 px-6 py-2 bg-brand-purple text-white rounded-xl hover:bg-brand-purple/90"
                        >
                            + Crear Primer Slide
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-warm-100">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`flex flex-col md:flex-row items-start md:items-center gap-4 p-4 transition-all ${!slide.activo ? 'opacity-50 bg-warm-50' : ''
                                    }`}
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full md:w-48 aspect-video rounded-lg overflow-hidden bg-warm-100 flex-shrink-0">
                                    <Image
                                        src={slide.imagenUrl}
                                        alt={slide.titulo}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">
                                        #{index + 1}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-warm-900 truncate">{slide.titulo}</h3>
                                        {!slide.activo && (
                                            <span className="text-xs bg-warm-300 text-warm-700 px-2 py-0.5 rounded-full">
                                                Inactivo
                                            </span>
                                        )}
                                        {slide.estiloOverlay === 'dark' && (
                                            <span className="text-xs bg-warm-800 text-white px-2 py-0.5 rounded-full">
                                                🌙 Oscuro
                                            </span>
                                        )}
                                    </div>
                                    {slide.subtitulo && (
                                        <p className="text-sm text-warm-600">{slide.subtitulo}</p>
                                    )}
                                    {slide.tags && slide.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {slide.tags.slice(0, 3).map((tag, i) => (
                                                <span key={i} className="text-xs bg-warm-100 text-warm-600 px-2 py-0.5 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                            {slide.tags.length > 3 && (
                                                <span className="text-xs text-warm-500">+{slide.tags.length - 3} más</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleMoveUp(index)}
                                        disabled={index === 0}
                                        className="p-2 rounded-lg bg-warm-100 text-warm-600 hover:bg-warm-200 disabled:opacity-30"
                                        title="Mover arriba"
                                    >
                                        ⬆️
                                    </button>
                                    <button
                                        onClick={() => handleMoveDown(index)}
                                        disabled={index === slides.length - 1}
                                        className="p-2 rounded-lg bg-warm-100 text-warm-600 hover:bg-warm-200 disabled:opacity-30"
                                        title="Mover abajo"
                                    >
                                        ⬇️
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(slide)}
                                        className={`p-2 rounded-lg ${slide.activo
                                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                            : 'bg-warm-200 text-warm-500 hover:bg-warm-300'
                                            }`}
                                        title={slide.activo ? 'Desactivar' : 'Activar'}
                                    >
                                        {slide.activo ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                    <button
                                        onClick={() => startEdit(slide)}
                                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slide.id)}
                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tips */}
            <div className="mt-8 p-6 bg-brand-purple/5 border border-brand-purple/20 rounded-2xl">
                <h3 className="font-semibold text-brand-purple mb-3 flex items-center gap-2">
                    <span>💡</span>
                    Tips para buenos slides
                </h3>
                <ul className="space-y-1 text-sm text-warm-700">
                    <li>📐 <strong>Imágenes:</strong> 1920x1080 px mínimo, formato horizontal</li>
                    <li>☀️ <strong>Overlay claro:</strong> Para imágenes claras/coloridas - texto oscuro</li>
                    <li>🌙 <strong>Overlay oscuro:</strong> Para fotos reales - texto blanco</li>
                    <li>🏷️ <strong>Tags:</strong> Usa emojis + texto corto (ej: "📅 6 Ene - 28 Feb")</li>
                </ul>
            </div>
        </div>
    )
}
