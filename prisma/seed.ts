import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database with unified workshops...')

    // 1. Crear usuario admin (Natalia)
    const adminPassword = await hash('admin123', 12)
    const admin = await prisma.usuario.upsert({
        where: { email: 'natalia@tallerlimone.com' },
        update: {
            password: adminPassword,
        },
        create: {
            email: 'natalia@tallerlimone.com',
            password: adminPassword,
            nombre: 'Natalia Fusari',
            rol: 'ADMIN',
            activo: true,
        },
    })
    console.log('✅ Admin creado:', admin.email)

    // 2. Crear Unified Workshops (Solo estos dos deben existir)
    const talleresUnified = [
        {
            nombre: 'Taller Regular',
            descripcion: 'Curso anual de arte para todas las edades. Dividido en fases.',
            cupoMaximo: 10,
            precio: 25000,
            diasSemana: 'MARTES a VIERNES',
            horaInicio: '16:00, 17:30, 19:10',
            activo: true
        },
        {
            nombre: 'Taller de Verano',
            descripcion: 'Talleres intensivos durante Enero y Febrero.',
            cupoMaximo: 10,
            precio: 75000,
            diasSemana: 'LUNES a VIERNES',
            horaInicio: 'Mañana y Tarde',
            activo: true
        }
    ]

    for (const tallerData of talleresUnified) {
        await prisma.taller.upsert({
            where: { nombre: tallerData.nombre },
            update: {
                descripcion: tallerData.descripcion,
                precio: tallerData.precio,
                diasSemana: tallerData.diasSemana,
                horaInicio: tallerData.horaInicio,
                activo: true
            },
            create: tallerData
        })
    }
    console.log('✅ Talleres unificados creados')

    // 3. Crear testimonios básicos
    const testimonios = [
        {
            nombre: 'María García',
            texto: 'Taller Limoné cambió mi perspectiva del arte. Natalia tiene una paciencia increíble.',
        },
        {
            nombre: 'Ana Martínez',
            texto: 'Mi hija ama ir al taller. Ver cómo desarrolló su creatividad fue increíble.',
        }
    ]

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
    console.log('✅ Testimonios creados')

    console.log('🎉 Seed completado!')
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
