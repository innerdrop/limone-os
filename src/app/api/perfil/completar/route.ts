import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const userId = session.user.id
        const body = await request.json()

        const {
            emergencyContact,
            healthInfo,
            authorizations,
            paymentInfo
        } = body

        // Find the student record
        const alumno = await prisma.alumno.findUnique({
            where: { usuarioId: userId }
        })

        if (!alumno) {
            return NextResponse.json(
                { error: 'Alumno no encontrado' },
                { status: 404 }
            )
        }

        // Update the student record with all the new information
        await prisma.alumno.update({
            where: { id: alumno.id },
            data: {
                // Emergency contact
                emergenciaNombre: emergencyContact.nombre,
                emergenciaTelefono: emergencyContact.telefono,
                emergenciaRelacion: emergencyContact.relacion,

                // Health information
                obraSocial: healthInfo.obraSocial,
                numeroAfiliado: healthInfo.numeroAfiliado,
                hospitalReferencia: healthInfo.hospitalReferencia,
                alergias: healthInfo.alergias,
                medicacionHabitual: healthInfo.medicacionHabitual,
                condicionesMedicas: healthInfo.condicionesMedicas,
                restriccionesFisicas: healthInfo.restriccionesFisicas,

                // Authorizations
                autorizacionParticipacion: authorizations.participacion,
                autorizacionMedica: authorizations.medica,
                autorizacionRetiro: authorizations.retiro,
                autorizacionImagenes: authorizations.imagenes,
                aceptacionReglamento: authorizations.reglamento,
                firmaResponsable: authorizations.firma,
                aclaracionFirma: authorizations.aclaracion,
                dniFirma: authorizations.dni,

                // Payment information
                planPago: paymentInfo.planPago,
                formaPago: paymentInfo.formaPago,
                firmaConformidad: paymentInfo.firma,

                // Mark profile as complete
                perfilCompleto: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Perfil completado exitosamente'
        })

    } catch (error) {
        console.error('Error al completar perfil:', error)
        return NextResponse.json(
            { error: 'Error al completar el perfil' },
            { status: 500 }
        )
    }
}
