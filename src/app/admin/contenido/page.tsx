import prisma from '@/lib/prisma'
import Link from 'next/link'
import UploadObraForm from '@/components/admin/UploadObraForm'
import { getOptimizedUrl } from '@/utils/cloudinary-helper'

export default async function ContenidoPage() {
    // Fetch alumnos with their obra counts
    const alumnosRaw = await prisma.alumno.findMany({
        include: {
            usuario: true,
            _count: {
                select: { obras: true }
            }
        },
        orderBy: { usuario: { nombre: 'asc' } }
    })

    const talleres = await prisma.taller.findMany({
        where: { activo: true },
        orderBy: { nombre: 'asc' }
    })

    const ultimasObras = await prisma.obra.findMany({
        take: 6,
        include: { alumno: { include: { usuario: true } } },
        orderBy: { fechaCreacion: 'desc' }
    })

    const alumnosConGaleria = alumnosRaw.map(al => ({
        id: al.id,
        nombre: al.usuario.nombre,
        obras: al._count.obras
    }))

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Gestión de Contenido
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Subí fotos a las galerías y gestioná el contenido del sitio
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-warm-800 mb-4">
                        Subir Foto a Galería de Alumno
                    </h2>
                    <UploadObraForm students={alumnosConGaleria} />
                </div>

                {/* Right Column: Recent Artworks and Quick Actions */}
                <div className="space-y-6">
                    {/* Recent Artworks */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-warm-800 mb-4">
                            Últimas Obras Subidas
                        </h2>
                        {ultimasObras.length === 0 ? (
                            <p className="text-center py-8 text-warm-500 italic">No hay obras todavía.</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {ultimasObras.map((obra) => (
                                    <div key={obra.id} className="relative aspect-square rounded-lg overflow-hidden group">
                                        <img
                                            src={getOptimizedUrl(obra.imagenUrl, 400, 400)}
                                            alt={obra.titulo || 'Obra'}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                            <p className="text-[10px] text-white font-bold truncate w-full">{obra.titulo}</p>
                                            <p className="text-[8px] text-lemon-400 truncate w-full">{obra.alumno.usuario.nombre}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        {/* Manage Workshops */}
                        <div className="card">
                            <h2 className="text-lg font-semibold text-warm-800 mb-4">
                                Gestionar Talleres
                            </h2>
                            <div className="space-y-3">
                                {talleres.map((taller) => (
                                    <div key={taller.id} className="flex items-center justify-between p-3 rounded-xl bg-canvas-50 border border-canvas-200">
                                        <div>
                                            <p className="font-medium text-warm-800">{taller.nombre}</p>
                                            <p className="text-sm text-warm-500">{taller.diasSemana} - {taller.horaInicio} hs</p>
                                        </div>
                                        <Link href="/admin/talleres" className="text-sm text-lemon-600 hover:text-lemon-700 font-medium">
                                            Gestionar
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <Link href="/admin/talleres" className="btn-outline w-full mt-4 flex items-center justify-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Configurar Talleres
                            </Link>
                        </div>

                        {/* Site Settings */}
                        <div className="card">
                            <h2 className="text-lg font-semibold text-warm-800 mb-4">
                                Configuración del Sitio
                            </h2>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas-50 border border-canvas-200 hover:border-lemon-300 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📝</span>
                                        <span className="text-warm-700">Editar Testimonios</span>
                                    </div>
                                    <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas-50 border border-canvas-200 hover:border-lemon-300 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📸</span>
                                        <span className="text-warm-700">Galería Principal</span>
                                    </div>
                                    <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas-50 border border-canvas-200 hover:border-lemon-300 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">⚙️</span>
                                        <span className="text-warm-700">Datos de Contacto</span>
                                    </div>
                                    <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
