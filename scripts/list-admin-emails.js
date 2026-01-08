const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const admins = await prisma.usuario.findMany({
        where: {
            rol: { not: 'ALUMNO' }
        },
        select: {
            id: true,
            email: true,
            nombre: true,
            rol: true
        }
    })
    console.log('Admins encontrados:')
    admins.forEach(a => {
        console.log(`ID: ${a.id} | Email: ${a.email} | Nombre: ${a.nombre} | Rol: ${a.rol}`)
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
