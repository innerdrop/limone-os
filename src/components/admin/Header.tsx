'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { menuItems } from './Sidebar'
import QuickTaskForm from './QuickTaskForm'

interface User {
    name?: string | null
    email?: string | null
    role: string
    image?: string | null
}

interface Notificacion {
    id: string
    titulo: string
    mensaje: string
    leida: boolean
    tipo: string | null
    enlace: string | null
    fechaEnvio: string
}

interface Tarea {
    id: string
    titulo: string
    fecha: string
    prioridad: string
}

function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
    const [tareas, setTareas] = useState<Tarea[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/notificaciones')
            if (res.ok) {
                const data = await res.json()
                setNotificaciones(data.notificaciones)
                setTareas(data.tareasProximas)
            }
        } catch (error) {
            console.error('Error fetching notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        // Opcional: Polling cada 3 minutos
        const interval = setInterval(fetchData, 180000)
        return () => clearInterval(interval)
    }, [])

    const markAsRead = async (id?: string) => {
        const url = id ? `/api/admin/notificaciones?id=${id}` : '/api/admin/notificaciones?all=true'
        try {
            const res = await fetch(url, { method: 'PATCH' })
            if (res.ok) {
                if (id) {
                    setNotificaciones(prev => prev.filter(n => n.id !== id))
                } else {
                    setNotificaciones([])
                }
            }
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const unreadCount = notificaciones.length + tareas.length

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-canvas-100 transition-colors"
            >
                <svg className="w-6 h-6 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-canvas-200 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-canvas-100 bg-canvas-50 flex justify-between items-center">
                            <h3 className="font-bold text-warm-800">Notificaciones</h3>
                            {notificaciones.length > 0 && (
                                <button
                                    onClick={() => markAsRead()}
                                    className="text-xs text-lemon-600 hover:text-lemon-700 font-medium"
                                >
                                    Marcar todas como leídas
                                </button>
                            )}
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto">
                            {/* Tareas Próximas */}
                            {tareas.length > 0 && (
                                <div className="p-2 bg-lemon-50/50">
                                    <p className="text-[10px] font-bold text-lemon-700 uppercase tracking-wider px-3 py-1">
                                        Tareas Próximas
                                    </p>
                                    {tareas.map(tarea => (
                                        <div key={tarea.id} className="p-3 hover:bg-white rounded-xl transition-colors group">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-lemon-100 flex items-center justify-center flex-shrink-0">
                                                    <span>📅</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-warm-800">{tarea.titulo}</p>
                                                    <p className="text-xs text-warm-500">
                                                        {new Date(tarea.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded h-fit ${tarea.prioridad === 'ALTA' ? 'bg-red-100 text-red-600' : 'bg-warm-100 text-warm-600'
                                                    }`}>
                                                    {tarea.prioridad}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Avisos de Pago y otras Notificaciones */}
                            <div className="p-2">
                                {notificaciones.length > 0 ? (
                                    notificaciones.map(notif => (
                                        <div key={notif.id} className="p-3 hover:bg-canvas-50 rounded-xl transition-colors group relative">
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 hover:bg-canvas-200 rounded-full transition-all"
                                                title="Marcar como leída"
                                            >
                                                <svg className="w-3 h-3 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                            <div className="flex gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.tipo === 'INFO' ? 'bg-blue-100' : 'bg-brand-purple/10'}`}>
                                                    <span>{notif.tipo === 'INFO' ? '💰' : '🔔'}</span>
                                                </div>
                                                <div className="flex-1 pr-6">
                                                    <p className="text-sm font-bold text-warm-800">{notif.titulo}</p>
                                                    <p className="text-xs text-warm-600 mt-0.5">{notif.mensaje}</p>
                                                    {notif.enlace && (
                                                        <Link
                                                            href={notif.enlace}
                                                            className="text-[10px] text-lemon-600 font-bold hover:underline mt-2 inline-block"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            Ver detalles →
                                                        </Link>
                                                    )}
                                                    <p className="text-[10px] text-warm-400 mt-2">
                                                        Hace {Math.floor((new Date().getTime() - new Date(notif.fechaEnvio).getTime()) / 60000)} minutos
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    tareas.length === 0 && !loading && (
                                        <div className="py-12 text-center">
                                            <div className="w-12 h-12 bg-canvas-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-warm-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-warm-500">No hay notificaciones pendientes</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="p-3 border-t border-canvas-100 bg-canvas-50">
                            <Link
                                href="/admin/agenda"
                                className="block w-full py-2 text-center text-xs font-bold text-warm-600 hover:text-warm-800 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Ver toda la agenda
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default function AdminHeader({ user }: { user: User }) {
    const [showMenu, setShowMenu] = useState(false)
    const [showMobileNav, setShowMobileNav] = useState(false)
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-canvas-200">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setShowMobileNav(!showMobileNav)}
                    className="lg:hidden p-2 rounded-lg hover:bg-canvas-100"
                >
                    <svg className="w-6 h-6 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Title */}
                <h1 className="text-lg font-semibold text-warm-800 hidden lg:block">
                    Panel de Administración
                </h1>

                {/* Mobile Logo */}
                <Link href="/admin" className="lg:hidden flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/colores.png"
                            alt="Logo Taller Limoné"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        <span className="font-gigi text-xl font-bold text-warm-800">
                            Limoné
                        </span>
                    </div>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Quick Add Button */}
                    <div className="hidden sm:block">
                        <QuickTaskForm />
                    </div>

                    {/* Notifications */}
                    <NotificationsDropdown />

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-canvas-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-warm-700 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user.name?.charAt(0) || 'A'}
                                </span>
                            </div>
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-canvas-200 py-2 z-50">
                                <div className="px-4 py-2 border-b border-canvas-100">
                                    <p className="text-sm font-medium text-warm-800">{user.name}</p>
                                    <p className="text-xs text-warm-400">{user.email}</p>
                                </div>
                                <Link
                                    href="/portal"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-warm-600 hover:bg-canvas-50"
                                    onClick={() => setShowMenu(false)}
                                >
                                    Portal Alumno
                                </Link>
                                <hr className="my-2 border-canvas-100" />
                                <button
                                    onClick={async () => {
                                        await signOut({ redirect: false })
                                        window.location.href = window.location.origin
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {showMobileNav && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-warm-900/60 backdrop-blur-sm"
                        onClick={() => setShowMobileNav(false)}
                    />

                    {/* Sidebar container */}
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-warm-800 shadow-xl transition-transform duration-300 ease-in-out">
                        <div className="absolute top-0 right-0 -mr-12 pt-4">
                            <button
                                onClick={() => setShowMobileNav(false)}
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-6 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <Image
                                            src="/colores.png"
                                            alt="Limoné Logo"
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <span className="font-gigi text-xl font-bold text-white block">
                                            Limoné
                                        </span>
                                        <span className="text-[10px] text-warm-400">Panel Admin</span>
                                    </div>
                                </div>
                            </div>

                            <nav className="px-4 space-y-1">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${isActive
                                                ? 'bg-brand-yellow text-brand-charcoal'
                                                : 'text-warm-300 hover:bg-warm-700 hover:text-white'
                                                }`}
                                            onClick={() => setShowMobileNav(false)}
                                        >
                                            <span className={isActive ? 'text-brand-charcoal' : ''}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                            {item.isNew && (
                                                <span className="ml-auto bg-brand-purple text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                    NUEVO
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>

                        <div className="flex-shrink-0 flex bg-warm-700 p-4 mx-4 mb-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center">
                                    <span className="text-white font-semibold text-xs">
                                        {user.name?.charAt(0) || 'A'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-white truncate">
                                        {user.name}
                                    </p>
                                    <Link href="/" className="text-[10px] text-warm-400 hover:text-white">
                                        Volver al sitio
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
