'use client'

import { useState } from 'react'

interface ConfirmarPagoButtonProps {
    pagoId: string
    isWaitingVerification: boolean
}

export default function ConfirmarPagoButton({ pagoId, isWaitingVerification }: ConfirmarPagoButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        if (!confirm('¿Confirmar que recibiste la transferencia? Esto activará la inscripción del alumno.')) return

        setLoading(true)
        try {
            const res = await fetch(`/api/admin/pagos/${pagoId}/confirmar`, {
                method: 'POST'
            })
            if (res.ok) {
                window.location.reload()
            } else {
                alert('Error al confirmar el pago.')
            }
        } catch (error) {
            alert('Error de conexión.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleConfirm}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 ${isWaitingVerification
                    ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-glow-amber animate-pulse'
                    : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                }`}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : isWaitingVerification ? (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    CONFIRMAR RECIBIDO
                </>
            ) : (
                'Confirmar Manual'
            )}
        </button>
    )
}
