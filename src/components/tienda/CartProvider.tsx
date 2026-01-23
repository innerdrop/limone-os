'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
    id: string
    nombre: string
    precio: number
    imagenUrl: string | null
    cantidad: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: Omit<CartItem, 'cantidad'>) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, cantidad: number) => void
    clearCart: () => void
    total: number
    itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('limone-cart')
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error('Error loading cart:', e)
            }
        }
    }, [])

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('limone-cart', JSON.stringify(items))
    }, [items])

    const addItem = (product: Omit<CartItem, 'cantidad'>) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            }
            return [...prev, { ...product, cantidad: 1 }]
        })
    }

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, cantidad: number) => {
        if (cantidad <= 0) {
            removeItem(id)
            return
        }
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, cantidad } : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0)

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            total,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
