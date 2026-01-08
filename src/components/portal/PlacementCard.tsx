'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PlacementCardProps {
    cita: {
        id: string
        fecha: Date
        estado: string
    }
}

export default function PlacementCard({ cita }: PlacementCardProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Edit States
    const dateObj = new Date(cita.fecha)
    const [editDate, setEditDate] = useState(dateObj.toISOString().split('T')[0]) // 2026-MM-DD
    const [editTime, setEditTime] = useState(dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }))

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de que deseas cancelar tu prueba de nivelación?')) return

        setLoading(true)
        try {
            const res = await fetch(`/api/portal/nivelacion/${cita.id}`, { method: 'DELETE' })
            if (res.ok) {
                router.refresh()
            } else {
                alert('Error al cancelar')
            }
        } catch (e) {
            console.error(e)
            alert('Error al conectar')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/portal/nivelacion/${cita.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: editDate, time: editTime })
            })
            if (res.ok) {
                setIsEditing(false)
                router.refresh()
            } else {
                alert('Error al reprogramar')
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (isEditing) {
        return (
            <div className="p-4 rounded-xl bg-white border-2 border-lemon-200 shadow-lg space-y-4">
                <h3 className="font-bold text-warm-800">Reprogramar Cita</h3>
                <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-bold text-warm-500">Mes</label>
                            <select
                                className="w-full p-2 rounded-lg border border-warm-200 text-sm"
                                value={editDate.split('-')[1]}
                                onChange={(e) => {
                                    const m = e.target.value
                                    const d = editDate.split('-')[2]
                                    setEditDate(`2026-${m}-${d}`)
                                }}
                            >
                                {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-warm-500">Día</label>
                            <select
                                className="w-full p-2 rounded-lg border border-warm-200 text-sm"
                                value={editDate.split('-')[2]}
                                onChange={(e) => {
                                    const d = e.target.value
                                    const m = editDate.split('-')[1]
                                    setEditDate(`2026-${m}-${d}`)
                                }}
                            >
                                {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-warm-500">Hora</label>
                        <select
                            className="w-full p-2 rounded-lg border border-warm-200 text-sm"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                        >
                            <option value="16:00">16:00</option>
                            <option value="17:00">17:00</option>
                            <option value="18:00">18:00</option>
                            <option value="19:00">19:00</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2 text-sm">
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="flex-1 bg-lemon-500 text-white py-2 rounded-lg font-bold hover:bg-lemon-600"
                    >
                        Guardar
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-2 text-warm-500 hover:text-warm-800"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 text-blue-900 group relative">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">Prueba de Nivelación</h3>
                <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{cita.estado}</span>
            </div>

            <div className="space-y-2 text-blue-700">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(cita.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{new Date(cita.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}hs</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-100 flex gap-3 transition-opacity">
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-white border border-blue-200 text-blue-700 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-50"
                >
                    Reprogramar
                </button>
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-white border border-red-200 text-red-600 py-1.5 rounded-lg text-sm font-bold hover:bg-red-50"
                >
                    {loading ? '...' : 'Cancelar'}
                </button>
            </div>
        </div>
    )
}
