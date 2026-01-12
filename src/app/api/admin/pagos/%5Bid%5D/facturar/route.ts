import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { afipService } from '@/lib/afip'
import { generateInvoicePDF } from '@/lib/invoice-generator'
import fs from 'fs/promises'
import path from 'path'

export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
        }

        const { id: pagoId } = await params

        // 1. Obtener datos del pago con alumno y tutor
        const pago = await prisma.pago.findUnique({
            where: { id: pagoId },
            include: {
                alumno: {
                    include: { usuario: true }
                }
            }
        })

        if (!pago) {
            return NextResponse.json({ message: 'Pago no encontrado' }, { status: 404 })
        }

        if (pago.cae) {
            return NextResponse.json({ message: 'Este pago ya ha sido facturado' }, { status: 400 })
        }

        // 2. Preparar datos para AFIP
        // Usamos el tutor si existe, sino el alumno (como consumidor final)
        const clienteNombre = pago.alumno.tutorNombre || pago.alumno.usuario.nombre
        const clienteDocumento = pago.alumno.tutorDni || pago.alumno.dni

        if (!clienteDocumento) {
            return NextResponse.json({
                message: 'El alumno/tutor no tiene DNI cargado. Es necesario para facturar.'
            }, { status: 400 })
        }

        // 3. Solicitar CAE a AFIP
        const fiscalData = await afipService.createFacturaB({
            dni: clienteDocumento,
            monto: pago.monto,
            puntoVenta: 1 // Por defecto el 1
        })

        // 4. Generar el PDF
        const pdfBlob = await generateInvoicePDF({
            razonSocialEmisor: 'TALLER LIMONE (Natalia Fusari)',
            cuitEmisor: '27-12345678-9', // CUIT de ejemplo
            puntoVenta: fiscalData.puntoVenta,
            numeroComprobante: fiscalData.nroComprobante,
            fechaEmision: new Date().toLocaleDateString('es-AR'),
            cae: fiscalData.cae,
            caeVencimiento: fiscalData.caeVencimiento,
            clienteNombre: clienteNombre,
            clienteDocumento: clienteDocumento,
            montoTotal: pago.monto,
            concepto: pago.concepto || `Cuota Taller - Mes ${pago.mesCubierto}`,
            tallerNombre: 'Taller Limoné'
        })

        // 5. Guardar el PDF en el servidor (Localmente en public para este caso)
        const fileName = `factura_${fiscalData.puntoVenta}_${fiscalData.nroComprobante}.pdf`
        const publicPath = path.join(process.cwd(), 'public', 'comprobantes', fileName)

        // Convert Blob to Buffer for Node.js fs
        const arrayBuffer = await pdfBlob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await fs.writeFile(publicPath, buffer)

        // 6. Actualizar el pago en la base de datos
        const pagoActualizado = await prisma.pago.update({
            where: { id: pagoId },
            data: {
                cae: fiscalData.cae,
                caeVencimiento: new Date(fiscalData.caeVencimiento),
                puntoVenta: fiscalData.puntoVenta,
                nroComprobante: fiscalData.nroComprobante,
                tipoFactura: fiscalData.tipoFactura,
                cuitEmisor: '27-12345678-9',
                emisorNombre: 'Taller Limoné',
                facturadoEn: new Date(),
                comprobantePdf: `/comprobantes/${fileName}`
            }
        })

        return NextResponse.json({
            message: 'Factura generada con éxito',
            cae: fiscalData.cae,
            pdfUrl: pagoActualizado.comprobantePdf
        })

    } catch (error: any) {
        console.error('Error in Billing API:', error)
        return NextResponse.json(
            { message: error.message || 'Error al procesar la facturación' },
            { status: 500 }
        )
    }
}
