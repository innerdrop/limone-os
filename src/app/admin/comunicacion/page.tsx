'use client'

import { useState, useEffect } from 'react'

interface Alumno {
    id: string
    nombre: string
    apellido: string
    usuario: { email: string }
}

interface Taller {
    id: string
    nombre: string
}

export default function ComunicacionAdminPage() {
    const [alumnos, setAlumnos] = useState<Alumno[]>([])
    const [talleres, setTalleres] = useState<Taller[]>([])
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [result, setResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null)

    // Form state
    const [target, setTarget] = useState('TODOS')
    const [targetId, setTargetId] = useState('')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [btnText, setBtnText] = useState('')
    const [btnLink, setBtnLink] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/comunicacion')
                const data = await res.json()
                setAlumnos(data.alumnos || [])
                setTalleres(data.talleres || [])
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (target !== 'TODOS' && !targetId) {
            alert('Por favor elegí un destinatario o taller')
            return
        }

        setSending(true)
        setResult(null)

        try {
            const res = await fetch('/api/admin/comunicacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target,
                    targetId,
                    subject,
                    body,
                    btnText,
                    btnLink
                })
            })

            const data = await res.json()
            if (res.ok) {
                setResult({ success: true, count: data.count })
                setSubject('')
                setBody('')
                setBtnText('')
                setBtnLink('')
            } else {
                setResult({ success: false, error: data.error })
            }
        } catch (error) {
            setResult({ success: false, error: 'Error de conexión' })
        } finally {
            setSending(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-warm-500">Cargando herramientas de comunicación...</div>

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in text-warm-900">
            <div>
                <h1 className="text-3xl font-bold text-warm-900 font-gigi">Comunicación Corporativa</h1>
                <p className="text-warm-500 mt-1">Enviá correos electrónicos con el diseño institucional de Taller Limoné.</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                <form onSubmit={handleSend} className="lg:col-span-3 card p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="label">Destinatarios</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['TODOS', 'TALLER', 'INDIVIDUAL'].map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => {
                                            setTarget(t)
                                            setTargetId('')
                                        }}
                                        className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${target === t ? 'bg-lemon-500 border-lemon-500 text-warm-900 shadow-glow-lemon' : 'bg-white border-warm-100 text-warm-400'}`}
                                    >
                                        {t === 'TODOS' ? '🚀 Todos' : t === 'TALLER' ? '🎨 Grupo' : '👤 Individual'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {target === 'TALLER' && (
                            <div className="animate-slide-down">
                                <label className="label">Elegí el Taller</label>
                                <select
                                    className="input-field"
                                    value={targetId}
                                    onChange={e => setTargetId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccioná un taller...</option>
                                    {talleres.map(tal => (
                                        <option key={tal.id} value={tal.id}>{tal.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {target === 'INDIVIDUAL' && (
                            <div className="animate-slide-down">
                                <label className="label">Elegí el Alumno</label>
                                <select
                                    className="input-field"
                                    value={targetId}
                                    onChange={e => setTargetId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccioná un alumno...</option>
                                    {alumnos.map(alum => (
                                        <option key={alum.id} value={alum.id}>{alum.nombre} {alum.apellido} ({alum.usuario?.email})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <hr className="border-warm-100" />

                        <div>
                            <label className="label">Asunto del Correo</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="input-field"
                                placeholder="Ej: ¡Novedades del Taller!"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Mensaje (Soporta saltos de línea)</label>
                            <textarea
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                className="input-field min-h-[200px] resize-none"
                                placeholder="Escribí aquí el cuerpo del mensaje..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-warm-100 pt-4">
                            <div>
                                <label className="label text-[10px]">Texto Botón (Opcional)</label>
                                <input
                                    type="text"
                                    value={btnText}
                                    onChange={e => setBtnText(e.target.value)}
                                    className="input-field text-sm"
                                    placeholder="Ej: Ver más"
                                />
                            </div>
                            <div>
                                <label className="label text-[10px]">Link Botón (Opcional)</label>
                                <input
                                    type="text"
                                    value={btnLink}
                                    onChange={e => setBtnLink(e.target.value)}
                                    className="input-field text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className={`p-4 rounded-xl text-center text-sm font-bold animate-fade-in ${result.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {result.success ? `✅ Enviado con éxito a ${result.count} destinatarios.` : `❌ Error: ${result.error}`}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={sending}
                        className="btn-primary w-full py-4 text-base shadow-lg shadow-lemon-200 disabled:opacity-50"
                    >
                        {sending ? 'Enviando correos...' : '🚀 Enviar Ahora'}
                    </button>
                </form>

                {/* Vista Previa Visual */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-warm-800 ml-2">Vista Previa</h3>
                    <div className="card p-0 overflow-hidden border-2 border-warm-100 bg-canvas-50 min-h-[600px] flex flex-col">
                        {/* Fake Email Header */}
                        <div className="bg-canvas-200 p-4 border-b border-warm-200 text-[10px] text-warm-500 space-y-1">
                            <p>De: Taller Limoné &lt;noreply@tallerlimone.com&gt;</p>
                            <p>Para: Destinatarios seleccionados</p>
                            <p>Asunto: {subject || '(Sin asunto)'}</p>
                        </div>

                        {/* Fake Branded Content */}
                        <div className="flex-1 bg-[#F5F0E8] p-4 flex items-center justify-center">
                            <div className="bg-white rounded-lg shadow-sm w-full max-w-[300px] overflow-hidden">
                                <div className="bg-gradient-to-br from-[#F1C40F] to-[#27AE60] p-6 text-center">
                                    <div className="w-24 h-10 bg-white/30 rounded mx-auto relative flex items-center justify-center">
                                        <span className="text-[8px] font-bold text-white/50">LOGO</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h4 className="font-bold text-warm-800 mb-3 break-words">{subject || 'Título del Mail'}</h4>
                                    <p className="text-[11px] text-warm-600 leading-relaxed whitespace-pre-wrap break-words">
                                        {body || 'Aquí se verá el cuerpo del mensaje redactado...'}
                                    </p>
                                    {(btnText && btnLink) && (
                                        <div className="mt-4 inline-block px-4 py-2 bg-[#F1C40F] text-warm-900 rounded-full text-[10px] font-bold">
                                            {btnText}
                                        </div>
                                    )}
                                </div>
                                <div className="bg-[#2D2D2D] p-4 text-center">
                                    <div className="w-12 h-1 bg-white/10 rounded mx-auto" />
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-warm-400 italic p-4 text-center">
                            Los alumnos recibirán el mail con el diseño corporativo completo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
