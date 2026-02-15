const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- BUSCANDO ACTIVIDADES EN FEBRERO 2026 ---');
    const start = new Date('2026-02-01T00:00:00Z');
    const end = new Date('2026-02-28T23:59:59Z');

    const citas = await prisma.citaNivelacion.findMany({
        where: { fecha: { gte: start, lte: end } },
        include: { alumno: true }
    });
    console.log(`Citas en Febrero: ${citas.length}`);
    citas.forEach(c => console.log(`- Día ${c.fecha.getDate()}: ${c.alumno?.nombre} (${c.fecha.toISOString()})`));

    const ins = await prisma.inscripcion.findMany({
        include: { alumno: true, taller: true }
    });
    console.log(`\nInscripciones totales: ${ins.length}`);
    ins.forEach(i => console.log(`- Alumno: ${i.alumno?.nombre}, Dia: ${i.dia}, Taller: ${i.taller?.nombre}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
