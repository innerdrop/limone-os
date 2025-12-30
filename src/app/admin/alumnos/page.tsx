'use client'

import { useState } from 'react'
import Link from 'next/link'

// Alumnos de ejemplo (en producción vendrían de la BD)
const alumnosEjemplo = [
    {
        id: '1',
        nombre: 'María García',
        email: 'maria@email.com',
        telefono: '+54 9 2901 111-111',
        edad: 28,
        nivel: 'INTERMEDIO',
        taller: 'Pintura al Óleo',
        estado: 'activo',
        cuotaAlDia: true,
        inscripcion: '15 Jul 2024',
    },
    {
        id: '2',
        nombre: 'Carlos Rodríguez',
        email: 'carlos@email.com',
        telefono: '+54 9 2901 222-222',
        edad: 35,
        nivel: 'PRINCIPIANTE',
        taller: 'Acuarela Creativa',
        estado: 'activo',
        cuotaAlDia: true,
        inscripcion: '20 Ago 2024',
    },
    {
        id: '3',
        nombre: 'Ana Martínez',
        email: 'ana@email.com',
        telefono: '+54 9 2901 333-333',
        edad: 42,
        nivel: 'AVANZADO',
        taller: 'Técnicas Mixtas',
        estado: 'activo',
        cuotaAlDia: false,
        inscripcion: '5 Mar 2024',
    },
    {
        id: '4',
        nombre: 'Lucía Fernández',
        email: 'lucia@email.com',
        telefono: '+54 9 2901 444-444',
        edad: 16,
        nivel: 'PRINCIPIANTE',
        taller: 'Dibujo Artístico',
        estado: 'activo',
        cuotaAlDia: true,
        inscripcion: '10 Oct 2024',
    },
    {
        id: '5',
        nombre: 'Pedro Gómez',
        email: 'pedro@email.com',
        telefono: '+54 9 2901 555-555',
        edad: 55,
        nivel: 'INTERMEDIO',
        taller: 'Pintura al Óleo',
        estado: 'pausado',
        cuotaAlDia: true,
        inscripcion: '1 Ene 2024',
    },
]

export default function AlumnosPage() {
    const [busqueda, setBusqueda] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')
    const [filtroTaller, setFiltroTaller] = useState('todos')
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<typeof alumnosEjemplo[0] | null>(null)

    const alumnosFiltrados = alumnosEjemplo.filter((alumno) => {
        const matchBusqueda = alumno.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            alumno.email.toLowerCase().includes(busqueda.toLowerCase())
        const matchEstado = filtroEstado === 'todos' || alumno.estado === filtroEstado
        const matchTaller = filtroTaller === 'todos' || alumno.taller === filtroTaller
        return matchBusqueda && matchEstado && matchTaller
    })

    const talleresUnicos = [...new Set(alumnosEjemplo.map(a => a.taller))]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Gestión de Alumnos
                    </h1>
                    <p className="text-warm-500 mt-1">
                        {alumnosEjemplo.length} alumnos registrados
                    </p>
                </div>
                <Link href="/admin/alumnos/nuevo" className="btn-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nuevo Alumno
                </Link>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <label className="label">Buscar</label>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar por nombre o email..."
                                className="input-field pl-10"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label">Estado</label>
                        <select
                            className="input-field"
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="activo">Activos</option>
                            <option value="pausado">Pausados</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Taller</label>
                        <select
                            className="input-field"
                            value={filtroTaller}
                            onChange={(e) => setFiltroTaller(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            {talleresUnicos.map((taller) => (
                                <option key={taller} value={taller}>{taller}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-canvas-50">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Alumno</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Taller</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Nivel</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-warm-500">Cuota</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-warm-500">Estado</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-warm-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-canvas-100">
                            {alumnosFiltrados.map((alumno) => (
                                <tr key={alumno.id} className="hover:bg-canvas-50">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-lemon-200 flex items-center justify-center">
                                                <span className="text-lemon-700 font-semibold">
                                                    {alumno.nombre.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-warm-800">{alumno.nombre}</p>
                                                <p className="text-sm text-warm-500">{alumno.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-warm-600">{alumno.taller}</td>
                                    <td className="py-4 px-4">
                                        <span className={`badge ${alumno.nivel === 'PRINCIPIANTE' ? 'bg-blue-100 text-blue-700' :
                                                alumno.nivel === 'INTERMEDIO' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {alumno.nivel}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {alumno.cuotaAlDia ? (
                                            <span className="text-green-600">✓</span>
                                        ) : (
                                            <span className="text-red-600">✗</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`badge ${alumno.estado === 'activo' ? 'badge-success' : 'badge-warning'
                                            }`}>
                                            {alumno.estado}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button
                                            onClick={() => setAlumnoSeleccionado(alumno)}
                                            className="text-lemon-600 hover:text-lemon-700 font-medium text-sm"
                                        >
                                            Ver ficha
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {alumnosFiltrados.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-warm-500">No se encontraron alumnos con los filtros seleccionados</p>
                    </div>
                )}
            </div>

            {/* Student Detail Modal */}
            {alumnoSeleccionado && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                        {/* Header */}
                        <div className="p-6 border-b border-canvas-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-warm-800">Ficha del Alumno</h2>
                            <button
                                onClick={() => setAlumnoSeleccionado(null)}
                                className="p-2 hover:bg-canvas-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Profile */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-lemon-200 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-lemon-700">
                                        {alumnoSeleccionado.nombre.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-warm-800">{alumnoSeleccionado.nombre}</h3>
                                    <p className="text-warm-500">{alumnoSeleccionado.email}</p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-canvas-50">
                                    <p className="text-sm text-warm-500">Teléfono</p>
                                    <p className="font-medium text-warm-800">{alumnoSeleccionado.telefono}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-canvas-50">
                                    <p className="text-sm text-warm-500">Edad</p>
                                    <p className="font-medium text-warm-800">{alumnoSeleccionado.edad} años</p>
                                </div>
                                <div className="p-4 rounded-xl bg-canvas-50">
                                    <p className="text-sm text-warm-500">Taller</p>
                                    <p className="font-medium text-warm-800">{alumnoSeleccionado.taller}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-canvas-50">
                                    <p className="text-sm text-warm-500">Nivel</p>
                                    <p className="font-medium text-warm-800">{alumnoSeleccionado.nivel}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-canvas-50">
                                    <p className="text-sm text-warm-500">Inscripción</p>
                                    <p className="font-medium text-warm-800">{alumnoSeleccionado.inscripcion}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-canvas-50">
                                    <p className="text-sm text-warm-500">Estado de cuota</p>
                                    <p className={`font-medium ${alumnoSeleccionado.cuotaAlDia ? 'text-green-600' : 'text-red-600'}`}>
                                        {alumnoSeleccionado.cuotaAlDia ? 'Al día' : 'Pendiente'}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button className="flex-1 btn-primary">
                                    Editar alumno
                                </button>
                                <button className="flex-1 btn-outline text-leaf-600 border-leaf-300 hover:bg-leaf-50">
                                    Ver galería
                                </button>
                                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
