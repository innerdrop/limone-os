// Script to migrate data from Supabase to local Docker
// Run with: npx tsx scripts/migrate-from-supabase.ts

import { PrismaClient } from '@prisma/client'

const supabase = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres.vjwmpmikpkkeyayfvtmw:2026limon3*@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
        }
    }
})

const local = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://limone:limone_dev_2025@localhost:5433/limone"
        }
    }
})

async function migrate() {
    console.log('🔄 Conectando a Supabase...')

    try {
        // 1. Users
        const usuarios = await supabase.usuario.findMany()
        console.log(`👤 ${usuarios.length} usuarios encontrados`)
        for (const u of usuarios) {
            await local.usuario.upsert({
                where: { id: u.id },
                update: {},
                create: u as any
            })
        }
        console.log('✅ Usuarios migrados')

        // 2. Students
        const alumnos = await supabase.alumno.findMany()
        console.log(`🎨 ${alumnos.length} alumnos encontrados`)
        for (const a of alumnos) {
            await local.alumno.upsert({
                where: { id: a.id },
                update: {},
                create: a as any
            })
        }
        console.log('✅ Alumnos migrados')

        // 3. Workshops
        const talleres = await supabase.taller.findMany()
        console.log(`🏫 ${talleres.length} talleres encontrados`)
        for (const t of talleres) {
            await local.taller.upsert({
                where: { id: t.id },
                update: {},
                create: t as any
            })
        }
        console.log('✅ Talleres migrados')

        // 4. Classes
        const clases = await supabase.clase.findMany()
        console.log(`📚 ${clases.length} clases encontradas`)
        for (const c of clases) {
            await local.clase.upsert({
                where: { id: c.id },
                update: {},
                create: c as any
            })
        }
        console.log('✅ Clases migradas')

        // 5. Enrollments
        const inscripciones = await supabase.inscripcion.findMany()
        console.log(`📝 ${inscripciones.length} inscripciones encontradas`)
        for (const i of inscripciones) {
            await local.inscripcion.upsert({
                where: { id: i.id },
                update: {},
                create: i as any
            })
        }
        console.log('✅ Inscripciones migradas')

        // 6. Payments
        const pagos = await supabase.pago.findMany()
        console.log(`💰 ${pagos.length} pagos encontrados`)
        for (const p of pagos) {
            await local.pago.upsert({
                where: { id: p.id },
                update: {},
                create: p as any
            })
        }
        console.log('✅ Pagos migrados')

        // 7. Notifications
        const notificaciones = await supabase.notificacion.findMany()
        console.log(`🔔 ${notificaciones.length} notificaciones encontradas`)
        for (const n of notificaciones) {
            await local.notificacion.upsert({
                where: { id: n.id },
                update: {},
                create: n as any
            })
        }
        console.log('✅ Notificaciones migradas')

        // 8. Slides
        const slides = await supabase.slide.findMany()
        console.log(`🖼️ ${slides.length} slides encontrados`)
        for (const s of slides) {
            await local.slide.upsert({
                where: { id: s.id },
                update: {},
                create: s as any
            })
        }
        console.log('✅ Slides migrados')

        // 9. Configuration
        const config = await supabase.configuracion.findMany()
        console.log(`⚙️ ${config.length} configuraciones encontradas`)
        for (const c of config) {
            await local.configuracion.upsert({
                where: { id: c.id },
                update: {},
                create: c as any
            })
        }
        console.log('✅ Configuraciones migradas')

        // 10. Testimonials
        const testimonios = await supabase.testimonio.findMany()
        console.log(`💬 ${testimonios.length} testimonios encontrados`)
        for (const t of testimonios) {
            await local.testimonio.upsert({
                where: { id: t.id },
                update: {},
                create: t as any
            })
        }
        console.log('✅ Testimonios migrados')

        // 11. Tasks
        const tareas = await supabase.tarea.findMany()
        console.log(`📋 ${tareas.length} tareas encontradas`)
        for (const t of tareas) {
            await local.tarea.upsert({
                where: { id: t.id },
                update: {},
                create: t as any
            })
        }
        console.log('✅ Tareas migradas')

        // 12. Artworks
        const obras = await supabase.obra.findMany()
        console.log(`🎭 ${obras.length} obras encontradas`)
        for (const o of obras) {
            await local.obra.upsert({
                where: { id: o.id },
                update: {},
                create: o as any
            })
        }
        console.log('✅ Obras migradas')

        console.log('\n🎉 ¡Migración completada exitosamente!')

    } catch (error) {
        console.error('❌ Error durante la migración:', error)
    } finally {
        await supabase.$disconnect()
        await local.$disconnect()
    }
}

migrate()
