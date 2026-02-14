'use client'

import { useState } from 'react'

interface CancelEnrollmentButtonProps {
    inscripcionId: string
    tallerNombre: string
}

export default function CancelEnrollmentButton({ inscripcionId, tallerNombre }: CancelEnrollmentButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [motivoSelect, setMotivoSelect] = useState('')
    const [motivoDetalle, setMotivoDetalle] = useState('')
    const [loading, setLoading] = useState(false)

    const opcionesMotivo = [
        "No realizó el pago",
        "Error en el registro",
        "Inscripción duplicada",
        "Baja solicitada por el tutor",
        "Otros"
    ]

    const handleCancel = async () => {
        if (!motivoSelect) {
            alert('Por favor, seleccioná un motivo.')
            return
        }

        if (motivoSelect === 'Otros' && !motivoDetalle.trim()) {
            alert('Por favor, especificá el motivo en el campo de texto.')
            return
        }

        const motivoFinal = motivoSelect === 'Otros'
            ? motivoDetalle
            : `${motivoSelect}${motivoDetalle ? ` - ${motivoDetalle}` : ''}`

        setLoading(true)
        try {
            const res = await fetch('/api/admin/inscripciones', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: inscripcionId, motivo: motivoFinal })
            })

            if (res.ok) {
                alert('Inscripción cancelada/rechazada correctamente.')
                window.location.reload()
            } else {
                const data = await res.json()
                alert(data.error || 'Error al procesar la solicitud')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error al procesar la cancelación')
        } finally {
            setLoading(false)
        }
    }

    if (!showConfirm) {
        return (
            <button
                onClick={() => setShowConfirm(true)}
                className="text-xs font-bold text-red-600 hover:text-red-700 underline"
            >
                Cancelar/Rechazar Inscripción
            </button>
        )
    }

    return (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-red-800">Cancelar {tallerNombre}</p>
                <button
                    onClick={() => setShowConfirm(false)}
                    className="text-red-400 hover:text-red-600"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1.5">
                        Motivo Principal
                    </label>
                    <select
                        value={motivoSelect}
                        onChange={(e) => setMotivoSelect(e.target.value)}
                        className="w-full p-2.5 text-sm bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    >
                        <option value="">Seleccioná una opción...</option>
                        {opcionesMotivo.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {(motivoSelect === 'Otros' || motivoSelect !== '') && (
                    <div className="animate-slide-up">
                        <label className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1.5">
                            {motivoSelect === 'Otros' ? 'Especificar Motivo *' : 'Notas adicionales (Opcional)'}
                        </label>
                        <textarea
                            value={motivoDetalle}
                            onChange={(e) => setMotivoDetalle(e.target.value)}
                            className="w-full p-3 text-sm bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all min-h-[80px] resize-none"
                            placeholder={motivoSelect === 'Otros' ? "Escribe el motivo detallado..." : "Detalles para el padre/tutor..."}
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    onClick={handleCancel}
                    disabled={loading || !motivoSelect}
                    className="flex-1 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Procesando...' : 'Confirmar Acción'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-all"
                >
                    Volver
                </button>
            </div>
        </div>
    )
}
