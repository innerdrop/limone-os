-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'ALUMNO',
    "imagen" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "alumnos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "dni" TEXT,
    "fechaNacimiento" DATETIME,
    "edad" INTEGER,
    "domicilio" TEXT,
    "tutorNombre" TEXT,
    "tutorDni" TEXT,
    "tutorRelacion" TEXT,
    "tutorDomicilio" TEXT,
    "tutorTelefonoPrincipal" TEXT,
    "tutorTelefonoAlternativo" TEXT,
    "tutorEmail" TEXT,
    "tutorProfesion" TEXT,
    "emergenciaNombre" TEXT,
    "emergenciaTelefono" TEXT,
    "emergenciaRelacion" TEXT,
    "obraSocial" TEXT,
    "numeroAfiliado" TEXT,
    "hospitalReferencia" TEXT,
    "alergias" TEXT,
    "medicacionHabitual" TEXT,
    "condicionesMedicas" TEXT,
    "restriccionesFisicas" TEXT,
    "autorizacionParticipacion" BOOLEAN NOT NULL DEFAULT false,
    "autorizacionMedica" BOOLEAN NOT NULL DEFAULT false,
    "autorizacionRetiro" TEXT,
    "autorizacionImagenes" BOOLEAN NOT NULL DEFAULT false,
    "aceptacionReglamento" BOOLEAN NOT NULL DEFAULT false,
    "firmaResponsable" TEXT,
    "aclaracionFirma" TEXT,
    "dniFirma" TEXT,
    "planPago" TEXT,
    "formaPago" TEXT,
    "firmaConformidad" TEXT,
    "perfilCompleto" BOOLEAN NOT NULL DEFAULT false,
    "contactoEmergencia" TEXT,
    "telefonoEmergencia" TEXT,
    "nivel" TEXT NOT NULL DEFAULT 'PRINCIPIANTE',
    "notas" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "alumnos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "talleres" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagen" TEXT,
    "cupoMaximo" INTEGER NOT NULL DEFAULT 10,
    "precio" REAL NOT NULL DEFAULT 0,
    "duracion" INTEGER NOT NULL DEFAULT 90,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "diasSemana" TEXT,
    "horaInicio" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "clases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tallerId" TEXT NOT NULL,
    "docenteId" TEXT NOT NULL,
    "fechaHora" DATETIME NOT NULL,
    "duracionMinutos" INTEGER NOT NULL DEFAULT 90,
    "ubicacion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PROGRAMADA',
    "notas" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "clases_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "talleres" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "clases_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumnoId" TEXT NOT NULL,
    "tallerId" TEXT NOT NULL,
    "fechaInscripcion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVA',
    "notas" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "inscripciones_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inscripciones_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "talleres" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "asistencias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumnoId" TEXT NOT NULL,
    "claseId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PRESENTE',
    "notas" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "asistencias_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "asistencias_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "clases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumnoId" TEXT NOT NULL,
    "inscripcionId" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "fechaPago" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "mercadoPagoId" TEXT,
    "comprobantePdf" TEXT,
    "mesCubierto" INTEGER NOT NULL,
    "anioCubierto" INTEGER NOT NULL,
    "concepto" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "pagos_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "pagos_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES "inscripciones" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "obras" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumnoId" TEXT NOT NULL,
    "claseId" TEXT,
    "imagenUrl" TEXT NOT NULL,
    "titulo" TEXT,
    "descripcion" TEXT,
    "tecnica" TEXT,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "obras_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "obras_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "clases" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "tipo" TEXT,
    "enlace" TEXT,
    "fechaEnvio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notificaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "testimonios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "imagen" TEXT,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "configuracion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descripcion" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "alumnos_usuarioId_key" ON "alumnos"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "talleres_nombre_key" ON "talleres"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_alumnoId_tallerId_key" ON "inscripciones"("alumnoId", "tallerId");

-- CreateIndex
CREATE UNIQUE INDEX "asistencias_alumnoId_claseId_key" ON "asistencias"("alumnoId", "claseId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_clave_key" ON "configuracion"("clave");
