'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Interface for Payment (corresponds to Prisma model)
interface Pago {
    id: string
    concepto: string
    monto: number
    fechaPago: string
    estado: string // 'PENDIENTE', 'APROBADO', 'RECHAZADO'
    comprobantePdf?: string | null
}

export default function PagosPage() {
    const [pagos, setPagos] = useState<Pago[]>([])
    const [loading, setLoading] = useState(true)
    const [showPayModal, setShowPayModal] = useState(false)

    // Fetch real payments from API
    useEffect(() => {
        const fetchPagos = async () => {
            try {
                const response = await fetch('/api/portal/pagos')
                const data = await response.json()
                if (Array.isArray(data)) {
                    setPagos(data)
                }
            } catch (error) {
                console.error('Error fetching payments:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPagos()
    }, [])

    const cuotaPendiente = pagos.find((p: Pago) => p.estado === 'PENDIENTE')
    const avisoPendiente = pagos.find((p: Pago) => p.estado === 'PENDIENTE_VERIFICACION')
    const pagosAprobados = pagos.filter((p: Pago) => p.estado === 'CONFIRMADO' || p.estado === 'APROBADO')
    const totalPagado = pagosAprobados.reduce((sum: number, p: Pago) => sum + p.monto, 0)

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    if (loading) {
        return <div className="p-8 text-center text-warm-500">Cargando pagos...</div>
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                        Mis Pagos
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Gestioná tus cuotas y descargá comprobantes
                    </p>
                </div>
            </div>

            {/* Alert for pending payment */}
            {cuotaPendiente && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-800">Tenés una cuota pendiente</h3>
                            <p className="text-sm text-amber-700">
                                {cuotaPendiente.concepto} - {formatMoney(cuotaPendiente.monto)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPayModal(true)}
                        className="btn-primary bg-amber-500 hover:bg-amber-600 whitespace-nowrap"
                    >
                        Pagar ahora
                    </button>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{pagosAprobados.length}</p>
                            <p className="text-sm text-warm-500">Cuotas pagadas</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-lemon-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{formatMoney(totalPagado)}</p>
                            <p className="text-sm text-warm-500">Total pagado</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{(cuotaPendiente ? 1 : 0) + (avisoPendiente ? 1 : 0)}</p>
                            <p className="text-sm text-warm-500">Cuotas pendientes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            <div className="card">
                <h2 className="text-lg font-semibold text-warm-800 mb-4">Historial de Pagos</h2>

                {pagos.length === 0 ? (
                    <div className="text-center py-12 text-warm-500">
                        <p className="text-xl mb-2">💸</p>
                        <p>No tenés pagos registrados todavía.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-canvas-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Concepto</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Fecha</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-warm-500">Monto</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-warm-500">Estado</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-warm-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagos.map((pago: Pago) => (
                                    <tr key={pago.id} className="border-b border-canvas-100 hover:bg-canvas-50">
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-warm-800">{(pago as any).studentName}</p>
                                            <p className="text-xs text-warm-500">{pago.concepto}</p>
                                        </td>
                                        <td className="py-4 px-4 text-warm-500">
                                            {pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-right font-semibold text-warm-800">
                                            {formatMoney(pago.monto)}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`badge ${(pago.estado === 'APROBADO' || pago.estado === 'CONFIRMADO')
                                                ? 'badge-success'
                                                : (pago.estado === 'PENDIENTE' || pago.estado === 'PENDIENTE_VERIFICACION')
                                                    ? 'badge-warning'
                                                    : 'badge-error'
                                                }`}>
                                                {(pago.estado === 'APROBADO' || pago.estado === 'CONFIRMADO') ? 'Pagado' :
                                                    (pago.estado === 'PENDIENTE' || pago.estado === 'PENDIENTE_VERIFICACION') ? 'Pendiente' : 'Rechazado'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {pago.comprobantePdf ? (
                                                    <>
                                                        {/* Botón Ver */}
                                                        <a
                                                            href={pago.comprobantePdf}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Ver Factura"
                                                            className="p-2 rounded-lg bg-leaf-50 text-leaf-600 hover:bg-leaf-100 transition-colors border border-leaf-100"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </a>
                                                        {/* Botón Descargar */}
                                                        <a
                                                            href={pago.comprobantePdf}
                                                            download={`Factura-${pago.id}.pdf`}
                                                            title="Descargar Factura"
                                                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                        </a>
                                                    </>
                                                ) : pago.estado === 'PENDIENTE' ? (
                                                    <button
                                                        onClick={() => setShowPayModal(true)}
                                                        className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium px-3 py-2 rounded-lg bg-amber-50 border border-amber-100"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        Pagar
                                                    </button>
                                                ) : pago.estado === 'PENDIENTE_VERIFICACION' ? (
                                                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-lg border border-green-100 font-bold">
                                                        Aviso enviado
                                                    </span>
                                                ) : (
                                                    <span className="text-warm-400 text-sm py-2 px-4">-</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pay Modal */}
            {showPayModal && cuotaPendiente && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-warm-800">
                                Pagar Cuota
                            </h3>
                            <button
                                onClick={() => setShowPayModal(false)}
                                className="p-2 hover:bg-canvas-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 rounded-xl bg-canvas-50 border border-canvas-200 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-warm-600">{cuotaPendiente.concepto}</span>
                                <span className="text-2xl font-bold text-warm-800">
                                    {formatMoney(cuotaPendiente.monto)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Mercado Pago disabled for now as per user request */}
                            {/* 
                            <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:border-blue-400 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">MP</span>
                                    </div>
                                    <span className="font-medium text-warm-800">Mercado Pago</span>
                                </div>
                                <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            */}

                            <button
                                onClick={() => {
                                    alert('Por favor, realizá la transferencia a los datos indicados en el portal y luego notificá el pago desde allí.');
                                    setShowPayModal(false);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-canvas-200 hover:border-canvas-300 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-canvas-200 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-warm-800">Transferencia bancaria</span>
                                </div>
                                <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <p className="mt-6 text-xs text-warm-400 text-center">
                            Al pagar, aceptás los términos y condiciones del servicio.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
