'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/portal'
    const error = searchParams.get('error')

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [formError, setFormError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setFormError('')

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                setFormError('Email o contraseña incorrectos')
            } else {
                router.push(callbackUrl)
                router.refresh()
            }
        } catch (error) {
            setFormError('Error al iniciar sesión. Intenta de nuevo.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-lemon flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-lemon-300/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-leaf-300/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <Image
                            src="/logo.jpg"
                            alt="Taller Limoné Logo"
                            width={50}
                            height={50}
                            className="rounded-lg object-contain shadow-lg"
                        />
                        <span className="font-serif text-2xl font-bold text-warm-800">
                            Taller Limoné
                        </span>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="card-glass p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-serif font-bold text-warm-800 mb-2">
                            ¡Bienvenido de vuelta!
                        </h1>
                        <p className="text-warm-500">
                            Ingresá a tu portal de alumno
                        </p>
                    </div>

                    {/* Success Message */}
                    {searchParams.get('inscripcion') === 'exitosa' && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                            <div className="flex items-start gap-2">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="font-semibold mb-1">¡Inscripción exitosa!</p>
                                    <p>Tu contraseña temporal son los primeros 4 dígitos del DNI del alumno. Al ingresar, deberás completar información adicional.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Messages */}
                    {(error || formError) && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {formError || 'Error al iniciar sesión. Intenta de nuevo.'}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="label">Contraseña</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-warm-600">
                                <input type="checkbox" className="rounded border-warm-300" />
                                Recordarme
                            </label>
                            <Link href="/recuperar-password" className="text-lemon-600 hover:text-lemon-700 font-medium">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full py-3.5"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Iniciando sesión...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-warm-500 text-sm">
                            ¿No tenés cuenta?{' '}
                            <Link href="/inscripcion" className="text-lemon-600 hover:text-lemon-700 font-medium">
                                Inscribite acá
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-warm-500 hover:text-warm-700 text-sm inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-lemon flex items-center justify-center p-4">
                <div className="animate-spin h-8 w-8 text-lemon-600" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
