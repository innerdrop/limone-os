-- Create opciones_inscripcion table
CREATE TABLE IF NOT EXISTS "opciones_inscripcion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "emoji" TEXT NOT NULL DEFAULT '🎨',
    "colorFondo" TEXT NOT NULL DEFAULT 'bg-emerald-100',
    "colorBorde" TEXT NOT NULL DEFAULT 'border-lemon-400',
    "colorHoverBg" TEXT NOT NULL DEFAULT 'bg-lemon-50/50',
    "tipo" TEXT NOT NULL DEFAULT 'regular',
    "redirigirUrl" TEXT,
    "esNuevo" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opciones_inscripcion_pkey" PRIMARY KEY ("id")
);

-- Create unique index on nombre
CREATE UNIQUE INDEX IF NOT EXISTS "opciones_inscripcion_nombre_key" ON "opciones_inscripcion"("nombre");

-- Seed default enrollment options
INSERT INTO "opciones_inscripcion" ("id", "nombre", "descripcion", "emoji", "colorFondo", "colorBorde", "colorHoverBg", "tipo", "redirigirUrl", "esNuevo", "orden", "activo", "creadoEn", "actualizadoEn")
VALUES
    ('opt_regular', 'Taller Regular', 'Curso anual completo de arte.', '🎨', 'bg-emerald-100', 'border-lemon-400', 'bg-lemon-50/50', 'regular', NULL, false, 0, true, NOW(), NOW()),
    ('opt_verano', 'Taller de Verano', 'Enero y Febrero. Modalidades especiales.', '☀️', 'bg-orange-100', 'border-orange-400', 'bg-orange-50/50', 'verano', NULL, false, 1, true, NOW(), NOW()),
    ('opt_clase_unica', 'Clase Única', 'Una clase individual para probar.', '✨', 'bg-purple-100', 'border-purple-400', 'bg-purple-50/50', 'clase-unica', '/portal/inscripcion/clase-unica', true, 2, true, NOW(), NOW())
ON CONFLICT ("nombre") DO UPDATE SET
    "descripcion" = EXCLUDED."descripcion",
    "actualizadoEn" = NOW();
