'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Taller {
    id: string
    nombre: string
    descripcion: string | null
    precio: number
    cupoMaximo: number
    duracion: number
    activo: boolean
    diasSemana: string | null
    horaInicio: string | null
}

export default function WorkshopEditForm({ taller }: { taller: Taller }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nombre: taller.nombre,
        descripcion: taller.descripcion || '',
        precio: taller.precio,
        cupoMaximo: taller.cupoMaximo,
        duracion: taller.duracion,
        activo: taller.activo,
        diasSemana: taller.diasSemana || '',
        horaInicio: taller.horaInicio || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`/api/admin/talleres/${taller.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push('/admin/talleres')
                router.refresh()
            } else {
                const error = await res.json()
                alert(`Error: ${error.message || 'No se pudo actualizar el taller'}`)
            }
        } catch (error) {
            console.error('Error updating workshop:', error)
            alert('Error de conexión al actualizar el taller')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="label">Nombre del Taller</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="label">Descripción</label>
                        <textarea
                            className="input-field min-h-[100px] resize-none"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label">Precio Mensual ($)</label>
                        <input
                            type="number"
                            required
                            className="input-field"
                            value={formData.precio}
                            onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="label">Cupo Máximo</label>
                        <input
                            type="number"
                            required
                            className="input-field"
                            value={formData.cupoMaximo}
                            onChange={(e) => setFormData({ ...formData, cupoMaximo: parseInt(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="label">Días de la Semana</label>
                        <input
                            type="text"
                            placeholder="ej: Martes a Viernes"
                            className="input-field"
                            value={formData.diasSemana}
                            onChange={(e) => setFormData({ ...formData, diasSemana: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label">Hora de Inicio</label>
                        <input
                            type="text"
                            placeholder="ej: 16:00"
                            className="input-field"
                            value={formData.horaInicio}
                            onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            id="activo"
                            className="rounded border-warm-300 text-lemon-600 focus:ring-lemon-500 h-5 w-5"
                            checked={formData.activo}
                            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                        />
                        <label htmlFor="activo" className="text-sm font-medium text-warm-700">Taller Activo</label>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <Link
                    href="/admin/talleres"
                    className="flex-1 py-3 px-4 text-center border border-canvas-300 text-warm-600 rounded-xl font-medium hover:bg-canvas-50 transition-colors"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    )
}
