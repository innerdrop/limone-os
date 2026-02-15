const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const activeJueves = await prisma.inscripcion.findMany({
        where: {
            estado: 'ACTIVA',
            OR: [
                { dia: { contains: 'JUEVES', mode: 'insensitive' } },
                { taller: { diasSemana: { contains: 'JUEVES', mode: 'insensitive' } } }
            ]
        },
        include: { alumno: true, taller: true }
    });

    console.log(`Active JUEVES inscriptions: ${activeJueves.length}`);
    activeJueves.forEach(i => {
        console.log(`- Alumno: ${i.alumno?.nombre}, Taller: ${i.taller?.nombre}, Dia: ${i.dia}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
