const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUser() {
    try {
        const user = await prisma.usuario.findUnique({
            where: { email: 'test@test.com' },
            include: { alumno: true }
        })

        console.log('Usuario encontrado:', JSON.stringify(user, null, 2))

        if (!user) {
            console.log('❌ Usuario NO encontrado en la base de datos')
        } else {
            console.log('✅ Usuario encontrado')
            console.log('Email:', user.email)
            console.log('Nombre:', user.nombre)
            console.log('Rol:', user.rol)
            console.log('Activo:', user.activo)
            console.log('Tiene alumno:', !!user.alumno)
        }
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkUser()
