const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const insc = await prisma.inscripcion.findMany({
        where: { alumno: { usuario: { email: 'ing.iyad@gmail.com' } } },
        include: { taller: true }
    });

    for (const i of insc) {
        console.log(`T: ${i.taller.nombre} | F: ${i.fase} | S: ${i.estado} | ID: ${i.tallerId}`);
    }
}

main().finally(() => prisma.$disconnect());
