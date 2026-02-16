'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Taller {
    id: string
    nombre: string
    descripcion: string | null
    imagen?: string | null
    cupoMaximo: number
    duracion: number
    activo: boolean
    tipo: string
    diasSemana: string | null
    horaInicio: string | null
    horarios?: any
    precio: number
    precio1dia: number
    precio2dia: number
    precio1diaExt?: number | null
    precio2diaExt?: number | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
}

const DIAS_DISPONIBLES = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']

export default function WorkshopEditForm({ taller }: { taller: Taller }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Parse initial settings
    const initialDays = taller.diasSemana ? taller.diasSemana.split(',').map(d => d.trim()) : []
    const initialHorarios = Array.isArray(taller.horarios) ? taller.horarios : []

    const [formData, setFormData] = useState({
        nombre: taller.nombre,
        descripcion: taller.descripcion || '',
        cupoMaximo: taller.cupoMaximo,
        duracion: taller.duracion,
        activo: taller.activo,
        tipo: taller.tipo || 'REGULAR',
        diasSemana: initialDays,
        horarios: initialHorarios,
    })

    const [newHorarioLabel, setNewHorarioLabel] = useState('')
    const [newHorarioValue, setNewHorarioValue] = useState('')

    const toggleDia = (dia: string) => {
        const currentDays = [...formData.diasSemana]
        if (currentDays.includes(dia)) {
            setFormData({ ...formData, diasSemana: currentDays.filter(d => d !== dia) })
        } else {
            setFormData({ ...formData, diasSemana: [...currentDays, dia] })
        }
    }

    const addHorario = () => {
        if (!newHorarioLabel || !newHorarioValue) return
        setFormData({
            ...formData,
            horarios: [...formData.horarios, { label: newHorarioLabel, value: newHorarioValue }]
        })
        setNewHorarioLabel('')
        setNewHorarioValue('')
    }

    const removeHorario = (index: number) => {
        const newHorarios = [...formData.horarios]
        newHorarios.splice(index, 1)
        setFormData({ ...formData, horarios: newHorarios })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`/api/admin/talleres/${taller.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    diasSemana: formData.diasSemana.join(','), // Back to string for DB
                }),
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

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informational Price Banner */}
            <div className="bg-warm-50 border-2 border-warm-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">
                        💰
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-warm-400 uppercase tracking-widest">Precio Centralizado</p>
                        <h4 className="text-lg font-black text-warm-800">
                            {taller.nombre.toLowerCase().includes('única')
                                ? `${formatMoney(taller.precio)} / clase`
                                : `${formatMoney(taller.precio1dia)} / mes`
                            }
                        </h4>
                        {taller.tipo === 'VERANO' && taller.precio1diaExt && (
                            <p className="text-[10px] font-bold text-orange-500 uppercase">
                                Extendido: {formatMoney(taller.precio1diaExt)} / mes
                            </p>
                        )}
                    </div>
                </div>
                <Link
                    href="/admin/precios"
                    className="text-xs font-bold text-lemon-600 hover:text-lemon-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-lemon-100 transition-all"
                >
                    Cambiar Precios →
                </Link>
            </div>

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
                        <label className="label">Tipo de Taller</label>
                        <select
                            className="input-field"
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        >
                            <option value="REGULAR">🌳 Taller Regular</option>
                            <option value="VERANO">☀️ Taller de Verano</option>
                        </select>
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

                    <div className="md:col-span-2">
                        <label className="label mb-3">Días de la Semana</label>
                        <div className="flex flex-wrap gap-2">
                            {DIAS_DISPONIBLES.map(dia => (
                                <button
                                    key={dia}
                                    type="button"
                                    onClick={() => toggleDia(dia)}
                                    className={`px-4 py-2 rounded-xl border-2 text-xs font-bold transition-all ${formData.diasSemana.includes(dia)
                                        ? 'bg-lemon-500 border-lemon-500 text-white shadow-md shadow-lemon-100'
                                        : 'bg-white border-warm-100 text-warm-600 hover:border-lemon-300'
                                        }`}
                                >
                                    {dia}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 border-t border-canvas-100 pt-6">
                        <label className="label mb-3">Bloques de Horarios</label>

                        <div className="grid gap-3 mb-4">
                            {formData.horarios.map((h: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-canvas-50 rounded-xl border border-canvas-100">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-warm-800">{h.label}</span>
                                        <span className="text-[10px] uppercase text-warm-500 font-mono">{h.value}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeHorario(index)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {formData.horarios.length === 0 && (
                                <p className="text-sm text-warm-400 italic py-2 text-center">No hay horarios definidos.</p>
                            )}
                        </div>

                        <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-canvas-200">
                            <p className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-3">Agregar nuevo bloque</p>
                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div>
                                    <label className="text-[10px] font-bold text-warm-400 uppercase mb-1 block">Etiqueta (ej: 16:00 a 17:20)</label>
                                    <input
                                        type="text"
                                        placeholder="16:00 a 17:20"
                                        className="input-field text-sm"
                                        value={newHorarioLabel}
                                        onChange={(e) => setNewHorarioLabel(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-warm-400 uppercase mb-1 block">Valor (ej: 16:00-17:20)</label>
                                    <input
                                        type="text"
                                        placeholder="16:00-17:20"
                                        className="input-field text-sm font-mono"
                                        value={newHorarioValue}
                                        onChange={(e) => setNewHorarioValue(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={addHorario}
                                        disabled={!newHorarioLabel || !newHorarioValue}
                                        className="w-full py-2 bg-warm-800 text-white rounded-xl text-sm font-bold hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        + Agregar Bloque
                                    </button>
                                </div>
                            </div>
                        </div>
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
