'use client'

import { useState, useEffect } from 'react'

interface PopupConfig {
    active: boolean
    badge: string
    title: string
    subtitle: string
    text: string
    btnText: string
    btnLink: string
    footer: string
}

export default function AdminPopupPage() {
    const [config, setConfig] = useState<PopupConfig>({
        active: false,
        badge: '',
        title: '',
        subtitle: '',
        text: '',
        btnText: '',
        btnLink: '',
        footer: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/popup')
            if (res.ok) {
                const data = await res.json()
                setConfig(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConfig()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')

        try {
            const res = await fetch('/api/admin/popup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            })

            if (res.ok) {
                setMessage('✅ Cambios guardados correctamente')
            } else {
                setMessage('❌ Error al guardar los cambios')
            }
        } catch (error) {
            setMessage('❌ Error de conexión')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-warm-500">Cargando configuración...</div>

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-warm-900 font-gigi">Gestión de Popup Promocional</h1>
                <p className="text-warm-500 mt-1">Configurá el cartel que aparece al inicio del sitio.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Formulario */}
                <form onSubmit={handleSave} className="card p-8 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-warm-50 rounded-2xl border-2 border-warm-100">
                        <div>
                            <p className="font-bold text-warm-800">Estado del Popup</p>
                            <p className="text-xs text-warm-500">{config.active ? 'Activo y visible' : 'Oculto'}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setConfig({ ...config, active: !config.active })}
                            className={`w-14 h-8 rounded-full transition-all relative ${config.active ? 'bg-lemon-500' : 'bg-warm-200'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${config.active ? 'right-1' : 'left-1'} shadow-sm`} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="label">Etiqueta (Badge)</label>
                            <input
                                type="text"
                                value={config.badge}
                                onChange={e => setConfig({ ...config, badge: e.target.value })}
                                className="input-field"
                                placeholder="Ej: Temporada 2026"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Título (Parte 1)</label>
                                <input
                                    type="text"
                                    value={config.title}
                                    onChange={e => setConfig({ ...config, title: e.target.value })}
                                    className="input-field"
                                    placeholder="Ej: Taller de"
                                />
                            </div>
                            <div>
                                <label className="label">Título destacado</label>
                                <input
                                    type="text"
                                    value={config.subtitle}
                                    onChange={e => setConfig({ ...config, subtitle: e.target.value })}
                                    className="input-field"
                                    placeholder="Ej: Verano"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Texto descriptivo</label>
                            <textarea
                                value={config.text}
                                onChange={e => setConfig({ ...config, text: e.target.value })}
                                className="input-field min-h-[100px] resize-none"
                                placeholder="Escribe el mensaje del popup..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Texto Botón</label>
                                <input
                                    type="text"
                                    value={config.btnText}
                                    onChange={e => setConfig({ ...config, btnText: e.target.value })}
                                    className="input-field"
                                    placeholder="Ej: ¡Reservar!"
                                />
                            </div>
                            <div>
                                <label className="label">Enlace Botón</label>
                                <input
                                    type="text"
                                    value={config.btnLink}
                                    onChange={e => setConfig({ ...config, btnLink: e.target.value })}
                                    className="input-field"
                                    placeholder="Ej: /taller-verano"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Texto pie de página</label>
                            <input
                                type="text"
                                value={config.footer}
                                onChange={e => setConfig({ ...config, footer: e.target.value })}
                                className="input-field"
                                placeholder="Ej: Cupos limitados"
                            />
                        </div>
                    </div>

                    {message && (
                        <p className={`text-sm font-bold text-center ${message.includes('✅') ? 'text-emerald-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary w-full py-4 text-base shadow-lg shadow-lemon-200"
                    >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>

                {/* Vista Previa */}
                <div className="sticky top-8 space-y-4">
                    <h3 className="text-lg font-bold text-warm-800 ml-2">Vista Previa</h3>
                    <div className="bg-warm-100 rounded-[2.5rem] p-8 border-2 border-warm-200 relative overflow-hidden flex items-center justify-center min-h-[500px]">
                        <div className="absolute inset-0 bg-black/5" />

                        {/* El diseño exacto del popup */}
                        <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-[320px] overflow-hidden border border-lemon-100">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-lemon-100/50 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />

                            <div className="p-8 pb-6 flex flex-col items-center text-center">
                                <span className={`inline-block px-3 py-1 bg-lemon-100 text-lemon-700 text-[10px] font-bold rounded-full uppercase mb-4`}>
                                    {config.badge || 'Etiqueta'}
                                </span>

                                <h2 className="text-2xl font-bold text-warm-800 mb-2 leading-tight">
                                    {config.title || 'Título'}<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange">
                                        {config.subtitle || 'Destacado'}
                                    </span>
                                </h2>

                                <p className="text-warm-600 text-[11px] leading-relaxed mb-6 max-w-[200px]">
                                    {config.text || 'Descripción del popup...'}
                                </p>

                                <div className="w-full py-3 bg-lemon-500 text-warm-900 font-bold rounded-2xl text-xs flex items-center justify-center">
                                    {config.btnText || 'Botón'}
                                </div>

                                <p className="text-[9px] text-warm-400 mt-4 uppercase tracking-widest font-medium">
                                    {config.footer || 'Texto de pie'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-warm-400 italic text-center px-4">
                        Esta es una simulación visual del diseño que verán los usuarios.
                    </p>
                </div>
            </div>
        </div>
    )
}
