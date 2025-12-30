'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'

export default function PerfilPage() {
    const { data: session } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        nombre: session?.user?.name || '',
        email: session?.user?.email || '',
        telefono: '',
        fechaNacimiento: '',
        contactoEmergencia: '',
        telefonoEmergencia: '',
        alergias: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Aquí iría la lógica para guardar
        alert('¡Perfil actualizado!')
        setIsEditing(false)
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Mi Perfil
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Gestioná tu información personal
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
                        Editar perfil
                    </button>
                )}
            </div>

            {/* Profile Card */}
            <div className="card">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 pb-6 border-b border-canvas-200">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-lemon-400 to-leaf-400 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">
                                {session?.user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        {isEditing && (
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-canvas-50 transition-colors">
                                <svg className="w-4 h-4 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-warm-800">
                            {session?.user?.name || 'Usuario'}
                        </h2>
                        <p className="text-warm-500">{session?.user?.email}</p>
                        <span className="badge badge-lemon mt-2">Alumno activo</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="pt-6 space-y-6">
                    {/* Personal Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-warm-800 mb-4">Información Personal</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Nombre completo</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    className="input-field bg-canvas-100"
                                    value={formData.email}
                                    disabled
                                />
                                <p className="text-xs text-warm-400 mt-1">El email no se puede modificar</p>
                            </div>
                            <div>
                                <label className="label">Teléfono</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    placeholder="+54 9 2901 ..."
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="label">Fecha de nacimiento</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.fechaNacimiento}
                                    onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-warm-800 mb-4">Contacto de Emergencia</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Nombre del contacto</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Nombre del familiar/tutor"
                                    value={formData.contactoEmergencia}
                                    onChange={(e) => setFormData({ ...formData, contactoEmergencia: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="label">Teléfono de emergencia</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    placeholder="+54 9 2901 ..."
                                    value={formData.telefonoEmergencia}
                                    onChange={(e) => setFormData({ ...formData, telefonoEmergencia: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Health Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-warm-800 mb-4">Información de Salud</h3>
                        <div>
                            <label className="label">Alergias o condiciones médicas</label>
                            <textarea
                                className="input-field min-h-[100px] resize-none"
                                placeholder="Indicá cualquier alergia o condición que debamos conocer..."
                                value={formData.alergias}
                                onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

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
                                className="flex-1 btn-primary"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Danger Zone */}
            <div className="card border-red-200">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Zona de Peligro</h3>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-red-50">
                    <div>
                        <p className="font-medium text-warm-800">Cerrar sesión</p>
                        <p className="text-sm text-warm-500">Salir de tu cuenta en este dispositivo</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    )
}
