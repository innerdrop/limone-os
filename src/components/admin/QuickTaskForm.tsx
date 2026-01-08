'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QuickTaskForm() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        prioridad: 'MEDIA'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/admin/tareas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setIsOpen(false)
                setFormData({
                    titulo: '',
                    descripcion: '',
                    fecha: new Date().toISOString().split('T')[0],
                    prioridad: 'MEDIA'
                })
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary py-2 px-4 text-sm flex items-center"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                + Tarea
            </button>
        )
    }

    return (
        <div className="fixed inset-0 bg-warm-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-in border border-canvas-200">
                <div className="p-6 border-b border-canvas-100 flex justify-between items-center bg-canvas-50">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-warm-800 italic">Agregar Recordatorio</h3>
                        <p className="text-xs text-warm-400 font-medium uppercase tracking-widest mt-0.5">Gestión de Tareas</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-warm-400 hover:text-warm-600 p-2 hover:bg-white rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="label text-xs uppercase font-bold text-warm-500 mb-1.5 block">Título de la actividad</label>
                        <input
                            type="text"
                            required
                            className="input-field italic"
                            value={formData.titulo}
                            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                            placeholder="Ej: Comprar pinceles, Llamar a tutor..."
                        />
                    </div>
                    <div>
                        <label className="label text-xs uppercase font-bold text-warm-500 mb-1.5 block">Descripción (Opcional)</label>
                        <textarea
                            className="input-field italic min-h-[100px] resize-none"
                            value={formData.descripcion}
                            onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                            placeholder="Detalles adicionales sobre la tarea..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="label text-xs uppercase font-bold text-warm-500 mb-1.5 block">Fecha de ejecución</label>
                            <input
                                type="date"
                                required
                                className="input-field italic"
                                value={formData.fecha}
                                onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label text-xs uppercase font-bold text-warm-500 mb-1.5 block">Prioridad</label>
                            <select
                                className="input-field italic"
                                value={formData.prioridad}
                                onChange={e => setFormData({ ...formData, prioridad: e.target.value })}
                            >
                                <option value="BAJA">Baja</option>
                                <option value="MEDIA">Media</option>
                                <option value="ALTA">Alta</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="btn-outline flex-1 py-3"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 py-3"
                        >
                            {loading ? 'Guardando...' : 'Guardar Tarea'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
