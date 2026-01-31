'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatus('idle')
        setErrorMessage('')

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al procesar la solicitud')
            }

            setStatus('success')
        } catch (error) {
            setStatus('error')
            setErrorMessage(error instanceof Error ? error.message : 'Error desconocido')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-canvas-100 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal mb-4">¡Revisa tu correo!</h1>
                    <p className="text-canvas-600 mb-6">
                        Si el email está registrado, recibirás un enlace para restablecer tu contraseña.
                    </p>
                    <Link href="/login" className="btn-primary inline-block">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-canvas-100 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <h1 className="text-3xl font-bold text-charcoal">🍋 Taller Limoné</h1>
                    </Link>
                    <h2 className="text-xl font-semibold text-charcoal">¿Olvidaste tu contraseña?</h2>
                    <p className="text-canvas-600 mt-2">
                        Ingresá tu email y te enviaremos un enlace para restablecerla.
                    </p>
                </div>

                {/* Error Message */}
                {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-canvas-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-charcoal font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando...
                            </span>
                        ) : 'Enviar enlace'}
                    </button>
                </form>

                {/* Back to login */}
                <div className="mt-6 text-center">
                    <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    )
}
