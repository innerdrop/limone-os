'use client'

import { useState, useEffect } from 'react'

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

const TIPOS = [
    { value: 'regular', label: 'Taller Regular' },
    { value: 'verano', label: 'Taller de Verano' },
    { value: 'clase-unica', label: 'Clase Única' },
    { value: 'custom', label: 'Personalizado' }
]

const COLORES_FONDO = [
    { value: 'bg-emerald-100', label: 'Verde', preview: '#d1fae5' },
    { value: 'bg-orange-100', label: 'Naranja', preview: '#ffedd5' },
    { value: 'bg-purple-100', label: 'Púrpura', preview: '#f3e8ff' },
    { value: 'bg-blue-100', label: 'Azul', preview: '#dbeafe' },
    { value: 'bg-rose-100', label: 'Rosa', preview: '#ffe4e6' },
    { value: 'bg-lemon-100', label: 'Limón', preview: '#fef9c3' },
    { value: 'bg-amber-100', label: 'Ámbar', preview: '#fef3c7' },
    { value: 'bg-teal-100', label: 'Teal', preview: '#ccfbf1' },
]

const COLORES_BORDE = [
    { value: 'border-lemon-400', label: 'Limón' },
    { value: 'border-orange-400', label: 'Naranja' },
    { value: 'border-purple-400', label: 'Púrpura' },
    { value: 'border-blue-400', label: 'Azul' },
    { value: 'border-rose-400', label: 'Rosa' },
    { value: 'border-emerald-400', label: 'Verde' },
    { value: 'border-amber-400', label: 'Ámbar' },
    { value: 'border-teal-400', label: 'Teal' },
]

const EMOJIS = ['🎨', '☀️', '✨', '🌟', '🖌️', '🎭', '🏖️', '🎪', '📝', '💫', '🌈', '🖼️']

const defaultOption: Omit<OpcionInscripcion, 'id'> = {
    nombre: '',
    descripcion: '',
    emoji: '🎨',
    colorFondo: 'bg-emerald-100',
    colorBorde: 'border-lemon-400',
    colorHoverBg: 'bg-lemon-50/50',
    tipo: 'regular',
    redirigirUrl: null,
    esNuevo: false,
    orden: 0,
    activo: true
}

export default function OpcionesInscripcionPage() {
    const [opciones, setOpciones] = useState<OpcionInscripcion[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<Omit<OpcionInscripcion, 'id'>>(defaultOption)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchOpciones = async () => {
        try {
            const res = await fetch('/api/admin/opciones-inscripcion?all=true')
            const data = await res.json()
            setOpciones(data)
        } catch {
            setError('Error al cargar opciones')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchOpciones() }, [])

    const handleSave = async () => {
        if (!formData.nombre.trim()) {
            setError('El nombre es requerido')
            return
        }

        setSaving(true)
        setError('')

        try {
            const method = editingId ? 'PATCH' : 'POST'
            const body = editingId ? { id: editingId, ...formData } : formData

            const res = await fetch('/api/admin/opciones-inscripcion', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Error al guardar')
            }

            setSuccess(editingId ? 'Opción actualizada' : 'Opción creada')
            setTimeout(() => setSuccess(''), 3000)
            setShowForm(false)
            setEditingId(null)
            setFormData(defaultOption)
            fetchOpciones()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta opción de inscripción?')) return

        try {
            const res = await fetch(`/api/admin/opciones-inscripcion?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Error al eliminar')
            setSuccess('Opción eliminada')
            setTimeout(() => setSuccess(''), 3000)
            fetchOpciones()
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleEdit = (opcion: OpcionInscripcion) => {
        setEditingId(opcion.id)
        setFormData({
            nombre: opcion.nombre,
            descripcion: opcion.descripcion || '',
            emoji: opcion.emoji,
            colorFondo: opcion.colorFondo,
            colorBorde: opcion.colorBorde,
            colorHoverBg: opcion.colorHoverBg,
            tipo: opcion.tipo,
            redirigirUrl: opcion.redirigirUrl,
            esNuevo: opcion.esNuevo,
            orden: opcion.orden,
            activo: opcion.activo
        })
        setShowForm(true)
    }

    const handleToggleActive = async (opcion: OpcionInscripcion) => {
        try {
            await fetch('/api/admin/opciones-inscripcion', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: opcion.id, activo: !opcion.activo })
            })
            fetchOpciones()
        } catch {
            setError('Error al cambiar estado')
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><p className="text-warm-500">Cargando...</p></div>
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-warm-900">Opciones de Inscripción</h1>
                    <p className="text-warm-500 mt-1">Gestioná las opciones que ven los usuarios al inscribirse</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingId(null); setFormData(defaultOption) }}
                    className="px-6 py-3 bg-lemon-500 text-warm-900 font-bold rounded-xl hover:bg-lemon-600 transition-colors flex items-center gap-2"
                >
                    <span className="text-lg">+</span> Nueva Opción
                </button>
            </div>

            {/* Messages */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700">
                    <span className="text-2xl">✓</span>
                    <p className="font-medium">{success}</p>
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                    <span className="text-2xl">⚠️</span>
                    <p className="font-medium">{error}</p>
                    <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                </div>
            )}

            {/* Preview */}
            <div className="bg-white rounded-2xl border-2 border-warm-100 p-6">
                <h2 className="text-lg font-bold text-warm-700 mb-4">Vista previa (así lo verán los usuarios)</h2>
                <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-warm-800">Elegí tu camino</h3>
                    <div className={`grid gap-6 ${opciones.filter(o => o.activo).length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                        {opciones.filter(o => o.activo).sort((a, b) => a.orden - b.orden).map(op => (
                            <div key={op.id} className={`p-8 rounded-3xl border-2 border-warm-200 hover:${op.colorBorde} transition-all group relative overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-md`}>
                                {op.esNuevo && (
                                    <div className="absolute top-0 right-0 bg-purple-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">NUEVO</div>
                                )}
                                <div className={`w-16 h-16 rounded-2xl ${op.colorFondo} mb-4 flex items-center justify-center text-3xl shadow-inner`}>
                                    {op.emoji}
                                </div>
                                <h3 className="text-xl font-black text-warm-800 mb-2">{op.nombre}</h3>
                                <p className="text-warm-500 text-sm">{op.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form (Create / Edit) */}
            {showForm && (
                <div className="bg-white rounded-2xl border-2 border-lemon-200 p-6 space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center pb-4 border-b border-warm-100">
                        <h2 className="text-xl font-bold text-warm-800">
                            {editingId ? 'Editar Opción' : 'Nueva Opción'}
                        </h2>
                        <button onClick={() => { setShowForm(false); setEditingId(null) }} className="text-warm-400 hover:text-warm-600 text-xl">✕</button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">Nombre *</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-warm-200 rounded-xl focus:border-lemon-400 focus:outline-none"
                                placeholder="Ej: Taller Regular"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">Descripción</label>
                            <input
                                type="text"
                                value={formData.descripcion}
                                onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-warm-200 rounded-xl focus:border-lemon-400 focus:outline-none"
                                placeholder="Ej: Curso anual completo de arte."
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">Tipo</label>
                            <select
                                value={formData.tipo}
                                onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-warm-200 rounded-xl focus:border-lemon-400 focus:outline-none"
                            >
                                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">Orden</label>
                            <input
                                type="number"
                                value={formData.orden}
                                onChange={e => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 border-2 border-warm-200 rounded-xl focus:border-lemon-400 focus:outline-none"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">URL de redirección</label>
                            <input
                                type="text"
                                value={formData.redirigirUrl || ''}
                                onChange={e => setFormData({ ...formData, redirigirUrl: e.target.value || null })}
                                className="w-full px-4 py-3 border-2 border-warm-200 rounded-xl focus:border-lemon-400 focus:outline-none"
                                placeholder="/portal/inscripcion/clase-unica"
                            />
                        </div>
                    </div>

                    {/* Emoji Selection */}
                    <div>
                        <label className="block text-sm font-bold text-warm-700 mb-2">Emoji / Ícono</label>
                        <div className="flex flex-wrap gap-2">
                            {EMOJIS.map(e => (
                                <button
                                    key={e}
                                    onClick={() => setFormData({ ...formData, emoji: e })}
                                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl transition-all ${formData.emoji === e ? 'border-lemon-500 bg-lemon-50 scale-110' : 'border-warm-200 bg-white hover:border-warm-300'}`}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">Color de fondo del ícono</label>
                            <div className="flex flex-wrap gap-2">
                                {COLORES_FONDO.map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => setFormData({ ...formData, colorFondo: c.value })}
                                        className={`w-10 h-10 rounded-lg border-2 transition-all ${formData.colorFondo === c.value ? 'border-warm-800 scale-110 ring-2 ring-warm-400' : 'border-warm-200'}`}
                                        style={{ backgroundColor: c.preview }}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">Color del borde (hover)</label>
                            <select
                                value={formData.colorBorde}
                                onChange={e => setFormData({ ...formData, colorBorde: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-warm-200 rounded-xl focus:border-lemon-400 focus:outline-none"
                            >
                                {COLORES_BORDE.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.esNuevo}
                                onChange={e => setFormData({ ...formData, esNuevo: e.target.checked })}
                                className="w-5 h-5 rounded border-warm-300 accent-lemon-500"
                            />
                            <span className="text-sm font-bold text-warm-700">Mostrar badge "NUEVO"</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.activo}
                                onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                                className="w-5 h-5 rounded border-warm-300 accent-lemon-500"
                            />
                            <span className="text-sm font-bold text-warm-700">Activo</span>
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => { setShowForm(false); setEditingId(null) }}
                            className="px-6 py-3 border border-warm-300 rounded-xl text-warm-600 font-medium hover:bg-warm-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 py-3 bg-lemon-500 text-warm-900 font-bold rounded-xl hover:bg-lemon-600 disabled:opacity-50 transition-colors"
                        >
                            {saving ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Crear Opción'}
                        </button>
                    </div>
                </div>
            )}

            {/* Options List */}
            <div className="space-y-3">
                <h2 className="text-lg font-bold text-warm-700">Opciones ({opciones.length})</h2>
                {opciones.length === 0 ? (
                    <div className="text-center py-12 bg-warm-50 rounded-2xl border-2 border-dashed border-warm-200">
                        <p className="text-warm-400">No hay opciones de inscripción creadas</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 px-6 py-2 bg-lemon-500 text-warm-900 font-bold rounded-xl hover:bg-lemon-600"
                        >
                            Crear primera opción
                        </button>
                    </div>
                ) : (
                    opciones.sort((a, b) => a.orden - b.orden).map(op => (
                        <div key={op.id} className={`bg-white rounded-2xl border-2 p-4 flex items-center gap-4 transition-all ${op.activo ? 'border-warm-100' : 'border-warm-100 opacity-50'}`}>
                            <div className={`w-14 h-14 rounded-2xl ${op.colorFondo} flex items-center justify-center text-2xl shrink-0`}>
                                {op.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-warm-800">{op.nombre}</h3>
                                    {op.esNuevo && <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">NUEVO</span>}
                                    {!op.activo && <span className="text-[10px] font-bold px-2 py-0.5 bg-warm-100 text-warm-500 rounded-full">INACTIVO</span>}
                                </div>
                                <p className="text-sm text-warm-500 truncate">{op.descripcion}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] px-2 py-0.5 bg-warm-50 text-warm-500 rounded-full">Tipo: {op.tipo}</span>
                                    <span className="text-[10px] px-2 py-0.5 bg-warm-50 text-warm-500 rounded-full">Orden: {op.orden}</span>
                                    {op.redirigirUrl && <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full">→ {op.redirigirUrl}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => handleToggleActive(op)} className={`p-2 rounded-lg transition-colors ${op.activo ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-warm-100 text-warm-400 hover:bg-warm-200'}`} title={op.activo ? 'Desactivar' : 'Activar'}>
                                    {op.activo ? '👁️' : '🚫'}
                                </button>
                                <button onClick={() => handleEdit(op)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Editar">
                                    ✏️
                                </button>
                                <button onClick={() => handleDelete(op.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Eliminar">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
