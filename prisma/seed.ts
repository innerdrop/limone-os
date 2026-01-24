import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Crear usuario admin (Natalia)
    const adminPassword = await hash('admin123', 12)
    const admin = await prisma.usuario.upsert({
        where: { email: 'natalia@limone.usev.app' },
        update: {
            password: adminPassword, // Force password update
        },
        create: {
            email: 'natalia@limone.usev.app',
            password: adminPassword,
            nombre: 'Natalia Fusari',
            rol: 'ADMIN',
            activo: true,
        },
    })
    console.log('✅ Admin creado:', admin.email)

    // Crear docente (para testing)
    const docentePassword = await hash('docente123', 12)
    const docente = await prisma.usuario.upsert({
        where: { email: 'docente@limone.usev.app' },
        update: {
            password: docentePassword,
        },
        create: {
            email: 'docente@limone.usev.app',
            password: docentePassword,
            nombre: 'Docente Demo',
            rol: 'DOCENTE',
            activo: true,
        },
    })
    console.log('✅ Docente creado:', docente.email)

    // Crear talleres
    const talleresData = [
        {
            nombre: 'Pintura al Óleo',
            descripcion: 'Domina las técnicas clásicas de los grandes maestros.',
            cupoMaximo: 8,
            precio: 28000,
            diasSemana: 'LUNES,MIERCOLES',
            horaInicio: '18:00',
        },
        {
            nombre: 'Acuarela Creativa',
            descripcion: 'Explora la transparencia y fluidez de la acuarela.',
            cupoMaximo: 10,
            precio: 25000,
            diasSemana: 'MARTES,JUEVES',
            horaInicio: '16:00',
        },
        {
            nombre: 'Dibujo Artístico',
            descripcion: 'Desarrollá tu trazo y dominio del lápiz.',
            cupoMaximo: 12,
            precio: 22000,
            diasSemana: 'VIERNES',
            horaInicio: '17:00',
        },
        {
            nombre: 'Técnicas Mixtas',
            descripcion: 'Combina materiales y libera tu creatividad.',
            cupoMaximo: 8,
            precio: 28000,
            diasSemana: 'SABADO',
            horaInicio: '10:00',
        },
    ]

    for (const taller of talleresData) {
        await prisma.taller.upsert({
            where: { nombre: taller.nombre },
            update: {},
            create: {
                nombre: taller.nombre,
                descripcion: taller.descripcion,
                cupoMaximo: taller.cupoMaximo,
                precio: taller.precio,
                diasSemana: taller.diasSemana,
                horaInicio: taller.horaInicio,
                activo: true,
            },
        })
    }
    console.log('✅ Talleres creados:', talleresData.length)

    // Crear alumno de prueba
    const alumnoPassword = await hash('alumno123', 12)
    const alumnoUser = await prisma.usuario.upsert({
        where: { email: 'alumno@demo.com' },
        update: {
            password: alumnoPassword,
        },
        create: {
            email: 'alumno@demo.com',
            password: alumnoPassword,
            nombre: 'María García',
            telefono: '+54 9 2901 111-111',
            rol: 'ALUMNO',
            activo: true,
        },
    })

    await prisma.alumno.upsert({
        where: { usuarioId: alumnoUser.id },
        update: {},
        create: {
            usuarioId: alumnoUser.id,
            fechaNacimiento: new Date('1996-05-15'),
            contactoEmergencia: 'Juan García',
            telefonoEmergencia: '+54 9 2901 222-222',
            nivel: 'INTERMEDIO',
        },
    })
    console.log('✅ Alumno demo creado:', alumnoUser.email)

    // Crear testimonios
    const testimonios = [
        {
            nombre: 'María García',
            texto: 'Taller Limoné cambió mi perspectiva del arte. Natalia tiene una paciencia increíble.',
        },
        {
            nombre: 'Carlos Rodríguez',
            texto: 'Nunca pensé que podría pintar algo tan lindo. El ambiente del taller es súper acogedor.',
        },
        {
            nombre: 'Ana Martínez',
            texto: 'Mi hija ama ir al taller. Ver cómo desarrolló su creatividad fue increíble.',
        },
    ]

    // Limpiar testimonios existentes y crear nuevos
    await prisma.testimonio.deleteMany({})
    for (const testimonio of testimonios) {
        await prisma.testimonio.create({
            data: {
                nombre: testimonio.nombre,
                texto: testimonio.texto,
                activo: true,
            },
        })
    }
    console.log('✅ Testimonios creados:', testimonios.length)

    console.log('')
    console.log('🎉 Seed completado!')
    console.log('')
    console.log('📧 Credenciales de acceso:')
    console.log('   Admin:   natalia@limone.usev.app / admin123')
    console.log('   Docente: docente@limone.usev.app / docente123')
    console.log('   Alumno:  alumno@demo.com / alumno123')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
