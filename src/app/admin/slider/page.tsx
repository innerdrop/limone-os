'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface ElementLayout {
    alineacion: 'left' | 'center' | 'right'
    tamano: string
    tamanoMobile: string
}

interface LayoutConfig {
    contenedor: { posV: 'top' | 'center' | 'bottom'; posH: 'left' | 'center' | 'right' }
    titulo: ElementLayout
    subtitulo: ElementLayout
    descripcion: ElementLayout
    badge: ElementLayout
    tags: { alineacion: 'left' | 'center' | 'right' }
    boton: ElementLayout & { offsetY: number }
    espaciado: { badgeTitulo: number; tituloSubtitulo: number; subtituloDescripcion: number; descripcionBoton: number }
}

const defaultLayoutConfig: LayoutConfig = {
    contenedor: { posV: 'center', posH: 'center' },
    titulo: { alineacion: 'center', tamano: '7xl', tamanoMobile: '3xl' },
    subtitulo: { alineacion: 'center', tamano: '2xl', tamanoMobile: 'xl' },
    descripcion: { alineacion: 'center', tamano: '2xl', tamanoMobile: 'lg' },
    badge: { alineacion: 'center', tamano: 'sm', tamanoMobile: 'xs' },
    tags: { alineacion: 'center' },
    boton: { alineacion: 'center', tamano: 'xl', tamanoMobile: 'lg', offsetY: 0 },
    espaciado: { badgeTitulo: 16, tituloSubtitulo: 8, subtituloDescripcion: 12, descripcionBoton: 24 },
}

interface Slide {
    id: string
    titulo: string | null
    subtitulo: string | null
    descripcion: string | null
    tags: string[]
    badgeTexto: string | null
    textoBoton: string | null
    enlace: string | null
    imagenUrl: string | null
    tituloImagenUrl: string | null
    codigoHtml: string | null
    estiloOverlay: string
    colorTitulo: string
    colorSubtitulo: string
    colorDescripcion: string
    colorBadge: string
    colorBoton: string
    colorFondoBoton: string
    orden: number
    activo: boolean
    aplicarBlur: boolean
    botonOffset: number
    layoutConfig?: string
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
    tituloImagenUrl: '',
    codigoHtml: '',
    estiloOverlay: 'light',
    colorTitulo: '#2D2D2D',
    colorSubtitulo: '#8E44AD',
    colorDescripcion: '#57534E',
    colorBadge: '#FFFFFF',
    colorBoton: '#2D2D2D',
    colorFondoBoton: '#F1C40F',
    activo: true,
    aplicarBlur: true,
    botonOffset: 0,
    layoutConfig: JSON.stringify(defaultLayoutConfig),
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
    const [useHtml, setUseHtml] = useState(false)

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
            titulo: slide.titulo || '',
            subtitulo: slide.subtitulo || '',
            descripcion: slide.descripcion || '',
            tags: slide.tags || [],
            badgeTexto: slide.badgeTexto || '',
            textoBoton: slide.textoBoton || '',
            enlace: slide.enlace || '',
            imagenUrl: slide.imagenUrl || '',
            tituloImagenUrl: slide.tituloImagenUrl || '',
            codigoHtml: slide.codigoHtml || '',
            estiloOverlay: slide.estiloOverlay,
            colorTitulo: slide.colorTitulo || '#2D2D2D',
            colorSubtitulo: slide.colorSubtitulo || '#8E44AD',
            colorDescripcion: slide.colorDescripcion || '#57534E',
            colorBadge: slide.colorBadge || '#FFFFFF',
            colorBoton: slide.colorBoton || '#2D2D2D',
            colorFondoBoton: slide.colorFondoBoton || '#F1C40F',
            activo: slide.activo,
            aplicarBlur: slide.aplicarBlur !== false,
            botonOffset: slide.botonOffset || 0,
            layoutConfig: slide.layoutConfig || JSON.stringify(defaultLayoutConfig),
        })
        setPreviewUrl(slide.imagenUrl || null)
        setUseHtml(!!slide.codigoHtml)
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

        console.log('Form submission:', { titulo: tituloFinal, imagenUrl: imagenUrlFinal, tituloImagenUrl: formData.tituloImagenUrl, formData })

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
                tituloImagenUrl: formData.tituloImagenUrl || null,
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
                                : formData.estiloOverlay === 'light'
                                    ? 'bg-white/30'
                                    : 'bg-transparent'
                                } ${formData.aplicarBlur ? 'backdrop-blur-[2px]' : ''}`}></div>
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
                                            className="mt-3 inline-block px-4 py-1.5 rounded-lg text-xs font-bold transition-transform duration-300"
                                            style={{
                                                backgroundColor: formData.colorFondoBoton,
                                                color: formData.colorBoton,
                                                transform: `translateY(${formData.botonOffset}px)`
                                            }}
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
                                        Título Principal
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
                                />

                                {/* Imagen de Título (reemplaza el texto) */}
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <label className="block text-sm font-medium text-blue-800 mb-2">
                                        🖼️ Imagen como Título (PNG, reemplaza el texto)
                                    </label>
                                    {formData.tituloImagenUrl && (
                                        <div className="mb-2 relative inline-block">
                                            <img src={formData.tituloImagenUrl} alt="Título imagen" className="max-h-20 rounded" />
                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, tituloImagenUrl: '' }))}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/png,image/webp,image/jpeg"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return
                                            const uploadData = new FormData()
                                            uploadData.append('file', file)
                                            try {
                                                const res = await fetch('/api/admin/slider/upload', { method: 'POST', body: uploadData })
                                                if (!res.ok) {
                                                    const errData = await res.json().catch(() => ({}))
                                                    throw new Error(errData.error || `Error ${res.status}`)
                                                }
                                                const { url } = await res.json()
                                                setFormData(prev => ({ ...prev, tituloImagenUrl: url }))
                                                setSuccess('✅ Imagen de título subida correctamente')
                                                setTimeout(() => setSuccess(null), 3000)
                                            } catch (err: any) { setError(err.message || 'Error al subir imagen de título') }
                                        }}
                                        className="text-sm"
                                    />
                                    <p className="text-xs text-blue-600 mt-1">Si se sube una imagen, se muestra en lugar del texto del título</p>
                                </div>
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

                            {/* ========== LAYOUT & POSITION SECTION ========== */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                                <h3 className="text-lg font-bold text-blue-900 mb-4">📐 Posición y Layout</h3>

                                {(() => {
                                    const lc: LayoutConfig = (() => {
                                        try { return { ...defaultLayoutConfig, ...JSON.parse(formData.layoutConfig || '{}') } } catch { return defaultLayoutConfig }
                                    })()

                                    const updateLC = (path: string, value: any) => {
                                        const parts = path.split('.')
                                        const updated = JSON.parse(JSON.stringify(lc))
                                        let obj = updated
                                        for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]]
                                        obj[parts[parts.length - 1]] = value
                                        setFormData(prev => ({ ...prev, layoutConfig: JSON.stringify(updated) }))
                                    }

                                    const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl']

                                    const AlignButtons = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
                                        <div className="flex gap-1">
                                            {(['left', 'center', 'right'] as const).map(a => (
                                                <button key={a} type="button" onClick={() => onChange(a)}
                                                    className={`px-2 py-1 text-xs rounded font-medium transition-colors ${value === a ? 'bg-blue-600 text-white' : 'bg-white text-warm-600 hover:bg-blue-100 border border-warm-300'}`}>
                                                    {a === 'left' ? '◀' : a === 'center' ? '◆' : '▶'}
                                                </button>
                                            ))}
                                        </div>
                                    )

                                    const SizeSelect = ({ value, onChange, label }: { value: string, onChange: (v: string) => void, label: string }) => (
                                        <div className="flex items-center gap-1">
                                            <span className="text-[9px] text-warm-500 uppercase font-bold whitespace-nowrap">{label}:</span>
                                            <select value={value} onChange={e => onChange(e.target.value)}
                                                className="text-xs px-1 py-0.5 border border-warm-300 rounded bg-white">
                                                {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    )

                                    const ElementControl = ({ label, element, hasSize = true }: { label: string, element: string, hasSize?: boolean }) => {
                                        const el = (lc as any)[element]
                                        return (
                                            <div className="flex items-center justify-between gap-2 py-2 border-b border-blue-100 last:border-0">
                                                <span className="text-sm font-medium text-warm-700 min-w-[80px]">{label}</span>
                                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                                    <AlignButtons value={el.alineacion} onChange={v => updateLC(`${element}.alineacion`, v)} />
                                                    {hasSize && (
                                                        <>
                                                            <SizeSelect label="PC" value={el.tamano} onChange={v => updateLC(`${element}.tamano`, v)} />
                                                            <SizeSelect label="Móvil" value={el.tamanoMobile} onChange={v => updateLC(`${element}.tamanoMobile`, v)} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }

                                    return (
                                        <div className="space-y-4">
                                            {/* Container Position Grid */}
                                            <div>
                                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                                    Posición del Contenido
                                                </label>
                                                <div className="inline-grid grid-cols-3 gap-1 bg-white rounded-lg p-2 border border-warm-300">
                                                    {(['top', 'center', 'bottom'] as const).map(v =>
                                                        (['left', 'center', 'right'] as const).map(h => (
                                                            <button key={`${v}-${h}`} type="button"
                                                                onClick={() => {
                                                                    const updated = JSON.parse(JSON.stringify(lc))
                                                                    updated.contenedor.posV = v
                                                                    updated.contenedor.posH = h
                                                                    setFormData(prev => ({ ...prev, layoutConfig: JSON.stringify(updated) }))
                                                                }}
                                                                className={`w-9 h-9 rounded text-xs font-bold transition-all ${lc.contenedor.posV === v && lc.contenedor.posH === h
                                                                    ? 'bg-blue-600 text-white shadow-md scale-110'
                                                                    : 'bg-warm-100 text-warm-400 hover:bg-blue-100'
                                                                    }`}
                                                                title={`${v}-${h}`}
                                                            >
                                                                ●
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                                <span className="text-xs text-warm-500 ml-2">
                                                    {lc.contenedor.posV === 'top' ? 'Arriba' : lc.contenedor.posV === 'center' ? 'Centro' : 'Abajo'}-{lc.contenedor.posH === 'left' ? 'Izq' : lc.contenedor.posH === 'center' ? 'Centro' : 'Der'}
                                                </span>
                                            </div>

                                            {/* Per-Element Controls */}
                                            <div>
                                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                                    Alineación y Tamaño por Elemento
                                                </label>
                                                <div className="bg-white rounded-lg p-3 border border-warm-300">
                                                    <ElementControl label="Título" element="titulo" />
                                                    <ElementControl label="Subtítulo" element="subtitulo" />
                                                    <ElementControl label="Descripción" element="descripcion" />
                                                    <ElementControl label="Badge" element="badge" />
                                                    <ElementControl label="Tags" element="tags" hasSize={false} />
                                                    <ElementControl label="Botón" element="boton" />
                                                </div>
                                            </div>

                                            {/* Spacing Controls */}
                                            <div>
                                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                                    📏 Espaciado entre Elementos (px)
                                                </label>
                                                <div className="bg-white rounded-lg p-3 border border-warm-300 space-y-2">
                                                    {[
                                                        { label: 'Badge → Título', key: 'badgeTitulo' },
                                                        { label: 'Título → Subtítulo', key: 'tituloSubtitulo' },
                                                        { label: 'Subtítulo → Descripción', key: 'subtituloDescripcion' },
                                                        { label: 'Descripción → Botón', key: 'descripcionBoton' },
                                                    ].map(({ label, key }) => (
                                                        <div key={key} className="flex items-center justify-between">
                                                            <span className="text-sm text-warm-600">{label}</span>
                                                            <div className="flex items-center gap-1">
                                                                <button type="button" onClick={() => updateLC(`espaciado.${key}`, Math.max(0, ((lc as any).espaciado?.[key] ?? 16) - 4))}
                                                                    className="p-1 bg-warm-100 rounded border border-warm-300 hover:bg-warm-200 text-xs">−</button>
                                                                <input type="number" value={(lc as any).espaciado?.[key] ?? 16}
                                                                    onChange={e => updateLC(`espaciado.${key}`, parseInt(e.target.value) || 0)}
                                                                    className="w-14 text-center px-1 py-0.5 border border-warm-300 rounded text-sm" />
                                                                <button type="button" onClick={() => updateLC(`espaciado.${key}`, ((lc as any).espaciado?.[key] ?? 16) + 4)}
                                                                    className="p-1 bg-warm-100 rounded border border-warm-300 hover:bg-warm-200 text-xs">+</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Button Offset */}
                                            <div>
                                                <label className="block text-sm font-medium text-warm-700 mb-1">
                                                    Offset Vertical del Botón
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => updateLC('boton.offsetY', (lc.boton.offsetY || 0) - 10)}
                                                        className="p-1.5 bg-white rounded border border-warm-300 hover:bg-warm-100 text-sm">↑</button>
                                                    <input type="number" value={lc.boton.offsetY || 0}
                                                        onChange={e => updateLC('boton.offsetY', parseInt(e.target.value) || 0)}
                                                        className="w-16 text-center px-1 py-1 border border-warm-300 rounded text-sm" />
                                                    <button type="button" onClick={() => updateLC('boton.offsetY', (lc.boton.offsetY || 0) + 10)}
                                                        className="p-1.5 bg-white rounded border border-warm-300 hover:bg-warm-100 text-sm">↓</button>
                                                    <span className="text-xs text-warm-500">px</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })()}
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
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="estiloOverlay"
                                            value="none"
                                            checked={formData.estiloOverlay === 'none'}
                                            onChange={(e) => setFormData(prev => ({ ...prev, estiloOverlay: e.target.value }))}
                                            className="text-brand-purple"
                                        />
                                        <span className="text-sm">🌈 Original (Sin overlay)</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer mt-6">
                                    <input
                                        type="checkbox"
                                        checked={formData.aplicarBlur}
                                        onChange={(e) => setFormData(prev => ({ ...prev, aplicarBlur: e.target.checked }))}
                                        className="w-5 h-5 text-brand-purple rounded"
                                    />
                                    <span className="font-medium text-sm">Aplicar desenfoque (blur)</span>
                                </label>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer mt-6">
                                    <input
                                        type="checkbox"
                                        checked={formData.activo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                                        className="w-5 h-5 text-brand-purple rounded"
                                    />
                                    <span className="font-medium text-sm">Slide activo (visible en la web)</span>
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
                                    {slide.imagenUrl ? (
                                        <Image
                                            src={slide.imagenUrl}
                                            alt={slide.titulo || 'Slide'}
                                            fill
                                            sizes="192px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-warm-400 text-xs">&lt;/&gt; HTML</div>
                                    )}
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
