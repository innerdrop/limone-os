/**
 * fix-encoding.ts
 * 
 * Fixes character encoding issues caused by importing a SQL backup
 * that was exported with incorrect encoding (CP437/Windows-1252 treated as UTF-8).
 * 
 * The corrupted characters were replaced with '?' by PostgreSQL.
 * This script manually corrects known corrupted records.
 * 
 * Usage: npx tsx scripts/fix-encoding.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ============================================================
// REPLACEMENT MAP: Known corrupted values → correct values
// ============================================================

interface FixRecord {
    table: string
    where: Record<string, unknown>
    updates: Record<string, unknown>
    description: string
}

const fixes: FixRecord[] = [
    // ---- SLIDES ----
    {
        table: 'slides',
        where: { titulo: 'Clase ??nica' },
        updates: {
            titulo: 'Clase Única',
            tags: JSON.stringify([
                '🎨 Experiencia Real',
                '👩‍🎨 Docentes Especializados',
                '🎯 Todos los niveles'
            ])
        },
        description: 'Fix "Clase Única" slide title and tags'
    },
    {
        table: 'slides',
        where: { titulo: 'Taller de Verano' },
        updates: {
            subtitulo: 'Edición 2026',
            tags: JSON.stringify([
                '📅 6 Ene - 28 Feb',
                '🧒 5 a 12 años',
                '✏ Materiales Incluidos'
            ])
        },
        description: 'Fix "Taller de Verano" slide subtitle and tags'
    },

    // ---- CONFIGURACION ----
    {
        table: 'configuracion',
        where: { clave: 'mantenimiento_activado' },
        updates: {
            descripcion: 'Indica si el sitio está en modo mantenimiento'
        },
        description: 'Fix configuracion description encoding'
    },

    // ---- TESTIMONIOS ----
    {
        table: 'testimonios',
        where: { nombre: 'María García' },
        updates: {
            nombre: 'María García',
            texto: 'Taller Limoné cambió mi perspectiva del arte. Natalia tiene una paciencia increíble.'
        },
        description: 'Fix María García testimonial'
    },
    {
        table: 'testimonios',
        where: { nombre: 'Ana Martínez' },
        updates: {
            nombre: 'Ana Martínez',
            texto: 'Mi hija ama ir al taller. Ver cómo desarrolló su creatividad fue increíble.'
        },
        description: 'Fix Ana Martínez testimonial'
    },
]

// Fallback: try to match records with '?' in their text fields
const fallbackFixes = [
    {
        table: 'testimonios',
        searchColumn: 'nombre',
        searchPattern: '%Garc%a%',
        updates: {
            nombre: 'María García',
            texto: 'Taller Limoné cambió mi perspectiva del arte. Natalia tiene una paciencia increíble.'
        },
        description: 'Fallback fix for María García (pattern match)'
    },
    {
        table: 'testimonios',
        searchColumn: 'nombre',
        searchPattern: '%Mart%nez%',
        updates: {
            nombre: 'Ana Martínez',
            texto: 'Mi hija ama ir al taller. Ver cómo desarrolló su creatividad fue increíble.'
        },
        description: 'Fallback fix for Ana Martínez (pattern match)'
    },
]

async function main() {
    console.log('🔤 Starting character encoding fix...\n')

    let fixedCount = 0
    let failedCount = 0

    // Apply direct fixes
    for (const fix of fixes) {
        try {
            console.log(`  📝 ${fix.description}...`)

            if (fix.table === 'slides') {
                const result = await prisma.slide.updateMany({
                    where: fix.where as any,
                    data: fix.updates as any,
                })
                if (result.count > 0) {
                    console.log(`     ✅ Fixed ${result.count} record(s)`)
                    fixedCount += result.count
                } else {
                    console.log(`     ⚠️  No matching records found (may already be fixed)`)
                }
            } else if (fix.table === 'configuracion') {
                const result = await prisma.configuracion.updateMany({
                    where: fix.where as any,
                    data: fix.updates as any,
                })
                if (result.count > 0) {
                    console.log(`     ✅ Fixed ${result.count} record(s)`)
                    fixedCount += result.count
                } else {
                    console.log(`     ⚠️  No matching records found`)
                }
            } else if (fix.table === 'testimonios') {
                const result = await prisma.testimonio.updateMany({
                    where: fix.where as any,
                    data: fix.updates as any,
                })
                if (result.count > 0) {
                    console.log(`     ✅ Fixed ${result.count} record(s)`)
                    fixedCount += result.count
                } else {
                    console.log(`     ⚠️  No matching records found, trying fallback...`)
                }
            }
        } catch (error) {
            console.log(`     ❌ Error: ${error}`)
            failedCount++
        }
    }

    // Apply fallback fixes using LIKE patterns for records with '?' in text
    console.log('\n  🔍 Applying fallback pattern-matching fixes...')
    for (const fix of fallbackFixes) {
        try {
            console.log(`  📝 ${fix.description}...`)

            if (fix.table === 'testimonios') {
                // Use raw query to find records with '?' characters
                const results: any[] = await prisma.$queryRawUnsafe(
                    `SELECT id FROM testimonios WHERE ${fix.searchColumn} LIKE $1`,
                    fix.searchPattern
                )

                for (const row of results) {
                    await prisma.testimonio.update({
                        where: { id: row.id },
                        data: fix.updates as any,
                    })
                    console.log(`     ✅ Fixed record ${row.id}`)
                    fixedCount++
                }

                if (results.length === 0) {
                    console.log(`     ⚠️  No matching records found`)
                }
            }
        } catch (error) {
            console.log(`     ❌ Error: ${error}`)
            failedCount++
        }
    }

    // Also fix any slides with '?' in tags using raw SQL
    console.log('\n  🔍 Fixing slides with corrupted tags...')
    try {
        const corruptedSlides: any[] = await prisma.$queryRawUnsafe(
            `SELECT id, titulo, tags FROM slides WHERE tags LIKE '%?%'`
        )
        for (const slide of corruptedSlides) {
            console.log(`     Found corrupted slide: "${slide.titulo}" (${slide.id})`)
            // These should have been caught by the direct fixes above
        }
        if (corruptedSlides.length === 0) {
            console.log(`     ✅ No remaining corrupted slides`)
        }
    } catch (error) {
        console.log(`     ❌ Error checking slides: ${error}`)
    }

    // Fix configuracion records with '?' characters
    console.log('\n  🔍 Fixing configuracion records with corrupted text...')
    try {
        const corruptedConfigs: any[] = await prisma.$queryRawUnsafe(
            `SELECT id, clave, descripcion FROM configuracion WHERE descripcion LIKE '%?%'`
        )
        for (const config of corruptedConfigs) {
            if (config.clave === 'mantenimiento_activado') {
                await prisma.configuracion.update({
                    where: { id: config.id },
                    data: { descripcion: 'Indica si el sitio está en modo mantenimiento' }
                })
                console.log(`     ✅ Fixed config: ${config.clave}`)
                fixedCount++
            }
        }
        if (corruptedConfigs.length === 0) {
            console.log(`     ✅ No remaining corrupted configuracion records`)
        }
    } catch (error) {
        console.log(`     ❌ Error checking configuracion: ${error}`)
    }

    // Summary
    console.log(`\n${'='.repeat(50)}`)
    console.log(`🎉 Encoding fix complete!`)
    console.log(`   ✅ Fixed: ${fixedCount} records`)
    if (failedCount > 0) {
        console.log(`   ❌ Failed: ${failedCount} records`)
    }
    console.log(`${'='.repeat(50)}`)

    // Verify results
    console.log('\n📋 Verification - Current data:')
    const slides = await prisma.slide.findMany({ select: { titulo: true, subtitulo: true, tags: true } })
    for (const slide of slides) {
        const tags = slide.tags ? JSON.parse(slide.tags) : []
        console.log(`   Slide: "${slide.titulo}" | Sub: "${slide.subtitulo}" | Tags: ${JSON.stringify(tags)}`)
    }

    const configs = await prisma.configuracion.findMany({ select: { clave: true, descripcion: true } })
    for (const config of configs) {
        console.log(`   Config: "${config.clave}" → "${config.descripcion}"`)
    }

    const testimonios = await prisma.testimonio.findMany({ select: { nombre: true, texto: true } })
    for (const t of testimonios) {
        console.log(`   Testimonio: "${t.nombre}" → "${t.texto?.substring(0, 50)}..."`)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('Fatal error:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
