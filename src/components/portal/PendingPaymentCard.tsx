'use client'

interface PendingPaymentCardProps {
    inscripcion: {
        id: string
        taller: { nombre: string }
        dia: string
        horario: string
        fase: string
        asiento: number | string
        studentName?: string
        pagos: Array<{
            id: string
            monto: number
            estado: string
        }>
    }
}

export default function PendingPaymentCard({ inscripcion }: PendingPaymentCardProps) {
    const pendingPayment = inscripcion.pagos.find(p => p.estado === 'PENDIENTE')

    if (!pendingPayment) return null

    return (
        <div className="card overflow-hidden border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 p-0">
            {/* Header / Top Strip */}
            <div className="bg-yellow-100/50 px-6 py-3 flex items-center justify-between border-b border-yellow-200">
                <div className="flex items-center gap-3">
                    <span className="text-xl">⏳</span>
                    <div>
                        <h3 className="font-bold text-warm-800 text-sm">Pago Pendiente</h3>
                        <p className="text-[10px] text-warm-500 uppercase tracking-wider font-bold">Esperando confirmación</p>
                    </div>
                </div>
                {inscripcion.studentName && (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-warm-400 uppercase font-black mb-0.5">Alumno:</span>
                        <span className="text-xs font-black bg-white text-yellow-700 px-3 py-1 rounded-lg border border-yellow-200 shadow-sm">
                            {inscripcion.studentName}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Enrollment Info */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-[10px] font-black text-warm-400 uppercase tracking-widest">Detalles del Taller</h4>
                            <p className="text-lg font-serif font-black text-warm-900 leading-tight">
                                {inscripcion.fase.includes('Verano') || (inscripcion.taller.nombre.includes('Verano'))
                                    ? 'Taller de Verano'
                                    : inscripcion.taller.nombre}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/50 p-2.5 rounded-xl border border-warm-100">
                                <p className="text-[10px] font-bold text-warm-400 uppercase">Día y Horario</p>
                                <p className="text-xs font-bold text-warm-800">{inscripcion.dia}, {inscripcion.horario}</p>
                            </div>
                            {!inscripcion.fase.includes('Verano') && (
                                <div className="bg-white/50 p-2.5 rounded-xl border border-warm-100">
                                    <p className="text-[10px] font-bold text-warm-400 uppercase">Asiento</p>
                                    <p className="text-xs font-bold text-warm-800">A{inscripcion.asiento}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-2 border-t border-yellow-200/50">
                            <div>
                                <p className="text-[10px] font-black text-yellow-600 uppercase">Total a pagar</p>
                                <p className="text-3xl font-black text-warm-900">${pendingPayment.monto.toLocaleString('es-AR')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Bank Data */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-yellow-200/60 shadow-inner space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h4 className="text-xs font-black text-warm-800 uppercase tracking-tight">Datos para transferencia</h4>
                        </div>

                        <div className="grid gap-3">
                            <div className="flex justify-between items-center group cursor-copy" onClick={() => { navigator.clipboard.writeText('0000003100010234567890'); alert('CBU Copiado'); }}>
                                <span className="text-[10px] font-bold text-warm-500 uppercase">CBU</span>
                                <span className="font-mono text-sm font-bold text-warm-800 bg-white px-2 py-0.5 rounded border border-warm-100 group-hover:border-yellow-400 transition-colors">0000003100010234567890</span>
                            </div>
                            <div className="flex justify-between items-center group cursor-copy" onClick={() => { navigator.clipboard.writeText('taller.limone.arte'); alert('Alias Copiado'); }}>
                                <span className="text-[10px] font-bold text-warm-500 uppercase">Alias</span>
                                <span className="font-mono text-sm font-bold text-warm-800 bg-white px-2 py-0.5 rounded border border-warm-100 group-hover:border-yellow-400 transition-colors">taller.limone.arte</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-warm-500 uppercase">Titular</span>
                                <span className="text-sm font-bold text-warm-800">Natalia Fusari</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer and Button */}
                <div className="mt-8 pt-6 border-t border-yellow-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-md">
                        <div className="flex gap-3 text-blue-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100 items-start">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-[11px] leading-relaxed">
                                Natalia confirmará tu pago y tu inscripción se activará automáticamente. Tus clases aparecerán en el calendario.
                            </p>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        {pendingPayment.estado === 'PENDIENTE_VERIFICACION' ? (
                            <div className="flex items-center gap-2 py-4 px-8 bg-green-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-green-200 animate-pulse">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                AVISO ENVIADO
                            </div>
                        ) : (
                            <button
                                onClick={async () => {
                                    if (!confirm('¿Ya realizaste la transferencia bancaria? Esto avisará a Natalia para que verifique tu pago.')) return
                                    try {
                                        const btn = document.getElementById(`btn-pago-${pendingPayment.id}`) as HTMLButtonElement
                                        if (btn) btn.disabled = true
                                        const res = await fetch(`/api/portal/pagos/${pendingPayment.id}/notificar`, { method: 'POST' })
                                        if (res.ok) window.location.reload()
                                        else {
                                            alert('Error al enviar el aviso.')
                                            if (btn) btn.disabled = false
                                        }
                                    } catch (err) { alert('Error de conexión.') }
                                }}
                                id={`btn-pago-${pendingPayment.id}`}
                                className="group relative py-4 px-10 bg-warm-900 text-white font-black rounded-2xl shadow-xl shadow-warm-200 hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-3 overflow-hidden"
                            >
                                <span className="text-xl group-hover:rotate-12 transition-transform">💳</span>
                                <span className="tracking-widest">YA PAGUÉ</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
