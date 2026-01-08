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
                alumno: {
                    include: {
                        inscripciones: true,
                        citasNivelacion: true,
                        pagos: true
                    }
                }
            }
        })

        if (!usuario) {
            console.log('❌ Usuario no encontrado')
            return
        }

        if (!usuario.alumno) {
            console.log('❌ El usuario no tiene perfil de alumno')
            return
        }

        console.log(`\n✅ Usuario encontrado: ${usuario.nombre}`)
        console.log(`📊 Resumen actual:`)
        console.log(`   - Inscripciones: ${usuario.alumno.inscripciones.length}`)
        console.log(`   - Citas de Nivelación: ${usuario.alumno.citasNivelacion.length}`)
        console.log(`   - Pagos: ${usuario.alumno.pagos.length}`)

        // Delete all related data
        console.log(`\n🗑️  Eliminando datos...`)

        // Delete payments (must be first due to foreign key constraints)
        const deletedPagos = await prisma.pago.deleteMany({
            where: { alumnoId: usuario.alumno.id }
        })
        console.log(`   ✓ Pagos eliminados: ${deletedPagos.count}`)

        // Delete enrollments
        const deletedInscripciones = await prisma.inscripcion.deleteMany({
            where: { alumnoId: usuario.alumno.id }
        })
        console.log(`   ✓ Inscripciones eliminadas: ${deletedInscripciones.count}`)

        // Delete placement test appointments
        const deletedCitas = await prisma.citaNivelacion.deleteMany({
            where: { alumnoId: usuario.alumno.id }
        })
        console.log(`   ✓ Citas de nivelación eliminadas: ${deletedCitas.count}`)

        // Delete notifications
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
