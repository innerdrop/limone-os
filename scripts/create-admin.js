require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
    console.log('🔐 Configurando usuario administrador...\n')

    const email = 'natalia@tallerlimone.com'
    const password = '2026Limon3*'
    const nombre = 'Natalia Fusari'

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Upsert the admin user
        const admin = await prisma.usuario.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                nombre,
                rol: 'ADMIN',
                activo: true,
                debeCambiarPassword: false,
            },
            create: {
                email,
                password: hashedPassword,
                nombre,
                rol: 'ADMIN',
                activo: true,
                debeCambiarPassword: false,
            },
        })

        console.log('✅ Usuario administrador configurado:')
        console.log(`   📧 Email: ${admin.email}`)
        console.log(`   👤 Nombre: ${admin.nombre}`)
        console.log(`   🔑 Rol: ${admin.rol}`)
        console.log(`   ✓ Activo: ${admin.activo}`)
        console.log('\n🎉 ¡Listo para producción!')
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

createAdmin()
