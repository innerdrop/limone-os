import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ExportButton from '@/components/admin/ExportButton'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function TallerAlumnosPage({ params, searchParams }: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ q?: string, pago?: string, fase?: string, turno?: string, dia?: string }>
}) {
    const { id } = await params
    const { q = '', pago = 'todos', fase = 'todos', turno = 'todos', dia = 'todos' } = await searchParams

    const taller = await prisma.taller.findUnique({
        where: { id },
        include: {
            inscripciones: {
                where: { estado: 'ACTIVA' },
                include: {
                    alumno: {
                        include: {
                            usuario: true,
                            pagos: {
                                orderBy: { creadoEn: 'desc' },
                                take: 1
                            }
                        }
                    }
                }
            }
        }
    })

    if (!taller) notFound()

    const calculateAge = (birthDate: Date | null) => {
        if (!birthDate) return 'N/A'
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const alumnosRaw = taller.inscripciones.map(ins => {
        const al = ins.alumno
        const ultimoPago = al.pagos[0]
        const tieneDeuda = !ins.pagado && (!ultimoPago || ultimoPago.estado !== 'PAGADO')

        // Split name into nombre and apellido
        const nameParts = al.usuario.nombre.split(' ')
        const nombre = nameParts[0] || ''
        const apellido = nameParts.slice(1).join(' ') || ''

        return {
            id: al.id,
            dni: al.dni || 'Sin registrar',
            nombre,
            apellido,
            edad: calculateAge(al.fechaNacimiento),
            horario: ins.horario || 'Sin horario',
            dia: ins.dia || 'Sin día',
            fase: ins.fase || 'Sin fase',
            pagoEstado: ins.pagado ? 'PAGADO' : 'PENDIENTE',
            tieneDeuda,
            email: al.usuario.email
        }
    }).filter(al => {
        // Filtrar por texto (nombre, apellido, dni)
        const matchText = !q || al.nombre.toLowerCase().includes(q.toLowerCase()) ||
            al.apellido.toLowerCase().includes(q.toLowerCase()) ||
            al.dni.toLowerCase().includes(q.toLowerCase())

        // Filtrar por estado de pago
        const matchPago = pago === 'todos' ||
            (pago === 'al-dia' && al.pagoEstado === 'PAGADO') ||
            (pago === 'deuda' && al.tieneDeuda) ||
            (pago === 'pendiente' && al.pagoEstado === 'PENDIENTE' && !al.tieneDeuda)

        // Filtrar por fase
        const matchFase = fase === 'todos' || al.fase === fase

        // Filtrar por turno (horario)
        const matchTurno = turno === 'todos' || al.horario === turno

        // Filtrar por día
        const matchDia = dia === 'todos' || al.dia.toUpperCase() === dia.toUpperCase()

        return matchText && matchPago && matchFase && matchTurno && matchDia
    })

    // Sort by dia and then by horario
    const sortedAlumnos = [...alumnosRaw].sort((a, b) => {
        const diaOrder: { [key: string]: number } = { 'MARTES': 1, 'MIERCOLES': 2, 'JUEVES': 3, 'VIERNES': 4, 'SABADO': 5, 'LUNES': 0 }
        const diaA = diaOrder[a.dia.toUpperCase()] || 99
        const diaB = diaOrder[b.dia.toUpperCase()] || 99

        if (diaA !== diaB) return diaA - diaB
        return a.horario.localeCompare(b.horario)
    })

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Breadcrumb ... (same as before) */}
            <div className="flex items-center gap-2 text-sm text-warm-500 mb-2">
                <Link href="/admin/talleres" className="hover:text-lemon-600">Talleres</Link>
                <span>/</span>
                <span className="text-warm-800">{taller.nombre}</span>
                <span>/</span>
                <span className="text-warm-800">Alumnos</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Alumnos: {taller.nombre}
                    </h1>
                    <p className="text-warm-500 mt-1">
                        {sortedAlumnos.length} alumnos encontrados
                    </p>
                </div>
                <div className="flex gap-3">
                    <ExportButton
                        data={sortedAlumnos.map(al => [al.dni, al.nombre, al.apellido, al.edad, al.dia, al.horario, al.fase, al.pagoEstado])}
                        filename={`alumnos_${taller.nombre.replace(/\s+/g, '_').toLowerCase()}`}
                        headers={['DNI', 'Nombre', 'Apellido', 'Edad', 'Día', 'Horario', 'Fase', 'Estado Pago']}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <form className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                        <label className="label">Buscar</label>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                name="q"
                                type="text"
                                defaultValue={q}
                                placeholder="Nombre o DNI..."
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Estado Pago</label>
                        <select name="pago" className="input-field" defaultValue={pago}>
                            <option value="todos">Todos</option>
                            <option value="al-dia">Al día</option>
                            <option value="deuda">Con deuda</option>
                            <option value="pendiente">Pendiente</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Día</label>
                        <select name="dia" className="input-field" defaultValue={dia}>
                            <option value="todos">Todos</option>
                            <option value="MARTES">Martes</option>
                            <option value="MIERCOLES">Miércoles</option>
                            <option value="JUEVES">Jueves</option>
                            <option value="VIERNES">Viernes</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Fase</label>
                        <select name="fase" className="input-field" defaultValue={fase}>
                            <option value="todos">Todas</option>
                            <option value="PRINCIPIANTE">Principiante</option>
                            <option value="INTERMEDIO">Intermedio</option>
                            <option value="AVANZADO">Avanzado</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Turno (Horario)</label>
                        <select name="turno" className="input-field" defaultValue={turno}>
                            <option value="todos">Todos</option>
                            <option value="16:00-17:20">16:00 - 17:20</option>
                            <option value="17:30-18:50">17:30 - 18:50</option>
                            <option value="19:10-20:30">19:10 - 20:30</option>
                        </select>
                    </div>

                    <div className="md:col-span-12 flex justify-end gap-3 mt-2">
                        <Link href={`/admin/talleres/${id}/alumnos`} className="btn-outline px-4 py-2 text-sm">
                            Limpiar Filtros
                        </Link>
                        <button type="submit" className="btn-primary px-8 py-2 text-sm">
                            Aplicar Filtros
                        </button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-canvas-50">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-bold text-warm-500 uppercase tracking-wider">Turno</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-warm-500 uppercase tracking-wider">Alumno</th>
                                <th className="text-center py-3 px-4 text-xs font-bold text-warm-500 uppercase tracking-wider">Edad</th>
                                <th className="text-center py-3 px-4 text-xs font-bold text-warm-500 uppercase tracking-wider">Fase</th>
                                <th className="text-center py-3 px-4 text-xs font-bold text-warm-500 uppercase tracking-wider">Estado Pago</th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-warm-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-canvas-100">
                            {(() => {
                                let lastDia = ''
                                return sortedAlumnos.map((alumno, index) => {
                                    const showDiaHeader = alumno.dia !== lastDia
                                    lastDia = alumno.dia

                                    return (
                                        <React.Fragment key={`${alumno.id}-${index}`}>
                                            {showDiaHeader && (
                                                <tr className="bg-canvas-100/50">
                                                    <td colSpan={6} className="py-2 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1 h-4 bg-lemon-500 rounded-full" />
                                                            <span className="text-sm font-bold text-warm-800 uppercase tracking-wide">
                                                                {alumno.dia}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className="hover:bg-canvas-50 group">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-warm-600">
                                                        <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="font-medium">{alumno.horario} hs</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-warm-800 group-hover:text-lemon-700 transition-colors">
                                                            {alumno.apellido}, {alumno.nombre}
                                                        </span>
                                                        <span className="text-xs text-warm-400">DNI: {alumno.dni}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="text-warm-600">{alumno.edad} años</span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${alumno.fase.toUpperCase() === 'PRINCIPIANTE' ? 'bg-blue-100 text-blue-700' :
                                                        alumno.fase.toUpperCase() === 'INTERMEDIO' ? 'bg-purple-100 text-purple-700' :
                                                            alumno.fase.toUpperCase() === 'AVANZADO' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-canvas-200 text-warm-600'
                                                        }`}>
                                                        {alumno.fase}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {alumno.pagoEstado === 'PAGADO' ? (
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-green-600 text-xs font-bold uppercase tracking-tight">AL DÍA</span>
                                                            <div className="w-8 h-1 bg-green-500 rounded-full mt-1" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <span className={`${alumno.tieneDeuda ? 'text-red-600' : 'text-amber-600'} text-xs font-bold uppercase tracking-tight`}>
                                                                {alumno.tieneDeuda ? 'CON DEUDA' : 'PENDIENTE'}
                                                            </span>
                                                            <div className={`w-8 h-1 ${alumno.tieneDeuda ? 'bg-red-500' : 'bg-amber-500'} rounded-full mt-1`} />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <Link
                                                        href={`/admin/alumnos/${alumno.id}`}
                                                        className="inline-flex items-center gap-1 text-lemon-600 hover:text-lemon-700 font-bold text-xs uppercase transition-colors"
                                                    >
                                                        Ficha
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    )
                                })
                            })()}
                        </tbody>
                    </table>
                </div>

                {sortedAlumnos.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-warm-500">No hay alumnos inscritos en este taller actualmente</p>
                    </div>
                )}
            </div>
        </div>
    )
}
