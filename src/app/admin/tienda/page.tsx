'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getOptimizedUrl } from '@/utils/cloudinary-helper'

interface Producto {
    id: string
    nombre: string
    descripcion: string | null
    precio: number
    imagenUrl: string | null
    categoria: string
    stock: number
    activo: boolean
    destacado: boolean
    tecnica: string | null
    dimensiones: string | null
    artista: string | null
    creadoEn: string
}

const CATEGORIAS = [
    { value: 'OBRA', label: 'Obras de Arte' },
    { value: 'MATERIAL', label: 'Materiales Artísticos' }
]

export default function AdminTiendaPage() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
    const [filterCategoria, setFilterCategoria] = useState('')

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagenUrl: '',
        categoria: 'OBRA',
        stock: '1',
        activo: true,
        destacado: false,
        tecnica: '',
        dimensiones: '',
        artista: 'Natalia Fusari'
    })

    const [uploading, setUploading] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const data = new FormData()
        data.append('file', file)

        try {
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: data
            })

            const result = await response.json()
            if (response.ok) {
                setFormData(prev => ({ ...prev, imagenUrl: result.url }))
            } else {
                console.error('Upload failed:', result.error)
                alert('Error al subir imagen: ' + result.error)
            }
        } catch (error) {
            console.error('Error uploading:', error)
            alert('Error al subir imagen')
        } finally {
            setUploading(false)
        }
    }

    const fetchProductos = async () => {
        try {
            const params = new URLSearchParams()
            if (filterCategoria) params.append('categoria', filterCategoria)

            const response = await fetch(`/api/admin/productos?${params}`)
            const data = await response.json()
            setProductos(data)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProductos()
    }, [filterCategoria])

    const resetForm = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            imagenUrl: '',
            categoria: 'OBRA',
            stock: '1',
            activo: true,
            destacado: false,
            tecnica: '',
            dimensiones: '',
            artista: 'Natalia Fusari'
        })
        setEditingProduct(null)
    }

    const openModal = (product?: Producto) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                nombre: product.nombre,
                descripcion: product.descripcion || '',
                precio: product.precio.toString(),
                imagenUrl: product.imagenUrl || '',
                categoria: product.categoria,
                stock: product.stock.toString(),
                activo: product.activo,
                destacado: product.destacado,
                tecnica: product.tecnica || '',
                dimensiones: product.dimensiones || '',
                artista: product.artista || 'Natalia Fusari'
            })
        } else {
            resetForm()
        }
        setShowModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const method = editingProduct ? 'PUT' : 'POST'
            const body = editingProduct
                ? { id: editingProduct.id, ...formData }
                : formData

            const response = await fetch('/api/admin/productos', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (response.ok) {
                setShowModal(false)
                resetForm()
                fetchProductos()
            }
        } catch (error) {
            console.error('Error saving product:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) return

        try {
            const response = await fetch(`/api/admin/productos?id=${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                fetchProductos()
            } else {
                const errorData = await response.json()
                alert(`Error al eliminar: ${errorData.error || 'Error desconocido'}`)
            }
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Error de red al intentar eliminar el producto')
        }
    }

    const toggleDestacado = async (product: Producto) => {
        try {
            await fetch('/api/admin/productos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id, destacado: !product.destacado })
            })
            fetchProductos()
        } catch (error) {
            console.error('Error toggling destacado:', error)
        }
    }

    const toggleActivo = async (product: Producto) => {
        try {
            await fetch('/api/admin/productos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id, activo: !product.activo })
            })
            fetchProductos()
        } catch (error) {
            console.error('Error toggling activo:', error)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-warm-800">
                        🛍️ Galería Limoné - Tienda
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Administrá los productos de la tienda online
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar Producto
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                <select
                    value={filterCategoria}
                    onChange={(e) => setFilterCategoria(e.target.value)}
                    className="input-field w-auto"
                >
                    <option value="">Todas las categorías</option>
                    {CATEGORIAS.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-12 text-warm-500">Cargando productos...</div>
            ) : productos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-warm-200">
                    <div className="text-4xl mb-4">🎨</div>
                    <p className="text-warm-500 mb-4">No hay productos todavía</p>
                    <button onClick={() => openModal()} className="btn-primary">
                        Agregar primer producto
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productos.map((producto) => (
                        <div
                            key={producto.id}
                            className={`bg-white rounded-2xl overflow-hidden border-2 ${producto.activo ? 'border-warm-100' : 'border-red-200 opacity-60'
                                } hover:shadow-lg transition-all`}
                        >
                            {/* Image */}
                            <div className="aspect-square relative bg-warm-100">
                                {producto.imagenUrl ? (
                                    <Image
                                        src={getOptimizedUrl(producto.imagenUrl, 600, 600)}
                                        alt={producto.nombre}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-warm-300">
                                        🖼️
                                    </div>
                                )}
                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex gap-2">
                                    {producto.destacado && (
                                        <span className="bg-brand-yellow text-warm-800 text-xs font-bold px-2 py-1 rounded-full">
                                            ⭐ Destacado
                                        </span>
                                    )}
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${producto.categoria === 'OBRA'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {producto.categoria === 'OBRA' ? 'Obra' : 'Material'}
                                    </span>
                                </div>
                                {!producto.activo && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            INACTIVO
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-warm-800 truncate">{producto.nombre}</h3>
                                {producto.artista && (
                                    <p className="text-xs text-warm-400">{producto.artista}</p>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xl font-bold text-lemon-600">
                                        ${producto.precio.toLocaleString('es-AR')}
                                    </span>
                                    <span className="text-xs text-warm-400">
                                        Stock: {producto.stock}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-warm-100">
                                    <button
                                        onClick={() => openModal(producto)}
                                        className="flex-1 py-2 text-sm font-medium text-lemon-600 hover:bg-lemon-50 rounded-lg transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => toggleDestacado(producto)}
                                        className={`p-2 rounded-lg transition-colors ${producto.destacado
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : 'hover:bg-warm-100 text-warm-400 hover:text-yellow-600'
                                            }`}
                                        title={producto.destacado ? 'Quitar destacado' : 'Destacar'}
                                    >
                                        <svg className={`w-5 h-5 ${producto.destacado ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => toggleActivo(producto)}
                                        className={`p-2 rounded-lg transition-colors ${producto.activo
                                            ? 'hover:bg-red-50 text-warm-400 hover:text-red-500'
                                            : 'bg-green-100 text-green-600'
                                            }`}
                                        title={producto.activo ? 'Desactivar (Ocultar)' : 'Activar (Mostrar)'}
                                    >
                                        {producto.activo ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.04m2.458-2.458A10.003 10.003 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-2.101-2.101L3 3" />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(producto.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                                        title="Eliminar"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-warm-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-warm-800">
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-warm-100 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="label">Nombre del producto *</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Precio *</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={formData.precio}
                                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div>
                                    <label className="label">Categoría</label>
                                    <select
                                        className="input-field"
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                    >
                                        {CATEGORIAS.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Stock</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="label">Artista</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.artista}
                                        onChange={(e) => setFormData({ ...formData, artista: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="label">Descripción</label>
                                <textarea
                                    className="input-field min-h-[100px]"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                />
                            </div>

                            {/* Image */}
                            {/* Image */}
                            <div>
                                <label className="label">Imagen del Producto</label>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-warm-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-lemon-50 file:text-lemon-700
                                                hover:file:bg-lemon-100
                                            "
                                            disabled={uploading}
                                        />
                                        {uploading && <div className="animate-spin h-5 w-5 border-2 border-lemon-500 border-t-transparent rounded-full" />}
                                    </div>

                                    {formData.imagenUrl && (
                                        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-warm-100 border border-warm-200">
                                            <Image
                                                src={getOptimizedUrl(formData.imagenUrl, 200, 200)}
                                                alt="Preview"
                                                fill
                                                sizes="128px"
                                                className="object-cover"
                                                unoptimized
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, imagenUrl: '' })}
                                                className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white transition-colors"
                                                title="Eliminar imagen"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                    <input type="hidden" name="imagenUrl" value={formData.imagenUrl} />
                                </div>
                            </div>

                            {/* Art-specific fields */}
                            {formData.categoria === 'OBRA' && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Técnica</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={formData.tecnica}
                                            onChange={(e) => setFormData({ ...formData, tecnica: e.target.value })}
                                            placeholder="Ej: Óleo sobre lienzo"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Dimensiones</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={formData.dimensiones}
                                            onChange={(e) => setFormData({ ...formData, dimensiones: e.target.value })}
                                            placeholder="Ej: 30x40 cm"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Toggles */}
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.activo}
                                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                        className="w-5 h-5 rounded"
                                    />
                                    <span>Activo (visible en tienda)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.destacado}
                                        onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                                        className="w-5 h-5 rounded"
                                    />
                                    <span>Destacado</span>
                                </label>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-4 pt-4 border-t border-warm-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-outline flex-1"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
