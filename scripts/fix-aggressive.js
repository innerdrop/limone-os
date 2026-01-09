const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- REPARACIÓN AGRESIVA DE INSCRIPCIONES ---');

    // 1. Encontrar el taller de Verano activo
    const tallerVerano = await prisma.taller.findFirst({
        where: {
            nombre: { contains: 'Verano', mode: 'insensitive' },
            activo: true
        }
    });

    if (!tallerVerano) {
        console.error('No se encontró el Taller de Verano activo.');
        return;
    }

    console.log(`Taller de Verano Destino: ${tallerVerano.nombre} (ID: ${tallerVerano.id})`);

    // 2. Buscar TODAS las inscripciones que parezcan de verano pero tengan otro tallerId
    const inscVerano = await prisma.inscripcion.findMany({
        where: {
            NOT: { tallerId: tallerVerano.id },
            OR: [
                { fase: { contains: 'Verano', mode: 'insensitive' } },
                { fase: { contains: 'Colonia', mode: 'insensitive' } },
                { dia: { contains: 'Verano', mode: 'insensitive' } },
                { notas: { contains: 'Verano', mode: 'insensitive' } },
                { notas: { contains: 'Colonia', mode: 'insensitive' } }
            ]
        },
        include: {
            taller: true,
            alumno: { include: { usuario: true } }
        }
    });

    console.log(`Encontradas ${inscVerano.length} inscripciones mal vinculadas.`);

    for (const i of inscVerano) {
        console.log(`- Corrigiendo: ${i.alumno.usuario.email} (${i.alumno.usuario.nombre})`);
        console.log(`  De: ${i.taller.nombre} -> A: ${tallerVerano.nombre}`);

        await prisma.inscripcion.update({
            where: { id: i.id },
            data: { tallerId: tallerVerano.id }
        });
    }

    console.log('\n--- Reparación completada ---');
}

main().finally(() => prisma.$disconnect());
