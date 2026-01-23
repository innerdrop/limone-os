-- AlterTable
ALTER TABLE "alumnos" ADD COLUMN "colegio" TEXT;
ALTER TABLE "alumnos" ADD COLUMN "grado" TEXT;

-- AlterTable
ALTER TABLE "pagos" ADD COLUMN "cae" TEXT;
ALTER TABLE "pagos" ADD COLUMN "caeVencimiento" DATETIME;
ALTER TABLE "pagos" ADD COLUMN "cuitEmisor" TEXT;
ALTER TABLE "pagos" ADD COLUMN "emisorNombre" TEXT;
ALTER TABLE "pagos" ADD COLUMN "facturadoEn" DATETIME;
ALTER TABLE "pagos" ADD COLUMN "nroComprobante" INTEGER;
ALTER TABLE "pagos" ADD COLUMN "puntoVenta" INTEGER;
ALTER TABLE "pagos" ADD COLUMN "tipoFactura" TEXT;

-- CreateTable
CREATE TABLE "citas_nivelacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumnoId" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "citas_nivelacion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tareas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha" DATETIME NOT NULL,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "prioridad" TEXT NOT NULL DEFAULT 'MEDIA',
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "slider_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imagenUrl" TEXT NOT NULL,
    "titulo" TEXT,
    "descripcion" TEXT,
    "enlace" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" REAL NOT NULL,
    "imagenUrl" TEXT,
    "imagenes" TEXT,
    "categoria" TEXT NOT NULL DEFAULT 'OBRA',
    "stock" INTEGER NOT NULL DEFAULT 1,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "tecnica" TEXT,
    "dimensiones" TEXT,
    "artista" TEXT DEFAULT 'Natalia Fusari',
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ordenes_tienda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombreCliente" TEXT NOT NULL,
    "emailCliente" TEXT NOT NULL,
    "telefonoCliente" TEXT NOT NULL,
    "direccion" TEXT,
    "total" REAL NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "orden_productos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ordenId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnit" REAL NOT NULL,
    CONSTRAINT "orden_productos_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "ordenes_tienda" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "orden_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
