const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tallerVerano = await prisma.taller.findFirst({ where: { nombre: { contains: 'Verano' } } });

    if (!tallerVerano) {
        console.error('No summer workshop found');
        return;
    }

    const result = await prisma.inscripcion.updateMany({
        where: {
            OR: [
                { fase: 'Colonia de Verano' },
                { dia: 'VERANO' }
            ],
            NOT: { tallerId: tallerVerano.id }
        },
        data: {
            tallerId: tallerVerano.id
        }
    });

    console.log(`Global update: ${result.count} inscriptions moved.`);
}

main().finally(() => prisma.$disconnect());
