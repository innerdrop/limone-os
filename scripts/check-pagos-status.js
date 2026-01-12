const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const pagos = await prisma.pago.findMany({
        select: { id: true, estado: true, monto: true }
    });
    console.log(JSON.stringify(pagos, null, 2));
}

main().finally(() => prisma.$disconnect());
