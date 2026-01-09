const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const ts = await prisma.taller.findMany();
    ts.forEach(t => console.log(`ID: ${t.id} -> ${t.nombre} (${t.activo ? 'ACT' : 'PAU'})`));
}

main().finally(() => prisma.$disconnect());
