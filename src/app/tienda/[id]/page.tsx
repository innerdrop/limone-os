'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useCart } from '@/components/tienda/CartProvider'

interface Producto {
    id: string
    nombre: string
    descripcion: string | null
    precio: number
    imagenUrl: string | null
    imagenes: string | null
    categoria: string
    stock: number
    destacado: boolean
    tecnica: string | null
    dimensiones: string | null
    artista: string | null
}

export default function ProductoDetallePage() {
    const params = useParams()
    const id = params.id as string
    const [producto, setProducto] = useState<Producto | null>(null)
    const [loading, setLoading] = useState(true)
    const [cantidad, setCantidad] = useState(1)
    const [added, setAdded] = useState(false)
    const { addItem } = useCart()

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await fetch(`/api/tienda/productos`)
                const data = await response.json()
                const found = data.find((p: Producto) => p.id === id)
                setProducto(found || null)
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchProducto()
    }, [id])

    const handleAddToCart = () => {
        if (!producto) return

        for (let i = 0; i < cantidad; i++) {
            addItem({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagenUrl: producto.imagenUrl
            })
        }
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-lemon-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-warm-500">Cargando producto...</p>
                </div>
            </div>
        )
    }

    if (!producto) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold text-warm-800 mb-4">Producto no encontrado</h1>
                    <Link href="/tienda" className="btn-primary">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-canvas-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/colores.png"
                                alt="Taller Limoné Colors"
                                width={50}
                                height={30}
                                className="object-contain"
                            />
                            <span className="font-gigi text-3xl font-bold text-warm-800">
                                Limoné
                            </span>
                        </Link>
                        <Link href="/tienda" className="text-warm-600 hover:text-lemon-600 transition-colors">
                            ← Volver a la tienda
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Image */}
                        <div className="space-y-4">
                            <div className="aspect-square rounded-3xl overflow-hidden bg-warm-100 relative shadow-2xl">
                                {producto.imagenUrl ? (
                                    <Image
                                        src={producto.imagenUrl}
                                        alt={producto.nombre}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-8xl text-warm-300">
                                        🖼️
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="lg:py-8">
                            {/* Category badge */}
                            <div className="flex gap-3 mb-4">
                                <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${producto.categoria === 'OBRA'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {producto.categoria === 'OBRA' ? '🎨 Obra de Arte' : '🎨 Material Artístico'}
                                </span>
                                {producto.destacado && (
                                    <span className="bg-brand-yellow text-warm-800 text-sm font-bold px-4 py-1.5 rounded-full">
                                        ⭐ Destacado
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-warm-800 mb-2">
                                {producto.nombre}
                            </h1>

                            {producto.artista && (
                                <p className="text-lg text-warm-500 mb-6">
                                    Por <span className="font-medium text-brand-purple">{producto.artista}</span>
                                </p>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-4xl md:text-5xl font-bold text-lemon-600">
                                    ${producto.precio.toLocaleString('es-AR')}
                                </span>
                                <span className="text-warm-400">ARS</span>
                            </div>

                            {/* Details */}
                            {(producto.tecnica || producto.dimensiones) && (
                                <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-warm-50 rounded-2xl">
                                    {producto.tecnica && (
                                        <div>
                                            <p className="text-sm text-warm-400 mb-1">Técnica</p>
                                            <p className="font-medium text-warm-800">{producto.tecnica}</p>
                                        </div>
                                    )}
                                    {producto.dimensiones && (
                                        <div>
                                            <p className="text-sm text-warm-400 mb-1">Dimensiones</p>
                                            <p className="font-medium text-warm-800">{producto.dimensiones}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            {producto.descripcion && (
                                <div className="mb-8">
                                    <h3 className="font-bold text-warm-800 mb-3">Descripción</h3>
                                    <p className="text-warm-600 leading-relaxed whitespace-pre-line">
                                        {producto.descripcion}
                                    </p>
                                </div>
                            )}

                            {/* Stock */}
                            <div className="flex items-center gap-2 text-sm mb-6">
                                <div className={`w-3 h-3 rounded-full ${producto.stock > 5 ? 'bg-green-500' : producto.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                <span className="text-warm-500">
                                    {producto.stock > 5 ? 'En stock' : producto.stock > 0 ? `Solo ${producto.stock} disponible${producto.stock > 1 ? 's' : ''}` : 'Agotado'}
                                </span>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-warm-600 font-medium">Cantidad:</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                            className="w-10 h-10 rounded-xl bg-warm-100 hover:bg-warm-200 flex items-center justify-center font-bold"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center text-xl font-bold">{cantidad}</span>
                                        <button
                                            onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                                            className="w-10 h-10 rounded-xl bg-warm-100 hover:bg-warm-200 flex items-center justify-center font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={producto.stock === 0 || added}
                                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${added
                                            ? 'bg-green-500 text-white'
                                            : producto.stock === 0
                                                ? 'bg-warm-200 text-warm-400 cursor-not-allowed'
                                                : 'bg-brand-purple text-white hover:bg-brand-purple/90 shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    {added ? '✓ Agregado al carrito' : producto.stock === 0 ? 'Agotado' : `Agregar al carrito - $${(producto.precio * cantidad).toLocaleString('es-AR')}`}
                                </button>

                                <Link
                                    href="/tienda/checkout"
                                    className="w-full block text-center py-4 rounded-2xl font-bold text-lg bg-lemon-500 text-warm-900 hover:bg-lemon-400 transition-all"
                                >
                                    Comprar ahora
                                </Link>
                            </div>

                            {/* Info */}
                            <div className="mt-8 pt-8 border-t border-warm-100 space-y-4">
                                <div className="flex items-center gap-3 text-warm-500">
                                    <span>📦</span>
                                    <span>Envío seguro a todo el país</span>
                                </div>
                                <div className="flex items-center gap-3 text-warm-500">
                                    <span>💬</span>
                                    <span>Atención personalizada por WhatsApp</span>
                                </div>
                                <div className="flex items-center gap-3 text-warm-500">
                                    <span>🔒</span>
                                    <span>Compra 100% segura</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
