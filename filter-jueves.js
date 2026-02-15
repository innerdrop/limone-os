const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const insJueves = await prisma.inscripcion.findMany({
        where: { dia: { contains: 'JUEVES', mode: 'insensitive' } },
        include: { alumno: true, taller: true }
    });
    console.log(`Inscripciones para JUEVES: ${insJueves.length}`);
    insJueves.forEach(i => console.log(`- ${i.alumno?.nombre} ${i.alumno?.apellido} (${i.taller?.nombre}) -> Dia: ${i.dia}`));

    const citations = await prisma.citaNivelacion.findMany({
        include: { alumno: true }
    });
    console.log(`\nCitas totales: ${citations.length}`);
    citations.forEach(c => {
        const d = new Date(c.fecha);
        console.log(`- Alumno: ${c.alumno?.nombre}, Fecha: ${d.toISOString()}, DiaSemana: ${d.getDay()}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
