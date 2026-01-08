const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
    const email = 'natalia@limone.usev.app'
    const password = '123limone'
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log(`Creando usuario administrador: ${email}`)

    const admin = await prisma.usuario.upsert({
        where: { email: email },
        update: {
            password: hashedPassword,
            rol: 'ADMIN',
            debeCambiarPassword: false
        },
        create: {
            email: email,
            password: hashedPassword,
            nombre: 'Natalia Fusari',
            rol: 'ADMIN',
            debeCambiarPassword: false
        }
    })

    console.log('Administrador creado/actualizado correctamente:')
    console.log(`ID: ${admin.id}`)
    console.log(`Email: ${admin.email}`)
    console.log(`Nombre: ${admin.nombre}`)
    console.log(`Rol: ${admin.rol}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
