'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AlumnoClaseUnica {
    id: string
    nombre: string
    apellido: string
    dni: string
    email: string
    claseUnicaAprobada: boolean
    inscripcionId: string
    fechaInscripcion: string
    estadoInscripcion: string
    pagado: boolean
}

export default function ClaseUnicaApprovalPage() {
    const [alumnos, setAlumnos] = useState<AlumnoClaseUnica[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchAlumnos = async () => {
        try {
            const res = await fetch('/api/admin/clase-unica')
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Error al cargar alumnos')
            setAlumnos(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAlumnos()
    }, [])

    const handleApprove = async (alumnoId: string, approve: boolean) => {
        setProcessingId(alumnoId)
        setError('')
        try {
            const res = await fetch('/api/admin/clase-unica/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alumnoId, approve })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Error al actualizar estado')

            setSuccess(`Alumno ${approve ? 'aprobado' : 'desaprobado'} con éxito`)
            setTimeout(() => setSuccess(''), 3000)

            // Update local state
            setAlumnos(prev => prev.map(al =>
                al.id === alumnoId ? { ...al, claseUnicaAprobada: approve } : al
            ))
        } catch (err: any) {
            setError(err.message)
        } finally {
            setProcessingId(null)
        }
    }

    if (loading) return <div className="p-8 text-center text-warm-500">Cargando alumnos de clase única...</div>

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-warm-900">Aprobación de Clase Única</h1>
                <p className="text-warm-500 mt-1">Habilita el Taller Regular para alumnos que hayan aprobado su Clase Única</p>
            </div>

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
                    <span>✓</span> {success}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-canvas-50 border-b border-canvas-200">
                                <th className="p-4 font-bold text-warm-700 text-sm italic">Alumno</th>
                                <th className="p-4 font-bold text-warm-700 text-sm italic">Contacto</th>
                                <th className="p-4 font-bold text-warm-700 text-sm italic">Clase Única</th>
                                <th className="p-4 font-bold text-warm-700 text-sm italic">Pago</th>
                                <th className="p-4 font-bold text-warm-700 text-sm italic">Estado</th>
                                <th className="p-4 font-bold text-warm-700 text-sm italic text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-canvas-100">
                            {alumnos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-warm-400">No hay alumnos con clases únicas registradas</td>
                                </tr>
                            ) : (
                                alumnos.map(al => (
                                    <tr key={al.id} className="hover:bg-canvas-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-warm-800">{al.nombre} {al.apellido}</p>
                                            <p className="text-xs text-warm-500">DNI: {al.dni}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-warm-700">{al.email}</p>
                                        </td>
                                        <td className="p-4 text-sm text-warm-600">
                                            {new Date(al.fechaInscripcion).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${al.pagado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {al.pagado ? 'PAGADO' : 'PENDIENTE'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {al.claseUnicaAprobada ? (
                                                <span className="flex items-center gap-1 text-green-600 font-bold text-sm">
                                                    <span className="text-lg">✓</span> Habilitado
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-warm-400 font-medium text-sm">
                                                    <span className="text-lg">○</span> Pendiente
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleApprove(al.id, !al.claseUnicaAprobada)}
                                                disabled={processingId === al.id}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${al.claseUnicaAprobada
                                                        ? 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                                                        : 'bg-lemon-500 text-warm-900 hover:bg-lemon-600 shadow-sm'
                                                    } disabled:opacity-50`}
                                            >
                                                {processingId === al.id ? '...' : al.claseUnicaAprobada ? 'Revocar' : 'Aprobar Clase'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
