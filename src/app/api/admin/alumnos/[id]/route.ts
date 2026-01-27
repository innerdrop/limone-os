import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        // Verificar que el usuario esté autenticado y sea administrador
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const params = await context.params
        const alumnoId = params.id

        const alumno = await prisma.alumno.findUnique({
            where: { id: alumnoId },
            include: {
                usuario: true
            }
        })

        if (!alumno) {
            return NextResponse.json(
                { error: 'Alumno no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(alumno)

    } catch (error) {
        console.error('Error al obtener alumno:', error)
        return NextResponse.json(
            { error: 'Error al obtener el alumno' },
            { status: 500 }
        )
    }
}


export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        // Verificar que el usuario esté autenticado y sea administrador
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const params = await context.params
        const alumnoId = params.id
        const data = await req.json()

        // Verificar que el alumno existe
        const alumnoExistente = await prisma.alumno.findUnique({
            where: { id: alumnoId },
            include: { usuario: true }
        })

        if (!alumnoExistente) {
            return NextResponse.json(
                { error: 'Alumno no encontrado' },
                { status: 404 }
            )
        }

        // Preparar datos del usuario (si se proporcionaron)
        const datosUsuario: any = {}
        if (data.nombre !== undefined) datosUsuario.nombre = data.nombre
        if (data.email !== undefined) datosUsuario.email = data.email
        if (data.telefono !== undefined) datosUsuario.telefono = data.telefono

        // Preparar datos del alumno
        const datosAlumno: any = {}
        if (data.dni !== undefined) datosAlumno.dni = data.dni
        if (data.fechaNacimiento !== undefined) {
            datosAlumno.fechaNacimiento = data.fechaNacimiento ? new Date(data.fechaNacimiento) : null
        }
        if (data.edad !== undefined) datosAlumno.edad = data.edad ? parseInt(data.edad) : null
        if (data.domicilio !== undefined) datosAlumno.domicilio = data.domicilio
        if (data.colegio !== undefined) datosAlumno.colegio = data.colegio
        if (data.grado !== undefined) datosAlumno.grado = data.grado

        // Datos del tutor
        if (data.tutorNombre !== undefined) datosAlumno.tutorNombre = data.tutorNombre
        if (data.tutorDni !== undefined) datosAlumno.tutorDni = data.tutorDni
        if (data.tutorRelacion !== undefined) datosAlumno.tutorRelacion = data.tutorRelacion
        if (data.tutorDomicilio !== undefined) datosAlumno.tutorDomicilio = data.tutorDomicilio
        if (data.tutorTelefonoPrincipal !== undefined) datosAlumno.tutorTelefonoPrincipal = data.tutorTelefonoPrincipal
        if (data.tutorTelefonoAlternativo !== undefined) datosAlumno.tutorTelefonoAlternativo = data.tutorTelefonoAlternativo
        if (data.tutorEmail !== undefined) datosAlumno.tutorEmail = data.tutorEmail
        if (data.tutorProfesion !== undefined) datosAlumno.tutorProfesion = data.tutorProfesion

        // Contacto de emergencia
        if (data.emergenciaNombre !== undefined) datosAlumno.emergenciaNombre = data.emergenciaNombre
        if (data.emergenciaTelefono !== undefined) datosAlumno.emergenciaTelefono = data.emergenciaTelefono
        if (data.emergenciaRelacion !== undefined) datosAlumno.emergenciaRelacion = data.emergenciaRelacion

        // Información médica
        if (data.obraSocial !== undefined) datosAlumno.obraSocial = data.obraSocial
        if (data.numeroAfiliado !== undefined) datosAlumno.numeroAfiliado = data.numeroAfiliado
        if (data.hospitalReferencia !== undefined) datosAlumno.hospitalReferencia = data.hospitalReferencia
        if (data.alergias !== undefined) datosAlumno.alergias = data.alergias
        if (data.medicacionHabitual !== undefined) datosAlumno.medicacionHabitual = data.medicacionHabitual
        if (data.condicionesMedicas !== undefined) datosAlumno.condicionesMedicas = data.condicionesMedicas
        if (data.restriccionesFisicas !== undefined) datosAlumno.restriccionesFisicas = data.restriccionesFisicas

        // Autorizaciones
        if (data.autorizacionParticipacion !== undefined) datosAlumno.autorizacionParticipacion = data.autorizacionParticipacion
        if (data.autorizacionMedica !== undefined) datosAlumno.autorizacionMedica = data.autorizacionMedica
        if (data.autorizacionRetiro !== undefined) datosAlumno.autorizacionRetiro = data.autorizacionRetiro
        if (data.autorizacionImagenes !== undefined) datosAlumno.autorizacionImagenes = data.autorizacionImagenes
        if (data.aceptacionReglamento !== undefined) datosAlumno.aceptacionReglamento = data.aceptacionReglamento

        // Nivel y notas
        if (data.nivel !== undefined) datosAlumno.nivel = data.nivel
        if (data.notas !== undefined) datosAlumno.notas = data.notas

        // Actualizar datos en una transacción
        const alumnoActualizado = await prisma.$transaction(async (tx) => {
            // Actualizar usuario si hay cambios
            if (Object.keys(datosUsuario).length > 0) {
                await tx.usuario.update({
                    where: { id: alumnoExistente.usuarioId },
                    data: datosUsuario
                })
            }

            // Actualizar alumno
            return await tx.alumno.update({
                where: { id: alumnoId },
                data: datosAlumno,
                include: {
                    usuario: true
                }
            })
        })

        return NextResponse.json({
            success: true,
            alumno: alumnoActualizado
        })

    } catch (error) {
        console.error('Error al actualizar alumno:', error)
        return NextResponse.json(
            { error: 'Error al actualizar el alumno' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const params = await context.params
        await prisma.alumno.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error al eliminar alumno:', error)
        return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
    }
}

