'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface GenerateInvoiceButtonProps {
    pagoId: string
    hasInvoice: boolean
    invoiceUrl?: string | null
}

export default function GenerateInvoiceButton({ pagoId, hasInvoice, invoiceUrl }: GenerateInvoiceButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleFacturar = async () => {
        if (isLoading) return

        setIsLoading(true)
        try {
            const response = await fetch(`/api/admin/pagos/${pagoId}/facturar`, {
                method: 'POST',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error al generar la factura')
            }

            alert('Factura generada con éxito')
            router.refresh()
        } catch (error: any) {
            console.error('Facturacion Error:', error)
            alert(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (hasInvoice && invoiceUrl) {
        return (
            <a
                href={invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ver Factura
            </a>
        )
    }

    return (
        <button
            onClick={handleFacturar}
            disabled={isLoading}
            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${isLoading
                    ? 'bg-canvas-100 text-warm-400 border-canvas-200 cursor-not-allowed'
                    : 'bg-leaf-50 text-leaf-700 border-leaf-200 hover:bg-leaf-100'
                }`}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Facturando...
                </>
            ) : (
                <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Generar Factura
                </>
            )}
        </button>
    )
}
