import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            // Student data
            nombre,
            dni,
            fechaNacimiento,
            edad,
            domicilio,
            colegio,
            grado,
            // Guardian data
            tutorNombre,
            tutorDni,
            tutorRelacion,
            tutorDomicilio,
            tutorTelefonoPrincipal,
            tutorTelefonoAlternativo,
            tutorEmail,
            tutorProfesion,
            // Authorizations
            autorizacionParticipacion,
            autorizacionMedica,
            autorizacionRetiro,
            autorizacionImagenes,
            aceptacionReglamento,
            firmaResponsable,
            aclaracionFirma,
            dniFirma
        } = body

        // Validate required fields
        if (!nombre || !dni || !fechaNacimiento || !domicilio) {
            return NextResponse.json(
                { error: 'Faltan datos del alumno' },
                { status: 400 }
            )
        }

        if (!tutorNombre || !tutorDni || !tutorRelacion || !tutorTelefonoPrincipal || !tutorEmail) {
            return NextResponse.json(
                { error: 'Faltan datos del tutor' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingUser = await prisma.usuario.findUnique({
            where: { email: tutorEmail }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'El email ya está registrado' },
                { status: 400 }
            )
        }

        // Generate temporary password (first 4 digits of DNI)
        const tempPassword = dni.substring(0, 4)
        const hashedPassword = await bcrypt.hash(tempPassword, 10)

        // Create user account
        const usuario = await prisma.usuario.create({
            data: {
                email: tutorEmail,
                password: hashedPassword,
                nombre: nombre,
                telefono: tutorTelefonoPrincipal,
                rol: 'ALUMNO',
                activo: true,
                debeCambiarPassword: true
            }
        })

        // Create student record
        const alumno = await prisma.alumno.create({
            data: {
                usuarioId: usuario.id,
                // Student data
                dni,
                fechaNacimiento: new Date(fechaNacimiento),
                edad: parseInt(edad),
                domicilio,
                colegio,
                grado,
                // Guardian data
                tutorNombre,
                tutorDni,
                tutorRelacion,
                tutorDomicilio,
                tutorTelefonoPrincipal,
                tutorTelefonoAlternativo,
                tutorEmail,
                tutorProfesion,
                // Authorizations
                autorizacionParticipacion: autorizacionParticipacion || false,
                autorizacionMedica: autorizacionMedica || false,
                autorizacionRetiro,
                autorizacionImagenes: autorizacionImagenes || false,
                aceptacionReglamento: aceptacionReglamento || false,
                firmaResponsable,
                aclaracionFirma,
                dniFirma,
                // Profile
                perfilCompleto: true // Since we are collecting everything now
            }
        })

        // TODO: Send welcome email with credentials
        // Email: tutorEmail
        // Password: tempPassword (first 4 digits of student DNI)

        return NextResponse.json({
            success: true,
            message: 'Inscripción exitosa',
            data: {
                email: tutorEmail,
                tempPassword: tempPassword // In production, this should be sent via email only
            }
        })

    } catch (error: any) {
        console.error('Error en inscripción:', error)
        return NextResponse.json(
            { error: 'Error al procesar la inscripción' },
            { status: 500 }
        )
    }
}
