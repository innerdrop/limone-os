'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

interface User {
    name?: string | null
    email?: string | null
    role: string
    image?: string | null
}

interface Notification {
    id: string
    title: string
    message: string
    date: string
    read: boolean
    type: 'info' | 'success' | 'warning' | 'error'
}

export default function PortalHeader({ user }: { user: User }) {
    const [showMenu, setShowMenu] = useState(false)
    // Ref for user menu to close on outside click as well (good UX improvement)
    const menuRef = useRef<HTMLDivElement>(null)

    const [showMobileNav, setShowMobileNav] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const notificationRef = useRef<HTMLDivElement>(null)

    // Close notifications and menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false)
            }
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])


    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/portal/notificaciones')
                if (res.ok) {
                    const data = await res.json()
                    setNotifications(data)
                }
            } catch (error) {
                console.error('Error fetching notifications:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    const handleNotificationClick = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))

        try {
            await fetch('/api/portal/notificaciones', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    const markAllAsRead = async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))

        try {
            await fetch('/api/portal/notificaciones', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAll: true })
            })
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation() // Prevent triggering the click on the item
        try {
            // Optimistic update
            setNotifications(prev => prev.filter(n => n.id !== id))

            await fetch(`/api/portal/notificaciones?id=${id}`, {
                method: 'DELETE'
            })
        } catch (error) {
            console.error('Error deleting notification:', error)
            // Revert on error could be implemented here if critical, but for notifications strictly necessary? 
            // We'll leave it simple for now.
        }
    }

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-canvas-200">
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

                {/* Page Title - Dynamic based on route */}
                <h1 className="text-lg font-semibold text-warm-800 hidden lg:block">
                    Mi Portal
                </h1>

                {/* Mobile Logo */}
                <Link href="/portal" className="lg:hidden flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/logo.jpg"
                            alt="Logo Taller Limoné"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-lg hover:bg-canvas-100 transition-colors"
                        >
                            <svg className={`w-6 h-6 ${showNotifications ? 'text-lemon-600' : 'text-warm-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-canvas-200 overflow-hidden z-50 animate-slide-up origin-top-right">
                                <div className="p-4 border-b border-canvas-100 flex items-center justify-between bg-canvas-50">
                                    <h3 className="font-semibold text-warm-800">Notificaciones</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-lemon-600 hover:text-lemon-700 font-medium"
                                        >
                                            Marcar todas como leídas
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-warm-500">
                                            <p>No tenés notificaciones nuevas</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-canvas-100">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification.id)}
                                                    className={`p-4 hover:bg-canvas-50 transition-colors cursor-pointer ${!notification.read ? 'bg-lemon-50/50' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-lemon-500' : 'bg-transparent'}`}></div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <h4 className={`text-sm ${!notification.read ? 'font-bold text-warm-900' : 'font-medium text-warm-700'}`}>
                                                                    {notification.title}
                                                                </h4>
                                                                <span className="text-xs text-warm-400 whitespace-nowrap">
                                                                    {new Date(notification.date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className={`text-sm mt-1 ${!notification.read ? 'text-warm-800' : 'text-warm-500'}`}>
                                                                {notification.message}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => handleDelete(e, notification.id)}
                                                            className="p-1 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar notificación"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-canvas-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-lemon-200 flex items-center justify-center">
                                <span className="text-lemon-700 font-semibold text-sm">
                                    {user.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <svg className="w-4 h-4 text-warm-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-canvas-200 py-2 z-50">
                                <div className="px-4 py-2 border-b border-canvas-100">
                                    <p className="text-sm font-medium text-warm-800">{user.name}</p>
                                    <p className="text-xs text-warm-400">{user.email}</p>
                                </div>
                                <Link
                                    href="/portal/perfil"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-warm-600 hover:bg-canvas-50"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Mi Perfil
                                </Link>
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-warm-600 hover:bg-canvas-50"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Ir al Inicio
                                </Link>
                                <hr className="my-2 border-canvas-100" />
                                <button
                                    onClick={async () => {
                                        await signOut({ redirect: false })
                                        window.location.href = window.location.origin
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {
                showMobileNav && (
                    <div className="lg:hidden border-t border-canvas-200 bg-white py-4 px-4">
                        <nav className="space-y-1">
                            {[
                                { label: 'Dashboard', href: '/portal' },
                                { label: 'Calendario', href: '/portal/calendario' },
                                { label: 'Mis Pagos', href: '/portal/pagos' },
                                { label: 'Mi Galería', href: '/portal/galeria' },
                                { label: 'Mi Perfil', href: '/portal/perfil' },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block px-4 py-2 rounded-lg text-warm-600 hover:bg-canvas-100"
                                    onClick={() => setShowMobileNav(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )
            }
        </header >
    )
}
