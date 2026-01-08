const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Update all workshops to 'Taller de Arte' (or a generic name)
    // Actually, usually they have one for regular and one for summer.
    // Let's see what we have.
    const workshops = await prisma.taller.findMany()
    console.log('Workshops found:', workshops.map(w => w.nombre))

    for (const w of workshops) {
        if (w.nombre.toLowerCase().includes('verano')) {
            await prisma.taller.update({
                where: { id: w.id },
                data: { nombre: 'Taller de Verano' }
            })
        } else {
            // Check if there is already a 'Taller de Arte' to avoid unique constraint error
            const exists = await prisma.taller.findFirst({ where: { nombre: 'Taller de Arte' } })
            if (!exists || exists.id === w.id) {
                await prisma.taller.update({
                    where: { id: w.id },
                    data: { nombre: 'Taller de Arte' }
                })
            } else {
                // If it exists, maybe delete this duplicate or rename it
                await prisma.taller.update({
                    where: { id: w.id },
                    data: { nombre: `Taller de Arte - ${w.id.substring(0, 4)}` }
                })
            }
        }
    }
    console.log('Workshops updated.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
