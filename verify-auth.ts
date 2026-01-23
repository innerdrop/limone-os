import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

async function testAuth() {
    console.log('🔍 Testing authentication...')

    const email = 'natalia@limone.usev.app'
    const password = 'admin123'

    const user = await prisma.usuario.findUnique({
        where: { email }
    })

    if (!user) {
        console.error('❌ User not found:', email)
        return
    }

    console.log('✅ User found:', user.email, 'Role:', user.rol)
    console.log('🔑 Stored hash:', user.password)

    const isValid = await compare(password, user.password)

    if (isValid) {
        console.log('✅ Password matches!')
    } else {
        console.error('❌ Password does NOT match!')
    }
}

testAuth()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
