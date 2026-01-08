import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
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

        return null
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
    matcher: ["/admin/:path*", "/portal/:path*", "/login"],
}
