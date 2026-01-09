'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteWorkshopButtonProps {
    workshopId: string
    workshopName: string
}

export default function DeleteWorkshopButton({ workshopId, workshopName }: DeleteWorkshopButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch(`/api/admin/talleres/${workshopId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Error al eliminar el taller')
            }

            // Recargar la página para reflejar los cambios
            router.refresh()
            setShowConfirm(false)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setIsDeleting(false)
        }
    }

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-600 animate-pulse">¿Confirmar?</span>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors border border-red-200"
                    title="Confirmar eliminación"
                >
                    {isDeleting ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="p-1.5 text-warm-600 bg-canvas-50 hover:bg-canvas-100 rounded-lg transition-colors border border-canvas-200"
                    title="Cancelar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
            title={`Eliminar taller: ${workshopName}`}
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    )
}
