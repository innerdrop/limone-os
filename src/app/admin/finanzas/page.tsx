'use client'

import { useState } from 'react'

// Datos de ejemplo
const ingresosMensuales = [
    { mes: 'Jul', monto: 850000 },
    { mes: 'Ago', monto: 920000 },
    { mes: 'Sep', monto: 880000 },
    { mes: 'Oct', monto: 1050000 },
    { mes: 'Nov', monto: 1150000 },
    { mes: 'Dic', monto: 1250000 },
]

const morosos = [
    { id: 1, nombre: 'Ana Martínez', email: 'ana@email.com', deudaMeses: 2, montoDeuda: 56000 },
    { id: 2, nombre: 'Roberto Silva', email: 'roberto@email.com', deudaMeses: 1, montoDeuda: 28000 },
    { id: 3, nombre: 'Carmen López', email: 'carmen@email.com', deudaMeses: 1, montoDeuda: 25000 },
]

const pagosRecientes = [
    { id: 1, alumno: 'María García', concepto: 'Cuota Enero', monto: 28000, fecha: '28 Dic', estado: 'aprobado' },
    { id: 2, alumno: 'Carlos Rodríguez', concepto: 'Cuota Enero', monto: 25000, fecha: '27 Dic', estado: 'aprobado' },
    { id: 3, alumno: 'Lucía Fernández', concepto: 'Cuota Enero', monto: 22000, fecha: '26 Dic', estado: 'pendiente' },
    { id: 4, alumno: 'Pedro Gómez', concepto: 'Cuota Enero', monto: 28000, fecha: '25 Dic', estado: 'aprobado' },
]

export default function FinanzasPage() {
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState('6m')

    const totalMes = 1250000
    const totalDeuda = morosos.reduce((sum, m) => sum + m.montoDeuda, 0)
    const maxIngreso = Math.max(...ingresosMensuales.map(i => i.monto))

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
                        Módulo Financiero
                    </h1>
                    <p className="text-warm-500 mt-1">
                        Ingresos, pagos y reportes de facturación
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-outline">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Exportar
                    </button>
                    <button className="btn-primary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Registrar Pago
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-leaf-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-leaf-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{formatMoney(totalMes)}</p>
                            <p className="text-sm text-warm-500">Ingresos del mes</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-lemon-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">39</p>
                            <p className="text-sm text-warm-500">Cuotas al día</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">{morosos.length}</p>
                            <p className="text-sm text-warm-500">Morosos</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-600">{formatMoney(totalDeuda)}</p>
                            <p className="text-sm text-warm-500">Deuda total</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-warm-800">Ingresos Mensuales</h2>
                        <select
                            value={periodoSeleccionado}
                            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                            className="input-field py-1.5 px-3 w-auto text-sm"
                        >
                            <option value="6m">Últimos 6 meses</option>
                            <option value="12m">Último año</option>
                        </select>
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="flex items-end justify-between gap-2 h-48 px-4">
                        {ingresosMensuales.map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                <div
                                    className="w-full bg-leaf-500 rounded-t-lg transition-all hover:bg-leaf-600"
                                    style={{ height: `${(item.monto / maxIngreso) * 100}%` }}
                                />
                                <span className="text-xs text-warm-500">{item.mes}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Morosos */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-warm-800">Alumnos Morosos</h2>
                        <span className="badge badge-error">{morosos.length} pendientes</span>
                    </div>

                    <div className="space-y-3">
                        {morosos.map((moroso) => (
                            <div key={moroso.id} className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center">
                                        <span className="text-red-700 font-semibold">{moroso.nombre.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-warm-800">{moroso.nombre}</p>
                                        <p className="text-sm text-warm-500">{moroso.deudaMeses} mes(es) de deuda</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-600">{formatMoney(moroso.montoDeuda)}</p>
                                    <button className="text-xs text-lemon-600 hover:text-lemon-700 font-medium">
                                        Enviar recordatorio
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-warm-800">Pagos Recientes</h2>
                    <button className="text-sm text-lemon-600 hover:text-lemon-700 font-medium">
                        Ver todos
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-canvas-50">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Alumno</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Concepto</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-warm-500">Fecha</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-warm-500">Monto</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-warm-500">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-canvas-100">
                            {pagosRecientes.map((pago) => (
                                <tr key={pago.id} className="hover:bg-canvas-50">
                                    <td className="py-4 px-4 font-medium text-warm-800">{pago.alumno}</td>
                                    <td className="py-4 px-4 text-warm-600">{pago.concepto}</td>
                                    <td className="py-4 px-4 text-warm-500">{pago.fecha}</td>
                                    <td className="py-4 px-4 text-right font-semibold text-warm-800">
                                        {formatMoney(pago.monto)}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`badge ${pago.estado === 'aprobado' ? 'badge-success' : 'badge-warning'
                                            }`}>
                                            {pago.estado === 'aprobado' ? 'Aprobado' : 'Pendiente'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
