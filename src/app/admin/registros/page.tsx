import Link from 'next/link'
import prisma from '@/lib/prisma'
import ExportButton from '@/components/admin/ExportButton'

interface SearchParams {
    busqueda?: string
}

export default async function RegistrosPage(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams
    const busqueda = searchParams.busqueda || ''

    // Fetch Usuarios who are guardians (Role ALUMNO or similar)
    // and include their children summary
    const usuariosRaw = await prisma.usuario.findMany({
        where: {
            rol: 'ALUMNO', // All portal users
            OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { email: { contains: busqueda, mode: 'insensitive' } }
            ]
        },
        include: {
            alumnos: {
                select: {
                    id: true,
                    nombre: true,
                    perfilCompleto: true
                }
            }
        } as any,
        orderBy: {
            creadoEn: 'desc'
        }
    }) as any[]

    const usuarios = usuariosRaw.map((u: any) => {
        const hijosNombres = (u.alumnos || [])
            .map((a: any) => `${a.nombre || ''} ${a.apellido || ''}`.trim())
            .filter((n: string) => n.length > 0)
            .join(', ') || 'Sin nombres registrados'

        return {
            id: u.id,
            nombre: u.nombre,
            email: u.email,
            telefono: u.telefono || 'Sin registrar',
            hijosCount: u.alumnos?.length || 0,
            hijosNombres,
            creadoEn: u.creadoEn.toLocaleDateString('es-AR'),
            estado: (u.alumnos || []).length > 0 ? ((u.alumnos || []).every((a: any) => a.perfilCompleto) ? 'Completo' : 'Pendiente') : 'Sin niños'
        }
    })

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Registros de Usuarios
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Padres, madres y tutores registrados en la plataforma.
                    </p>
                </div>
                <div className="flex gap-3">
                    <ExportButton data={usuarios} />
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                placeholder="Nombre o email del tutor..."
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <button type="submit" className="btn-primary flex-1">
                            Filtrar
                        </button>
                        <Link href="/admin/registros" className="btn-outline px-3" title="Limpiar">
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
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Tutor / Usuario</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Teléfono</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-warm-500">Niños</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Nombres</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-warm-500">Registro</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-warm-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-canvas-100">
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-canvas-50">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-warm-200 flex items-center justify-center text-warm-700 font-bold">
                                                {usuario.nombre.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-warm-800">{usuario.nombre}</p>
                                                <p className="text-sm text-warm-500">{usuario.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-warm-600 font-medium">
                                        {usuario.telefono}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${usuario.hijosCount > 0 ? 'bg-lemon-100 text-lemon-700' : 'bg-red-50 text-red-500'
                                            }`}>
                                            {usuario.hijosCount}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-warm-500 italic max-w-xs truncate">
                                        {usuario.hijosNombres || 'Ninguno aún'}
                                    </td>
                                    <td className="py-4 px-4 text-center text-sm text-warm-500">
                                        {usuario.creadoEn}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <Link
                                            href={`/admin/registros/${usuario.id}`}
                                            className="text-brand-purple hover:underline font-medium text-sm"
                                        >
                                            Gestionar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {usuarios.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-warm-500">No se encontraron registros</p>
                    </div>
                )}
            </div>
        </div>
    )
}
