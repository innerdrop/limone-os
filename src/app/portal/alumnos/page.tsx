'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AlumnosPortalPage() {
    const { data: session } = useSession()
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/portal/alumnos')
            if (res.ok) {
                const data = await res.json()
                setStudents(data.students || [])
            }
        } catch (error) {
            console.error('Error fetching students:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session) {
            fetchStudents()
        }
    }, [session])

    const handleBaja = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de que querés dar de baja a ${name}? Esta acción no se puede deshacer.`)) return

        try {
            const res = await fetch(`/api/portal/alumnos/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                setMessage('Alumno dado de baja correctamente')
                fetchStudents()
            } else {
                const data = await res.json()
                alert(data.error || 'Error al dar de baja')
            }
        } catch (error) {
            alert('Error al procesar la baja')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lemon-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-black text-warm-900">Mis Alumnos</h1>
                    <p className="text-warm-500">Gestioná los perfiles y las inscripciones de tus hijos.</p>
                </div>
                <Link href="/portal/inscripcion" className="btn-primary">
                    + Inscribir otro menor
                </Link>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-lemon-50 border border-lemon-100 text-lemon-700 font-medium">
                    {message}
                </div>
            )}

            {students.length === 0 ? (
                <div className="card text-center py-20 space-y-4">
                    <div className="text-6xl text-warm-200">👥</div>
                    <h3 className="text-xl font-bold text-warm-800">No tenés alumnos registrados</h3>
                    <p className="text-warm-500 max-w-sm mx-auto">Comenzá inscribiendo a un menor en nuestros talleres.</p>
                    <Link href="/portal/inscripcion" className="btn-primary inline-block">
                        Comenzar Inscripción
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {students.map((student) => (
                        <div key={student.id} className="card p-0 overflow-hidden border-2 border-transparent hover:border-lemon-200 transition-all group">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-lemon-100 flex items-center justify-center text-3xl">
                                            👤
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-warm-900">
                                                {student.nombre} {student.apellido}
                                            </h3>
                                            <p className="text-sm text-warm-500">DNI: {student.dni || '-'}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${student.perfilCompleto ? 'bg-leaf-100 text-leaf-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {student.perfilCompleto ? 'Perfil Completo' : 'Perfil Pendiente'}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-warm-400 uppercase tracking-widest">Inscripciones Activas</h4>
                                    {student.inscripciones?.filter((ins: any) => ins.estado === 'ACTIVA').length > 0 ? (
                                        <div className="space-y-2">
                                            {student.inscripciones.filter((ins: any) => ins.estado === 'ACTIVA').map((ins: any) => (
                                                <div key={ins.id} className="p-3 rounded-xl bg-canvas-50 border border-canvas-200 flex justify-between items-center text-sm">
                                                    <div>
                                                        <p className="font-bold text-warm-800">{ins.fase}</p>
                                                        <p className="text-warm-500">{ins.dia} • {ins.horario}</p>
                                                    </div>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lemon-100 text-lemon-700 uppercase">
                                                        {ins.taller?.nombre}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm italic text-warm-400">Sin inscripciones activas</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-canvas-50 border-t border-canvas-200 flex gap-3">
                                <Link
                                    href={`/portal/perfil?studentId=${student.id}`}
                                    className="flex-1 py-2 rounded-xl border border-canvas-300 bg-white text-center text-sm font-bold text-warm-600 hover:bg-canvas-100 transition-colors"
                                >
                                    Editar Datos
                                </Link>
                                <button
                                    onClick={() => handleBaja(student.id, student.nombre)}
                                    className="flex-1 py-2 rounded-xl border border-red-200 bg-red-50/50 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors"
                                >
                                    Dar de baja
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
