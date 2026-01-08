const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const roles = await prisma.usuario.groupBy({
        by: ['rol'],
        _count: { _all: true }
    })
    console.log('Conteos por rol:', roles)

    const admins = await prisma.usuario.findMany({
        where: { rol: 'ADMIN' },
        select: { id: true, email: true, nombre: true }
    })
    console.log('Admins:', admins)

    const docentes = await prisma.usuario.findMany({
        where: { rol: 'DOCENTE' },
        select: { id: true, email: true, nombre: true }
    })
    console.log('Docentes:', docentes)
}

main().finally(() => prisma.$disconnect())
