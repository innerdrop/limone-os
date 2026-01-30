'use client'

import { useState, FormEvent } from 'react'

interface FormData {
    nombre: string
    email: string
    telefono: string
    motivo: string
    mensaje: string
}

export default function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        email: '',
        telefono: '',
        motivo: '',
        mensaje: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')
        setErrorMessage('')

        try {
            const res = await fetch('/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al enviar')
            }

            setSubmitStatus('success')
            setFormData({ nombre: '', email: '', telefono: '', motivo: '', mensaje: '' })
        } catch (error) {
            setSubmitStatus('error')
            setErrorMessage(error instanceof Error ? error.message : 'Error al enviar el mensaje')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitStatus === 'success') {
        return (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">¡Mensaje Enviado!</h3>
                <p className="text-green-600 mb-4">
                    Te enviamos un correo de confirmación. Te responderemos a la brevedad.
                </p>
                <button
                    onClick={() => setSubmitStatus('idle')}
                    className="text-green-700 underline hover:no-underline"
                >
                    Enviar otra consulta
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    {errorMessage}
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="label">Nombre *</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Tu nombre"
                        required
                    />
                </div>
                <div>
                    <label className="label">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="tu@email.com"
                        required
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="label">Teléfono (opcional)</label>
                    <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+54 9 2901 ..."
                    />
                </div>
                <div>
                    <label className="label">¿De qué se trata tu consulta?</label>
                    <select
                        name="motivo"
                        value={formData.motivo}
                        onChange={handleChange}
                        className="input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10"
                    >
                        <option value="">Seleccionar una opción</option>
                        <option value="inscripciones">Inscripciones y Registro</option>
                        <option value="horarios">Horarios y Vacantes</option>
                        <option value="materiales">Materiales e Insumos</option>
                        <option value="pagos">Costos y Medios de Pago</option>
                        <option value="otro">Otras consultas</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="label">Mensaje *</label>
                <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="input-field min-h-[120px] resize-none"
                    placeholder="Contanos en qué podemos ayudarte..."
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                    </span>
                ) : 'Enviar mensaje'}
            </button>
        </form>
    )
}
