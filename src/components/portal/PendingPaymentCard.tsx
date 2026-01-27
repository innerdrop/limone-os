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
        <div className="card border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                        <span className="text-2xl">⏳</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-warm-800">Pago Pendiente</h3>
                        <p className="text-xs text-warm-500">Esperando confirmación</p>
                    </div>
                </div>
                {inscripcion.studentName && (
                    <span className="text-xs font-bold bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full border border-yellow-300">
                        {inscripcion.studentName}
                    </span>
                )}
            </div>

            {/* Enrollment Details */}
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl mb-4 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-warm-600">Taller:</span>
                    <span className="font-semibold text-warm-800">{(inscripcion.fase === 'Taller de Verano' || inscripcion.fase === 'Colonia de Verano') ? 'Taller de Verano' : inscripcion.taller.nombre}</span>
                </div>
                {inscripcion.fase === 'Taller de Verano' || inscripcion.dia === 'VERANO' ? (
                    <>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-600">Tipo:</span>
                            <span className="font-semibold text-warm-800">Intensivo de Verano</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-600">Horario:</span>
                            <span className="font-semibold text-warm-800">17:00hs</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-600">Fase:</span>
                            <span className="font-semibold text-warm-800">{inscripcion.fase}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-600">Día:</span>
                            <span className="font-semibold text-warm-800">{inscripcion.dia}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-600">Horario:</span>
                            <span className="font-semibold text-warm-800">{inscripcion.horario}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-600">Asiento:</span>
                            <span className="font-semibold text-warm-800">A{inscripcion.asiento}</span>
                        </div>
                    </>
                )}
                <div className="pt-2 mt-2 border-t border-warm-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-warm-700">Total a pagar:</span>
                    <span className="text-2xl font-black text-warm-900">${pendingPayment.monto.toLocaleString('es-AR')}</span>
                </div>
            </div>

            {/* Transfer Instructions */}
            <div className="bg-white p-4 rounded-xl border-2 border-yellow-200 shadow-inner">
                <h4 className="font-bold text-warm-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Datos para transferencia
                </h4>
                <div className="space-y-3">
                    <div className="bg-warm-50 p-3 rounded-lg">
                        <p className="text-xs text-warm-500 mb-1">CBU</p>
                        <p className="font-mono font-bold text-warm-800 text-sm">0000003100010234567890</p>
                    </div>
                    <div className="bg-warm-50 p-3 rounded-lg">
                        <p className="text-xs text-warm-500 mb-1">Alias</p>
                        <p className="font-mono font-bold text-warm-800">taller.limone.arte</p>
                    </div>
                    <div className="bg-warm-50 p-3 rounded-lg">
                        <p className="text-xs text-warm-500 mb-1">Titular</p>
                        <p className="font-bold text-warm-800">Natalia Fusari</p>
                    </div>
                </div>
            </div>

            {/* Footer Note and Action */}
            <div className="mt-4 space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Una vez realizada la transferencia, Natalia confirmará tu pago y tu inscripción quedará activa. Tus clases aparecerán en el calendario.</span>
                    </p>
                </div>

                {pendingPayment.estado === 'PENDIENTE_VERIFICACION' ? (
                    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-bold text-sm italic">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Aviso enviado. Natalia verificará tu transferencia pronto.
                    </div>
                ) : (
                    <button
                        onClick={async () => {
                            if (!confirm('¿Ya realizaste la transferencia bancaria? Esto avisará a Natalia para que verifique tu pago.')) return

                            try {
                                const btn = document.getElementById(`btn-pago-${pendingPayment.id}`) as HTMLButtonElement
                                if (btn) btn.disabled = true

                                const res = await fetch(`/api/portal/pagos/${pendingPayment.id}/notificar`, { method: 'POST' })
                                if (res.ok) {
                                    window.location.reload()
                                } else {
                                    alert('Error al enviar el aviso. Intentalo de nuevo.')
                                    if (btn) btn.disabled = false
                                }
                            } catch (err) {
                                alert('Error de conexión.')
                            }
                        }}
                        id={`btn-pago-${pendingPayment.id}`}
                        className="w-full py-4 bg-warm-900 text-white font-black rounded-2xl shadow-xl hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">💳</span>
                        YA PAGUÉ
                    </button>
                )}
            </div>
        </div>
    )
}
