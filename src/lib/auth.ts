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

                const usuario = await prisma.usuario.findUnique({
                    where: { email: credentials.email },
                    include: { alumnos: true } as any
                }) as any

                if (!usuario) {
                    throw new Error('Email no registrado')
                }

                const isValid = await compare(credentials.password, usuario.password)

                if (!isValid) {
                    throw new Error('Contraseña incorrecta')
                }

                // Consider profile complete if they have at least one student and ALL their students have complete profiles
                const hasStudents = usuario.alumnos && usuario.alumnos.length > 0
                const allComplete = hasStudents && usuario.alumnos.every((a: any) => a.perfilCompleto)

                return {
                    id: usuario.id.toString(),
                    name: usuario.nombre,
                    email: usuario.email,
                    role: usuario.rol,
                    image: usuario.imagen,
                    perfilCompleto: allComplete,
                    debeCambiarPassword: usuario.debeCambiarPassword
                } as any
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },
    callbacks: {
        async jwt({ token, user, trigger, session: updateSession }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.perfilCompleto = user.perfilCompleto
                token.debeCambiarPassword = user.debeCambiarPassword
            }

            if (trigger === "update" && updateSession) {
                if (updateSession.perfilCompleto !== undefined) {
                    token.perfilCompleto = updateSession.perfilCompleto
                }
                if (updateSession.debeCambiarPassword !== undefined) {
                    token.debeCambiarPassword = updateSession.debeCambiarPassword
                }
            }

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.perfilCompleto = token.perfilCompleto as boolean
                session.user.debeCambiarPassword = token.debeCambiarPassword as boolean
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
