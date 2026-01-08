'use client'

import { useState, useEffect } from 'react'

// Interface for Artwork (corresponds to Prisma model)
interface Obra {
    id: string
    titulo: string
    descripcion: string | null
    imagenUrl: string
    fechaCreacion: string
    tecnica: string | null
    destacada: boolean
    clase?: {
        // Assuming we might fetch associated class info
        tema?: string
    }
}

export default function GaleriaPage() {
    const [obras, setObras] = useState<Obra[]>([])
    const [loading, setLoading] = useState(true)
    const [filtroTecnica, setFiltroTecnica] = useState('todas')
    const [obraSeleccionada, setObraSeleccionada] = useState<Obra | null>(null)

    // Fetch real artworks from API
    useEffect(() => {
        const fetchObras = async () => {
            try {
                const response = await fetch('/api/portal/galeria')
                const data = await response.json()
                if (Array.isArray(data)) {
                    setObras(data)
                }
            } catch (error) {
                console.error('Error fetching gallery:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchObras()
    }, [])

    const obrasFiltradas = filtroTecnica === 'todas'
        ? obras
        : obras.filter(obra => obra.tecnica?.toLowerCase() === filtroTecnica)

    const tecnicasUnicas = [...new Set(obras.map(o => o.tecnica).filter(Boolean))] as string[]

    if (loading) {
        return <div className="p-8 text-center text-warm-500">Cargando galería...</div>
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Mi Galería de Arte
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Todas las obras que has creado en el taller
                    </p>
                </div>
                {/* Only show filters if there are artworks */}
                {obras.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-warm-500">Filtrar por:</span>
                        <select
                            value={filtroTecnica}
                            onChange={(e) => setFiltroTecnica(e.target.value)}
                            className="input-field py-2 px-4 w-auto"
                        >
                            <option value="todas">Todas las técnicas</option>
                            {tecnicasUnicas.map((tecnica) => (
                                <option key={tecnica} value={tecnica.toLowerCase()}>
                                    {tecnica}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Stats - Only show if there is data */}
            {obras.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="card p-4 text-center">
                        <p className="text-3xl font-bold text-lemon-600">{obras.length}</p>
                        <p className="text-sm text-warm-500">Obras totales</p>
                    </div>
                    <div className="card p-4 text-center">
                        <p className="text-3xl font-bold text-leaf-600">{obras.filter(o => o.destacada).length}</p>
                        <p className="text-sm text-warm-500">Destacadas</p>
                    </div>
                    <div className="card p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">{tecnicasUnicas.length}</p>
                        <p className="text-sm text-warm-500">Técnicas</p>
                    </div>
                </div>
            )}

            {/* Gallery Grid or Empty State */}
            {obras.length === 0 ? (
                <div className="card py-16 text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold text-warm-800 mb-2">
                        Todavía no hay obras en tu galería
                    </h3>
                    <p className="text-warm-500">
                        ¡Pronto verás aquí tus creaciones del taller!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {obrasFiltradas.map((obra) => (
                        <div
                            key={obra.id}
                            onClick={() => setObraSeleccionada(obra)}
                            className="card group cursor-pointer overflow-hidden hover:shadow-glow-lemon"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] -mx-6 -mt-6 mb-4 bg-canvas-200 overflow-hidden">
                                {obra.imagenUrl ? (
                                    /* In real app, use next/image */
                                    <img src={obra.imagenUrl} alt={obra.titulo} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-lemon-100 to-leaf-100">
                                        <svg className="w-16 h-16 text-lemon-400/50" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Badges */}
                                {obra.destacada && (
                                    <div className="absolute top-3 left-3 badge bg-lemon-400 text-warm-800">
                                        ⭐ Destacada
                                    </div>
                                )}
                                {obra.tecnica && (
                                    <div className="absolute top-3 right-3 badge bg-white/90">
                                        {obra.tecnica}
                                    </div>
                                )}
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-warm-800">
                                        Ver detalle
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="font-semibold text-warm-800 group-hover:text-lemon-700 transition-colors">
                                    {obra.titulo || 'Sin título'}
                                </h3>
                                <p className="text-sm text-warm-500 mt-1 line-clamp-2">
                                    {obra.descripcion}
                                </p>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-canvas-100">
                                    <span className="text-xs text-warm-400">
                                        {new Date(obra.fechaCreacion).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filter Empty State (only if we have works but filtered them all out) */}
            {obras.length > 0 && obrasFiltradas.length === 0 && (
                <div className="card py-16 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-warm-800 mb-2">
                        No hay obras con este filtro
                    </h3>
                    <p className="text-warm-500">
                        Probá seleccionando otra técnica
                    </p>
                </div>
            )}

            {/* Lightbox Modal */}
            {obraSeleccionada && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setObraSeleccionada(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image */}
                        <div className="aspect-video bg-canvas-200 relative">
                            {obraSeleccionada.imagenUrl ? (
                                <img src={obraSeleccionada.imagenUrl} alt={obraSeleccionada.titulo} className="w-full h-full object-contain bg-black" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-lemon-100 to-leaf-100">
                                    <svg className="w-24 h-24 text-lemon-400/50" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            <button
                                onClick={() => setObraSeleccionada(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <svg className="w-5 h-5 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-warm-800">
                                        {obraSeleccionada.titulo}
                                    </h2>
                                    <div className="flex items-center gap-3 mt-2">
                                        {obraSeleccionada.tecnica && (
                                            <span className="badge badge-lemon">{obraSeleccionada.tecnica}</span>
                                        )}
                                        <span className="text-sm text-warm-400">{new Date(obraSeleccionada.fechaCreacion).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {obraSeleccionada.destacada && (
                                    <span className="text-2xl">⭐</span>
                                )}
                            </div>

                            <p className="mt-4 text-warm-600">
                                {obraSeleccionada.descripcion}
                            </p>

                            <div className="mt-6 flex gap-3">
                                <button className="flex-1 btn-primary">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Descargar
                                </button>
                                <button className="flex-1 btn-outline">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Compartir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
