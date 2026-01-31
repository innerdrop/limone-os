'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setStatus('error')
            setErrorMessage('Las contraseñas no coinciden')
            return
        }

        if (password.length < 4) {
            setStatus('error')
            setErrorMessage('La contraseña debe tener al menos 4 caracteres')
            return
        }

        setIsSubmitting(true)
        setStatus('idle')
        setErrorMessage('')

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al restablecer la contraseña')
            }

            setStatus('success')
            // Redirect to login after 3 seconds
            setTimeout(() => router.push('/login'), 3000)
        } catch (error) {
            setStatus('error')
            setErrorMessage(error instanceof Error ? error.message : 'Error desconocido')
        } finally {
            setIsSubmitting(false)
        }
    }

    // No token provided
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-canvas-100 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal mb-4">Enlace inválido</h1>
                    <p className="text-canvas-600 mb-6">
                        El enlace para restablecer la contraseña no es válido o ha expirado.
                    </p>
                    <Link href="/forgot-password" className="btn-primary inline-block">
                        Solicitar nuevo enlace
                    </Link>
                </div>
            </div>
        )
    }

    // Success state
    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-canvas-100 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal mb-4">¡Contraseña actualizada!</h1>
                    <p className="text-canvas-600 mb-6">
                        Tu contraseña ha sido cambiada exitosamente. Serás redirigido al inicio de sesión...
                    </p>
                    <Link href="/login" className="btn-primary inline-block">
                        Iniciar sesión ahora
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
                    <h2 className="text-xl font-semibold text-charcoal">Nueva contraseña</h2>
                    <p className="text-canvas-600 mt-2">
                        Ingresá tu nueva contraseña.
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
                            Nueva contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-canvas-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                            placeholder="••••••••"
                            required
                            minLength={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-canvas-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                            placeholder="••••••••"
                            required
                            minLength={4}
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
                                Guardando...
                            </span>
                        ) : 'Guardar nueva contraseña'}
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-canvas-100">
                <div className="animate-spin h-8 w-8 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}
