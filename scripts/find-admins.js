const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const admins = await prisma.usuario.findMany({
        where: {
            rol: { not: 'ALUMNO' }
        }
    })
    console.log('Usuarios que no son alumnos:')
    console.log(JSON.stringify(admins, null, 2))

    if (admins.length === 0) {
        // Just in case, list the first 5 users to see what roles they have
        const someUsers = await prisma.usuario.findMany({ take: 5 })
        console.log('Primeros 5 usuarios en la BD:')
        console.log(JSON.stringify(someUsers, null, 2))
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
