'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ConfirmPaymentButtonProps {
    pagoId: string
    monto: number
}

export default function ConfirmPaymentButton({ pagoId, monto }: ConfirmPaymentButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleConfirm = async () => {
        if (!confirm(`¿Confirmar pago de $${monto.toLocaleString('es-AR')}?`)) {
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch(`/api/admin/pagos/${pagoId}/confirmar`, {
                method: 'POST'
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Error al confirmar pago')
            }

            // Refresh the page to show updated data
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div>
            <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
                {loading ? 'Confirmando...' : 'Confirmar Pago'}
            </button>
            {error && (
                <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
            )}
        </div>
    )
}
