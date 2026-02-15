'use client'

import { useState, useEffect } from 'react'

interface SolicitudRecuperacion {
    id: string
    alumnoId: string
    inscripcionId: string
    fechaClaseOriginal: string
    motivo: string | null
    estado: string // PENDIENTE, APROBADA, RECHAZADA
    esRecuperable: boolean
    fechaRecuperacion: string | null
    horarioRecuperacion: string | null
    creadoEn: string
    alumno: {
        nombre: string
        apellido: string
    }
    inscripcion: {
        taller: {
            nombre: string
        }
    }
}

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']
const HORARIOS = [
    { label: 'Tarde 1 (16:00 - 17:30)', value: '16:00 - 17:30' },
    { label: 'Tarde 2 (17:30 - 19:00)', value: '17:30 - 19:00' },
    { label: 'Tarde 3 (19:00 - 20:30)', value: '19:00 - 20:30' },
]

export default function RecuperosAdminPage() {
    const [solicitudes, setSolicitudes] = useState<SolicitudRecuperacion[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSol, setSelectedSol] = useState<SolicitudRecuperacion | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [processing, setProcessing] = useState(false)

    // Form states for approval
    const [esRecuperable, setEsRecuperable] = useState(true)
    const [fechaRec, setFechaRec] = useState('')
    const [horarioRec, setHorarioRec] = useState('')

    const fetchSolicitudes = async () => {
        try {
            const res = await fetch('/api/admin/recuperos')
            const data = await res.json()
            setSolicitudes(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSolicitudes()
    }, [])

    const handleUpdate = async (id: string, estado: string) => {
        setProcessing(true)
        try {
            const res = await fetch('/api/admin/recuperos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    estado,
                    esRecuperable: estado === 'APROBADA' ? esRecuperable : false,
                    fechaRecuperacion: estado === 'APROBADA' && esRecuperable ? fechaRec : null,
                    horarioRecuperacion: estado === 'APROBADA' && esRecuperable ? horarioRec : null
                })
            })

            if (res.ok) {
                setShowModal(false)
                fetchSolicitudes()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setProcessing(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-warm-500">Cargando solicitudes de recupero...</div>

    const pending = solicitudes.filter(s => s.estado === 'PENDIENTE')
    const historical = solicitudes.filter(s => s.estado !== 'PENDIENTE')

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-warm-900">Recupero de Clases</h1>
                <p className="text-warm-500 mt-1">Gestioná los avisos de inasistencia y programá clases de recupero.</p>
            </div>

            {/* Pending Requests */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-warm-800 flex items-center gap-2">
                    <span className="w-3 h-3 bg-lemon-500 rounded-full animate-pulse"></span>
                    Pendientes de Revisión
                </h2>
                {pending.length === 0 ? (
                    <div className="card p-12 text-center text-warm-400 italic">No hay solicitudes pendientes</div>
                ) : (
                    <div className="grid gap-4">
                        {pending.map(sol => (
                            <div key={sol.id} className="card p-6 flex items-center justify-between hover:border-lemon-300 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-warm-100 flex flex-col items-center justify-center text-warm-600">
                                        <span className="text-[10px] font-bold uppercase">{new Date(sol.fechaClaseOriginal).toLocaleDateString('es-AR', { month: 'short' })}</span>
                                        <span className="text-xl font-black">{new Date(sol.fechaClaseOriginal).getDate()}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-warm-900 text-lg">{sol.alumno.nombre} {sol.alumno.apellido}</h3>
                                        <div className="flex items-center gap-3 text-sm text-warm-500">
                                            <span>{sol.inscripcion.taller.nombre}</span>
                                            <span className="w-1 h-1 bg-warm-300 rounded-full"></span>
                                            <span>Clase original: {new Date(sol.fechaClaseOriginal).toLocaleDateString()}</span>
                                        </div>
                                        {sol.motivo && <p className="text-xs text-warm-400 mt-1 italic">"{sol.motivo}"</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedSol(sol)
                                            setShowModal(true)
                                            setEsRecuperable(true)
                                        }}
                                        className="btn-primary px-6"
                                    >
                                        Gestionar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Historial */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-warm-800">Historial Reciente</h2>
                <div className="card overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-canvas-50 border-b border-canvas-200">
                            <tr>
                                <th className="p-4 text-xs font-bold text-warm-500 uppercase">Alumno</th>
                                <th className="p-4 text-xs font-bold text-warm-500 uppercase text-center">Clase Original</th>
                                <th className="p-4 text-xs font-bold text-warm-500 uppercase text-center">Estado</th>
                                <th className="p-4 text-xs font-bold text-warm-500 uppercase">Recupero</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-canvas-100">
                            {historical.map(sol => (
                                <tr key={sol.id} className="text-sm">
                                    <td className="p-4">
                                        <p className="font-bold text-warm-800">{sol.alumno.nombre} {sol.alumno.apellido}</p>
                                        <p className="text-xs text-warm-500">{sol.inscripcion.taller.nombre}</p>
                                    </td>
                                    <td className="p-4 text-center text-warm-600">
                                        {new Date(sol.fechaClaseOriginal).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${sol.estado === 'APROBADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {sol.estado}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {sol.esRecuperable && sol.fechaRecuperacion ? (
                                            <div>
                                                <p className="font-medium text-emerald-700">{new Date(sol.fechaRecuperacion).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-emerald-600 font-bold">{sol.horarioRecuperacion}</p>
                                            </div>
                                        ) : (
                                            <span className="text-warm-400 italic">No aplica</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal de Gestión */}
            {showModal && selectedSol && (
                <div className="fixed inset-0 bg-warm-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-slide-up">
                        <h3 className="text-2xl font-bold text-warm-900 mb-2">Gestionar Inasistencia</h3>
                        <p className="text-warm-500 mb-6">
                            Alumno: <span className="font-bold text-warm-800">{selectedSol.alumno.nombre} {selectedSol.alumno.apellido}</span>
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-warm-700 mb-3">¿Es recuperable?</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setEsRecuperable(true)}
                                        className={`flex-1 py-3 rounded-2xl border-2 font-bold transition-all ${esRecuperable ? 'bg-lemon-100 border-lemon-500 text-lemon-700' : 'bg-white border-warm-100 text-warm-400'}`}
                                    >
                                        Sí, se recupera
                                    </button>
                                    <button
                                        onClick={() => setEsRecuperable(false)}
                                        className={`flex-1 py-3 rounded-2xl border-2 font-bold transition-all ${!esRecuperable ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-white border-warm-100 text-warm-400'}`}
                                    >
                                        No se recupera
                                    </button>
                                </div>
                            </div>

                            {esRecuperable && (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-bold text-warm-700 mb-2">Fecha de Recupero</label>
                                        <input
                                            type="date"
                                            value={fechaRec}
                                            onChange={e => setFechaRec(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-warm-100 focus:border-lemon-400 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-warm-700 mb-2">Bloque Horario</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {HORARIOS.map(h => (
                                                <button
                                                    key={h.value}
                                                    onClick={() => setHorarioRec(h.value)}
                                                    className={`px-3 py-2 text-xs font-bold rounded-xl border-2 transition-all ${horarioRec === h.value ? 'bg-lemon-500 border-lemon-500 text-white' : 'bg-white border-warm-100 text-warm-600 hover:border-lemon-300'}`}
                                                >
                                                    {h.label.split('(')[0]}<br />
                                                    <span className="text-[10px] opacity-80">{h.label.match(/\(([^)]+)\)/)?.[1]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    onClick={() => handleUpdate(selectedSol.id, 'APROBADA')}
                                    disabled={processing || (esRecuperable && (!fechaRec || !horarioRec))}
                                    className="w-full py-4 bg-lemon-500 text-warm-900 font-bold rounded-2xl hover:bg-lemon-600 shadow-lg shadow-lemon-200 transition-all disabled:opacity-50"
                                >
                                    {processing ? '...' : 'Aplicar'}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full mt-2 py-2 text-sm font-bold text-warm-400 hover:text-warm-600 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
