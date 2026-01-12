import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { afipService } from '@/lib/afip'
import { generateInvoicePDF } from '@/lib/invoice-generator'
import fs from 'fs/promises'
import path from 'path'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { es } from 'date-fns/locale'

export async function POST(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
        }

        const { id: pagoId } = await context.params

        // 1. Obtener datos del pago con alumno y su taller
        const pago = await prisma.pago.findUnique({
            where: { id: pagoId },
            include: {
                alumno: {
                    include: { usuario: true }
                },
                inscripcion: {
                    include: { taller: true }
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
        const clienteNombre = pago.alumno.tutorNombre || pago.alumno.usuario.nombre
        const clienteDocumento = pago.alumno.tutorDni || pago.alumno.dni

        if (!clienteDocumento) {
            return NextResponse.json({
                message: 'El alumno/tutor no tiene DNI cargado. Es necesario para facturar.'
            }, { status: 400 })
        }

        // Calcular periodos de servicio (Mes completo)
        const fechaReferencia = new Date(pago.anioCubierto, pago.mesCubierto - 1, 1)
        const fechaDesdeStr = format(startOfMonth(fechaReferencia), 'yyyyMMdd')
        const fechaHastaStr = format(endOfMonth(fechaReferencia), 'yyyyMMdd')

        const nombreMes = format(fechaReferencia, 'MMMM', { locale: es })
        const conceptoFactura = `Servicios de enseñanza artística - Mensualidad ${nombreMes} ${pago.anioCubierto}`

        // 3. Solicitar CAE a AFIP
        const fiscalData = await afipService.createFacturaB({
            dni: clienteDocumento,
            monto: pago.monto,
            puntoVenta: 1,
            concepto: 2, // 2: Servicios (Educación)
            fechaDesde: fechaDesdeStr,
            fechaHasta: fechaHastaStr
        })

        // 4. Generar el PDF
        const pdfBlob = await generateInvoicePDF({
            razonSocialEmisor: 'TALLER LIMONE (Natalia Fusari)',
            cuitEmisor: process.env.AFIP_CUIT || '27-12345678-9',
            puntoVenta: fiscalData.puntoVenta,
            numeroComprobante: fiscalData.nroComprobante,
            fechaEmision: new Date().toLocaleDateString('es-AR'),
            cae: fiscalData.cae,
            caeVencimiento: fiscalData.caeVencimiento,
            clienteNombre: clienteNombre,
            clienteDocumento: clienteDocumento,
            montoTotal: pago.monto,
            concepto: conceptoFactura,
            tallerNombre: pago.inscripcion?.taller.nombre || 'Taller Limoné'
        })

        // 5. Guardar el PDF en el servidor
        const fileName = `factura_${fiscalData.puntoVenta}_${fiscalData.nroComprobante}.pdf`
        const dirPath = path.join(process.cwd(), 'public', 'comprobantes')
        const publicPath = path.join(dirPath, fileName)

        // Asegurar que el directorio existe
        await fs.mkdir(dirPath, { recursive: true })

        const arrayBuffer = await pdfBlob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await fs.writeFile(publicPath, buffer)

        // 6. Actualizar el pago en la base de datos
        // Convertir caeVencimiento de AAAAMMDD a Date
        const year = parseInt(fiscalData.caeVencimiento.slice(0, 4))
        const month = parseInt(fiscalData.caeVencimiento.slice(4, 6)) - 1
        const day = parseInt(fiscalData.caeVencimiento.slice(6, 8))

        const pagoActualizado = await prisma.pago.update({
            where: { id: pagoId },
            data: {
                cae: fiscalData.cae,
                caeVencimiento: new Date(year, month, day),
                puntoVenta: fiscalData.puntoVenta,
                nroComprobante: fiscalData.nroComprobante,
                tipoFactura: fiscalData.tipoFactura,
                cuitEmisor: process.env.AFIP_CUIT || '27-12345678-9',
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
