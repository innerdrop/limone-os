import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupTestUser() {
    const testEmail = 'ing.iyad@gmail.com'

    try {
        console.log(`🔍 Buscando usuario: ${testEmail}`)

        // Find user
        const usuario = await prisma.usuario.findUnique({
            where: { email: testEmail },
            include: {
                alumnos: {
                    include: {
                        inscripciones: true,
                        citasNivelacion: true,
                        pagos: true
                    }
                }
            }
        }) as any

        if (!usuario) {
            console.log('❌ Usuario no encontrado')
            return
        }

        if (!usuario.alumnos || usuario.alumnos.length === 0) {
            console.log('❌ El usuario no tiene perfiles de alumnos')
            return
        }

        console.log(`\n✅ Usuario encontrado: ${usuario.nombre}`)
        console.log(`📊 Total de alumnos: ${usuario.alumnos.length}`)

        // Delete all related data for each student
        console.log(`\n🗑️  Eliminando datos...`)

        for (const alumno of usuario.alumnos) {
            console.log(`📍 Procesando alumno: ${alumno.nombre || 'Sin nombre'} (${alumno.id})`)

            // Delete payments
            const deletedPagos = await prisma.pago.deleteMany({
                where: { alumnoId: alumno.id }
            })
            console.log(`   ✓ Pagos eliminados: ${deletedPagos.count}`)

            // Delete enrollments
            const deletedInscripciones = await prisma.inscripcion.deleteMany({
                where: { alumnoId: alumno.id }
            })
            console.log(`   ✓ Inscripciones eliminadas: ${deletedInscripciones.count}`)

            // Delete placement test appointments
            const deletedCitas = await prisma.citaNivelacion.deleteMany({
                where: { alumnoId: alumno.id }
            })
            console.log(`   ✓ Citas de nivelación eliminadas: ${deletedCitas.count}`)
        }

        // Delete notifications for the user
        const deletedNotifs = await prisma.notificacion.deleteMany({
            where: { usuarioId: usuario.id }
        })
        console.log(`   ✓ Notificaciones eliminadas: ${deletedNotifs.count}`)

        console.log(`\n✨ Limpieza completada exitosamente!`)
        console.log(`El usuario ${testEmail} está listo para nuevas pruebas.`)

    } catch (error) {
        console.error('❌ Error durante la limpieza:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

cleanupTestUser()
    .then(() => {
        console.log('\n✅ Script finalizado')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Error fatal:', error)
        process.exit(1)
    })
