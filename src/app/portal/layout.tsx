import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import PortalSidebar from '@/components/portal/Sidebar'
import PortalHeader from '@/components/portal/Header'

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login?callbackUrl=/portal')
    }

    return (
        <div className="min-h-screen bg-canvas-100">
            {/* Sidebar */}
            <PortalSidebar user={session.user} />

            {/* Main Content */}
            <div className="lg:pl-72">
                <PortalHeader user={session.user} />
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
