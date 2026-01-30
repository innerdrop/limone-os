import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/lib/email'
import { welcomeEmail } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            // Registration Only Flag
            registrationOnly,
            // Student data (optional if registrationOnly is true)
            nombre,
            apellido,
            dni,
            fechaNacimiento,
            edad,
            domicilio,
            domicilioCalle,
            domicilioNumero,
            domicilioTira,
            domicilioPiso,
            domicilioDepto,
            colegio,
            grado,
            // Guardian data
            tutorNombre,
            tutorApellido,
            tutorDni,
            tutorRelacion,
            tutorDomicilio,
            tutorDomicilioCalle,
            tutorDomicilioNumero,
            tutorDomicilioTira,
            tutorDomicilioPiso,
            tutorDomicilioDepto,
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

        // Validate required fields for Tutor
        if (!tutorNombre || !tutorApellido || !tutorDni || !tutorTelefonoPrincipal || !tutorEmail) {
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

        // Generate temporary password (first 4 digits of Tutor DNI)
        const tempPassword = tutorDni.substring(0, 4)
        const hashedPassword = await bcrypt.hash(tempPassword, 10)

        // Create user account
        // If registrationOnly is true, we use Tutor Name for the account
        const usuario = await prisma.usuario.create({
            data: {
                email: tutorEmail,
                password: hashedPassword,
                nombre: `${tutorNombre} ${tutorApellido}`,
                telefono: tutorTelefonoPrincipal,
                rol: 'ALUMNO', // Always ALUMNO for portal users
                activo: true,
                debeCambiarPassword: true
            }
        })

        // Create student record ONLY if NOT registrationOnly
        if (!registrationOnly) {
            await prisma.alumno.create({
                data: {
                    usuarioId: usuario.id,
                    nombre: nombre || null,
                    apellido: apellido || null,
                    dni: dni || null,
                    fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
                    edad: edad ? parseInt(edad) : null,
                    domicilio,
                    domicilioCalle,
                    domicilioNumero,
                    domicilioTira,
                    domicilioPiso,
                    domicilioDepto,
                    colegio,
                    grado,
                    tutorNombre,
                    tutorApellido,
                    tutorDni,
                    tutorRelacion: tutorRelacion || 'Tutor',
                    tutorDomicilio,
                    tutorDomicilioCalle,
                    tutorDomicilioNumero,
                    tutorDomicilioTira,
                    tutorDomicilioPiso,
                    tutorDomicilioDepto,
                    tutorTelefonoPrincipal,
                    tutorTelefonoAlternativo,
                    tutorEmail,
                    tutorProfesion,
                    autorizacionParticipacion: autorizacionParticipacion || false,
                    autorizacionMedica: autorizacionMedica || false,
                    autorizacionRetiro,
                    autorizacionImagenes: autorizacionImagenes || false,
                    aceptacionReglamento: aceptacionReglamento || false,
                    firmaResponsable,
                    aclaracionFirma,
                    dniFirma,
                    perfilCompleto: true
                } as any
            })
        }

        // Send welcome email
        const loginUrl = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/login` : 'https://limone.vercel.app/login'
        sendEmail({
            to: tutorEmail,
            subject: '¡Bienvenido/a a Taller Limoné! 🎨',
            html: welcomeEmail({
                nombre: `${tutorNombre} ${tutorApellido}`,
                email: tutorEmail,
                tempPassword: tempPassword,
                loginUrl
            })
        }).catch(err => console.error('Error sending welcome email:', err))

        return NextResponse.json({
            success: true,
            message: registrationOnly ? 'Registro exitoso' : 'Inscripción exitosa',
            data: {
                email: tutorEmail,
                tempPassword: tempPassword
            }
        })

    } catch (error) {
        console.error('Error en inscripción/registro:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
