'use client'

import { useState, useEffect } from 'react'
import { startOfDay, addDays, format, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import QuickTaskForm from '@/components/admin/QuickTaskForm'
import DeleteTaskButton from '@/components/admin/DeleteTaskButton'

export default function AgendaPage() {
    const [loading, setLoading] = useState(true)
    const [agendaData, setAgendaData] = useState<any>(null)
    const [selectedItem, setSelectedItem] = useState<any>(null)

    const fetchAgenda = async () => {
        try {
            const res = await fetch('/api/admin/agenda-v2')
            if (res.ok) {
                const data = await res.json()
                setAgendaData(data)
            }
        } catch (error) {
            console.error('Error fetching agenda:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAgenda()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lemon-500"></div>
        </div>
    )

    // Group items by day label
    const groupedItems: Record<string, any[]> = {}
    if (agendaData?.agendaItems) {
        agendaData.agendaItems.forEach((item: any) => {
            const dayKey = format(new Date(item.fecha), "EEEE d 'de' MMMM", { locale: es })
            if (!groupedItems[dayKey]) groupedItems[dayKey] = []
            groupedItems[dayKey].push(item)
        })
    }

    const stats = agendaData?.stats || { todayTalleres: 0, todayCitas: 0 }

    return (
        <div className="space-y-6 animate-fade-in mb-20 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        📅 Agenda de Clases
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Solo se muestran los talleres con alumnos inscriptos este día
                    </p>
                </div>
                <QuickTaskForm onSuccess={fetchAgenda} />
            </div>

            {/* Today Summary */}
            <div className="card p-6 bg-gradient-to-r from-leaf-50 via-lemon-50 to-orange-50 border-2 border-leaf-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-warm-500 uppercase font-bold tracking-wider">📍 Hoy</p>
                        <h2 className="text-xl font-bold text-warm-800 capitalize">
                            {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl">
                            <span className="text-2xl">🎨</span>
                            <div>
                                <p className="text-lg font-bold text-warm-800">{stats.todayTalleres}</p>
                                <p className="text-xs text-warm-500">Clases hoy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl">
                            <span className="text-2xl">👤</span>
                            <div>
                                <p className="text-lg font-bold text-warm-800">{stats.todayCitas}</p>
                                <p className="text-xs text-warm-500">Citas hoy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agenda Items */}
            <div className="space-y-8">
                {Object.keys(groupedItems).length > 0 ? Object.entries(groupedItems).map(([dayLabel, items]) => {
                    const firstItemDate = new Date(items[0].fecha)
                    const isTodayGroup = isToday(firstItemDate)

                    return (
                        <div key={dayLabel} className="space-y-4">
                            <h2 className={`text-lg font-bold border-b pb-2 capitalize flex items-center gap-2 ${isTodayGroup ? 'text-leaf-700 border-leaf-300' : 'text-warm-600 border-warm-200'}`}>
                                {isTodayGroup && <span className="bg-leaf-500 text-white text-xs px-2 py-0.5 rounded-full">HOY</span>}
                                {dayLabel}
                            </h2>
                            <div className="grid gap-3">
                                {items.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className={`card p-4 flex items-start gap-4 hover:shadow-soft transition-all border-l-4 ${item.color.split(' ').find((c: string) => c.startsWith('border-')) || 'border-warm-300'}`}
                                    >
                                        <div className="flex-shrink-0 w-16 text-center">
                                            <p className="text-xl font-bold text-warm-800">
                                                {item.horaDisplay}
                                            </p>
                                            <p className="text-xs text-warm-400 uppercase">hs</p>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                                                    {item.tipoLabel}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-warm-800">
                                                {item.titulo}
                                            </h3>
                                            <p className="text-sm text-warm-500 mt-1">{item.detalle}</p>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {item.tipo === 'TAREA' && (
                                                <DeleteTaskButton
                                                    taskId={item.id.replace('tarea-', '')}
                                                    onSuccess={fetchAgenda}
                                                />
                                            )}
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="btn-outline text-xs px-3 py-1"
                                            >
                                                Ver más
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }) : (
                    <div className="card py-12 text-center">
                        <p className="text-4xl mb-4">📭</p>
                        <p className="text-warm-500">No hay clases programadas con alumnos para los próximos 7 días.</p>
                    </div>
                )}
            </div>

            {/* Attendance Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-warm-900/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className={`p-6 text-white ${selectedItem.color.includes('orange') ? 'bg-orange-500' : selectedItem.color.includes('leaf') ? 'bg-leaf-600' : 'bg-lemon-600'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider">{selectedItem.tipoLabel}</span>
                                    <h2 className="text-2xl font-bold mt-2">{selectedItem.titulo}</h2>
                                    <p className="opacity-90 mt-1 flex items-center gap-2">
                                        <span>📅 {format(new Date(selectedItem.fecha), "EEEE d 'de' MMMM", { locale: es })}</span>
                                        <span>•</span>
                                        <span>⏰ {selectedItem.horaDisplay} hs</span>
                                    </p>
                                </div>
                                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-sm font-bold text-warm-400 uppercase tracking-widest mb-4">Alumnos Inscriptos ({selectedItem.attendees?.length || 0})</h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {selectedItem.attendees?.map((al: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-canvas-50 border border-canvas-100">
                                        <div className="w-8 h-8 rounded-full bg-lemon-200 flex items-center justify-center text-lemon-700 font-bold text-xs uppercase">
                                            {al.nombre[0]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-warm-800">{al.nombre}</p>
                                            <div className="flex gap-2">
                                                <span className="text-[10px] text-warm-500">DNI: {al.dni || 'S/D'}</span>
                                            </div>
                                        </div>
                                        <Link href={`/admin/alumnos/${al.id}`} className="text-lemon-600 hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {selectedItem.tipo === 'TAREA' && (
                                <div className="mt-4 pt-4 border-t border-canvas-100 flex justify-center">
                                    <DeleteTaskButton
                                        taskId={selectedItem.id.replace('tarea-', '')}
                                        variant="text"
                                        onSuccess={() => {
                                            setSelectedItem(null)
                                            fetchAgenda()
                                        }}
                                    />
                                </div>
                            )}

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-full mt-6 py-3 bg-warm-800 text-white font-bold rounded-xl hover:bg-warm-900 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
