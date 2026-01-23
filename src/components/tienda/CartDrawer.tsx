'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartProvider'

export default function CartDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart()

    return (
        <>
            {/* Cart Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-brand-purple text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-lemon-500 text-warm-900 text-xs font-bold rounded-full flex items-center justify-center">
                        {itemCount}
                    </span>
                )}
            </button>

            {/* Drawer Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-warm-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-warm-800">
                            🛒 Tu Carrito ({itemCount})
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-warm-100 rounded-lg"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {items.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">🛒</div>
                                <p className="text-warm-500 mb-4">Tu carrito está vacío</p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-lemon-600 font-medium hover:underline"
                                >
                                    Seguir comprando →
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-warm-50 rounded-xl">
                                        <div className="w-20 h-20 rounded-lg bg-warm-200 overflow-hidden flex-shrink-0">
                                            {item.imagenUrl ? (
                                                <Image
                                                    src={item.imagenUrl}
                                                    alt={item.nombre}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                                    🖼️
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-warm-800 truncate">{item.nombre}</h4>
                                            <p className="text-lemon-600 font-bold">
                                                ${item.precio.toLocaleString('es-AR')}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                                    className="w-8 h-8 rounded-lg bg-warm-200 hover:bg-warm-300 flex items-center justify-center font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-bold">{item.cantidad}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                                    className="w-8 h-8 rounded-lg bg-warm-200 hover:bg-warm-300 flex items-center justify-center font-bold"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="ml-auto text-red-400 hover:text-red-600"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={clearCart}
                                    className="w-full py-2 text-sm text-red-500 hover:text-red-700"
                                >
                                    Vaciar carrito
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-6 border-t border-warm-100 space-y-4">
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-medium text-warm-600">Total:</span>
                                <span className="text-2xl font-bold text-warm-900">
                                    ${total.toLocaleString('es-AR')}
                                </span>
                            </div>
                            <Link
                                href="/tienda/checkout"
                                onClick={() => setIsOpen(false)}
                                className="btn-primary w-full text-center block"
                            >
                                Finalizar Compra
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
