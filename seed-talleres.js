const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const talleres = [
        {
            nombre: 'Pintura al Óleo',
            descripcion: 'Técnicas clásicas y contemporáneas de óleo sobre lienzo.',
            precio: 15000,
            cupoMaximo: 12,
            activo: true
        },
        {
            nombre: 'Acrílico',
            descripcion: 'Exploración de color y texturas con pintura acrílica de secado rápido.',
            precio: 12500,
            cupoMaximo: 15,
            activo: true
        },
        {
            nombre: 'Acuarela',
            descripcion: 'Transparencias y efectos de luz con técnicas de acuarela profesional.',
            precio: 13000,
            cupoMaximo: 10,
            activo: true
        }
    ]

    for (const taller of talleres) {
        await prisma.taller.upsert({
            where: { nombre: taller.nombre },
            update: taller,
            create: taller
        })
    }

    console.log('Talleres sembrados con éxito')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
