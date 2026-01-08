const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.usuario.findMany({
        select: {
            id: true,
            email: true,
            rol: true,
            nombre: true
        }
    })
    console.log('Todos los usuarios:')
    users.forEach(u => {
        console.log(`ID: ${u.id} | Email: ${u.email} | Rol: ${u.rol} | Nombre: ${u.nombre}`)
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
