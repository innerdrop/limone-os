const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testPassword() {
    try {
        const user = await prisma.usuario.findUnique({
            where: { email: 'test@test.com' }
        })

        if (!user) {
            console.log('❌ Usuario NO encontrado')
            return
        }

        console.log('✅ Usuario encontrado')
        console.log('Email:', user.email)
        console.log('Password hash:', user.password)

        // Test password
        const testPassword = '1234'
        const isValid = await bcrypt.compare(testPassword, user.password)

        console.log('\nTest password "1234":', isValid ? '✅ CORRECTO' : '❌ INCORRECTO')

        // Try to hash and compare
        const newHash = await bcrypt.hash(testPassword, 10)
        console.log('\nNuevo hash de "1234":', newHash)
        const testNew = await bcrypt.compare(testPassword, newHash)
        console.log('Test con nuevo hash:', testNew ? '✅ CORRECTO' : '❌ INCORRECTO')

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testPassword()
