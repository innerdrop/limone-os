const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Restaurando talleres...')

    const tallerRegular = await prisma.taller.upsert({
        where: { nombre: 'Taller de Arte' },
        update: {},
        create: {
            nombre: 'Taller de Arte',
            descripcion: 'Taller regular de artes plásticas para niños y adolescentes.',
            cupoMaximo: 10,
            precio: 25000,
            duracion: 80,
            activo: true,
            diasSemana: 'Martes, Miércoles, Jueves, Viernes',
            horaInicio: '16:00'
        }
    })

    const tallerVerano = await prisma.taller.upsert({
        where: { nombre: 'Taller de Verano 2026' },
        update: {},
        create: {
            nombre: 'Taller de Verano 2026',
            descripcion: 'Edición especial de verano con actividades recreativas y artísticas.',
            cupoMaximo: 12,
            precio: 18000,
            duracion: 120,
            activo: true,
            diasSemana: 'Lunes, Martes, Miércoles, Jueves',
            horaInicio: '10:00'
        }
    })

    console.log('Talleres restaurados:', { tallerRegular, tallerVerano })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
