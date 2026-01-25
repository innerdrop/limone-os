'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getOptimizedUrl } from '@/utils/cloudinary-helper'
import { useCart } from '@/components/tienda/CartProvider'

interface Producto {
    id: string
    nombre: string
    descripcion: string | null
    precio: number
    imagenUrl: string | null
    categoria: string
    stock: number
    destacado: boolean
    tecnica: string | null
    dimensiones: string | null
    artista: string | null
}

const CATEGORIAS = [
    { value: '', label: 'Todo' },
    { value: 'OBRA', label: 'Obras de Arte' },
    { value: 'MATERIAL', label: 'Materiales Artísticos' }
]

function Header() {
    return (
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

                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-warm-600 hover:text-lemon-600 transition-colors hidden md:block">
                            ← Volver al inicio
                        </Link>
                        <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 border border-lemon-600 rounded-xl text-sm font-medium text-lemon-700 hover:bg-lemon-50 transition-colors">
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default function TiendaPage() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)
    const [filterCategoria, setFilterCategoria] = useState('')
    const { addItem } = useCart()

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const params = new URLSearchParams()
                if (filterCategoria) params.append('categoria', filterCategoria)

                const response = await fetch(`/api/tienda/productos?${params}`)
                const data = await response.json()
                if (Array.isArray(data)) {
                    setProductos(data)
                } else {
                    console.error('API error or invalid response:', data)
                    setProductos([])
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProductos()
    }, [filterCategoria])

    const handleAddToCart = (producto: Producto) => {
        addItem({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagenUrl: producto.imagenUrl
        })
    }

    const destacados = productos.filter(p => p.destacado)
    const regulares = productos.filter(p => !p.destacado)

    return (
        <>
            <Header />
            <main className="pt-20 md:pt-24 pb-24">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-warm-900 via-warm-800 to-brand-purple text-white overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl" />
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                        <div className="text-center max-w-3xl mx-auto">
                            <span className="inline-block bg-brand-yellow/20 text-brand-yellow px-4 py-2 rounded-full text-sm font-bold mb-6">
                                🎨 Nueva Tienda Online
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Galería <span className="font-gigi text-brand-yellow">Limoné</span>
                            </h1>
                            <p className="text-xl text-warm-200 mb-8">
                                Descubrí obras de arte únicas y materiales artísticos de primera calidad
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filters */}
                <section className="py-8 border-b border-warm-100 sticky top-16 md:top-20 bg-white/95 backdrop-blur-sm z-30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {CATEGORIAS.map(cat => (
                                <button
                                    key={cat.value}
                                    onClick={() => setFilterCategoria(cat.value)}
                                    className={`px-6 py-3 rounded-full font-medium transition-all ${filterCategoria === cat.value
                                        ? 'bg-brand-purple text-white shadow-lg'
                                        : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="max-w-7xl mx-auto px-4 py-24 text-center text-warm-500">
                        <div className="animate-spin w-12 h-12 border-4 border-lemon-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Cargando productos...
                    </div>
                ) : productos.length === 0 ? (
                    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                        <div className="text-6xl mb-4">🎨</div>
                        <h2 className="text-2xl font-bold text-warm-800 mb-2">Próximamente</h2>
                        <p className="text-warm-500">
                            Estamos preparando nuestra colección. ¡Volvé pronto!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Featured Products */}
                        {destacados.length > 0 && !filterCategoria && (
                            <section className="py-8 bg-gradient-to-b from-lemon-50/50 to-white">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <h2 className="text-xl md:text-2xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                                        <span className="text-brand-yellow text-xl">⭐</span> Destacados de la Semana
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {destacados.map((producto) => (
                                            <ProductCard
                                                key={producto.id}
                                                producto={producto}
                                                onAddToCart={() => handleAddToCart(producto)}
                                                featured
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* All Products */}
                        <section className="py-12">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                {!filterCategoria && destacados.length > 0 && (
                                    <h2 className="text-2xl md:text-3xl font-bold text-warm-800 mb-8 text-center">
                                        Toda la Colección
                                    </h2>
                                )}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {(filterCategoria ? productos : regulares).map((producto) => (
                                        <ProductCard
                                            key={producto.id}
                                            producto={producto}
                                            onAddToCart={() => handleAddToCart(producto)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {/* Info Section */}
                <section className="py-16 bg-warm-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-brand-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">🎨</span>
                                </div>
                                <h3 className="font-bold text-warm-800 mb-2">Obras Originales</h3>
                                <p className="text-warm-500 text-sm">
                                    Todas las obras son piezas únicas creadas por artistas locales
                                </p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-lemon-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">📦</span>
                                </div>
                                <h3 className="font-bold text-warm-800 mb-2">Envío Seguro</h3>
                                <p className="text-warm-500 text-sm">
                                    Embalaje especial para proteger tus compras
                                </p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-leaf-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">💬</span>
                                </div>
                                <h3 className="font-bold text-warm-800 mb-2">Atención Personalizada</h3>
                                <p className="text-warm-500 text-sm">
                                    Te acompañamos en todo el proceso de compra
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-warm-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-warm-400">
                        © {new Date().getFullYear()} Galería Limoné - Taller Limoné
                    </p>
                </div>
            </footer>
        </>
    )
}

function ProductCard({
    producto,
    onAddToCart,
    featured = false
}: {
    producto: Producto
    onAddToCart: () => void
    featured?: boolean
}) {
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        onAddToCart()
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className={`group bg-white rounded-xl overflow-hidden border border-warm-100 hover:border-lemon-400 hover:shadow-lg transition-all ${featured ? 'bg-lemon-50/20' : ''}`}>
            <Link href={`/tienda/${producto.id}`}>
                <div className="relative aspect-square bg-warm-100 overflow-hidden">
                    {producto.imagenUrl ? (
                        <Image
                            src={getOptimizedUrl(producto.imagenUrl, 500, 500)}
                            alt={producto.nombre}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-warm-300">
                            🖼️
                        </div>
                    )}
                    {producto.destacado && (
                        <span className="absolute top-2 left-2 bg-brand-yellow text-warm-800 text-[9px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                            ⭐
                        </span>
                    )}
                    <span className={`absolute top-2 right-2 text-[9px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ${producto.categoria === 'OBRA'
                        ? 'bg-purple-100/90 text-purple-700 backdrop-blur-sm'
                        : 'bg-blue-100/90 text-blue-700 backdrop-blur-sm'
                        }`}>
                        {producto.categoria === 'OBRA' ? 'Obra' : 'Mat.'}
                    </span>
                </div>
            </Link>

            <div className="p-2.5">
                <Link href={`/tienda/${producto.id}`}>
                    <h3 className="font-bold text-sm text-warm-800 hover:text-lemon-600 transition-colors line-clamp-1 leading-tight">
                        {producto.nombre}
                    </h3>
                </Link>
                <div className="flex flex-col mt-0.5 mb-2">
                    {producto.artista && (
                        <p className="text-[10px] md:text-xs text-warm-500 truncate leading-none mb-0.5">{producto.artista}</p>
                    )}
                    {producto.tecnica && (
                        <p className="text-[9px] md:text-[10px] text-warm-400 truncate italic leading-none">{producto.tecnica}</p>
                    )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-warm-100/50 gap-2">
                    <span className="text-sm md:text-lg font-bold text-lemon-600 leading-none">
                        ${producto.precio.toLocaleString('es-AR')}
                    </span>
                    <button
                        onClick={handleAdd}
                        disabled={added}
                        className={`px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-semibold transition-all whitespace-nowrap ${added
                            ? 'bg-green-500 text-white'
                            : 'bg-brand-purple text-white hover:bg-brand-purple/90 shrink-0'
                            }`}
                    >
                        {added ? '✓' : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    )
}
