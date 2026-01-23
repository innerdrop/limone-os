'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
                setProductos(data)
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
                            <section className="py-12 bg-gradient-to-b from-lemon-50 to-white">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <h2 className="text-2xl md:text-3xl font-bold text-warm-800 mb-8 text-center">
                                        ⭐ Destacados
                                    </h2>
                                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        <div className={`group bg-white rounded-2xl overflow-hidden border-2 border-warm-100 hover:border-lemon-300 hover:shadow-xl transition-all ${featured ? 'ring-2 ring-lemon-400' : ''}`}>
            <Link href={`/tienda/${producto.id}`}>
                <div className={`relative ${featured ? 'aspect-[4/5]' : 'aspect-square'} bg-warm-100 overflow-hidden`}>
                    {producto.imagenUrl ? (
                        <Image
                            src={producto.imagenUrl}
                            alt={producto.nombre}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl text-warm-300">
                            🖼️
                        </div>
                    )}
                    {producto.destacado && (
                        <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-brand-yellow text-warm-800 text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                            ⭐ Destacado
                        </span>
                    )}
                    <span className={`absolute top-2 right-2 md:top-3 md:right-3 text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full ${producto.categoria === 'OBRA'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                        }`}>
                        {producto.categoria === 'OBRA' ? 'Obra' : 'Material'}
                    </span>
                </div>
            </Link>

            <div className="p-3 md:p-4">
                <Link href={`/tienda/${producto.id}`}>
                    <h3 className="font-bold text-sm md:text-base text-warm-800 hover:text-lemon-600 transition-colors line-clamp-2 min-h-[2.5em]">
                        {producto.nombre}
                    </h3>
                </Link>
                {producto.artista && (
                    <p className="text-xs text-warm-400 mt-1 truncate">{producto.artista}</p>
                )}
                {producto.tecnica && (
                    <p className="text-[10px] md:text-xs text-warm-400 truncate">{producto.tecnica}</p>
                )}

                <div className="flex flex-wrap items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-warm-100 gap-2">
                    <span className="text-lg md:text-2xl font-bold text-lemon-600">
                        ${producto.precio.toLocaleString('es-AR')}
                    </span>
                    <button
                        onClick={handleAdd}
                        disabled={added}
                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${added
                            ? 'bg-green-500 text-white'
                            : 'bg-brand-purple text-white hover:bg-brand-purple/90'
                            }`}
                    >
                        {added ? '✓' : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    )
}
