const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Iniciando eliminación de Taller de Verano 2026 ---');

    // Primero buscamos para ver qué ID tiene
    const taller = await prisma.taller.findFirst({
        where: {
            nombre: {
                contains: 'verano 2026',
                mode: 'insensitive'
            }
        }
    });

    if (!taller) {
        console.log('No se encontró ningún taller con ese nombre.');
        return;
    }

    console.log(`Encontrado: ${taller.nombre} (ID: ${taller.id})`);

    // Intentamos eliminarlo. Si tiene inscripciones, Prisma fallará por integridad referencial
    // a menos que hayamos configurado el cascade delete.
    try {
        const deleted = await prisma.taller.delete({
            where: { id: taller.id }
        });
        console.log(`Taller "${deleted.nombre}" eliminado con éxito.`);
    } catch (error) {
        if (error.code === 'P2003') {
            console.log('No se puede eliminar porque tiene inscripciones o datos asociados.');
            console.log('Procediendo a desactivarlo en su lugar para mantener integridad...');
            const updated = await prisma.taller.update({
                where: { id: taller.id },
                data: { activo: false, nombre: `${taller.nombre} (Eliminado)` }
            });
            console.log(`Taller desactivado y renombrado a: ${updated.nombre}`);
        } else {
            throw error;
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
