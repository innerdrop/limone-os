const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const inscripciones = await prisma.inscripcion.findMany({
        take: 5,
        select: { dia: true }
    })
    console.log('Sample dias:', inscripciones.map(i => i.dia))
}

main().catch(console.error).finally(() => prisma.$disconnect())
