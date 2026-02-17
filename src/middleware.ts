import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    async function middleware(req) {
        const token = req.nextauth.token
        const isAuth = !!token
        const isAuthPage = req.nextUrl.pathname.startsWith("/login")

        // If on login page and authenticated, redirect to role-based dashboard
        if (isAuthPage) {
            if (isAuth) {
                if (token.role === "ADMIN") {
                    return NextResponse.redirect(new URL("/admin", req.url))
                }
                return NextResponse.redirect(new URL("/portal", req.url))
            }
            return null
        }

        // Role-based access control for /admin
        if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/portal", req.url))
        }

        // Role-based access control for /portal
        if (req.nextUrl.pathname.startsWith("/portal") && token?.role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", req.url))
        }

        const requestHeaders = new Headers(req.headers)
        requestHeaders.set('x-url', req.url)
        requestHeaders.set('x-pathname', req.nextUrl.pathname)

        // Robust Maintenance Check in Middleware
        const pathname = req.nextUrl.pathname
        const isExcludedFromMaint =
            pathname.startsWith('/mantenimiento') ||
            pathname.startsWith('/admin') ||
            pathname.startsWith('/api') ||
            pathname.startsWith('/login') ||
            pathname.startsWith('/_next') ||
            pathname.includes('favicon.ico') ||
            /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i.test(pathname)

        if (!isExcludedFromMaint && token?.role !== 'ADMIN') {
            try {
                // Fetch public status from internal API (using absolute URL)
                const maintRes = await fetch(new URL('/api/mantenimiento/status', req.url), {
                    cache: 'no-store'
                })
                if (maintRes.ok) {
                    const { activado } = await maintRes.json()
                    if (activado) {
                        return NextResponse.redirect(new URL('/mantenimiento', req.url))
                    }
                }
            } catch (error) {
                console.error('Error checking maintenance in middleware:', error)
            }
        }

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // If accessing protected routes, require token
                const isProtected = req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/portal")
                if (isProtected) return !!token
                return true
            },
        },
    }
)

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
