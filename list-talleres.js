const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const talleres = await prisma.taller.findMany()
    console.log(JSON.stringify(talleres, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
