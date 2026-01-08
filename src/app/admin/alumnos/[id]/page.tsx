import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import PrintButton from '@/components/admin/PrintButton'

export default async function AlumnoDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const alumno = await prisma.alumno.findUnique({
        where: { id: params.id },
        include: { usuario: true }
    })

    if (!alumno) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-canvas-50 pb-12 print:bg-white print:pb-0">
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    .card { 
                        border: none !important; 
                        box-shadow: none !important; 
                        padding: 0 !important;
                        margin-bottom: 2rem !important;
                    }
                    body { background: white !important; }
                    .min-h-screen { min-height: 0 !important; padding: 0 !important; }
                    h2 { border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 2rem; }
                }
            `}} />

            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-canvas-200 no-print">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-warm-500 mb-2">
                        <Link href="/admin/alumnos" className="hover:text-warm-800">Alumnos</Link>
                        <span>/</span>
                        <span>Ficha Digital</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-warm-800 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-lemon-200 text-lemon-700 flex items-center justify-center text-lg">
                                {alumno.usuario.nombre.charAt(0)}
                            </span>
                            {alumno.usuario.nombre}
                        </h1>
                        <div className="flex gap-3">
                            <PrintButton />
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${alumno.perfilCompleto ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {alumno.perfilCompleto ? 'Ficha Completa' : 'Incompleta'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print-only Header */}
            <div className="hidden print:block mb-8 text-center border-b-2 border-lemon-500 pb-4">
                <h1 className="text-3xl font-serif font-bold text-warm-800">Taller Limoné</h1>
                <p className="text-warm-500">Ficha de Inscripción del Alumno</p>
                <p className="text-xs text-warm-400 mt-2">Emitido el {new Date().toLocaleDateString('es-AR')}</p>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* 1. Datos del Alumno */}
                <section className="card">
                    <h2 className="text-xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                        <span>👤</span> Datos del Alumno
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="label text-xs uppercase tracking-wide">Nombre Completo</label>
                            <p className="font-medium text-lg">{alumno.usuario.nombre}</p>
                        </div>
                        <div>
                            <label className="label text-xs uppercase tracking-wide">DNI</label>
                            <p className="font-medium text-lg">{alumno.dni || '-'}</p>
                        </div>
                        <div>
                            <label className="label text-xs uppercase tracking-wide">Fecha de Nacimiento</label>
                            <p className="font-medium">{alumno.fechaNacimiento ? new Date(alumno.fechaNacimiento).toLocaleDateString() : '-'}</p>
                        </div>
                        <div>
                            <label className="label text-xs uppercase tracking-wide">Edad</label>
                            <p className="font-medium">{alumno.edad ? `${alumno.edad} años` : '-'}</p>
                        </div>
                        <div>
                            <label className="label text-xs uppercase tracking-wide">Colegio</label>
                            <p className="font-medium">{alumno.colegio || '-'}</p>
                        </div>
                        <div>
                            <label className="label text-xs uppercase tracking-wide">Grado</label>
                            <p className="font-medium">{alumno.grado || '-'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="label text-xs uppercase tracking-wide">Domicilio</label>
                            <p className="font-medium">{alumno.domicilio || '-'}</p>
                        </div>
                    </div>
                </section>

                {/* 2. Datos del Tutor */}
                <section className="card">
                    <h2 className="text-xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                        <span>👨‍👩‍👧</span> Datos del Tutor
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="label text-xs uppercase tracking-wide">Nombre</label>
                            <p className="font-medium text-lg">{alumno.tutorNombre || '-'}</p>
                        </div>
                        <div>
                            <label className="label text-xs uppercase tracking-wide">Relación</label>
                            <p className="font-medium">{alumno.tutorRelacion || '-'}</p>
                        </div>
                        <div>
                            <label className="label text-xs uppercase tracking-wide">DNI</label>
                            <p className="font-medium">{alumno.tutorDni || '-'}</p>
                        </div>
                        <div>
                            <label className="label text-xs uppercase tracking-wide">Profesión</label>
                            <p className="font-medium">{alumno.tutorProfesion || '-'}</p>
                        </div>
                        <div>
                            <label className="label text-xs uppercase tracking-wide">Teléfono Principal</label>
                            <p className="font-medium">{alumno.tutorTelefonoPrincipal || '-'}</p>
                        </div>
                        <div>
                            <label className="label text-xs uppercase tracking-wide">Email</label>
                            <p className="font-medium">{alumno.tutorEmail || '-'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="label text-xs uppercase tracking-wide">Domicilio</label>
                            <p className="font-medium">{alumno.tutorDomicilio || '-'}</p>
                        </div>
                    </div>
                </section>

                {/* 3. Autorizaciones y Firma */}
                <section className="card border-l-4 border-lemon-500">
                    <h2 className="text-xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                        <span>✍️</span> Autorizaciones y Firma
                    </h2>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${alumno.autorizacionParticipacion ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {alumno.autorizacionParticipacion ? '✓' : '✗'}
                            </div>
                            <span className="font-medium">Autorización de Participación</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${alumno.autorizacionMedica ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {alumno.autorizacionMedica ? '✓' : '✗'}
                            </div>
                            <span className="font-medium">Autorización Médica</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${alumno.autorizacionImagenes ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {alumno.autorizacionImagenes ? '✓' : '✗'}
                            </div>
                            <span className="font-medium">Uso de Imagen</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${alumno.aceptacionReglamento ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {alumno.aceptacionReglamento ? '✓' : '✗'}
                            </div>
                            <span className="font-medium">Aceptación de Reglamento</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-canvas-100">
                        <div>
                            <label className="label text-xs uppercase tracking-wide mb-2">Retiro del Alumno</label>
                            <div className="bg-canvas-50 p-4 rounded-lg font-medium">
                                {alumno.autorizacionRetiro === 'SOLO' ? 'Se retira solo/a' :
                                    alumno.autorizacionRetiro === 'NO' ? 'No se retira solo/a (Retiran padres)' :
                                        `Autorizados: ${alumno.autorizacionRetiro}`}
                            </div>
                        </div>

                        <div>
                            <label className="label text-xs uppercase tracking-wide mb-2">Firma del Responsable</label>
                            <div className="border border-canvas-200 rounded-lg p-2 bg-white">
                                {alumno.firmaResponsable ? (
                                    <img src={alumno.firmaResponsable} alt="Firma" className="max-h-32 object-contain" />
                                ) : (
                                    <p className="text-gray-400 text-sm italic p-4">Sin firma digital</p>
                                )}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                <p>Aclaración: {alumno.aclaracionFirma || '-'}</p>
                                <p>DNI: {alumno.dniFirma || '-'}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
