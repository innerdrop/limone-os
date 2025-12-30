'use client'

import { useState, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'

interface ProfileCompletionModalProps {
    isOpen: boolean
    onClose: () => void
    onComplete: () => void
}

interface EmergencyContact {
    nombre: string
    telefono: string
    relacion: string
}

interface HealthInfo {
    obraSocial: string
    numeroAfiliado: string
    hospitalReferencia: string
    alergias: string
    medicacionHabitual: string
    condicionesMedicas: string
    restriccionesFisicas: string
}

interface Authorizations {
    participacion: boolean
    medica: boolean
    retiro: string
    imagenes: boolean
    reglamento: boolean
    aclaracion: string
    dni: string
}

interface PaymentInfo {
    planPago: string
    formaPago: string
}

export default function ProfileCompletionModal({ isOpen, onClose, onComplete }: ProfileCompletionModalProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const signatureRef = useRef<SignatureCanvas>(null)
    const paymentSignatureRef = useRef<SignatureCanvas>(null)

    const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
        nombre: '',
        telefono: '',
        relacion: ''
    })

    const [healthInfo, setHealthInfo] = useState<HealthInfo>({
        obraSocial: '',
        numeroAfiliado: '',
        hospitalReferencia: '',
        alergias: '',
        medicacionHabitual: '',
        condicionesMedicas: '',
        restriccionesFisicas: ''
    })

    const [authorizations, setAuthorizations] = useState<Authorizations>({
        participacion: false,
        medica: false,
        retiro: '',
        imagenes: false,
        reglamento: false,
        aclaracion: '',
        dni: ''
    })

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        planPago: '',
        formaPago: ''
    })

    if (!isOpen) return null

    const handleNext = () => {
        // Validate current step
        if (step === 1) {
            if (!emergencyContact.nombre || !emergencyContact.telefono || !emergencyContact.relacion) {
                setError('Por favor completá todos los campos de contacto de emergencia')
                return
            }
        } else if (step === 2) {
            if (!healthInfo.obraSocial || !healthInfo.hospitalReferencia) {
                setError('Por favor completá los campos obligatorios de salud')
                return
            }
        } else if (step === 3) {
            if (!authorizations.participacion || !authorizations.medica || !authorizations.reglamento) {
                setError('Debés aceptar todas las autorizaciones obligatorias')
                return
            }
            if (!authorizations.aclaracion || !authorizations.dni) {
                setError('Por favor completá la firma con aclaración y DNI')
                return
            }
            if (signatureRef.current?.isEmpty()) {
                setError('Por favor firmá el documento')
                return
            }
        }

        setError('')
        setStep(step + 1)
    }

    const handlePrevious = () => {
        setStep(step - 1)
        setError('')
    }

    const handleSubmit = async () => {
        if (!paymentInfo.planPago || !paymentInfo.formaPago) {
            setError('Por favor completá la información de pago')
            return
        }

        if (paymentSignatureRef.current?.isEmpty()) {
            setError('Por favor firmá la conformidad')
            return
        }

        setLoading(true)
        setError('')

        try {
            const firmaResponsable = signatureRef.current?.toDataURL()
            const firmaConformidad = paymentSignatureRef.current?.toDataURL()

            const response = await fetch('/api/perfil/completar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emergencyContact,
                    healthInfo,
                    authorizations: {
                        ...authorizations,
                        firma: firmaResponsable
                    },
                    paymentInfo: {
                        ...paymentInfo,
                        firma: firmaConformidad
                    }
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al completar el perfil')
            }

            onComplete()
        } catch (err: any) {
            setError(err.message || 'Error al completar el perfil')
        } finally {
            setLoading(false)
        }
    }

    const clearSignature = () => {
        signatureRef.current?.clear()
    }

    const clearPaymentSignature = () => {
        paymentSignatureRef.current?.clear()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-canvas-200">
                    <h2 className="text-2xl font-bold text-warm-800">
                        Completar Perfil
                    </h2>
                    <p className="text-warm-600 mt-1">
                        Para acceder al portal, necesitamos información adicional
                    </p>
                </div>

                <div className="p-6">
                    {/* Progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-warm-600">Paso {step} de 4</span>
                            <span className="text-warm-600">{Math.round((step / 4) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-canvas-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-lemon-500 transition-all duration-300"
                                style={{ width: `${(step / 4) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Step 1: Emergency Contact */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-warm-800 mb-4">
                                🚨 Contacto de Emergencia
                            </h3>

                            <div>
                                <label className="label">Nombre y Apellido *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={emergencyContact.nombre}
                                    onChange={(e) => setEmergencyContact({ ...emergencyContact, nombre: e.target.value })}
                                    placeholder="Pedro Martínez"
                                />
                            </div>

                            <div>
                                <label className="label">Teléfono *</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={emergencyContact.telefono}
                                    onChange={(e) => setEmergencyContact({ ...emergencyContact, telefono: e.target.value })}
                                    placeholder="+54 9 2901 123456"
                                />
                            </div>

                            <div>
                                <label className="label">Relación con el menor *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={emergencyContact.relacion}
                                    onChange={(e) => setEmergencyContact({ ...emergencyContact, relacion: e.target.value })}
                                    placeholder="Tío, Abuelo, etc."
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Health Information */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-warm-800 mb-4">
                                🏥 Información de Salud
                            </h3>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Obra Social / Prepaga *</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={healthInfo.obraSocial}
                                        onChange={(e) => setHealthInfo({ ...healthInfo, obraSocial: e.target.value })}
                                        placeholder="OSDE, Swiss Medical, etc."
                                    />
                                </div>
                                <div>
                                    <label className="label">Nº de Afiliado</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={healthInfo.numeroAfiliado}
                                        onChange={(e) => setHealthInfo({ ...healthInfo, numeroAfiliado: e.target.value })}
                                        placeholder="123456789"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Hospital de Referencia *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={healthInfo.hospitalReferencia}
                                    onChange={(e) => setHealthInfo({ ...healthInfo, hospitalReferencia: e.target.value })}
                                    placeholder="Hospital Regional Ushuaia"
                                />
                            </div>

                            <div>
                                <label className="label">Alergias</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    value={healthInfo.alergias}
                                    onChange={(e) => setHealthInfo({ ...healthInfo, alergias: e.target.value })}
                                    placeholder="Detallá cualquier alergia conocida"
                                />
                            </div>

                            <div>
                                <label className="label">Medicación Habitual</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    value={healthInfo.medicacionHabitual}
                                    onChange={(e) => setHealthInfo({ ...healthInfo, medicacionHabitual: e.target.value })}
                                    placeholder="Medicamentos que toma regularmente"
                                />
                            </div>

                            <div>
                                <label className="label">Condiciones Médicas Relevantes</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    value={healthInfo.condicionesMedicas}
                                    onChange={(e) => setHealthInfo({ ...healthInfo, condicionesMedicas: e.target.value })}
                                    placeholder="Diabetes, asma, epilepsia, etc."
                                />
                            </div>

                            <div>
                                <label className="label">Restricciones Físicas</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    value={healthInfo.restriccionesFisicas}
                                    onChange={(e) => setHealthInfo({ ...healthInfo, restriccionesFisicas: e.target.value })}
                                    placeholder="Cualquier limitación física que debamos conocer"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Authorizations */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-warm-800 mb-4">
                                📝 Autorizaciones Obligatorias
                            </h3>

                            <div className="space-y-3">
                                <label className="flex items-start gap-3 p-3 rounded-xl border border-canvas-200 hover:bg-canvas-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={authorizations.participacion}
                                        onChange={(e) => setAuthorizations({ ...authorizations, participacion: e.target.checked })}
                                    />
                                    <span className="text-warm-700">
                                        Autorizo la participación del menor en las actividades del taller *
                                    </span>
                                </label>

                                <label className="flex items-start gap-3 p-3 rounded-xl border border-canvas-200 hover:bg-canvas-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={authorizations.medica}
                                        onChange={(e) => setAuthorizations({ ...authorizations, medica: e.target.checked })}
                                    />
                                    <span className="text-warm-700">
                                        Autorizo a recibir atención médica de emergencia en caso de ser necesario *
                                    </span>
                                </label>

                                <label className="flex items-start gap-3 p-3 rounded-xl border border-canvas-200 hover:bg-canvas-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={authorizations.imagenes}
                                        onChange={(e) => setAuthorizations({ ...authorizations, imagenes: e.target.checked })}
                                    />
                                    <span className="text-warm-700">
                                        Autorizo el uso de imágenes (fotos/videos) del menor con fines educativos y de difusión del taller
                                    </span>
                                </label>

                                <label className="flex items-start gap-3 p-3 rounded-xl border border-canvas-200 hover:bg-canvas-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={authorizations.reglamento}
                                        onChange={(e) => setAuthorizations({ ...authorizations, reglamento: e.target.checked })}
                                    />
                                    <span className="text-warm-700">
                                        Acepto el reglamento interno del taller *
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label className="label">Personas autorizadas para retirar al menor</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    value={authorizations.retiro}
                                    onChange={(e) => setAuthorizations({ ...authorizations, retiro: e.target.value })}
                                    placeholder="Nombre completo y DNI de cada persona autorizada"
                                />
                            </div>

                            <div className="border-t border-canvas-200 pt-4 mt-6">
                                <h4 className="font-semibold text-warm-800 mb-4">Firma del Responsable</h4>

                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="label">Aclaración *</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={authorizations.aclaracion}
                                            onChange={(e) => setAuthorizations({ ...authorizations, aclaracion: e.target.value })}
                                            placeholder="Nombre completo"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">DNI *</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={authorizations.dni}
                                            onChange={(e) => setAuthorizations({ ...authorizations, dni: e.target.value })}
                                            placeholder="12345678"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Firma *</label>
                                    <div className="border-2 border-canvas-300 rounded-xl overflow-hidden bg-white">
                                        <SignatureCanvas
                                            ref={signatureRef}
                                            canvasProps={{
                                                className: 'w-full h-40'
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="text-sm text-lemon-600 hover:text-lemon-700 mt-2"
                                    >
                                        Limpiar firma
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment Information */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-warm-800 mb-4">
                                💳 Información Administrativa
                            </h3>

                            <div>
                                <label className="label">Plan de Pago / Arancel *</label>
                                <select
                                    className="input-field"
                                    value={paymentInfo.planPago}
                                    onChange={(e) => setPaymentInfo({ ...paymentInfo, planPago: e.target.value })}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="mensual">Mensual</option>
                                    <option value="trimestral">Trimestral</option>
                                    <option value="semestral">Semestral</option>
                                    <option value="anual">Anual</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">Forma de Pago *</label>
                                <select
                                    className="input-field"
                                    value={paymentInfo.formaPago}
                                    onChange={(e) => setPaymentInfo({ ...paymentInfo, formaPago: e.target.value })}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="transferencia">Transferencia Bancaria</option>
                                    <option value="mercadopago">Mercado Pago</option>
                                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                                </select>
                            </div>

                            <div className="border-t border-canvas-200 pt-4 mt-6">
                                <h4 className="font-semibold text-warm-800 mb-4">Firma de Conformidad</h4>

                                <div>
                                    <label className="label">Firma *</label>
                                    <div className="border-2 border-canvas-300 rounded-xl overflow-hidden bg-white">
                                        <SignatureCanvas
                                            ref={paymentSignatureRef}
                                            canvasProps={{
                                                className: 'w-full h-40'
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearPaymentSignature}
                                        className="text-sm text-lemon-600 hover:text-lemon-700 mt-2"
                                    >
                                        Limpiar firma
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between gap-4 mt-6 pt-6 border-t border-canvas-200">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="btn-outline"
                            >
                                Anterior
                            </button>
                        )}

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="btn-primary ml-auto"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="btn-primary ml-auto"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Completar Perfil'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
