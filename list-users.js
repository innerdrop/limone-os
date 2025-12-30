const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listUsers() {
    try {
        const users = await prisma.usuario.findMany({
            include: { alumno: true }
        })
        console.log('--- Current Users ---')
        users.forEach(u => {
            console.log(`Email: ${u.email}, Rol: ${u.rol}, Alumno: ${!!u.alumno}, Alumno DNI: ${u.alumno?.dni || 'N/A'}`)
        })
    } catch (e) { console.error(e) } finally { await prisma.$disconnect() }
}

listUsers()
