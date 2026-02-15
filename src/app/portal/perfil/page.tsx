'use client'

import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

export default function PerfilPage() {
    const { data: session, update } = useSession()

    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState<any>(null)
    const [formData, setFormData] = useState({
        email: '',
        telefono: '',
    })

    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await fetch('/api/portal/usuario')
                if (res.ok) {
                    const data = await res.json()
                    setUserData(data)
                    setFormData({
                        email: data.email || '',
                        telefono: data.telefono || '',
                    })
                }
            } catch (error) {
                console.error('Error fetching user profile:', error)
            } finally {
                setLoading(false)
            }
        }

        if (session) {
            fetchUserProfile()
        }
    }, [session])

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Las contraseñas nuevas no coinciden')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/portal/usuario/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            })

            if (res.ok) {
                alert('¡Contraseña actualizada con éxito!')
                setShowPasswordForm(false)
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
            } else {
                const error = await res.json()
                alert(error.error || 'Error al actualizar la contraseña')
            }
        } catch (error) {
            console.error(error)
            alert('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/portal/usuario', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                const data = await res.json()
                setUserData(data.usuario)

                // Update session to reflect new email if it changed
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        email: data.usuario.email
                    }
                })

                alert('¡Perfil actualizado con éxito!')
                setIsEditing(false)
            } else {
                alert('Error al actualizar el perfil')
            }
        } catch (error) {
            console.error(error)
            alert('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lemon-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Mi Perfil de Responsable
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Gestioná tus datos de contacto registrados en Taller Limoné
                    </p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Editar mis datos
                    </button>
                )}
            </div>

            {/* Profile Card */}
            <div className="card">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 pb-6 border-b border-canvas-200">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-white border border-canvas-200 flex items-center justify-center overflow-hidden shadow-soft">
                            <Image
                                src="/colores.png"
                                alt="Avatar"
                                width={80}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-warm-800">
                            {userData?.nombre}
                        </h2>
                        <p className="text-warm-500">{userData?.email}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="badge badge-purple">Responsable de Cuenta</span>
                            {session?.user?.role === 'ADMIN' && (
                                <span className="badge bg-red-100 text-red-700">Administrador</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="pt-6 space-y-8">
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-lemon-100 flex items-center justify-center text-lemon-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-warm-800">Datos de la Cuenta</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="label">Nombre Completo</label>
                                <input
                                    type="text"
                                    className="input-field bg-canvas-50 italic text-warm-400"
                                    value={userData?.nombre || ''}
                                    disabled
                                />
                                <p className="text-[10px] text-warm-400 mt-1">
                                    Para cambiar tu nombre, por favor contactate con administración.
                                </p>
                            </div>

                            <div>
                                <label className="label">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className={`input-field ${!isEditing ? 'bg-canvas-50' : 'bg-white'}`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!isEditing}
                                    required
                                />
                                {isEditing && (
                                    <p className="text-[10px] text-lemon-600 mt-1">
                                        Se usará para iniciar sesión y recibir notificaciones.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">Teléfono de Contacto</label>
                                <input
                                    type="tel"
                                    className={`input-field ${!isEditing ? 'bg-canvas-50' : 'bg-white'}`}
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Ej: +54 9 2901 ..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    {isEditing && (
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-3 px-4 border border-canvas-300 text-warm-600 rounded-xl font-medium hover:bg-canvas-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 btn-primary shadow-glow-lemon"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Password Change Section */}
            <div className="card">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-warm-800">Seguridad</h3>
                </div>

                <div className="max-w-md">
                    <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="text-brand-purple font-medium text-sm flex items-center gap-2 hover:underline"
                    >
                        {showPasswordForm ? 'Cancelar cambio' : 'Cambiar mi contraseña'}
                    </button>

                    {showPasswordForm && (
                        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 animate-slide-down">
                            <div>
                                <label className="label">Contraseña Actual</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                    minLength={6}
                                />
                                <p className="text-[10px] text-warm-400 mt-1">Mínimo 6 caracteres.</p>
                            </div>
                            <div>
                                <label className="label">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-brand-purple text-white rounded-xl font-bold shadow-soft hover:bg-brand-purple/90 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Logout button moved down */}
            <div className="p-4 rounded-2xl border border-canvas-200 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-warm-800">Cerrar Sesión</p>
                        <p className="text-sm text-warm-500">Salir de tu cuenta en este dispositivo</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                    >
                        Salir
                    </button>
                </div>
            </div>
        </div>
    )
}
