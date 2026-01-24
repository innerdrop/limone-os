'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TaskActionsProps {
    taskId: string
    isCompleted: boolean
}

export default function TaskActions({ taskId, isCompleted }: TaskActionsProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const toggleComplete = async () => {
        setLoading(true)
        try {
            await fetch(`/api/admin/tareas/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completada: !isCompleted })
            })
            router.refresh()
        } catch (error) {
            console.error('Error updating task:', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteTask = async () => {
        if (!confirm('¿Eliminar esta tarea?')) return

        setLoading(true)
        try {
            await fetch(`/api/admin/tareas/${taskId}`, {
                method: 'DELETE'
            })
            router.refresh()
        } catch (error) {
            console.error('Error deleting task:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={toggleComplete}
                disabled={loading}
                className={`p-2 rounded-lg transition-all ${isCompleted
                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
            >
                {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>
            <button
                onClick={deleteTask}
                disabled={loading}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                title="Eliminar tarea"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    )
}
