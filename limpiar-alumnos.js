const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('⚠️ ADVERTENCIA: Este script eliminará TODOS los alumnos, sus usuarios asociados y toda su información relacionada (pagos, inscripciones, asistencias, etc.)');
    console.log('No afectará a los administradores ni a los docentes.');

    // 1. Identificar usuarios con rol ALUMNO
    const usuariosAlumno = await prisma.usuario.findMany({
        where: { rol: 'ALUMNO' },
        select: { id: true, nombre: true }
    });

    console.log(`\nSe encontraron ${usuariosAlumno.length} usuarios con rol ALUMNO.`);

    if (usuariosAlumno.length === 0) {
        console.log('No hay alumnos para eliminar.');
        return;
    }

    // 2. Eliminar usuarios (esto disparará el CASCADE en Alumno, Inscripcion, Pago, etc.)
    console.log('Iniciando eliminación masiva...');

    const result = await prisma.usuario.deleteMany({
        where: {
            id: { in: usuariosAlumno.map(u => u.id) }
        }
    });

    console.log(`✅ ¡Eliminación completada con éxito!`);
    console.log(`Usuarios eliminados: ${result.count}`);
    console.log('\nRelaciones eliminadas automáticamente por CASCADE:');
    console.log('- Perfiles de Alumno');
    console.log('- Inscripciones');
    console.log('- Pagos y registros de facturación');
    console.log('- Asistencias');
    console.log('- Obras realizadas');
    console.log('- Solicitudes de recuperación');
    console.log('- Créditos de clases extra');
    console.log('- Notificaciones');
    console.log('- Citas de nivelación');
}

main()
    .catch((e) => {
        console.error('❌ Error durante la eliminación:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
