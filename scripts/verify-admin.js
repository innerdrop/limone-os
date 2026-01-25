require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function verifyUser() {
    const email = 'natalia@tallerlimone.com'
    const password = '2026Limon3*'

    console.log(`🔍 Verificando usuario: ${email}...`)

    try {
        const user = await prisma.usuario.findUnique({
            where: { email }
        })

        if (!user) {
            console.log('❌ El usuario no existe en la base de datos.')
            return
        }

        console.log('✅ Usuario encontrado en la DB.')
        console.log(`   Rol: ${user.rol}`)
        console.log(`   Activo: ${user.activo}`)

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            console.log('✅ La contraseña coincide con el hash en la DB.')
        } else {
            console.log('❌ La contraseña NO coincide con el hash en la DB.')
        }
    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

verifyUser()
