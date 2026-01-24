'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/tienda/CartProvider'

export default function CheckoutPage() {
    const { items, total, clearCart, removeItem, updateQuantity } = useCart()
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        notas: ''
    })
    const [step, setStep] = useState<'cart' | 'info' | 'confirm'>('cart')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const generateWhatsAppMessage = () => {
        const itemsList = items.map(item =>
            `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString('es-AR')}`
        ).join('\n')

        const message = `🛍️ *NUEVO PEDIDO - Galería Limoné*

👤 *Datos del Cliente:*
Nombre: ${formData.nombre}
Email: ${formData.email}
Teléfono: ${formData.telefono}
Dirección: ${formData.direccion}
Ciudad: ${formData.ciudad}

📦 *Productos:*
${itemsList}

💰 *TOTAL: $${total.toLocaleString('es-AR')}*

${formData.notas ? `📝 Notas: ${formData.notas}` : ''}

---
_Enviado desde Galería Limoné_`

        return encodeURIComponent(message)
    }

    const handleConfirmOrder = () => {
        const whatsappUrl = `https://wa.me/5492901588969?text=${generateWhatsAppMessage()}`
        window.open(whatsappUrl, '_blank')
        clearCart()
    }

    if (items.length === 0 && step !== 'confirm') {
        return (
            <>
                <Header />
                <main className="pt-24 pb-24">
                    <div className="max-w-2xl mx-auto px-4 text-center py-24">
                        <div className="text-6xl mb-6">🛒</div>
                        <h1 className="text-2xl font-bold text-warm-800 mb-4">Tu carrito está vacío</h1>
                        <p className="text-warm-500 mb-8">
                            Agregá productos para continuar con tu compra
                        </p>
                        <Link href="/tienda" className="btn-primary">
                            Ver productos
                        </Link>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="pt-24 pb-24">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-8 md:mb-12 px-2">
                        {['Carrito', 'Datos', 'Confirmar'].map((label, i) => {
                            const stepMap = ['cart', 'info', 'confirm']
                            const isActive = stepMap.indexOf(step) >= i
                            const isCurrent = step === stepMap[i]
                            return (
                                <div key={label} className="flex flex-col md:flex-row items-center gap-1 md:gap-3 flex-1 relative">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors shrink-0 z-10 ${isActive ? 'bg-brand-purple text-white' : 'bg-warm-200 text-warm-400'
                                        }`}>
                                        {i + 1}
                                    </div>
                                    <span className={`text-[10px] md:text-sm font-medium transition-colors ${isActive ? 'text-warm-800' : 'text-warm-400'} ${isCurrent ? 'font-bold' : ''}`}>
                                        {label}
                                    </span>
                                    {i < 2 && (
                                        <div className={`absolute top-4 left-[50%] w-full h-0.5 -z-0 md:static md:w-full ${stepMap.indexOf(step) > i ? 'bg-brand-purple' : 'bg-warm-200'
                                            }`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Step 1: Cart Review */}
                    {step === 'cart' && (
                        <div className="space-y-6 md:space-y-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-warm-800 text-center">
                                Tu Carrito
                            </h1>

                            <div className="bg-white rounded-2xl border border-warm-100 overflow-hidden divide-y divide-warm-100">
                                {items.map((item) => (
                                    <div key={item.id} className="p-4 md:p-6 flex flex-col sm:flex-row gap-4">
                                        <div className="flex gap-4 flex-1">
                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-warm-100 overflow-hidden shrink-0">
                                                {item.imagenUrl ? (
                                                    <Image
                                                        src={item.imagenUrl}
                                                        alt={item.nombre}
                                                        width={96}
                                                        height={96}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-3xl">
                                                        🖼️
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-warm-800 text-sm md:text-base truncate">{item.nombre}</h3>
                                                <p className="text-lemon-600 font-bold text-base md:text-lg">
                                                    ${item.precio.toLocaleString('es-AR')}
                                                </p>

                                                <div className="flex items-center gap-3 mt-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                                        className="w-8 h-8 rounded-lg bg-warm-100 hover:bg-warm-200 flex items-center justify-center font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-6 text-center font-bold text-sm">{item.cantidad}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                                        className="w-8 h-8 rounded-lg bg-warm-100 hover:bg-warm-200 flex items-center justify-center font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col justify-between items-end sm:items-end pt-3 sm:pt-0 border-t sm:border-t-0 border-warm-50 gap-2">
                                            <div className="text-left sm:text-right">
                                                <p className="text-xs text-warm-400 sm:hidden">Subtotal:</p>
                                                <p className="font-bold text-warm-800 text-base md:text-lg">
                                                    ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-400 hover:text-red-500 text-xs md:text-sm font-medium"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-r from-lemon-50 to-lemon-100 rounded-2xl p-5 md:p-6 flex justify-between items-center shadow-sm">
                                <span className="text-sm md:text-xl font-medium text-warm-700">Total a pagar:</span>
                                <span className="text-2xl md:text-3xl font-bold text-warm-900 leading-none">
                                    ${total.toLocaleString('es-AR')}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <Link href="/tienda" className="btn-outline text-center py-3 md:flex-1 order-2 sm:order-1">
                                    ← Seguir comprando
                                </Link>
                                <button
                                    onClick={() => setStep('info')}
                                    className="btn-primary py-3 md:flex-1 order-1 sm:order-2"
                                >
                                    Continuar →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Customer Info */}
                    {step === 'info' && (
                        <div className="space-y-6 md:space-y-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-warm-800 text-center">
                                Tus Datos
                            </h1>

                            <div className="bg-white rounded-2xl border border-warm-100 p-5 md:p-8 space-y-5 md:space-y-6">
                                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="label text-sm">Nombre completo *</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            className="input-field py-2.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label text-sm">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input-field py-2.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label text-sm">Teléfono *</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            className="input-field py-2.5"
                                            placeholder="+54 9 2901 ..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label text-sm">Ciudad *</label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            value={formData.ciudad}
                                            onChange={handleInputChange}
                                            className="input-field py-2.5"
                                            placeholder="Ej: Ushuaia"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label text-sm">Dirección de envío *</label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleInputChange}
                                        className="input-field py-2.5"
                                        placeholder="Calle, número, piso, dpto..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label text-sm">Notas adicionales (opcional)</label>
                                    <textarea
                                        name="notas"
                                        value={formData.notas}
                                        onChange={handleInputChange}
                                        className="input-field min-h-[80px] md:min-h-[100px] py-2.5"
                                        placeholder="Ej: Horarios de entrega preferidos, referencias..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <button
                                    onClick={() => setStep('cart')}
                                    className="btn-outline py-3 md:flex-1 order-2 sm:order-1"
                                >
                                    ← Volver
                                </button>
                                <button
                                    onClick={() => setStep('confirm')}
                                    disabled={!formData.nombre || !formData.email || !formData.telefono || !formData.direccion || !formData.ciudad}
                                    className="btn-primary py-3 md:flex-1 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                                >
                                    Continuar →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm & Pay */}
                    {step === 'confirm' && (
                        <div className="space-y-6 md:space-y-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-warm-800 text-center">
                                Confirmar Pedido
                            </h1>

                            <div className="grid lg:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    {/* Order Summary */}
                                    <div className="bg-white rounded-2xl border border-warm-100 overflow-hidden shadow-sm">
                                        <div className="p-4 md:p-5 bg-warm-50 border-b border-warm-100">
                                            <h3 className="font-bold text-warm-800 flex items-center gap-2">
                                                <span>📦</span> Resumen del pedido
                                            </h3>
                                        </div>
                                        <div className="p-4 md:p-5 space-y-3">
                                            {items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-start gap-4">
                                                    <span className="text-warm-600 text-sm md:text-base">
                                                        {item.nombre} <span className="text-warm-400 text-xs font-bold">x{item.cantidad}</span>
                                                    </span>
                                                    <span className="font-bold text-warm-800 text-sm md:text-base shrink-0">
                                                        ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="border-t border-warm-100 pt-3 flex justify-between items-center">
                                                <span className="font-bold text-warm-800">Total:</span>
                                                <span className="text-xl md:text-2xl font-bold text-lemon-600">
                                                    ${total.toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Info Summary */}
                                    <div className="bg-white rounded-2xl border border-warm-100 p-4 md:p-5 shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-warm-800 flex items-center gap-2">
                                                <span>📍</span> Datos de envío
                                            </h3>
                                            <button
                                                onClick={() => setStep('info')}
                                                className="text-lemon-600 text-xs font-bold hover:underline"
                                            >
                                                Editar
                                            </button>
                                        </div>
                                        <div className="grid gap-2 text-sm md:text-base text-warm-600 border-l-2 border-warm-100 pl-4 py-1">
                                            <p><strong>{formData.nombre}</strong></p>
                                            <p>{formData.email} • {formData.telefono}</p>
                                            <p>{formData.direccion}, {formData.ciudad}</p>
                                            {formData.notas && <p className="text-warm-400 italic text-xs md:text-sm mt-1">"{formData.notas}"</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Bank Transfer Info */}
                                    <div className="bg-gradient-to-br from-brand-purple/5 to-brand-purple/10 rounded-2xl p-5 md:p-6 border border-brand-purple/20 shadow-sm">
                                        <h3 className="font-bold text-brand-purple mb-4 flex items-center gap-2">
                                            🏦 Datos para transferencia
                                        </h3>
                                        <div className="space-y-3 text-sm md:text-base text-warm-800">
                                            <div className="flex justify-between border-b border-brand-purple/10 pb-2">
                                                <span className="text-warm-500">Banco</span>
                                                <span className="font-medium">Banco Galicia</span>
                                            </div>
                                            <div className="flex justify-between border-b border-brand-purple/10 pb-2">
                                                <span className="text-warm-500">Titular</span>
                                                <span className="font-medium">Natalia Fusari</span>
                                            </div>
                                            <div className="flex flex-col gap-1 border-b border-brand-purple/10 pb-2">
                                                <span className="text-warm-500">CBU</span>
                                                <span className="font-mono text-xs md:text-sm font-bold bg-white/50 p-1.5 rounded">0070088530004053455621</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-warm-500">Alias</span>
                                                <span className="font-bold text-brand-purple">LIMONE.TALLER</span>
                                            </div>
                                        </div>
                                        <div className="mt-5 p-3 bg-white/80 rounded-xl text-[11px] md:text-xs text-warm-600 border border-brand-purple/10">
                                            📝 Realizá la transferencia y luego confirmá por WhatsApp enviándonos el comprobante.
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleConfirmOrder}
                                            className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                            </svg>
                                            Confirmar por WhatsApp
                                        </button>
                                        <button
                                            onClick={() => setStep('info')}
                                            className="w-full text-warm-500 text-xs hover:underline py-2"
                                        >
                                            ← Corregir datos de envío
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}

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
                    <Link href="/tienda" className="text-warm-600 hover:text-lemon-600 transition-colors">
                        ← Volver a la tienda
                    </Link>
                </div>
            </div>
        </header>
    )
}
