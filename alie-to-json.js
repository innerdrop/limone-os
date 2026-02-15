const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    const alie = await prisma.alumno.findFirst({
        where: { nombre: 'Alie' },
        include: { inscripciones: { include: { taller: true } } }
    });
    fs.writeFileSync('alie.json', JSON.stringify(alie, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
