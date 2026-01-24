import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const alumno = await prisma.alumno.findUnique({
            where: { usuarioId: session.user.id }
        })

        if (!alumno) {
            return NextResponse.json(
                { error: 'Alumno no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(alumno)
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const body = await request.json()
        const {
            nombre, dni, fechaNacimiento, domicilio,
            tutorNombre, tutorEmail, tutorTelefonoPrincipal,
            emergenciaNombre, emergenciaTelefono, alergias
        } = body

        // Update Usuario (Nombre)
        if (nombre) {
            await prisma.usuario.update({
                where: { id: session.user.id },
                data: { nombre }
            })
        }

        // Update Alumno
        const updatedAlumno = await prisma.alumno.update({
            where: { usuarioId: session.user.id },
            data: {
                dni,
                fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
                domicilio,
                tutorNombre,
                tutorEmail,
                tutorTelefonoPrincipal,
                emergenciaNombre,
                emergenciaTelefono,
                alergias,
                perfilCompleto: true // We can mark as complete once saved manual for the first time
            }
        })

        return NextResponse.json(updatedAlumno)
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }
}
