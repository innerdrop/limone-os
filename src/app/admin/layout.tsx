import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

import { prisma } from '@/lib/prisma'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login?callbackUrl=/admin')
    }

    // Solo admins pueden acceder
    if (session.user.role !== 'ADMIN' && session.user.role !== 'DOCENTE') {
        redirect('/portal')
    }

    // Check maintenance mode for warning banner
    const config = await prisma.configuracion.findUnique({
        where: { clave: 'mantenimiento_activado' }
    })
    const isMaintenance = config?.valor === 'true'

    return (
        <div className="min-h-screen bg-warm-50">
            {/* Maintenance Warning Banner */}
            {isMaintenance && (
                <div className="bg-amber-500 text-white py-2 text-center text-sm font-bold sticky top-0 z-[60] shadow-md">
                    ⚠️ MODO MANTENIMIENTO ACTIVO - El sitio es inaccesible para los alumnos
                </div>
            )}

            {/* Sidebar */}
            <AdminSidebar user={session.user} />

            {/* Main Content */}
            <div className="lg:pl-72">
                <AdminHeader user={session.user} />
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
