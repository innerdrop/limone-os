'use client'

import { useState } from 'react'

interface FAQItem {
    question: string
    answer: string
}

const faqs: FAQItem[] = [
    {
        question: "¿Cómo me inscribo a un taller?",
        answer: "¡Es muy fácil! Primero debés registrarte en nuestro Portal de Alumnos. Una vez que tengas tu cuenta, podrás ver todos los talleres disponibles, elegir el horario que más te convenga y completar la inscripción de forma 100% online."
    },
    {
        question: "¿Cuáles son los horarios de las clases?",
        answer: "Nuestras clases se dictan de martes a viernes, en el turno tarde entre las 16:00 y las 20:30 hs. La disponibilidad específica de cada taller la podés consultar directamente en el portal al momento de inscribirte."
    },
    {
        question: "¿Qué materiales necesito llevar?",
        answer: "¡No necesitás traer nada! En Taller Limoné todos los materiales básicos están incluidos: desde pinceles y pinturas hasta bastidores y papeles especiales. Solo traé tus ganas de crear."
    },
    {
        question: "¿Para qué edades están dirigidos los talleres?",
        answer: "Actualmente ofrecemos talleres para niños y adolescentes de entre 7 y 15 años. Trabajamos en grupos reducidos para brindar una atención personalizada que se adapte al ritmo de cada alumno."
    },
    {
        question: "¿Qué puedo hacer desde el Portal de Alumnos?",
        answer: "Una vez que ingreses con tu cuenta, podrás gestionar tus inscripciones, ver el calendario actualizado con tus días y horarios, descargar cupones de pago, subir comprobantes y recibir notificaciones importantes del taller."
    },
    {
        question: "¿Tienen clases para adultos?",
        answer: "Por el momento nuestro foco principal son los niños y adolescentes, pero siempre estamos evaluando nuevas propuestas. Te recomendamos seguirnos en Instagram para enterarte de futuros workshops especiales para adultos."
    }
]

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold text-brand-charcoal mb-6 flex items-center gap-2">
                <span className="text-brand-yellow">💡</span> Preguntas Frecuentes
            </h3>
            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`border border-canvas-200 rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'bg-lemon-50/50 border-lemon-200 shadow-sm' : 'bg-white'
                            }`}
                    >
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-canvas-50 transition-colors"
                        >
                            <span className={`font-semibold text-lg ${activeIndex === index ? 'text-brand-charcoal' : 'text-warm-700'}`}>
                                {faq.question}
                            </span>
                            <span className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-brand-orange' : 'text-warm-400'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                        <div
                            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-48 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                                }`}
                        >
                            <p className="text-warm-600 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl">
                <p className="text-brand-purple font-medium flex items-center gap-2">
                    <span>✨</span> ¿Tenés otra duda?
                </p>
                <p className="text-sm text-warm-500 mt-1">
                    Si tu consulta no está aquí, completá el formulario y te responderemos lo antes posible.
                </p>
            </div>
        </div>
    )
}
