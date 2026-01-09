const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Actualizando talleres...')

    // 1. Taller de Arte
    const tallerArte = await prisma.taller.upsert({
        where: { nombre: 'Taller de Arte' },
        update: {
            descripcion: 'Taller de dibujo y pintura para niños y adolescentes. 3 turnos disponibles por día.',
            cupoMaximo: 10,
            precio: 25000,
            duracion: 80,
            diasSemana: 'Martes a Viernes',
            horaInicio: '16:00',
            activo: true
        },
        create: {
            nombre: 'Taller de Arte',
            descripcion: 'Taller de dibujo y pintura para niños y adolescentes. 3 turnos disponibles por día.',
            cupoMaximo: 10,
            precio: 25000,
            duracion: 80,
            diasSemana: 'Martes a Viernes',
            horaInicio: '16:00',
            activo: true
        }
    })
    console.log('Taller de Arte actualizado:', tallerArte.id)

    // 2. Taller de Verano (Bonus, ensuring it exists)
    const tallerVerano = await prisma.taller.upsert({
        where: { nombre: 'Taller de Verano' },
        update: {
            descripcion: 'Colonia de arte para niños de 5 a 12 años. Enero y Febrero.',
            cupoMaximo: 10,
            precio: 100000,
            duracion: 120,
            diasSemana: 'Lunes a Viernes',
            horaInicio: '10:00',
            activo: true
        },
        create: {
            nombre: 'Taller de Verano',
            descripcion: 'Colonia de arte para niños de 5 a 12 años. Enero y Febrero.',
            cupoMaximo: 10,
            precio: 100000,
            duracion: 120,
            diasSemana: 'Lunes a Viernes',
            horaInicio: '10:00',
            activo: true
        }
    })
    console.log('Taller de Verano actualizado:', tallerVerano.id)

    // 3. Desactivar otros talleres si existen para limpiar la vista
    await prisma.taller.updateMany({
        where: {
            NOT: {
                nombre: { in: ['Taller de Arte', 'Taller de Verano'] }
            }
        },
        data: { activo: false }
    })
    console.log('Otros talleres desactivados.')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
