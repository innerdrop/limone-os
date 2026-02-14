'use client'

import { useState, useEffect } from 'react'

export default function PreciosPage() {
    const [precios, setPrecios] = useState({
        precio_taller_regular: 25000,
        precio_clase_unica: 15000,
        precio_verano_base_1x: 75000,
        precio_verano_base_2x: 130000,
        precio_verano_extended_1x: 145000,
        precio_verano_extended_2x: 210000
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/admin/precios')
            .then(res => res.json())
            .then(data => {
                setPrecios(data)
            })
            .catch(err => {
                setError('Error al cargar precios')
            })
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setError('')
        setSuccess(false)

        try {
            const response = await fetch('/api/admin/precios', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(precios)
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Error al guardar precios')
            }

            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
    }

    const handleChange = (key: string, value: string) => {
        const numValue = parseFloat(value) || 0
        setPrecios({ ...precios, [key]: numValue })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-warm-500">Cargando precios...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-warm-900">Gestión de Precios</h1>
                    <p className="text-warm-500 mt-1">Configurá los precios de los talleres y clases</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-lemon-500 text-warm-900 font-bold rounded-xl hover:bg-lemon-600 disabled:opacity-50 transition-colors"
                >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700">
                    <span className="text-2xl">✓</span>
                    <p className="font-medium">Precios actualizados correctamente</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                    <span className="text-2xl">⚠️</span>
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Taller Regular */}
            <div className="bg-white rounded-2xl border-2 border-warm-100 p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-warm-100">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">
                        🎨
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-warm-800">Taller Regular</h2>
                        <p className="text-sm text-warm-500">Curso anual de arte</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-warm-700 mb-2">
                            Precio Mensual
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500">$</span>
                            <input
                                type="number"
                                value={precios.precio_taller_regular}
                                onChange={e => handleChange('precio_taller_regular', e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border-2 border-warm-200 rounded-xl focus:border-lemon-400 focus:outline-none"
                                min="0"
                                step="1000"
                            />
                        </div>
                        <p className="text-xs text-warm-400 mt-1">
                            Vista previa: {formatCurrency(precios.precio_taller_regular)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Clase Única */}
            <div className="bg-white rounded-2xl border-2 border-warm-100 p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-warm-100">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                        ✨
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-warm-800">Clase Única</h2>
                        <p className="text-sm text-warm-500">Una clase individual para probar</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-warm-700 mb-2">
                            Precio por Clase
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500">$</span>
                            <input
                                type="number"
                                value={precios.precio_clase_unica}
                                onChange={e => handleChange('precio_clase_unica', e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border-2 border-warm-200 rounded-xl focus:border-purple-400 focus:outline-none"
                                min="0"
                                step="1000"
                            />
                        </div>
                        <p className="text-xs text-warm-400 mt-1">
                            Vista previa: {formatCurrency(precios.precio_clase_unica)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Taller de Verano */}
            <div className="bg-white rounded-2xl border-2 border-warm-100 p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-warm-100">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                        ☀️
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-warm-800">Taller de Verano</h2>
                        <p className="text-sm text-warm-500">Enero y Febrero - Modalidades especiales</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-warm-700">Modalidad Base (1h 20m)</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">
                                1 día por semana (mensual)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500">$</span>
                                <input
                                    type="number"
                                    value={precios.precio_verano_base_1x}
                                    onChange={e => handleChange('precio_verano_base_1x', e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-warm-200 rounded-xl focus:border-orange-400 focus:outline-none"
                                    min="0"
                                    step="1000"
                                />
                            </div>
                            <p className="text-xs text-warm-400 mt-1">
                                Vista previa: {formatCurrency(precios.precio_verano_base_1x)}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">
                                2 días por semana (mensual)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500">$</span>
                                <input
                                    type="number"
                                    value={precios.precio_verano_base_2x}
                                    onChange={e => handleChange('precio_verano_base_2x', e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-warm-200 rounded-xl focus:border-orange-400 focus:outline-none"
                                    min="0"
                                    step="1000"
                                />
                            </div>
                            <p className="text-xs text-warm-400 mt-1">
                                Vista previa: {formatCurrency(precios.precio_verano_base_2x)}
                            </p>
                        </div>
                    </div>

                    <h3 className="font-bold text-warm-700 pt-4">Modalidad Extended (2h + Merienda)</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">
                                1 día por semana (mensual)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500">$</span>
                                <input
                                    type="number"
                                    value={precios.precio_verano_extended_1x}
                                    onChange={e => handleChange('precio_verano_extended_1x', e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-warm-200 rounded-xl focus:border-orange-400 focus:outline-none"
                                    min="0"
                                    step="1000"
                                />
                            </div>
                            <p className="text-xs text-warm-400 mt-1">
                                Vista previa: {formatCurrency(precios.precio_verano_extended_1x)}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-warm-700 mb-2">
                                2 días por semana (mensual)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500">$</span>
                                <input
                                    type="number"
                                    value={precios.precio_verano_extended_2x}
                                    onChange={e => handleChange('precio_verano_extended_2x', e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-warm-200 rounded-xl focus:border-orange-400 focus:outline-none"
                                    min="0"
                                    step="1000"
                                />
                            </div>
                            <p className="text-xs text-warm-400 mt-1">
                                Vista previa: {formatCurrency(precios.precio_verano_extended_2x)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button (Bottom) */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-4 bg-lemon-500 text-warm-900 font-bold rounded-xl hover:bg-lemon-600 disabled:opacity-50 transition-colors shadow-lg"
                >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    )
}
