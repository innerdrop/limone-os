'use client'

import { useState, useEffect } from 'react'

export default function PreciosPage() {
    const [data, setData] = useState<any>({
        talleres: [],
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/admin/precios')
            .then(res => res.json())
            .then(resData => {
                setData({
                    talleres: resData.talleres || [],
                })
            })
            .catch(() => {
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
                body: JSON.stringify({
                    talleres: data.talleres,
                })
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.error || 'Error al guardar precios')
            }

            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleTallerChange = (id: string, field: string, value: string) => {
        const numValue = parseFloat(value) || 0
        setData((prev: any) => ({
            ...prev,
            talleres: prev.talleres.map((t: any) =>
                t.id === id ? { ...t, [field]: numValue } : t
            )
        }))
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="w-12 h-12 border-4 border-lemon-200 border-t-lemon-500 rounded-full animate-spin"></div>
                <p className="text-warm-500 font-medium animate-pulse">Cargando gestión de precios...</p>
            </div>
        )
    }

    // Smart categorization
    const talleresRegular = data.talleres.filter((t: any) =>
        (t.tipo === 'REGULAR' || !t.tipo) &&
        !t.nombre.toLowerCase().includes('única') &&
        !t.nombre.toLowerCase().includes('verano')
    )

    const talleresVerano = data.talleres.filter((t: any) =>
        t.tipo === 'VERANO' || t.nombre.toLowerCase().includes('verano')
    )

    const claseUnica = data.talleres.find((t: any) => t.nombre.toLowerCase().includes('única'))

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-black text-warm-900 tracking-tight">Gestión de Precios</h1>
                    <p className="text-warm-500 mt-2 text-lg">Centralizá y controlá los valores de tus servicios artísticos.</p>
                </div>
                <div className="flex items-center gap-4">
                    {success && (
                        <span className="text-green-600 font-bold animate-bounce-in bg-green-50 px-4 py-2 rounded-full border border-green-100 text-sm">
                            ✨ ¡Guardado con éxito!
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="group relative px-8 py-4 bg-warm-900 text-white font-black rounded-2xl overflow-hidden hover:bg-black disabled:opacity-50 transition-all shadow-xl hover:shadow-warm-200"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <span>💾</span>
                                    Actualizar Precios
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700 animate-slide-up">
                    <span className="text-xl">⚠️</span>
                    <p className="font-bold">{error}</p>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Fixed Column: Clase Única */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-2 mb-2 px-2">
                        <span className="text-xl">✨</span>
                        <h2 className="text-xl font-black text-warm-800 uppercase tracking-wider">Plan Especial</h2>
                    </div>
                    {claseUnica ? (
                        <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-[2.5rem] border-2 border-purple-100 shadow-lg shadow-purple-50/50 hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-warm-900">{claseUnica.nombre}</h3>
                                    <p className="text-purple-500 text-sm font-bold uppercase tracking-widest mt-1">Precio Fijo</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-2xl text-2xl group-hover:scale-110 transition-transform">🎫</div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-warm-400 uppercase tracking-[0.2em] ml-1">Monto Sugerido</label>
                                <div className="relative group/input">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={claseUnica.precio}
                                        onChange={(e) => handleTallerChange(claseUnica.id, 'precio', e.target.value)}
                                        className="w-full pl-10 pr-6 py-4 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-400 focus:outline-none text-xl font-black text-warm-800 shadow-inner group-hover/input:border-purple-200 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-warm-50 rounded-2xl border-2 border-dashed border-warm-100 text-warm-400 text-center text-sm">
                            Clase Única no configurada
                        </div>
                    )}
                </div>

                {/* Main Column: Workshop Groups */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Talleres Regulares */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2 px-2">
                            <span className="text-xl">🌿</span>
                            <h2 className="text-xl font-black text-warm-800 uppercase tracking-wider">Talleres Regulares</h2>
                        </div>
                        <div className="grid gap-6">
                            {talleresRegular.map((t: any) => (
                                <PriceWorkshopCard
                                    key={t.id}
                                    taller={t}
                                    onChange={(f: string, v: string) => handleTallerChange(t.id, f, v)}
                                    color="lemon"
                                    icon="🎨"
                                />
                            ))}
                            {talleresRegular.length === 0 && (
                                <div className="p-12 text-center bg-warm-50 rounded-[2.5rem] border-2 border-dashed border-warm-100">
                                    <p className="text-warm-400 font-medium italic">No hay talleres regulares para mostrar.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Talleres de Verano */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2 px-2">
                            <span className="text-xl">☀️</span>
                            <h2 className="text-xl font-black text-warm-800 uppercase tracking-wider">Talleres de Verano</h2>
                        </div>
                        <div className="grid gap-6">
                            {talleresVerano.map((t: any) => (
                                <PriceWorkshopCard
                                    key={t.id}
                                    taller={t}
                                    onChange={(f: string, v: string) => handleTallerChange(t.id, f, v)}
                                    color="orange"
                                    icon="🌋"
                                    isSummer
                                />
                            ))}
                            {talleresVerano.length === 0 && (
                                <div className="p-12 text-center bg-warm-100/50 rounded-[2.5rem] border-2 border-dashed border-warm-200">
                                    <p className="text-warm-400 font-medium italic">No hay talleres de verano activos actualmente.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function PriceWorkshopCard({ taller, onChange, color, icon, isSummer }: any) {
    const bgColor = color === 'lemon' ? 'from-lemon-50/50 to-white' : 'from-orange-50/50 to-white'
    const borderColor = color === 'lemon' ? 'border-lemon-100' : 'border-orange-100'
    const focusColor = color === 'lemon' ? 'focus:border-lemon-400' : 'focus:border-orange-400'
    const iconBg = color === 'lemon' ? 'bg-lemon-100' : 'bg-orange-100'

    return (
        <div className={`bg-gradient-to-r ${bgColor} p-8 rounded-[2.5rem] border-2 ${borderColor} shadow-sm hover:shadow-md transition-all`}>
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center text-2xl shadow-inner`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-warm-900">{taller.nombre}</h3>
                        <p className="text-[10px] font-bold text-warm-400 uppercase tracking-[0.2em] mt-0.5">ID: {taller.id.slice(-6)}</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Bloque Normal */}
                    <div className="space-y-4">
                        {isSummer && <p className="text-[10px] font-black text-warm-500 uppercase tracking-widest border-b border-warm-100 pb-1">Modalidad Base</p>}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-warm-400 uppercase tracking-[0.2em] ml-1">1 Día por semana</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={taller.precio1dia}
                                        onChange={(e) => onChange('precio1dia', e.target.value)}
                                        className={`w-full pl-8 pr-4 py-3 bg-white border-2 border-warm-100 rounded-2xl ${focusColor} focus:outline-none font-black text-warm-800 transition-all`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-warm-400 uppercase tracking-[0.2em] ml-1">2 Días por semana</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={taller.precio2dia}
                                        onChange={(e) => onChange('precio2dia', e.target.value)}
                                        className={`w-full pl-8 pr-4 py-3 bg-white border-2 border-warm-100 rounded-2xl ${focusColor} focus:outline-none font-black text-warm-800 transition-all`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bloque Extendido (Solo Verano) */}
                    {isSummer && (
                        <div className="space-y-4 animate-slide-up">
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest border-b border-orange-100 pb-1">Modalidad Extendida (Con Merienda)</p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-warm-400 uppercase tracking-[0.2em] ml-1">1 Día con Merienda</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={taller.precio1diaExt}
                                            onChange={(e) => onChange('precio1diaExt', e.target.value)}
                                            className={`w-full pl-8 pr-4 py-3 bg-white border-2 border-orange-50 rounded-2xl focus:border-orange-400 focus:outline-none font-black text-warm-800 transition-all`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-warm-400 uppercase tracking-[0.2em] ml-1">2 Días con Merienda</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={taller.precio2diaExt}
                                            onChange={(e) => onChange('precio2diaExt', e.target.value)}
                                            className={`w-full pl-8 pr-4 py-3 bg-white border-2 border-orange-50 rounded-2xl focus:border-orange-400 focus:outline-none font-black text-warm-800 transition-all`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
