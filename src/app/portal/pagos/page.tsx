'use client'

import { useState } from 'react'
import Link from 'next/link'

// Pagos de ejemplo (en producción vendrían de la BD)
const pagosEjemplo = [
    {
        id: 1,
        concepto: 'Cuota Diciembre 2024',
        monto: 25000,
        fecha: '5 Dic 2024',
        estado: 'aprobado',
        comprobante: true,
    },
    {
        id: 2,
        concepto: 'Cuota Noviembre 2024',
        monto: 25000,
        fecha: '3 Nov 2024',
        estado: 'aprobado',
        comprobante: true,
    },
    {
        id: 3,
        concepto: 'Cuota Octubre 2024',
        monto: 23000,
        fecha: '4 Oct 2024',
        estado: 'aprobado',
        comprobante: true,
    },
    {
        id: 4,
        concepto: 'Cuota Enero 2025',
        monto: 28000,
        fecha: null,
        estado: 'pendiente',
        comprobante: false,
    },
]

export default function PagosPage() {
    const [showPayModal, setShowPayModal] = useState(false)

    const cuotaPendiente = pagosEjemplo.find(p => p.estado === 'pendiente')
    const pagosAprobados = pagosEjemplo.filter(p => p.estado === 'aprobado')
    const totalPagado = pagosAprobados.reduce((sum, p) => sum + p.monto, 0)

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(amount)
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
                            <p className="text-2xl font-bold text-warm-800">{cuotaPendiente ? 1 : 0}</p>
                            <p className="text-sm text-warm-500">Cuotas pendientes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            <div className="card">
                <h2 className="text-lg font-semibold text-warm-800 mb-4">Historial de Pagos</h2>

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
                            {pagosEjemplo.map((pago) => (
                                <tr key={pago.id} className="border-b border-canvas-100 hover:bg-canvas-50">
                                    <td className="py-4 px-4">
                                        <span className="font-medium text-warm-800">{pago.concepto}</span>
                                    </td>
                                    <td className="py-4 px-4 text-warm-500">
                                        {pago.fecha || '-'}
                                    </td>
                                    <td className="py-4 px-4 text-right font-semibold text-warm-800">
                                        {formatMoney(pago.monto)}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`badge ${pago.estado === 'aprobado'
                                                ? 'badge-success'
                                                : pago.estado === 'pendiente'
                                                    ? 'badge-warning'
                                                    : 'badge-error'
                                            }`}>
                                            {pago.estado === 'aprobado' ? 'Pagado' :
                                                pago.estado === 'pendiente' ? 'Pendiente' : 'Rechazado'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        {pago.comprobante ? (
                                            <button className="inline-flex items-center gap-1 text-sm text-lemon-600 hover:text-lemon-700 font-medium">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Comprobante
                                            </button>
                                        ) : pago.estado === 'pendiente' ? (
                                            <button
                                                onClick={() => setShowPayModal(true)}
                                                className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                Pagar
                                            </button>
                                        ) : (
                                            <span className="text-warm-400 text-sm">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

                            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-canvas-200 hover:border-canvas-300 transition-colors">
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
