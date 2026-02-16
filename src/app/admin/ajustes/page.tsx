'use client'

import { useState, useEffect } from 'react'

export default function AjustesPage() {
    const [mantenimiento, setMantenimiento] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    // Stats state
    const [stats, setStats] = useState({ total: 0, sources: { direct: 0, google: 0, facebook: 0, instagram: 0, other: 0 } })
    const [statsLoading, setStatsLoading] = useState(true)
    const [filter, setFilter] = useState('day')

    useEffect(() => {
        const fetchMantenimiento = async () => {
            try {
                const res = await fetch('/api/admin/mantenimiento')
                const data = await res.json()
                setMantenimiento(data.activado)
            } catch (err) {
                setError('Error al cargar estado de mantenimiento')
            } finally {
                setLoading(false)
            }
        }
        fetchMantenimiento()
    }, [])

    useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true)
            try {
                const res = await fetch(`/api/admin/stats/visits?filter=${filter}`)
                const data = await res.json()
                if (data.error) throw new Error(data.error)
                setStats(data)
            } catch (err) {
                console.error('Error fetching stats:', err)
            } finally {
                setStatsLoading(false)
            }
        }
        fetchStats()
    }, [filter])

    const handleToggleMantenimiento = async (newValue: boolean) => {
        setSaving(true)
        setError('')
        setSuccess(false)

        try {
            const response = await fetch('/api/admin/mantenimiento', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activado: newValue })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Error al actualizar modo mantenimiento')
            }

            setMantenimiento(newValue)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-warm-500">Cargando ajustes...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-warm-900 font-serif">Ajustes del Sistema</h1>
                <p className="text-warm-500 mt-1">Configurá el comportamiento global de la plataforma</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700">
                    <span className="text-xl text-green-500">✓</span>
                    <p className="font-medium">Ajustes actualizados correctamente</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                    <span className="text-xl">⚠️</span>
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <div className="grid gap-6">
                {/* Maintenance Mode Card */}
                <div className="bg-white rounded-2xl border-2 border-warm-100 overflow-hidden shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${mantenimiento ? 'bg-amber-100' : 'bg-emerald-100'
                                    }`}>
                                    {mantenimiento ? '🚧' : '🚀'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-warm-800">Modo Mantenimiento</h2>
                                    <p className="text-warm-500 mt-1 max-w-md">
                                        Cuando está activo, los usuarios verán una página de mantenimiento.
                                        Los administradores aún podrán acceder al panel.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${mantenimiento
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {mantenimiento ? 'ACTIVADO' : 'DESACTIVADO'}
                                </span>

                                <button
                                    onClick={() => handleToggleMantenimiento(!mantenimiento)}
                                    disabled={saving}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${mantenimiento ? 'bg-amber-500' : 'bg-warm-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${mantenimiento ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {mantenimiento && (
                        <div className="bg-amber-50 px-6 py-3 border-t border-amber-100 flex items-center gap-2">
                            <span className="text-amber-500 text-lg">ℹ️</span>
                            <p className="text-xs text-amber-700 font-medium">
                                El sitio es actualmente inaccesible para los alumnos. Los cambios impactan de inmediato.
                            </p>
                        </div>
                    )}
                </div>

                {/* Web Statistics Card */}
                <div className="bg-white rounded-2xl border-2 border-warm-100 overflow-hidden shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-3xl shrink-0">
                                    📊
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-warm-800">Estadísticas de Tráfico</h2>
                                    <p className="text-warm-500 mt-1">Conocé cuántas visitas recibe la web y desde dónde llegan.</p>
                                </div>
                            </div>

                            <div className="flex bg-warm-100 p-1 rounded-xl">
                                {['day', 'week', 'month', 'year'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f
                                            ? 'bg-white text-warm-900 shadow-sm'
                                            : 'text-warm-500 hover:text-warm-700'
                                            }`}
                                    >
                                        {f === 'day' ? 'HOY' : f === 'week' ? 'SEMANA' : f === 'month' ? 'MES' : 'AÑO'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {statsLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Total Visits */}
                                <div className="bg-canvas-50 rounded-2xl p-6 border border-warm-100">
                                    <p className="text-xs font-bold text-warm-400 uppercase tracking-widest mb-2">Visitas Totales</p>
                                    <h3 className="text-4xl font-bold text-warm-900">{stats.total}</h3>
                                    <p className="text-sm text-warm-500 mt-2">En el periodo seleccionado</p>
                                </div>

                                {/* Referrers List */}
                                <div className="md:col-span-2 bg-canvas-50 rounded-2xl p-6 border border-warm-100">
                                    <p className="text-xs font-bold text-warm-400 uppercase tracking-widest mb-4">Fuentes de Tráfico</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                        {[
                                            { id: 'direct', label: 'Directo', icon: '🔗', color: 'bg-blue-100' },
                                            { id: 'google', label: 'Google', icon: '🔍', color: 'bg-red-100' },
                                            { id: 'facebook', label: 'Facebook', icon: '📱', color: 'bg-indigo-100' },
                                            { id: 'instagram', label: 'Instagram', icon: '📸', color: 'bg-pink-100' },
                                            { id: 'other', label: 'Otros', icon: '🌐', color: 'bg-warm-100' },
                                        ].map((s) => (
                                            <div key={s.id} className="text-center">
                                                <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mx-auto mb-2 text-xl`}>
                                                    {s.icon}
                                                </div>
                                                <p className="text-[10px] font-bold text-warm-500 uppercase">{s.label}</p>
                                                <p className="text-lg font-bold text-warm-800">{(stats.sources as any)[s.id] || 0}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Progress bars */}
                                    <div className="mt-6 pt-6 border-t border-warm-200/50 space-y-3">
                                        {Object.entries(stats.sources).map(([key, value]) => {
                                            const percentage = stats.total > 0 ? (value as number / stats.total) * 100 : 0;
                                            if (percentage === 0) return null;
                                            return (
                                                <div key={key} className="flex items-center gap-3">
                                                    <span className="text-[10px] font-bold text-warm-500 uppercase w-16">{key}</span>
                                                    <div className="flex-1 h-2 bg-warm-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-brand-purple transition-all duration-1000"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-warm-700 w-8 text-right">{Math.round(percentage)}%</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
