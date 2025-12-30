import 'next-auth'
import { Rol } from '@prisma/client'

declare module 'next-auth' {
    interface User {
        id: string
        role: Rol
    }

    interface Session {
        user: {
            id: string
            email: string
            name: string
            role: Rol
            image?: string
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        role: Rol
    }
}
