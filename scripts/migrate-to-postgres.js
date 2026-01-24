/**
 * Script de Migración: SQLite → PostgreSQL
 * 
 * Este script exporta todos los datos de SQLite a JSON y luego
 * los importa a PostgreSQL, preservando IDs y relaciones.
 * 
 * Uso:
 *   node scripts/migrate-to-postgres.js export   - Exporta datos a JSON
 *   node scripts/migrate-to-postgres.js import   - Importa datos desde JSON
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const BACKUP_FILE = path.join(__dirname, '..', 'backup-sqlite.json');

// Orden de exportación respetando foreign keys
const MODELS = [
    'usuario',
    'alumno',
    'taller',
    'clase',
    'citaNivelacion',
    'inscripcion',
    'asistencia',
    'pago',
    'obra',
    'notificacion',
    'testimonio',
    'configuracion',
    'tarea',
    'sliderImage',
    'producto',
    'ordenTienda',
    'ordenProducto',
    'slide'
];

async function exportData() {
    console.log('📤 Iniciando exportación de SQLite...\n');

    const prisma = new PrismaClient();
    const backup = {};

    try {
        for (const model of MODELS) {
            try {
                const data = await prisma[model].findMany();
                backup[model] = data;
                console.log(`  ✅ ${model}: ${data.length} registros`);
            } catch (err) {
                console.log(`  ⚠️  ${model}: sin datos o no existe`);
                backup[model] = [];
            }
        }

        fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2));
        console.log(`\n✅ Backup guardado en: ${BACKUP_FILE}`);
        console.log(`📊 Total de modelos exportados: ${Object.keys(backup).length}`);

    } finally {
        await prisma.$disconnect();
    }
}

async function importData() {
    console.log('📥 Iniciando importación a PostgreSQL...\n');

    if (!fs.existsSync(BACKUP_FILE)) {
        console.error('❌ Error: No se encontró el archivo de backup.');
        console.error(`   Ejecuta primero: node scripts/migrate-to-postgres.js export`);
        process.exit(1);
    }

    const prisma = new PrismaClient();
    const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));

    try {
        // Importar en orden para respetar foreign keys
        for (const model of MODELS) {
            const records = backup[model] || [];
            if (records.length === 0) continue;

            console.log(`  📝 Importando ${model}...`);

            let imported = 0;
            for (const record of records) {
                try {
                    // Convertir fechas string a Date objects
                    const cleanRecord = {};
                    for (const [key, value] of Object.entries(record)) {
                        if (value && typeof value === 'string' &&
                            (key.includes('En') || key.includes('fecha') || key.includes('Fecha') ||
                                key === 'fechaHora' || key === 'fechaPago' || key === 'fechaEnvio' ||
                                key === 'fechaCreacion' || key === 'fechaInscripcion' || key === 'completadaEn' ||
                                key === 'caeVencimiento' || key === 'facturadoEn')) {
                            cleanRecord[key] = new Date(value);
                        } else {
                            cleanRecord[key] = value;
                        }
                    }

                    await prisma[model].create({ data: cleanRecord });
                    imported++;
                } catch (err) {
                    // Si ya existe (por ID duplicado), intentar upsert
                    if (err.code === 'P2002') {
                        console.log(`    ⚠️ Registro duplicado, saltando...`);
                    } else {
                        console.error(`    ❌ Error en ${model}:`, err.message);
                    }
                }
            }
            console.log(`  ✅ ${model}: ${imported}/${records.length} importados`);
        }

        console.log('\n🎉 Importación completada!');

    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    const command = process.argv[2];

    switch (command) {
        case 'export':
            await exportData();
            break;
        case 'import':
            await importData();
            break;
        default:
            console.log(`
Uso: node scripts/migrate-to-postgres.js <comando>

Comandos:
  export  - Exporta datos de SQLite a backup-sqlite.json
  import  - Importa datos desde backup-sqlite.json a PostgreSQL

Pasos para migración completa:
  1. Con DATABASE_URL apuntando a SQLite: node scripts/migrate-to-postgres.js export
  2. Cambiar DATABASE_URL a PostgreSQL
  3. Ejecutar: npx prisma db push
  4. Ejecutar: node scripts/migrate-to-postgres.js import
            `);
    }
}

main().catch(console.error);
