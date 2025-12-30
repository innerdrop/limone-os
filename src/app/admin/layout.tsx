import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

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

    return (
        <div className="min-h-screen bg-warm-50">
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
