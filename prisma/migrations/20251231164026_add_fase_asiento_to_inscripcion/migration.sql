-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_inscripciones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumnoId" TEXT NOT NULL,
    "tallerId" TEXT NOT NULL,
    "dia" TEXT,
    "horario" TEXT,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "fechaInscripcion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVA',
    "notas" TEXT,
    "fase" TEXT,
    "asiento" INTEGER,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "inscripciones_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inscripciones_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "talleres" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_inscripciones" ("actualizadoEn", "alumnoId", "creadoEn", "estado", "fechaInscripcion", "id", "notas", "tallerId") SELECT "actualizadoEn", "alumnoId", "creadoEn", "estado", "fechaInscripcion", "id", "notas", "tallerId" FROM "inscripciones";
DROP TABLE "inscripciones";
ALTER TABLE "new_inscripciones" RENAME TO "inscripciones";
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'ALUMNO',
    "imagen" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "debeCambiarPassword" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);
INSERT INTO "new_usuarios" ("activo", "actualizadoEn", "creadoEn", "email", "id", "imagen", "nombre", "password", "rol", "telefono") SELECT "activo", "actualizadoEn", "creadoEn", "email", "id", "imagen", "nombre", "password", "rol", "telefono" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
