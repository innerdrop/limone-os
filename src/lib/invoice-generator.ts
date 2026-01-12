import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface InvoiceData {
    razonSocialEmisor: string;
    cuitEmisor: string;
    puntoVenta: number;
    numeroComprobante: number;
    fechaEmision: string;
    cae: string;
    caeVencimiento: string;
    clienteNombre: string;
    clienteDocumento: string;
    montoTotal: number;
    concepto: string;
    tallerNombre: string;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Cabecera ---
    doc.setFontSize(22);
    doc.text('FACTURA', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(40);
    doc.rect(pageWidth / 2 - 10, 10, 20, 20);
    doc.text('B', pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.text('Cod. 006', pageWidth / 2, 33, { align: 'center' });

    // --- Datos del Emisor (Izquierda) ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.tallerNombre.toUpperCase(), 15, 45);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Razón Social: ${data.razonSocialEmisor}`, 15, 52);
    doc.text('Condición frente al IVA: Responsable Monotributo', 15, 57);
    doc.text('Domicilio Comercial: Ushuaia, Tierra del Fuego', 15, 62);

    // --- Datos de la Factura (Derecha) ---
    doc.text(`Punto de Venta: ${data.puntoVenta.toString().padStart(5, '0')}`, pageWidth - 15, 52, { align: 'right' });
    doc.text(`Comp. Nro: ${data.numeroComprobante.toString().padStart(8, '0')}`, pageWidth - 15, 57, { align: 'right' });
    doc.text(`Fecha de Emisión: ${data.fechaEmision}`, pageWidth - 15, 62, { align: 'right' });
    doc.text(`CUIT: ${data.cuitEmisor}`, pageWidth - 15, 67, { align: 'right' });
    doc.text('Ingresos Brutos: Exento', pageWidth - 15, 72, { align: 'right' });
    doc.text('Inicio de Actividades: 01/01/2024', pageWidth - 15, 77, { align: 'right' });

    doc.line(10, 85, pageWidth - 10, 85);

    // --- Datos del Receptor ---
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEPTOR', 15, 95);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Apellido y Nombre / Razón Social: ${data.clienteNombre}`, 15, 102);
    doc.text(`CUIT / CUIL / DNI: ${data.clienteDocumento}`, 15, 107);
    doc.text('Condición frente al IVA: Consumidor Final', 15, 112);
    doc.text('Condición de Venta: Contado', 15, 117);

    doc.line(10, 125, pageWidth - 10, 125);

    // --- Detalle ---
    doc.setFont('helvetica', 'bold');
    doc.text('Descripción', 15, 135);
    doc.text('Importe', pageWidth - 15, 135, { align: 'right' });

    doc.line(15, 138, pageWidth - 15, 138);

    doc.setFont('helvetica', 'normal');
    // Manejo de descripción multi-línea
    const splitConcepto = doc.splitTextToSize(data.concepto, pageWidth - 100);
    doc.text(splitConcepto, 15, 145);

    doc.text(`$ ${data.montoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, pageWidth - 15, 145, { align: 'right' });

    // --- Totales ---
    doc.line(10, 200, pageWidth - 10, 200);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', pageWidth - 60, 215);
    doc.text(`$ ${data.montoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, pageWidth - 15, 215, { align: 'right' });

    // --- Pie de página (QR y CAE) ---
    // AFIP requiere QR con URL específica que contiene datos en Base64
    const qrData = JSON.stringify({
        ver: 1,
        fecha: data.fechaEmision.split('/').reverse().join('-'), // YYYY-MM-DD
        cuit: parseInt(data.cuitEmisor.replace(/-/g, '')),
        ptoVta: data.puntoVenta,
        tipoCbte: 6,
        nroCbte: data.numeroComprobante,
        importe: data.montoTotal,
        moneda: "PES",
        ctz: 1,
        tipoCodAut: "E",
        codAut: parseInt(data.cae)
    });

    const qrBase64 = Buffer.from(qrData).toString('base64');
    const qrUrl = `https://www.afip.gob.ar/fe/qr/?p=${qrBase64}`;

    try {
        const qrImage = await QRCode.toDataURL(qrUrl);
        doc.addImage(qrImage, 'PNG', 15, 230, 45, 45);
    } catch (e) {
        console.error('Error generating QR code', e);
    }

    doc.setFontSize(11);
    doc.text(`CAE: ${data.cae}`, pageWidth - 15, 250, { align: 'right' });

    // Formatear fecha vencimiento de AAAAMMDD a DD/MM/AAAA
    const vto = data.caeVencimiento;
    const vtoFormatted = `${vto.slice(6, 8)}/${vto.slice(4, 6)}/${vto.slice(0, 4)}`;
    doc.text(`Vencimiento CAE: ${vtoFormatted}`, pageWidth - 15, 257, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Comprobante autorizado por AFIP (ARCA)', pageWidth / 2, 285, { align: 'center' });

    return doc.output('blob');
}
