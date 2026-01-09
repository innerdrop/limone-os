import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import WorkshopEditForm from '@/components/admin/WorkshopEditForm'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function WorkshopEditPage({ params }: PageProps) {
    const { id } = await params

    const taller = await prisma.taller.findUnique({
        where: { id }
    })

    if (!taller) notFound()

    return (
        <div className="max-w-3xl animate-fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-warm-500 mb-6">
                <Link href="/admin/talleres" className="hover:text-lemon-600">Talleres</Link>
                <span>/</span>
                <span className="text-warm-800">Editar Taller</span>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">
                    Editar Taller: {taller.nombre}
                </h1>
                <p className="text-warm-500 mt-1">
                    Modificá los datos generales del taller
                </p>
            </div>

            <WorkshopEditForm taller={taller} />
        </div>
    )
}
