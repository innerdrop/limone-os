const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const email = 'juan-pwd@test.com'
    console.log(`Searching for alumno with tutorEmail: ${email}`)

    const alumno = await prisma.alumno.findFirst({
        where: { tutorEmail: email }
    })

    if (alumno) {
        console.log(`Found alumno: ${alumno.id}. Updating...`)
        await prisma.alumno.update({
            where: { id: alumno.id },
            data: { perfilCompleto: true }
        })
        console.log('Update successful')
    } else {
        console.log('Alumno not found')
        const allAlumnos = await prisma.alumno.findMany()
        console.log('Current Alumnos in DB:', allAlumnos.map(a => a.tutorEmail))
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
