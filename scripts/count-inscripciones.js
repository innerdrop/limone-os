const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const talleres = await prisma.taller.findMany({
        include: {
            _count: {
                select: { inscripciones: { where: { estado: 'ACTIVA' } } }
            }
        }
    });

    console.log('--- Conteo de Inscripciones Activas ---');
    talleres.forEach(t => {
        console.log(`${t.nombre}: ${t._count.inscripciones}`);
    });
}

main().finally(() => prisma.$disconnect());
