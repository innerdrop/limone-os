const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Diagnóstico de Inscripciones ---');

    // Obtener todos los talleres
    const talleres = await prisma.taller.findMany();
    console.log('\nTalleres registrados:');
    talleres.forEach(t => console.log(`- [${t.id}] ${t.nombre}`));

    // Buscar al usuario específico
    const email = 'ing.iyad@gmail.com';
    const inscripciones = await prisma.inscripcion.findMany({
        where: {
            alumno: {
                usuario: {
                    email: email
                }
            }
        },
        include: {
            taller: true,
            alumno: {
                include: {
                    usuario: true
                }
            }
        }
    });

    console.log(`\nInscripciones para ${email}:`);
    if (inscripciones.length === 0) {
        console.log('No se encontraron inscripciones.');
    } else {
        inscripciones.forEach(i => {
            console.log(`- ID Inscripción: ${i.id}`);
            console.log(`  Taller: ${i.taller.nombre} (ID: ${i.tallerId})`);
            console.log(`  Estado: ${i.estado}`);
            console.log(`  Día: ${i.dia}, Horario: ${i.horario}`);
        });
    }

    // Buscar si hay inscripciones con IDs de taller que no coinciden con los nombres
    console.log('\nResumen de todas las inscripciones activas:');
    const todas = await prisma.inscripcion.findMany({
        where: { estado: 'ACTIVA' },
        include: {
            taller: { select: { nombre: true } },
            alumno: { include: { usuario: { select: { email: true } } } }
        }
    });

    todas.forEach(i => {
        console.log(`- ${i.alumno.usuario.email} -> ${i.taller.nombre} (${i.tallerId})`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
