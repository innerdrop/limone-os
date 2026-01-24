const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function unifyFinanzas() {
    console.log('🚀 Iniciando unificación de finanzas y duplicados...');

    // 1. Obtener todos los alumnos que tienen más de una inscripción activa para el mismo taller
    const alumnos = await prisma.alumno.findMany({
        include: {
            inscripciones: {
                where: { estado: 'ACTIVA' },
                include: { taller: true, pagos: true }
            }
        }
    });

    for (const alumno of alumnos) {
        // Agrupar inscripciones por taller
        const inscripcionesPorTaller = {};
        alumno.inscripciones.forEach(insc => {
            const tallerId = insc.tallerId;
            if (!inscripcionesPorTaller[tallerId]) inscripcionesPorTaller[tallerId] = [];
            inscripcionesPorTaller[tallerId].push(insc);
        });

        for (const tallerId in inscripcionesPorTaller) {
            const grupo = inscripcionesPorTaller[tallerId];
            if (grupo.length > 1) {
                console.log(`\nMerging ${grupo.length} inscripciones for ${alumno.usuarioId} in taller ${tallerId}`);

                // Conservar la primera, mezclar las demás
                const baseInsc = grupo[0];
                const otrasInsc = grupo.slice(1);

                const diasUnificados = [...new Set(grupo.map(i => i.dia).filter(Boolean))].join(', ');
                const horariosUnificados = [...new Set(grupo.map(i => i.horario).filter(Boolean))].join(' / ');
                const notasUnificadas = [...new Set(grupo.map(i => i.notas).filter(Boolean))].join(' | ');

                // 2. Mover pagos a la inscripción base
                for (const inscToMove of otrasInsc) {
                    await prisma.pago.updateMany({
                        where: { inscripcionId: inscToMove.id },
                        data: { inscripcionId: baseInsc.id }
                    });
                }

                // 3. Actualizar inscripción base
                await prisma.inscripcion.update({
                    where: { id: baseInsc.id },
                    data: {
                        dia: diasUnificados,
                        horario: horariosUnificados,
                        notas: notasUnificadas
                    }
                });

                // 4. Eliminar inscripciones redundantes
                const idsToDelete = otrasInsc.map(i => i.id);
                await prisma.inscripcion.deleteMany({
                    where: { id: { in: idsToDelete } }
                });
                console.log(`✅ Inscripciones unificadas para ${alumno.id}`);
            }
        }

        // 5. Unificar Pagos duplicados (mismo mes/año/taller)
        // Recargar pagos del alumno
        const pagos = await prisma.pago.findMany({
            where: { alumnoId: alumno.id, estado: 'PENDIENTE' },
            include: { inscripcion: { include: { taller: true } } }
        });

        const pagosPorPeriodo = {};
        pagos.forEach(p => {
            const key = `${p.mesCubierto}-${p.anioCubierto}-${p.inscripcion.taller.nombre}`;
            if (!pagosPorPeriodo[key]) pagosPorPeriodo[key] = [];
            pagosPorPeriodo[key].push(p);
        });

        for (const key in pagosPorPeriodo) {
            const grupoPagos = pagosPorPeriodo[key];
            if (grupoPagos.length > 1) {
                console.log(`Merging ${grupoPagos.length} payments for period ${key}`);
                const basePago = grupoPagos[0];
                const otrosPagos = grupoPagos.slice(1);

                const montoTotal = grupoPagos.reduce((sum, p) => sum + p.monto, 0);
                const conceptoUnificado = [...new Set(grupoPagos.map(p => p.concepto).filter(Boolean))].join(' + ');

                await prisma.pago.update({
                    where: { id: basePago.id },
                    data: {
                        monto: montoTotal,
                        concepto: conceptoUnificado
                    }
                });

                await prisma.pago.deleteMany({
                    where: { id: { in: otrosPagos.map(p => p.id) } }
                });
                console.log(`✅ Pagos unificados para ${alumno.id} periodo ${key}`);
            }
        }
    }

    console.log('\n✨ Proceso de unificación de finanzas terminado.');
}

unifyFinanzas()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
