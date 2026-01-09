const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'ing.iyad@gmail.com';
    const tallerVerano = await prisma.taller.findFirst({ where: { nombre: { contains: 'Verano' } } });

    const count = await prisma.inscripcion.updateMany({
        where: {
            alumno: { usuario: { email: email } },
            fase: 'Colonia de Verano'
        },
        data: {
            tallerId: tallerVerano.id
        }
    });

    console.log(`Updated: ${count.count}`);
}

main().finally(() => prisma.$disconnect());
