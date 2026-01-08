const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.usuario.findMany({
        select: { id: true, email: true, rol: true }
    })
    console.log('---BEGIN USERS---')
    users.forEach(u => console.log(`${u.id}|${u.email}|${u.rol}`))
    console.log('---END USERS---')
}

main().finally(() => prisma.$disconnect())
