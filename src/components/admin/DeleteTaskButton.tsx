'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteTaskButtonProps {
    taskId: string
    onSuccess?: () => void
    variant?: 'icon' | 'text'
}

export default function DeleteTaskButton({ taskId, onSuccess, variant = 'icon' }: DeleteTaskButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm('¿Estás seguro de que querés eliminar esta tarea?')) return

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/tareas/${taskId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                if (onSuccess) {
                    onSuccess()
                } else {
                    router.refresh()
                }
            } else {
                alert('Error al eliminar la tarea')
            }
        } catch (error) {
            console.error('Error deleting task:', error)
            alert('Error de conexión')
        } finally {
            setIsDeleting(false)
        }
    }

    if (variant === 'text') {
        return (
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
            >
                {isDeleting ? 'Eliminando...' : (
                    <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Borrar Tarea
                    </>
                )}
            </button>
        )
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all"
            title="Eliminar Tarea"
        >
            {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )}
        </button>
    )
}
