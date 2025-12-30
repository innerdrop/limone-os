import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import prisma from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Contraseña', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Credenciales requeridas')
                }

                const user = await prisma.usuario.findUnique({
                    where: { email: credentials.email },
                    include: { alumno: true }
                })

                if (!user || !user.activo) {
                    throw new Error('Usuario no encontrado o inactivo')
                }

                const isValid = await compare(credentials.password, user.password)

                if (!isValid) {
                    throw new Error('Contraseña incorrecta')
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.nombre,
                    role: user.rol,
                    image: user.imagen,
                    perfilCompleto: user.alumno?.perfilCompleto ?? false,
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.perfilCompleto = (user as any).perfilCompleto
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.perfilCompleto = token.perfilCompleto as boolean
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}
