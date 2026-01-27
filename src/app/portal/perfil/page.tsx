'use client'

import { useState, useEffect, Suspense } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

function PerfilContent() {
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const studentIdParam = searchParams.get('studentId')

    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [alumnoData, setAlumnoData] = useState<any>(null)
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        dni: '',
        domicilio: '',
        tutorNombre: '',
        tutorEmail: '',
        tutorTelefonoPrincipal: '',
        emergenciaNombre: '',
        emergenciaTelefono: '',
        alergias: '',
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const url = studentIdParam ? `/api/portal/perfil?studentId=${studentIdParam}` : '/api/perfil'
                const res = await fetch(url)
                if (res.ok) {
                    const data = await res.json()
                    const student = data.students ? data.students[0] : data

                    setAlumnoData(student)
                    setFormData({
                        nombre: student?.nombre || '',
                        apellido: student?.apellido || '',
                        email: session?.user?.email || '',
                        telefono: student?.tutorTelefonoPrincipal || '',
                        fechaNacimiento: student?.fechaNacimiento ? student?.fechaNacimiento.split('T')[0] : '',
                        dni: student?.dni || '',
                        domicilio: student?.domicilio || '',
                        tutorNombre: student?.tutorNombre || '',
                        tutorEmail: student?.tutorEmail || '',
                        tutorTelefonoPrincipal: student?.tutorTelefonoPrincipal || '',
                        emergenciaNombre: student?.emergenciaNombre || '',
                        emergenciaTelefono: student?.emergenciaTelefono || '',
                        alergias: student?.alergias || '',
                    })
                }
            } catch (error) {
                console.error('Error fetching profile:', error)
            } finally {
                setLoading(false)
            }
        }

        if (session) {
            fetchProfile()
        }
    }, [session, studentIdParam])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/portal/perfil', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    studentId: studentIdParam || alumnoData?.id
                })
            })
            if (res.ok) {
                const data = await res.json()
                setAlumnoData(data.student || data)
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
                        {studentIdParam ? `Perfil de ${alumnoData?.nombre}` : 'Mi Perfil'}
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Información completa del alumno y su inscripción
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
                            {alumnoData?.nombre} {alumnoData?.apellido}
                        </h2>
                        <p className="text-warm-500">{session?.user?.email}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="badge badge-lemon">Alumno activo</span>
                            <span className={`badge ${alumnoData?.perfilCompleto ? 'bg-leaf-100 text-leaf-700' : 'bg-amber-100 text-amber-700'}`}>
                                {alumnoData?.perfilCompleto ? 'Perfil Completo' : 'Perfil Incompleto'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="pt-6 space-y-8">
                    {/* Alumno Info */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-lemon-100 flex items-center justify-center text-lemon-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-warm-800">Datos del Alumno</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Nombre</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="label">Apellido</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.apellido}
                                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="label">DNI</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.dni}
                                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
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
                            <div className="md:col-span-2">
                                <label className="label">Domicilio</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.domicilio}
                                    onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Tutor Info */}
                    <section className="pt-6 border-t border-canvas-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-leaf-100 flex items-center justify-center text-leaf-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-warm-800">Responsable / Tutor</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Nombre del Tutor</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.tutorNombre}
                                    onChange={(e) => setFormData({ ...formData, tutorNombre: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="label">Parentesco</label>
                                <input
                                    type="text"
                                    className="input-field bg-canvas-100"
                                    value={alumnoData?.tutorRelacion || ''}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="label">Email de contacto</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={formData.tutorEmail}
                                    onChange={(e) => setFormData({ ...formData, tutorEmail: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="label">Teléfono Principal</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={formData.tutorTelefonoPrincipal}
                                    onChange={(e) => setFormData({ ...formData, tutorTelefonoPrincipal: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Security & Health */}
                    <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-canvas-100">
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-warm-800">Emergencias</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Contacto de Emergencia</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.emergenciaNombre}
                                        onChange={(e) => setFormData({ ...formData, emergenciaNombre: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <label className="label">Teléfono Emergencia</label>
                                    <input
                                        type="tel"
                                        className="input-field"
                                        value={formData.emergenciaTelefono}
                                        onChange={(e) => setFormData({ ...formData, emergenciaTelefono: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-warm-800">Salud</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Alergias / Condiciones</label>
                                    <textarea
                                        className="input-field min-h-[80px] resize-none"
                                        value={formData.alergias}
                                        onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="p-3 rounded-lg bg-canvas-50 border border-canvas-200 text-sm">
                                    <p className="text-warm-600">Obra Social: <span className="font-semibold">{alumnoData?.obraSocial || 'No especificada'}</span></p>
                                    <p className="text-warm-600">Afiliado: <span className="font-semibold">{alumnoData?.numeroAfiliado || '-'}</span></p>
                                </div>
                            </div>
                        </section>
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

            {/* Account Settings - Only if NOT editing a specific student */}
            {!studentIdParam && (
                <div className="p-4 rounded-2xl border border-canvas-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="font-medium text-warm-800">Cerrar sesión</p>
                            <p className="text-sm text-warm-500">Salir de tu cuenta en este dispositivo</p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="px-4 py-2 border border-red-200 text-red-600 bg-red-50/30 rounded-lg font-medium hover:bg-red-50 transition-colors"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function PerfilPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lemon-500"></div></div>}>
            <PerfilContent />
        </Suspense>
    )
}
