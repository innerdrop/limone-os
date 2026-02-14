const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando limpieza de pagos pendientes...');

    // 1. Encontrar todos los pagos pendientes o por verificar
    const pagos = await prisma.pago.findMany({
        where: {
            estado: { in: ['PENDIENTE', 'PENDIENTE_VERIFICACION'] }
        },
        include: {
            inscripcion: true,
            alumno: {
                include: {
                    usuario: true
                }
            }
        }
    });

    console.log(`Se encontraron ${pagos.length} pagos para procesar.`);

    for (const pago of pagos) {
        console.log(`Procesando pago ${pago.id} de ${pago.alumno?.usuario?.nombre || 'Alumno'}...`);

        // Actualizar el pago a RECHAZADO
        await prisma.pago.update({
            where: { id: pago.id },
            data: { estado: 'RECHAZADO' }
        });

        // Si la inscripción no está pagada y no tiene otros pagos activos, la cancelamos para que desaparezca de la agenda
        if (pago.inscripcion && pago.inscripcion.estado !== 'CANCELADA') {
            console.log(`Cancelando inscripción ${pago.inscripcion.id} asociada...`);
            await prisma.inscripcion.update({
                where: { id: pago.inscripcion.id },
                data: {
                    estado: 'CANCELADA',
                    notas: (pago.inscripcion.notas || '') + '\n[LIMPIEZA AUTOMÁTICA] Cancelada por pedido de admin para limpiar pendientes.'
                }
            });
        }
    }

    console.log('Limpieza completada con éxito.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
