import Link from 'next/link'
import prisma from '@/lib/prisma'
import ExportButton from '@/components/admin/ExportButton'

interface SearchParams {
    busqueda?: string
    estado?: string
    taller?: string
}

export default async function AlumnosPage(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams
    const busqueda = searchParams.busqueda || ''
    const filterEstado = searchParams.estado || 'todos'
    const filterTaller = searchParams.taller || 'todos'

    // Fetch alumnos with relations
    const alumnosRaw = await prisma.alumno.findMany({
        include: {
            usuario: true,
            inscripciones: {
                include: {
                    taller: true
                }
            },
            citasNivelacion: {
                orderBy: { fecha: 'desc' },
                take: 1
            }
        },
        orderBy: {
            usuario: {
                nombre: 'asc'
            }
        }
    })

    // Map and filter
    const alumnos = alumnosRaw.map(al => {
        const activeInscripcion = al.inscripciones.find(ins => ins.estado === 'ACTIVA')
        const hasCita = al.citasNivelacion.length > 0

        let tallerPrincipal = 'Sin asignar'
        if (activeInscripcion) {
            if (activeInscripcion.taller.nombre.toLowerCase().includes('verano')) {
                tallerPrincipal = 'Taller de Verano'
            } else {
                tallerPrincipal = 'Taller de Arte'
            }
        } else if (hasCita) {
            tallerPrincipal = 'Prueba de Nivelación'
        }

        return {
            id: al.id,
            nombre: al.usuario.nombre,
            email: al.usuario.email,
            telefono: al.usuario.telefono || al.tutorTelefonoPrincipal || 'Sin registrar',
            dni: al.dni || 'Sin registrar',
            nivel: al.nivel,
            tallerPrincipal,
            estado: al.perfilCompleto ? 'P. Completo' : 'P. Pendiente',
            pagado: activeInscripcion?.pagado || false,
            inscripcionFecha: al.creadoEn.toLocaleDateString('es-AR'),
        }
    }).filter(al => {
        const matchBusqueda = al.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            al.email.toLowerCase().includes(busqueda.toLowerCase())

        const matchTaller = filterTaller === 'todos' || al.tallerPrincipal === filterTaller
        const matchPago = filterEstado === 'todos' ||
            (filterEstado === 'pagado' && al.pagado) ||
            (filterEstado === 'pendiente' && !al.pagado)

        return matchBusqueda && matchTaller && matchPago
    })

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Gestión de Alumnos
                    </h1>
                    <p className="text-warm-500 mt-1">
                        {alumnos.length} alumnos encontrados con los filtros actuales
                    </p>
                </div>
                <div className="flex gap-3">
                    <ExportButton data={alumnos} />
                    <Link href="/admin/alumnos/nuevo" className="btn-primary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nuevo Alumno
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <form className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                        <label className="label">Buscar</label>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                name="busqueda"
                                type="text"
                                defaultValue={busqueda}
                                placeholder="Nombre o email..."
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label">Taller Principal</label>
                        <select name="taller" className="input-field" defaultValue={filterTaller}>
                            <option value="todos">Todos</option>
                            <option value="Taller de Arte">Taller de Arte</option>
                            <option value="Taller de Verano">Taller de Verano</option>
                            <option value="Prueba de Nivelación">Prueba de Nivelación</option>
                            <option value="Sin asignar">Sin asignar</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Estado Pago</label>
                        <select name="estado" className="input-field" defaultValue={filterEstado}>
                            <option value="todos">Todos</option>
                            <option value="pagado">Pagados</option>
                            <option value="pendiente">Pendientes</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-2">
                        <button type="submit" className="btn-primary flex-1">
                            Filtrar
                        </button>
                        <Link href="/admin/alumnos" className="btn-outline px-3" title="Limpiar">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Link>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-canvas-50">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Alumno</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Taller Principal</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Nivel</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-warm-500">Pagado</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-warm-500">Perfil</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-warm-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-canvas-100">
                            {alumnos.map((alumno) => (
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
                                    <td className="py-4 px-4 text-warm-600 font-medium">{alumno.tallerPrincipal}</td>
                                    <td className="py-4 px-4">
                                        <span className={`badge ${alumno.nivel === 'PRINCIPIANTE' ? 'bg-blue-100 text-blue-700' :
                                            alumno.nivel === 'INTERMEDIO' ? 'bg-purple-100 text-purple-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {alumno.nivel}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {alumno.pagado ? (
                                            <span className="text-green-600 font-bold">SI</span>
                                        ) : (
                                            <span className="text-red-600 font-bold">NO</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`badge ${alumno.estado === 'P. Completo' ? 'badge-success' : 'badge-warning'
                                            }`}>
                                            {alumno.estado}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <Link
                                            href={`/admin/alumnos/${alumno.id}`}
                                            className="text-lemon-600 hover:text-lemon-700 font-medium text-sm"
                                        >
                                            Ver ficha
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {alumnos.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-warm-500">No se encontraron alumnos con los criterios seleccionados</p>
                    </div>
                )}
            </div>
        </div>
    )
}
