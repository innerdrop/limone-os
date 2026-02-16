const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

async function generateProfessionalPDF(mdFile, outputFile, title, subtitle) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // --- TITLE PAGE ---
    // No logos per user request

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(45, 45, 45);
    doc.text(title.toUpperCase(), pageWidth / 2, 80, { align: 'center' });

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, pageWidth / 2, 90, { align: 'center' });

    // Credit at the bottom
    doc.setFontSize(10);
    doc.text('Este manual está creado por Vsolutions', pageWidth / 2, pageHeight - 40, { align: 'center' });

    doc.addPage();

    // --- CONTENT PAGES ---
    let y = margin + 10;
    const content = fs.readFileSync(mdFile, 'utf8');
    const lines = content.split('\n');

    const checkNewPage = (neededHeight) => {
        if (y + neededHeight > pageHeight - margin) {
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`${title} - Taller Limoné`, margin, pageHeight - 10);
            doc.text('Página ' + doc.internal.getNumberOfPages(), pageWidth - margin, pageHeight - 10, { align: 'right' });

            doc.addPage();
            y = margin + 10;
            return true;
        }
        return false;
    };

    lines.forEach((line) => {
        line = line.trim();
        if (line === "") {
            y += 5;
            return;
        }

        if (line.startsWith('# ')) {
            checkNewPage(20);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(142, 68, 173);
            doc.text(line.replace('# ', ''), margin, y);
            y += 15;
        } else if (line.startsWith('## ')) {
            checkNewPage(15);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.setTextColor(45, 45, 45);
            doc.text(line.replace('## ', ''), margin, y);
            y += 10;
        } else if (line.startsWith('### ')) {
            checkNewPage(12);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(45, 45, 45);
            doc.text(line.replace('### ', ''), margin, y);
            y += 8;
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            const text = '  •  ' + line.substring(2);
            const splitText = doc.splitTextToSize(text, contentWidth);
            checkNewPage(splitText.length * 6);
            doc.text(splitText, margin, y);
            y += (splitText.length * 6);
        } else if (line.startsWith('---')) {
            y += 5;
            doc.setDrawColor(230, 230, 230);
            doc.line(margin, y, pageWidth - margin, y);
            y += 10;
        } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            const splitText = doc.splitTextToSize(line, contentWidth);
            checkNewPage(splitText.length * 6);
            doc.text(splitText, margin, y);
            y += (splitText.length * 6);
        }
    });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`${title} - Taller Limoné`, margin, pageHeight - 10);
    doc.text('Página ' + doc.internal.getNumberOfPages(), pageWidth - margin, pageHeight - 10, { align: 'right' });

    const pdfData = doc.output();
    fs.writeFileSync(outputFile, pdfData, 'binary');
    console.log(`PDF generado con éxito: ${outputFile}`);
}

async function start() {
    await generateProfessionalPDF(
        'MANUAL_ADMIN.md',
        'MANUAL_ADMIN.pdf',
        'Manual del Administrador',
        'Gestión Integral Taller Limoné'
    );

    await generateProfessionalPDF(
        'DOCUMENTACION_TECNICA.md',
        'DOCUMENTACION_TECNICA.pdf',
        'Documentación Técnica',
        'Arquitectura y Desarrollo - Limoné OS'
    );
}

start();
