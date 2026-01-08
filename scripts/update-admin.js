const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
    const email = 'natalia@limone.usev.app'
    const password = '123limone'
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log(`Actualizando credenciales para el administrador...`)

    // Encontrar al usuario con rol ADMIN o DOCENTE
    const admin = await prisma.usuario.findFirst({
        where: {
            OR: [
                { rol: 'ADMIN' },
                { rol: 'DOCENTE' }
            ]
        }
    })

    if (!admin) {
        console.error('No se encontró ningún usuario administrador.')
        process.exit(1)
    }

    const updatedUser = await prisma.usuario.update({
        where: { id: admin.id },
        data: {
            email: email,
            password: hashedPassword,
            debeCambiarPassword: false // Lo ponemos en false para que pueda entrar directo
        }
    })

    console.log('Credenciales actualizadas correctamente:')
    console.log(`Email: ${updatedUser.email}`)
    console.log(`Nombre: ${updatedUser.nombre}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
