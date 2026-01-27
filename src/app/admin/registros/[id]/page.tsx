'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegistroDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [usuario, setUsuario] = useState<any>(null)
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        rol: '',
        activo: true
    })

    useEffect(() => {
        fetchUsuario()
    }, [params.id])

    const fetchUsuario = async () => {
        try {
            const res = await fetch(`/api/admin/registros/${params.id}`)
            if (res.ok) {
                const data = await res.ok ? await res.json() : null
                if (data) {
                    setUsuario(data)
                    setFormData({
                        nombre: data.nombre || '',
                        email: data.email || '',
                        telefono: data.telefono || '',
                        rol: data.rol || 'ALUMNO',
                        activo: data.activo
                    })
                }
            } else {
                setError('Error al cargar el usuario')
            }
        } catch (e) {
            setError('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            const res = await fetch(`/api/admin/registros/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                alert('Usuario actualizado correctamente')
                fetchUsuario()
            } else {
                const d = await res.json()
                setError(d.error || 'Error al guardar')
            }
        } catch (e) {
            setError('Error de conexión')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteUser = async () => {
        if (!confirm('¿ESTÁS SEGURO? Esta acción ELIMINARÁ AL PADRE Y A TODOS SUS HIJOS ASOCIADOS y no se puede deshacer.')) return

        try {
            const res = await fetch(`/api/admin/registros/${params.id}`, { method: 'DELETE' })
            if (res.ok) {
                router.push('/admin/registros')
            } else {
                alert('Error al eliminar')
            }
        } catch (e) {
            alert('Error de conexión')
        }
    }

    const handleDeleteAlumno = async (alumnoId: string, nombre: string) => {
        if (!confirm(`¿Estás seguro de eliminar a ${nombre}?`)) return

        try {
            const res = await fetch(`/api/admin/alumnos/${alumnoId}`, { method: 'DELETE' })
            if (res.ok) {
                fetchUsuario()
            } else {
                alert('Error al eliminar alumno')
            }
        } catch (e) {
            alert('Error de conexión')
        }
    }

    if (loading) return <div className="p-8 text-center text-warm-500">Cargando...</div>
    if (!usuario) return <div className="p-8 text-center text-red-500">{error || 'Usuario no encontrado'}</div>

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/registros" className="text-sm text-warm-500 hover:text-warm-800 flex items-center gap-1 mb-2">
                        ← Volver a Registros
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-warm-800">Gestionar Registro</h1>
                </div>
                <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold border border-red-200"
                >
                    Eliminar Usuario
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* User Data Form */}
                <div className="md:col-span-2 space-y-6">
                    <form onSubmit={handleSave} className="card space-y-4">
                        <h2 className="text-xl font-bold text-warm-800 flex items-center gap-2">
                            <span>👤</span> Perfil del Tutor
                        </h2>

                        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Nombre Completo</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Teléfono</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.telefono}
                                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Rol</label>
                                <select
                                    className="input-field"
                                    value={formData.rol}
                                    onChange={e => setFormData({ ...formData, rol: e.target.value })}
                                >
                                    <option value="ALUMNO">Tutor / Alumno</option>
                                    <option value="DOCENTE">Docente</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="activo"
                                checked={formData.activo}
                                onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                                className="w-4 h-4 text-lemon-500 border-warm-300 rounded focus:ring-lemon-500"
                            />
                            <label htmlFor="activo" className="text-sm text-warm-700">Usuario Activo (puede iniciar sesión)</label>
                        </div>

                        <div className="pt-4 border-t border-canvas-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-lemon-500 hover:bg-lemon-600 text-brand-charcoal font-bold rounded-xl transition-all shadow-lg disabled:opacity-50"
                            >
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>

                    {/* Associated Children */}
                    <div className="card space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-warm-800 flex items-center gap-2">
                                <span>🎨</span> Niños Asociados ({usuario.alumnos?.length || 0})
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {usuario.alumnos && usuario.alumnos.length > 0 ? (
                                usuario.alumnos.map((hijo: any) => (
                                    <div key={hijo.id} className="flex items-center justify-between p-4 rounded-xl bg-canvas-50 border border-canvas-200 hover:border-lemon-300 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-lemon-100 flex items-center justify-center text-lemon-600 font-bold uppercase">
                                                {(hijo.nombre || hijo.apellido || '?').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-warm-800">
                                                    {`${hijo.nombre || ''} ${hijo.apellido || ''}`.trim() || 'Sin nombre'}
                                                </p>
                                                <p className="text-xs text-warm-500">
                                                    DNI: {hijo.dni || 'Sin registrar'} • {hijo.perfilCompleto ? '✅ Perfil Completo' : '⚠️ Pendiente'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/alumnos/${hijo.id}`}
                                                className="px-3 py-1.5 bg-white text-brand-purple text-xs font-bold rounded-lg border border-brand-purple/20 hover:bg-brand-purple hover:text-white transition-all shadow-sm"
                                            >
                                                Ver Ficha
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteAlumno(hijo.id, hijo.nombre)}
                                                className="px-3 py-1.5 bg-white text-red-500 text-xs font-bold rounded-lg border border-red-100 hover:bg-red-50 transition-all"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-4 text-warm-400 italic">No hay niños registrados para este usuario.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="card bg-gradient-to-br from-warm-800 to-warm-900 border-none text-white">
                        <h3 className="font-bold text-warm-400 uppercase tracking-widest text-xs mb-4">Información de Cuenta</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-2xl font-black mb-1">{usuario.nombre}</p>
                                <p className="text-warm-400 text-sm">Miembro desde {new Date(usuario.creadoEn).toLocaleDateString()}</p>
                            </div>
                            <div className="pt-4 border-t border-warm-700">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${usuario.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {usuario.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-lemon-50 p-6 rounded-3xl border border-lemon-100 space-y-3">
                        <h4 className="font-bold text-lemon-800 flex items-center gap-2">
                            <span>💡</span> Tip del Admin
                        </h4>
                        <p className="text-sm text-lemon-700 leading-relaxed">
                            Desde aquí puedes corregir datos mal ingresados por el tutor o cambiar su rol. Recuerda que eliminar a un tutor eliminará todos sus registros asociados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
