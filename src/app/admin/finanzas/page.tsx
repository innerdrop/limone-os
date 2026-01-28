import prisma from '@/lib/prisma'
import { startOfMonth, subMonths, format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import RegistrarPagoManual from '@/components/admin/RegistrarPagoManual'
import GenerateInvoiceButton from '@/components/admin/GenerateInvoiceButton'
import ConfirmarPagoButton from '@/components/admin/ConfirmarPagoButton'

export default async function FinanzasPage(props: {
    searchParams: Promise<{ busqueda?: string, estado?: string, mes?: string }>
}) {
    const searchParams = await props.searchParams
    const busqueda = searchParams.busqueda || ''
    const estado = searchParams.estado || ''

    const now = new Date()
    const monthStart = startOfMonth(now)

    // 1. Fetch Stats & Pagos with filters
    const [pagosMes, todosPagos, morososRaw] = await Promise.all([
        prisma.pago.aggregate({
            _sum: { monto: true },
            where: {
                OR: [
                    { estado: 'APROBADO' },
                    { estado: 'CONFIRMADO' }
                ],
                fechaPago: { gte: monthStart }
            }
        }),
        prisma.pago.findMany({
            where: {
                AND: [
                    busqueda ? {
                        alumno: {
                            usuario: {
                                nombre: { contains: busqueda }
                            }
                        }
                    } : {},
                    estado ? { estado: estado as any } : {}
                ]
            },
            include: { alumno: { include: { usuario: true } } },
            orderBy: { fechaPago: 'desc' }
        }),
        // UNIFICADO: Buscar directamente los registros de PAGO pendientes
        prisma.pago.findMany({
            where: {
                estado: 'PENDIENTE'
            },
            include: {
                alumno: { include: { usuario: true } },
                inscripcion: { include: { taller: true } }
            },
            orderBy: { creadoEn: 'desc' }
        })
    ])

    // Generate last 6 months revenue for chart
    const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(now, 5 - i))
    const ingresosChart = await Promise.all(last6Months.map(async (date: Date) => {
        const start = startOfMonth(date)
        const d_copy = new Date(date)
        d_copy.setMonth(d_copy.getMonth() + 1)
        const end = startOfMonth(d_copy)

        const sum = await prisma.pago.aggregate({
            _sum: { monto: true },
            where: {
                OR: [
                    { estado: 'APROBADO' },
                    { estado: 'CONFIRMADO' }
                ],
                fechaPago: { gte: start, lt: end }
            }
        })
        return {
            mes: format(date, 'MMM', { locale: es }),
            monto: sum._sum.monto || 0
        }
    }))

    const totalMes = pagosMes._sum.monto || 0
    const maxIngreso = Math.max(...ingresosChart.map((i: any) => i.monto), 1)

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
                    <RegistrarPagoManual />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-leaf-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-leaf-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{formatMoney(totalMes)}</p>
                            <p className="text-sm text-warm-500">Ingresos {format(now, 'MMMM', { locale: es })}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6 border-l-4 border-red-400">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">{morososRaw.length}</p>
                            <p className="text-sm text-warm-500">Inscripciones pendientes</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6 border-l-4 border-lemon-400">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-lemon-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-lemon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warm-800">{todosPagos.length}</p>
                            <p className="text-sm text-warm-500">Operaciones filtradas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <form className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            name="busqueda"
                            type="text"
                            placeholder="Buscar por nombre de alumno..."
                            className="input-field"
                            defaultValue={busqueda}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <select name="estado" className="input-field" defaultValue={estado}>
                            <option value="">Todos los Estados</option>
                            <option value="APROBADO">Aprobado</option>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="RECHAZADO">Rechazado</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary px-8">
                        Filtrar
                    </button>
                    {(busqueda || estado) && (
                        <Link href="/admin/finanzas" className="btn-outline">
                            Limpiar
                        </Link>
                    )}
                </form>
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* 1. Payments Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-canvas-100">
                            <h2 className="text-lg font-bold text-warm-800">Historial de Pagos</h2>
                            <span className="text-xs text-warm-500 font-medium">Mostrando {todosPagos.length} registros</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-canvas-50">
                                    <tr>
                                        <th className="text-left py-3 px-6 text-sm font-medium text-warm-500 italic">Alumno / Concepto</th>
                                        <th className="text-left py-3 px-6 text-sm font-medium text-warm-500 italic">Fecha</th>
                                        <th className="text-right py-3 px-6 text-sm font-medium text-warm-500 italic">Monto</th>
                                        <th className="text-center py-3 px-6 text-sm font-medium text-warm-500 italic">Estado</th>
                                        <th className="text-center py-3 px-6 text-sm font-medium text-warm-500 italic">Factura</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-canvas-100 italic">
                                    {(todosPagos as any[]).map((pago) => (
                                        <tr key={pago.id} className="hover:bg-canvas-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-warm-800">{pago.alumno?.usuario?.nombre || 'Alumno'}</div>
                                                <div className="text-[10px] text-warm-400 uppercase font-bold tracking-tight">{pago.concepto || 'Cuota Mensual'}</div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-warm-500">
                                                {format(pago.fechaPago as Date, 'dd/MM/yyyy HH:mm')}
                                            </td>
                                            <td className="py-4 px-6 text-right font-bold text-leaf-700">
                                                {formatMoney(pago.monto as number)}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${(pago.estado === 'APROBADO' || pago.estado === 'CONFIRMADO')
                                                    ? 'bg-green-100 text-green-700' :
                                                    pago.estado === 'RECHAZADO' ? 'bg-red-100 text-red-700' :
                                                        pago.estado === 'PENDIENTE_VERIFICACION' ? 'bg-amber-100 text-amber-700 animate-pulse border border-amber-300' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {pago.estado === 'PENDIENTE_VERIFICACION' ? 'VERIFICAR' : pago.estado}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center space-y-2">
                                                {(pago.estado === 'APROBADO' || pago.estado === 'CONFIRMADO') ? (
                                                    <GenerateInvoiceButton
                                                        pagoId={pago.id}
                                                        hasInvoice={!!(pago as any).cae}
                                                        invoiceUrl={(pago as any).comprobantePdf}
                                                    />
                                                ) : (
                                                    <ConfirmarPagoButton
                                                        pagoId={pago.id}
                                                        isWaitingVerification={pago.estado === 'PENDIENTE_VERIFICACION'}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {todosPagos.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-warm-400">
                                                No se encontraron pagos con los filtros aplicados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 2. Side Panel: Morosos/Pending */}
                <div className="space-y-6">
                    <div className="card border-l-4 border-red-500">
                        <div className="p-6 border-b border-canvas-100">
                            <h2 className="text-lg font-bold text-warm-800 flex items-center justify-between">
                                Pagos Pendientes
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">{morososRaw.length}</span>
                            </h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {morososRaw.length > 0 ? (morososRaw as any[]).map((pagoRegistro) => {
                                const isWaiting = pagoRegistro.estado === 'PENDIENTE_VERIFICACION'
                                return (
                                    <div key={pagoRegistro.id} className={`flex flex-col p-3 rounded-lg border-2 transition-colors group italic ${isWaiting ? 'bg-amber-50 border-amber-300 animate-pulse' : 'bg-red-50 border-transparent hover:bg-red-100'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-warm-800">{pagoRegistro.alumno.usuario.nombre}</span>
                                            <span className={`${isWaiting ? 'text-amber-600' : 'text-red-600'} font-bold`}>{formatMoney(pagoRegistro.monto)}</span>
                                        </div>
                                        <div className="text-[10px] text-warm-500 uppercase font-bold">
                                            {pagoRegistro.concepto || `${pagoRegistro.inscripcion.taller.nombre} - ${pagoRegistro.inscripcion.dia}`}
                                        </div>
                                        {isWaiting && (
                                            <div className="mt-2 pt-2 border-t border-amber-200">
                                                <ConfirmarPagoButton pagoId={pagoRegistro.id} isWaitingVerification={true} />
                                            </div>
                                        )}
                                    </div>
                                )
                            }) : (
                                <p className="text-center py-6 text-warm-400">Todo al día ✨</p>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="p-6 border-b border-canvas-100 italic">
                            <h2 className="text-lg font-bold text-warm-800">Recaudación Mensual</h2>
                        </div>
                        <div className="p-6 flex items-end justify-between gap-2 h-32 px-4 italic">
                            {ingresosChart.map((item, index) => (
                                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                                    <div
                                        className="w-full bg-leaf-500 rounded-t transition-all hover:bg-leaf-600"
                                        style={{ height: `${(item.monto / maxIngreso) * 100}%` }}
                                    />
                                    <span className="text-[10px] text-warm-500 uppercase font-medium">{item.mes}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
