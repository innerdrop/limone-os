const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Corrigiendo asignación de Talleres ---');

    // 1. Obtener los IDs de los talleres
    const tallerArte = await prisma.taller.findFirst({
        where: { nombre: { contains: 'Arte', mode: 'insensitive' } }
    });
    const tallerVerano = await prisma.taller.findFirst({
        where: { nombre: { contains: 'Verano', mode: 'insensitive' } }
    });

    if (!tallerArte || !tallerVerano) {
        console.error('Error: No se encontraron los talleres necesarios.');
        console.log('Arte:', tallerArte ? 'OK' : 'No encontrado');
        console.log('Verano:', tallerVerano ? 'OK' : 'No encontrado');
        return;
    }

    console.log(`Taller Arte ID: ${tallerArte.id}`);
    console.log(`Taller Verano ID: ${tallerVerano.id}`);

    // 2. Buscar inscripciones que deberían ser de verano pero están en arte
    const malAsignadas = await prisma.inscripcion.findMany({
        where: {
            tallerId: tallerArte.id,
            OR: [
                { fase: 'Colonia de Verano' },
                { dia: 'VERANO' }
            ]
        },
        include: {
            alumno: { include: { usuario: true } }
        }
    });

    console.log(`\nInscripciones mal asignadas encontradas: ${malAsignadas.length}`);

    for (const insc of malAsignadas) {
        console.log(`- Moviendo a ${insc.alumno.usuario.email} (${insc.alumno.usuario.nombre}) al Taller de Verano...`);

        await prisma.inscripcion.update({
            where: { id: insc.id },
            data: { tallerId: tallerVerano.id }
        });
    }

    console.log('\n--- Proceso completado con éxito ---');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
