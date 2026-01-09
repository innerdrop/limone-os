const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const insc = await prisma.inscripcion.findMany({
        where: { alumno: { usuario: { email: 'ing.iyad@gmail.com' } } },
        include: { taller: true }
    });

    for (const i of insc) {
        console.log(`Email: ing.iyad@gmail.com | Taller: ${i.taller.nombre} | Fase: ${i.fase}`);
    }
}

main().finally(() => prisma.$disconnect());
