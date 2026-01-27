import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const students = await prisma.alumno.findMany({
            where: {
                usuarioId: session.user.id,
                OR: [
                    { nombre: { not: null } },
                    { perfilCompleto: true }
                ] as any
            }
        })

        return NextResponse.json({ students })
    } catch (error) {
        console.error('Error al obtener perfil:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const {
            studentId, // New field needed
            nombre,
            apellido,
            dni,
            fechaNacimiento,
            edad,
            domicilioCalle,
            domicilioNumero,
            domicilioTira,
            domicilioPiso,
            domicilioDepto,
            colegio,
            grado,
            autorizacionParticipacion,
            autorizacionMedica,
            autorizacionRetiro,
            autorizacionImagenes,
            aceptacionReglamento,
            firmaResponsable,
            aclaracionFirma,
            dniFirma
        } = body

        if (!studentId) {
            return NextResponse.json({ error: 'ID de alumno requerido' }, { status: 400 })
        }

        // Format address
        const fullAddress = `${domicilioCalle} ${domicilioNumero}${domicilioTira ? `, Tira ${domicilioTira}` : ''}${domicilioPiso ? `, Piso ${domicilioPiso}` : ''}${domicilioDepto ? `, Depto ${domicilioDepto}` : ''}`

        const student = await prisma.alumno.update({
            where: { id: studentId, usuarioId: session.user.id },
            data: {
                nombre,
                apellido,
                dni,
                fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
                edad: edad ? parseInt(edad) : null,
                domicilio: fullAddress,
                domicilioCalle,
                domicilioNumero,
                domicilioTira,
                domicilioPiso,
                domicilioDepto,
                colegio,
                grado,
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

        return NextResponse.json({ success: true, student })
    } catch (error) {
        console.error('Error al actualizar perfil:', error)
        return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 })
    }
}
