const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function unify() {
    console.log('🚀 Iniciando unificación de talleres...');

    // 1. Asegurar que existan los dos talleres base
    const regular = await prisma.taller.upsert({
        where: { nombre: 'Taller Regular' },
        update: {},
        create: {
            nombre: 'Taller Regular',
            descripcion: 'Curso anual de arte para todas las edades.',
            cupoMaximo: 10,
            precio: 25000,
            activo: true
        }
    });

    const verano = await prisma.taller.upsert({
        where: { nombre: 'Taller de Verano' },
        update: {},
        create: {
            nombre: 'Taller de Verano',
            descripcion: 'Talleres intensivos durante Enero y Febrero.',
            cupoMaximo: 10,
            precio: 75000,
            activo: true
        }
    });

    // 2. Mover todas las inscripciones
    const inscripciones = await prisma.inscripcion.findMany({
        include: { taller: true }
    });

    console.log(`📦 Reasignando ${inscripciones.length} inscripciones...`);

    for (const insc of inscripciones) {
        const esVerano = insc.taller.nombre.toLowerCase().includes('verano') || insc.fase?.toLowerCase().includes('verano');
        const nuevoTallerId = esVerano ? verano.id : regular.id;

        await prisma.inscripcion.update({
            where: { id: insc.id },
            data: {
                tallerId: nuevoTallerId,
                // Limpiamos nombres de técnicas viejas si están en notas/fase?
            }
        });
    }

    // 3. Eliminar talleres viejos
    const deleted = await prisma.taller.deleteMany({
        where: {
            id: {
                notIn: [regular.id, verano.id]
            }
        }
    });

    console.log(`🗑️ Se eliminaron ${deleted.count} talleres antiguos.`);
    console.log('✅ Unificación completada con éxito.');
}

unify()
    .catch(e => {
        console.error(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
