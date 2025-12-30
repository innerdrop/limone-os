const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    await prisma.alumno.update({
        where: { tutorEmail: 'juan-pwd@test.com' },
        data: { perfilCompleto: true }
    })
    console.log('User status updated')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
