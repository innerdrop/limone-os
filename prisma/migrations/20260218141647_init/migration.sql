-- DropIndex
DROP INDEX "alumnos_usuarioId_key";

-- AlterTable
ALTER TABLE "alumnos" ADD COLUMN     "apellido" TEXT,
ADD COLUMN     "claseUnicaAprobada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "domicilioCalle" TEXT,
ADD COLUMN     "domicilioDepto" TEXT,
ADD COLUMN     "domicilioNumero" TEXT,
ADD COLUMN     "domicilioPiso" TEXT,
ADD COLUMN     "domicilioTira" TEXT,
ADD COLUMN     "nombre" TEXT,
ADD COLUMN     "tutorApellido" TEXT,
ADD COLUMN     "tutorDomicilioCalle" TEXT,
ADD COLUMN     "tutorDomicilioDepto" TEXT,
ADD COLUMN     "tutorDomicilioNumero" TEXT,
ADD COLUMN     "tutorDomicilioPiso" TEXT,
ADD COLUMN     "tutorDomicilioTira" TEXT;

-- AlterTable
ALTER TABLE "inscripciones" ALTER COLUMN "asiento" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pagos" ADD COLUMN     "esPagoParcial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalOriginal" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "slides" ADD COLUMN     "colorBadge" TEXT NOT NULL DEFAULT '#FFFFFF',
ADD COLUMN     "colorBoton" TEXT NOT NULL DEFAULT '#2D2D2D',
ADD COLUMN     "colorDescripcion" TEXT NOT NULL DEFAULT '#57534E',
ADD COLUMN     "colorFondoBoton" TEXT NOT NULL DEFAULT '#F1C40F',
ADD COLUMN     "colorSubtitulo" TEXT NOT NULL DEFAULT '#8E44AD',
ADD COLUMN     "colorTitulo" TEXT NOT NULL DEFAULT '#2D2D2D';

-- AlterTable
ALTER TABLE "talleres" ADD COLUMN     "horarios" JSONB,
ADD COLUMN     "precio1dia" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "precio1diaExt" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "precio2dia" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "precio2diaExt" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "tipo" TEXT NOT NULL DEFAULT 'REGULAR';

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opciones_inscripcion" (
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

-- CreateTable
CREATE TABLE "solicitudes_recuperacion" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "inscripcionId" TEXT NOT NULL,
    "fechaClaseOriginal" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "esRecuperable" BOOLEAN NOT NULL DEFAULT false,
    "fechaRecuperacion" TIMESTAMP(3),
    "horarioRecuperacion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_recuperacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dias_no_laborables" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dias_no_laborables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creditos_clase_extra" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "tallerId" TEXT,
    "motivo" TEXT,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "fechaProgramada" TIMESTAMP(3),
    "horarioProgramado" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creditos_clase_extra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitas" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referente" TEXT,
    "path" TEXT,
    "userAgent" TEXT,
    "ipSession" TEXT,

    CONSTRAINT "visitas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "opciones_inscripcion_nombre_key" ON "opciones_inscripcion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "dias_no_laborables_fecha_key" ON "dias_no_laborables"("fecha");

-- CreateIndex
CREATE INDEX "visitas_fecha_idx" ON "visitas"("fecha");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_recuperacion" ADD CONSTRAINT "solicitudes_recuperacion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_recuperacion" ADD CONSTRAINT "solicitudes_recuperacion_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES "inscripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creditos_clase_extra" ADD CONSTRAINT "creditos_clase_extra_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creditos_clase_extra" ADD CONSTRAINT "creditos_clase_extra_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "talleres"("id") ON DELETE SET NULL ON UPDATE CASCADE;
