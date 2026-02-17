--
-- PostgreSQL database dump
--

\restrict N8vfNHhtCpJ4zWo9OGRJEdA28o078erGclISdFmb0GU8hSUZ9PIJkMoLYapYSxB

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.solicitudes_recuperacion DROP CONSTRAINT IF EXISTS "solicitudes_recuperacion_inscripcionId_fkey";
ALTER TABLE IF EXISTS ONLY public.solicitudes_recuperacion DROP CONSTRAINT IF EXISTS "solicitudes_recuperacion_alumnoId_fkey";
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS "password_reset_tokens_usuarioId_fkey";
ALTER TABLE IF EXISTS ONLY public.pagos DROP CONSTRAINT IF EXISTS "pagos_inscripcionId_fkey";
ALTER TABLE IF EXISTS ONLY public.pagos DROP CONSTRAINT IF EXISTS "pagos_alumnoId_fkey";
ALTER TABLE IF EXISTS ONLY public.orden_productos DROP CONSTRAINT IF EXISTS "orden_productos_productoId_fkey";
ALTER TABLE IF EXISTS ONLY public.orden_productos DROP CONSTRAINT IF EXISTS "orden_productos_ordenId_fkey";
ALTER TABLE IF EXISTS ONLY public.obras DROP CONSTRAINT IF EXISTS "obras_claseId_fkey";
ALTER TABLE IF EXISTS ONLY public.obras DROP CONSTRAINT IF EXISTS "obras_alumnoId_fkey";
ALTER TABLE IF EXISTS ONLY public.notificaciones DROP CONSTRAINT IF EXISTS "notificaciones_usuarioId_fkey";
ALTER TABLE IF EXISTS ONLY public.inscripciones DROP CONSTRAINT IF EXISTS "inscripciones_tallerId_fkey";
ALTER TABLE IF EXISTS ONLY public.inscripciones DROP CONSTRAINT IF EXISTS "inscripciones_alumnoId_fkey";
ALTER TABLE IF EXISTS ONLY public.creditos_clase_extra DROP CONSTRAINT IF EXISTS "creditos_clase_extra_tallerId_fkey";
ALTER TABLE IF EXISTS ONLY public.creditos_clase_extra DROP CONSTRAINT IF EXISTS "creditos_clase_extra_alumnoId_fkey";
ALTER TABLE IF EXISTS ONLY public.clases DROP CONSTRAINT IF EXISTS "clases_tallerId_fkey";
ALTER TABLE IF EXISTS ONLY public.clases DROP CONSTRAINT IF EXISTS "clases_docenteId_fkey";
ALTER TABLE IF EXISTS ONLY public.citas_nivelacion DROP CONSTRAINT IF EXISTS "citas_nivelacion_alumnoId_fkey";
ALTER TABLE IF EXISTS ONLY public.asistencias DROP CONSTRAINT IF EXISTS "asistencias_claseId_fkey";
ALTER TABLE IF EXISTS ONLY public.asistencias DROP CONSTRAINT IF EXISTS "asistencias_alumnoId_fkey";
ALTER TABLE IF EXISTS ONLY public.alumnos DROP CONSTRAINT IF EXISTS "alumnos_usuarioId_fkey";
DROP INDEX IF EXISTS public.visitas_fecha_idx;
DROP INDEX IF EXISTS public.usuarios_email_key;
DROP INDEX IF EXISTS public.talleres_nombre_key;
DROP INDEX IF EXISTS public.password_reset_tokens_token_key;
DROP INDEX IF EXISTS public.opciones_inscripcion_nombre_key;
DROP INDEX IF EXISTS public.dias_no_laborables_fecha_key;
DROP INDEX IF EXISTS public.configuracion_clave_key;
DROP INDEX IF EXISTS public."asistencias_alumnoId_claseId_key";
ALTER TABLE IF EXISTS ONLY public.visitas DROP CONSTRAINT IF EXISTS visitas_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.testimonios DROP CONSTRAINT IF EXISTS testimonios_pkey;
ALTER TABLE IF EXISTS ONLY public.tareas DROP CONSTRAINT IF EXISTS tareas_pkey;
ALTER TABLE IF EXISTS ONLY public.talleres DROP CONSTRAINT IF EXISTS talleres_pkey;
ALTER TABLE IF EXISTS ONLY public.solicitudes_recuperacion DROP CONSTRAINT IF EXISTS solicitudes_recuperacion_pkey;
ALTER TABLE IF EXISTS ONLY public.slides DROP CONSTRAINT IF EXISTS slides_pkey;
ALTER TABLE IF EXISTS ONLY public.slider_images DROP CONSTRAINT IF EXISTS slider_images_pkey;
ALTER TABLE IF EXISTS ONLY public.productos DROP CONSTRAINT IF EXISTS productos_pkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.pagos DROP CONSTRAINT IF EXISTS pagos_pkey;
ALTER TABLE IF EXISTS ONLY public.ordenes_tienda DROP CONSTRAINT IF EXISTS ordenes_tienda_pkey;
ALTER TABLE IF EXISTS ONLY public.orden_productos DROP CONSTRAINT IF EXISTS orden_productos_pkey;
ALTER TABLE IF EXISTS ONLY public.opciones_inscripcion DROP CONSTRAINT IF EXISTS opciones_inscripcion_pkey;
ALTER TABLE IF EXISTS ONLY public.obras DROP CONSTRAINT IF EXISTS obras_pkey;
ALTER TABLE IF EXISTS ONLY public.notificaciones DROP CONSTRAINT IF EXISTS notificaciones_pkey;
ALTER TABLE IF EXISTS ONLY public.inscripciones DROP CONSTRAINT IF EXISTS inscripciones_pkey;
ALTER TABLE IF EXISTS ONLY public.dias_no_laborables DROP CONSTRAINT IF EXISTS dias_no_laborables_pkey;
ALTER TABLE IF EXISTS ONLY public.creditos_clase_extra DROP CONSTRAINT IF EXISTS creditos_clase_extra_pkey;
ALTER TABLE IF EXISTS ONLY public.configuracion DROP CONSTRAINT IF EXISTS configuracion_pkey;
ALTER TABLE IF EXISTS ONLY public.clases DROP CONSTRAINT IF EXISTS clases_pkey;
ALTER TABLE IF EXISTS ONLY public.citas_nivelacion DROP CONSTRAINT IF EXISTS citas_nivelacion_pkey;
ALTER TABLE IF EXISTS ONLY public.asistencias DROP CONSTRAINT IF EXISTS asistencias_pkey;
ALTER TABLE IF EXISTS ONLY public.alumnos DROP CONSTRAINT IF EXISTS alumnos_pkey;
DROP TABLE IF EXISTS public.visitas;
DROP TABLE IF EXISTS public.usuarios;
DROP TABLE IF EXISTS public.testimonios;
DROP TABLE IF EXISTS public.tareas;
DROP TABLE IF EXISTS public.talleres;
DROP TABLE IF EXISTS public.solicitudes_recuperacion;
DROP TABLE IF EXISTS public.slides;
DROP TABLE IF EXISTS public.slider_images;
DROP TABLE IF EXISTS public.productos;
DROP TABLE IF EXISTS public.password_reset_tokens;
DROP TABLE IF EXISTS public.pagos;
DROP TABLE IF EXISTS public.ordenes_tienda;
DROP TABLE IF EXISTS public.orden_productos;
DROP TABLE IF EXISTS public.opciones_inscripcion;
DROP TABLE IF EXISTS public.obras;
DROP TABLE IF EXISTS public.notificaciones;
DROP TABLE IF EXISTS public.inscripciones;
DROP TABLE IF EXISTS public.dias_no_laborables;
DROP TABLE IF EXISTS public.creditos_clase_extra;
DROP TABLE IF EXISTS public.configuracion;
DROP TABLE IF EXISTS public.clases;
DROP TABLE IF EXISTS public.citas_nivelacion;
DROP TABLE IF EXISTS public.asistencias;
DROP TABLE IF EXISTS public.alumnos;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alumnos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alumnos (
    id text NOT NULL,
    "usuarioId" text NOT NULL,
    nombre text,
    apellido text,
    dni text,
    "fechaNacimiento" timestamp(3) without time zone,
    edad integer,
    domicilio text,
    "domicilioCalle" text,
    "domicilioNumero" text,
    "domicilioTira" text,
    "domicilioPiso" text,
    "domicilioDepto" text,
    colegio text,
    grado text,
    "tutorNombre" text,
    "tutorApellido" text,
    "tutorDni" text,
    "tutorRelacion" text,
    "tutorDomicilio" text,
    "tutorDomicilioCalle" text,
    "tutorDomicilioNumero" text,
    "tutorDomicilioTira" text,
    "tutorDomicilioPiso" text,
    "tutorDomicilioDepto" text,
    "tutorTelefonoPrincipal" text,
    "tutorTelefonoAlternativo" text,
    "tutorEmail" text,
    "tutorProfesion" text,
    "emergenciaNombre" text,
    "emergenciaTelefono" text,
    "emergenciaRelacion" text,
    "obraSocial" text,
    "numeroAfiliado" text,
    "hospitalReferencia" text,
    alergias text,
    "medicacionHabitual" text,
    "condicionesMedicas" text,
    "restriccionesFisicas" text,
    "autorizacionParticipacion" boolean DEFAULT false NOT NULL,
    "autorizacionMedica" boolean DEFAULT false NOT NULL,
    "autorizacionRetiro" text,
    "autorizacionImagenes" boolean DEFAULT false NOT NULL,
    "aceptacionReglamento" boolean DEFAULT false NOT NULL,
    "firmaResponsable" text,
    "aclaracionFirma" text,
    "dniFirma" text,
    "planPago" text,
    "formaPago" text,
    "firmaConformidad" text,
    "perfilCompleto" boolean DEFAULT false NOT NULL,
    "contactoEmergencia" text,
    "telefonoEmergencia" text,
    nivel text DEFAULT 'PRINCIPIANTE'::text NOT NULL,
    notas text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL,
    "claseUnicaAprobada" boolean DEFAULT false NOT NULL
);


--
-- Name: asistencias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asistencias (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    "claseId" text NOT NULL,
    estado text DEFAULT 'PRESENTE'::text NOT NULL,
    notas text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: citas_nivelacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.citas_nivelacion (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    fecha timestamp(3) without time zone NOT NULL,
    estado text DEFAULT 'PENDIENTE'::text NOT NULL,
    notas text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: clases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clases (
    id text NOT NULL,
    "tallerId" text NOT NULL,
    "docenteId" text NOT NULL,
    "fechaHora" timestamp(3) without time zone NOT NULL,
    "duracionMinutos" integer DEFAULT 90 NOT NULL,
    ubicacion text,
    estado text DEFAULT 'PROGRAMADA'::text NOT NULL,
    notas text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: configuracion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuracion (
    id text NOT NULL,
    clave text NOT NULL,
    valor text NOT NULL,
    descripcion text
);


--
-- Name: creditos_clase_extra; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.creditos_clase_extra (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    motivo text,
    usado boolean DEFAULT false NOT NULL,
    "fechaProgramada" timestamp(3) without time zone,
    "horarioProgramado" text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL,
    "tallerId" text
);


--
-- Name: dias_no_laborables; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dias_no_laborables (
    id text NOT NULL,
    fecha timestamp(3) without time zone NOT NULL,
    motivo text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: inscripciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inscripciones (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    "tallerId" text NOT NULL,
    dia text,
    horario text,
    pagado boolean DEFAULT false NOT NULL,
    "fechaInscripcion" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado text DEFAULT 'ACTIVA'::text NOT NULL,
    notas text,
    fase text,
    asiento text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notificaciones (
    id text NOT NULL,
    "usuarioId" text NOT NULL,
    titulo text NOT NULL,
    mensaje text NOT NULL,
    leida boolean DEFAULT false NOT NULL,
    tipo text,
    enlace text,
    "fechaEnvio" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: obras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.obras (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    "claseId" text,
    "imagenUrl" text NOT NULL,
    titulo text,
    descripcion text,
    tecnica text,
    "fechaCreacion" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    destacada boolean DEFAULT false NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: opciones_inscripcion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.opciones_inscripcion (
    id text NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    emoji text DEFAULT '­ƒÄ¿'::text NOT NULL,
    "colorFondo" text DEFAULT 'bg-emerald-100'::text NOT NULL,
    "colorBorde" text DEFAULT 'border-lemon-400'::text NOT NULL,
    "colorHoverBg" text DEFAULT 'bg-lemon-50/50'::text NOT NULL,
    tipo text DEFAULT 'regular'::text NOT NULL,
    "redirigirUrl" text,
    "esNuevo" boolean DEFAULT false NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: orden_productos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orden_productos (
    id text NOT NULL,
    "ordenId" text NOT NULL,
    "productoId" text NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    "precioUnit" double precision NOT NULL
);


--
-- Name: ordenes_tienda; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ordenes_tienda (
    id text NOT NULL,
    "nombreCliente" text NOT NULL,
    "emailCliente" text NOT NULL,
    "telefonoCliente" text NOT NULL,
    direccion text,
    total double precision NOT NULL,
    estado text DEFAULT 'PENDIENTE'::text NOT NULL,
    notas text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: pagos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pagos (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    "inscripcionId" text NOT NULL,
    monto double precision NOT NULL,
    "fechaPago" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado text DEFAULT 'PENDIENTE'::text NOT NULL,
    "mercadoPagoId" text,
    "comprobantePdf" text,
    "mesCubierto" integer NOT NULL,
    "anioCubierto" integer NOT NULL,
    concepto text,
    cae text,
    "caeVencimiento" timestamp(3) without time zone,
    "puntoVenta" integer,
    "nroComprobante" integer,
    "tipoFactura" text,
    "cuitEmisor" text,
    "emisorNombre" text,
    "facturadoEn" timestamp(3) without time zone,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL,
    "esPagoParcial" boolean DEFAULT false NOT NULL,
    "totalOriginal" double precision
);


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    id text NOT NULL,
    "usuarioId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: productos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.productos (
    id text NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    precio double precision NOT NULL,
    "imagenUrl" text,
    imagenes text,
    categoria text DEFAULT 'OBRA'::text NOT NULL,
    stock integer DEFAULT 1 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    destacado boolean DEFAULT false NOT NULL,
    tecnica text,
    dimensiones text,
    artista text DEFAULT 'Natalia Fusari'::text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: slider_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.slider_images (
    id text NOT NULL,
    "imagenUrl" text NOT NULL,
    titulo text,
    descripcion text,
    enlace text,
    orden integer DEFAULT 0 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: slides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.slides (
    id text NOT NULL,
    titulo text NOT NULL,
    subtitulo text,
    descripcion text,
    tags text,
    "badgeTexto" text,
    "textoBoton" text,
    enlace text,
    "imagenUrl" text NOT NULL,
    "estiloOverlay" text DEFAULT 'light'::text NOT NULL,
    "colorTitulo" text DEFAULT '#2D2D2D'::text NOT NULL,
    "colorSubtitulo" text DEFAULT '#8E44AD'::text NOT NULL,
    "colorDescripcion" text DEFAULT '#57534E'::text NOT NULL,
    "colorBadge" text DEFAULT '#FFFFFF'::text NOT NULL,
    "colorBoton" text DEFAULT '#2D2D2D'::text NOT NULL,
    "colorFondoBoton" text DEFAULT '#F1C40F'::text NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: solicitudes_recuperacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solicitudes_recuperacion (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    "inscripcionId" text NOT NULL,
    "fechaClaseOriginal" timestamp(3) without time zone NOT NULL,
    motivo text,
    estado text DEFAULT 'PENDIENTE'::text NOT NULL,
    "esRecuperable" boolean DEFAULT false NOT NULL,
    "fechaRecuperacion" timestamp(3) without time zone,
    "horarioRecuperacion" text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: talleres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.talleres (
    id text NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    imagen text,
    "cupoMaximo" integer DEFAULT 10 NOT NULL,
    precio double precision DEFAULT 0 NOT NULL,
    duracion integer DEFAULT 90 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "diasSemana" text,
    "horaInicio" text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL,
    horarios jsonb,
    precio1dia double precision DEFAULT 0 NOT NULL,
    precio2dia double precision DEFAULT 0 NOT NULL,
    tipo text DEFAULT 'REGULAR'::text NOT NULL,
    "precio1diaExt" double precision DEFAULT 0,
    "precio2diaExt" double precision DEFAULT 0
);


--
-- Name: tareas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tareas (
    id text NOT NULL,
    titulo text NOT NULL,
    descripcion text,
    fecha timestamp(3) without time zone NOT NULL,
    hora text,
    prioridad text DEFAULT 'MEDIA'::text NOT NULL,
    categoria text,
    completada boolean DEFAULT false NOT NULL,
    "completadaEn" timestamp(3) without time zone,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: testimonios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonios (
    id text NOT NULL,
    nombre text NOT NULL,
    texto text NOT NULL,
    imagen text,
    destacado boolean DEFAULT false NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    nombre text NOT NULL,
    telefono text,
    rol text DEFAULT 'ALUMNO'::text NOT NULL,
    imagen text,
    activo boolean DEFAULT true NOT NULL,
    "debeCambiarPassword" boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: visitas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitas (
    id text NOT NULL,
    fecha timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    referente text,
    path text,
    "userAgent" text,
    "ipSession" text
);


--
-- Data for Name: alumnos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.alumnos (id, "usuarioId", nombre, apellido, dni, "fechaNacimiento", edad, domicilio, "domicilioCalle", "domicilioNumero", "domicilioTira", "domicilioPiso", "domicilioDepto", colegio, grado, "tutorNombre", "tutorApellido", "tutorDni", "tutorRelacion", "tutorDomicilio", "tutorDomicilioCalle", "tutorDomicilioNumero", "tutorDomicilioTira", "tutorDomicilioPiso", "tutorDomicilioDepto", "tutorTelefonoPrincipal", "tutorTelefonoAlternativo", "tutorEmail", "tutorProfesion", "emergenciaNombre", "emergenciaTelefono", "emergenciaRelacion", "obraSocial", "numeroAfiliado", "hospitalReferencia", alergias, "medicacionHabitual", "condicionesMedicas", "restriccionesFisicas", "autorizacionParticipacion", "autorizacionMedica", "autorizacionRetiro", "autorizacionImagenes", "aceptacionReglamento", "firmaResponsable", "aclaracionFirma", "dniFirma", "planPago", "formaPago", "firmaConformidad", "perfilCompleto", "contactoEmergencia", "telefonoEmergencia", nivel, notas, "creadoEn", "actualizadoEn", "claseUnicaAprobada") FROM stdin;
\.


--
-- Data for Name: asistencias; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.asistencias (id, "alumnoId", "claseId", estado, notas, "creadoEn") FROM stdin;
\.


--
-- Data for Name: citas_nivelacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.citas_nivelacion (id, "alumnoId", fecha, estado, notas, "creadoEn", "actualizadoEn") FROM stdin;
\.


--
-- Data for Name: clases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clases (id, "tallerId", "docenteId", "fechaHora", "duracionMinutos", ubicacion, estado, notas, "creadoEn", "actualizadoEn") FROM stdin;
\.


--
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.configuracion (id, clave, valor, descripcion) FROM stdin;
cmlp5a9q90000mw4rats4f72y	mantenimiento_activado	true	Indica si el sitio est├í en modo mantenimiento
\.


--
-- Data for Name: creditos_clase_extra; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.creditos_clase_extra (id, "alumnoId", motivo, usado, "fechaProgramada", "horarioProgramado", "creadoEn", "actualizadoEn", "tallerId") FROM stdin;
\.


--
-- Data for Name: dias_no_laborables; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dias_no_laborables (id, fecha, motivo, "creadoEn", "actualizadoEn") FROM stdin;
cmlofu9st0000alzc7r9l0skp	2026-02-16 03:00:00	Carnaval	2026-02-16 00:30:34.006	2026-02-16 00:30:34.006
cmlofvzqx0001alzcrhozs81o	2026-02-17 03:00:00	Carnaval	2026-02-16 00:31:54.295	2026-02-16 00:31:54.295
\.


--
-- Data for Name: inscripciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inscripciones (id, "alumnoId", "tallerId", dia, horario, pagado, "fechaInscripcion", estado, notas, fase, asiento, "creadoEn", "actualizadoEn") FROM stdin;
\.


--
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notificaciones (id, "usuarioId", titulo, mensaje, leida, tipo, enlace, "fechaEnvio") FROM stdin;
cmkrs3wz600019lyab3l4r7p8	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Mar├¡a Garc├¡a avis├│ que ya realiz├│ la transferencia de $┬á50.000,00.	t	INFO	/admin/finanzas	2026-01-24 03:57:35.536
cmkrs442k00039lyaredgt0cx	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Mar├¡a Garc├¡a avis├│ que ya realiz├│ la transferencia de $┬á105.000,00.	t	INFO	/admin/finanzas	2026-01-24 03:57:44.732
cmkzl5pr2000i11caclgnwr4i	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Iyad Marmoud avis├│ que ya realiz├│ la transferencia de $┬á25.000,00.	f	INFO	/admin/finanzas	2026-01-29 15:05:11.58
cmkzlxitw000411po8yrny22d	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Iyad Marmoud avis├│ que ya realiz├│ la transferencia de $┬á75.000,00.	f	INFO	/admin/finanzas	2026-01-29 15:26:48.979
cml1p6hlq000jbyqgclu9dgi9	cmkrc5q8m0000jt6hljld23aw	Nueva Inscripci├│n (Regular)	Un alumno se inscribi├│ a Fase 2. D├¡as: MARTES. Total: $25000	f	INFO	/admin/alumnos/cml1p6hea000abyqg62h4nyb2	2026-01-31 02:33:18.495
cmkzlxitw000511pomdmyqghk	cmkt3kd6c0000xak6xz0dd9il	Nuevo Aviso de Pago	Iyad Marmoud avis├│ que ya realiz├│ la transferencia de $┬á75.000,00.	t	INFO	/admin/finanzas	2026-01-29 15:26:48.979
cml1p6hml000lbyqgj7n5s6er	cmkt3kd6c0000xak6xz0dd9il	Nueva Inscripci├│n (Regular)	Un alumno se inscribi├│ a Fase 2. D├¡as: MARTES. Total: $25000	t	INFO	/admin/alumnos/cml1p6hea000abyqg62h4nyb2	2026-01-31 02:33:18.525
cmllcl03g000er61ixfqii5rj	cmkrc5q8m0000jt6hljld23aw	Nueva Inscripci├│n (Regular)	Un alumno se inscribi├│ a Fase 1. D├¡as: MARTES, JUEVES. Total: $50000	f	INFO	/admin/alumnos/cmllckzuo0003r61ivjlxp4ct	2026-02-13 20:36:04.156
cmllcmzao000kr61icaovdpqo	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Mauro Rodriguez avis├│ que ya realiz├│ la transferencia de $┬á50.000,00.	f	INFO	/admin/finanzas	2026-02-13 20:37:36.284
cmllmj5jf000910ibk1ikadeg	cmkrc5q8m0000jt6hljld23aw	Nueva Clase ├Ünica	Mauro se inscribi├│ a una Clase ├Ünica (LUNES 19:10-20:30). Total: $15000	f	INFO	/admin/alumnos/cmkzkyw6z000211caji6i1zfr	2026-02-14 01:14:34.06
cmllngz3h000a65zcjiwhu944	cmkrc5q8m0000jt6hljld23aw	Nueva Clase ├Ünica	Un alumno se inscribi├│ a una Clase ├Ünica (VIERNES 19:10-20:30). Total: $15000	f	INFO	/admin/alumnos/cmllngyzv000165zc77fl9dv8	2026-02-14 01:40:52.013
cmllnt2qa000aj9uhxwmhvf6p	cmkrc5q8m0000jt6hljld23aw	Nueva Clase ├Ünica	Un alumno se inscribi├│ a una Clase ├Ünica (JUEVES 16:00-17:20). Total: $15000	f	INFO	/admin/alumnos/cmllnt2mp0001j9uhprv2ynya	2026-02-14 01:50:16.595
cmllnt2qg000cj9uh6zt1qoyn	cmkt3kd6c0000xak6xz0dd9il	Nueva Clase ├Ünica	Un alumno se inscribi├│ a una Clase ├Ünica (JUEVES 16:00-17:20). Total: $15000	t	INFO	/admin/alumnos/cmllnt2mp0001j9uhprv2ynya	2026-02-14 01:50:16.6
cmllmj5jl000b10ibwyd4l6fg	cmkt3kd6c0000xak6xz0dd9il	Nueva Clase ├Ünica	Mauro se inscribi├│ a una Clase ├Ünica (LUNES 19:10-20:30). Total: $15000	t	INFO	/admin/alumnos/cmkzkyw6z000211caji6i1zfr	2026-02-14 01:14:34.066
cmllcmz6j000ir61i0racrx7i	cmkt3kd6c0000xak6xz0dd9il	Nuevo Aviso de Pago	Mauro Rodriguez avis├│ que ya realiz├│ la transferencia de $┬á50.000,00.	t	INFO	/admin/finanzas	2026-02-13 20:37:36.284
cmllcl049000gr61ileq3koxw	cmkt3kd6c0000xak6xz0dd9il	Nueva Inscripci├│n (Regular)	Un alumno se inscribi├│ a Fase 1. D├¡as: MARTES, JUEVES. Total: $50000	t	INFO	/admin/alumnos/cmllckzuo0003r61ivjlxp4ct	2026-02-13 20:36:04.185
cmllngz3l000c65zclwyx815d	cmkt3kd6c0000xak6xz0dd9il	Nueva Clase ├Ünica	Un alumno se inscribi├│ a una Clase ├Ünica (VIERNES 19:10-20:30). Total: $15000	t	INFO	/admin/alumnos/cmllngyzv000165zc77fl9dv8	2026-02-14 01:40:52.017
cmllupbla000b810a1s60o4bq	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Iyad Marmoud avis├│ que ya realiz├│ la transferencia de $┬á15.000,00.	f	INFO	/admin/finanzas	2026-02-14 05:03:18.766
cmllv59ar000u810afgvr9r2s	cmkrc5q8m0000jt6hljld23aw	Nueva Clase Extra Agendada ­ƒÄ¿	Natalia agend├│ una clase extra para el 16/2/2026 a las 19:00 - 20:30.	f	INFO	\N	2026-02-14 05:15:42.289
cmllwd7ok000111l91bc78y54	cmkrc5q8m0000jt6hljld23aw	Nueva Clase Extra Agendada ­ƒÄ¿	Natalia agend├│ una clase extra para el 18/2/2026 a las 19:10-20:30.	f	INFO	\N	2026-02-14 05:49:53.058
cmloge7uu000oalzcdn9esuwi	cmkrc5q8m0000jt6hljld23aw	Nueva Clase Extra Agendada ­ƒÄ¿	Natalia agend├│ una clase extra para el 25/2/2026 a las 19:10-20:30.	f	INFO	\N	2026-02-16 00:46:04.612
cmloged5i000qalzccqz65y3b	cmkrc5q8m0000jt6hljld23aw	Nueva Clase Extra Agendada ­ƒÄ¿	Natalia agend├│ una clase extra para el 25/2/2026 a las 19:10-20:30.	f	INFO	\N	2026-02-16 00:46:11.478
cmllupbla000c810a2ggh7hoj	cmkt3kd6c0000xak6xz0dd9il	Nuevo Aviso de Pago	Iyad Marmoud avis├│ que ya realiz├│ la transferencia de $┬á15.000,00.	t	INFO	/admin/finanzas	2026-02-14 05:03:18.766
\.


--
-- Data for Name: obras; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.obras (id, "alumnoId", "claseId", "imagenUrl", titulo, descripcion, tecnica, "fechaCreacion", destacada, "creadoEn") FROM stdin;
\.


--
-- Data for Name: opciones_inscripcion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.opciones_inscripcion (id, nombre, descripcion, emoji, "colorFondo", "colorBorde", "colorHoverBg", tipo, "redirigirUrl", "esNuevo", orden, activo, "creadoEn", "actualizadoEn") FROM stdin;
opt_verano	Taller de Verano	Enero y Febrero. Modalidades especiales.	ÔÿÇ´©Å	bg-orange-100	border-orange-400	bg-orange-50/50	verano	\N	f	1	t	2026-02-14 00:40:57.409	2026-02-14 01:04:27.004
opt_clase_unica	Clase ├Ünica	Una clase individual para probar.	­ƒûî´©Å	bg-purple-100	border-purple-400	bg-purple-50/50	clase-unica	/portal/inscripcion/clase-unica	t	2	t	2026-02-14 00:40:57.409	2026-02-14 01:04:46.294
opt_regular	Taller Regular	Curso anual completo de arte.	­ƒÄ¿	bg-emerald-100	border-lemon-400	bg-lemon-50/50	regular	\N	f	0	t	2026-02-14 00:40:57.409	2026-02-14 01:05:43.582
\.


--
-- Data for Name: orden_productos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orden_productos (id, "ordenId", "productoId", cantidad, "precioUnit") FROM stdin;
\.


--
-- Data for Name: ordenes_tienda; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ordenes_tienda (id, "nombreCliente", "emailCliente", "telefonoCliente", direccion, total, estado, notas, "creadoEn", "actualizadoEn") FROM stdin;
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pagos (id, "alumnoId", "inscripcionId", monto, "fechaPago", estado, "mercadoPagoId", "comprobantePdf", "mesCubierto", "anioCubierto", concepto, cae, "caeVencimiento", "puntoVenta", "nroComprobante", "tipoFactura", "cuitEmisor", "emisorNombre", "facturadoEn", "creadoEn", "actualizadoEn", "esPagoParcial", "totalOriginal") FROM stdin;
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_tokens (id, "usuarioId", token, "expiresAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.productos (id, nombre, descripcion, precio, "imagenUrl", imagenes, categoria, stock, activo, destacado, tecnica, dimensiones, artista, "creadoEn", "actualizadoEn") FROM stdin;
\.


--
-- Data for Name: slider_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.slider_images (id, "imagenUrl", titulo, descripcion, enlace, orden, activo, "creadoEn", "actualizadoEn") FROM stdin;
\.


--
-- Data for Name: slides; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.slides (id, titulo, subtitulo, descripcion, tags, "badgeTexto", "textoBoton", enlace, "imagenUrl", "estiloOverlay", "colorTitulo", "colorSubtitulo", "colorDescripcion", "colorBadge", "colorBoton", "colorFondoBoton", orden, activo, "creadoEn", "actualizadoEn") FROM stdin;
cmks9g0480000apujm677kqdp	Taller de Verano	Edici├│n 2026	M├ís que una colonia, un taller de arte especializado para crear y divertirse.	["­ƒôà 6 Ene - 28 Feb","­ƒºÆ 5 a 12 a├▒os","­ƒÄ¿ Materiales Incluidos"]	┬íNo te lo Pierdas!	Reg├¡strate Ahora	/taller-verano	https://res.cloudinary.com/dxaupveuf/image/upload/v1769440147/slider/vdgianybpjg1gutndhws.jpg	dark	#ffffff	#ffde0a	#ffffff	#FFFFFF	#2D2D2D	#F1C40F	1	t	2026-01-24 12:02:52.952	2026-01-27 14:46:38.095
cmks9g04j0001apujtxkv4la6	Clase ├Ünica		Ven├¡ a conocer Taller Limon├®. Prob├í materiales, conoc├® el espacio y descubr├¡ tu potencial art├¡stico.	["Ô£¿ Experiencia Real","­ƒæ®ÔÇì­ƒÄ¿ Docentes Especializados","­ƒÄ¿ Todos los niveles"]	┬íProb├í!	Agendar Clase ├Ünica	/inscripcion?mode=nivelacion	/taller-aula.png	dark	#ffffff	#8E44AD	#ffffff	#FFFFFF	#2D2D2D	#F1C40F	0	t	2026-01-24 12:02:52.964	2026-02-14 01:21:03.592
\.


--
-- Data for Name: solicitudes_recuperacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.solicitudes_recuperacion (id, "alumnoId", "inscripcionId", "fechaClaseOriginal", motivo, estado, "esRecuperable", "fechaRecuperacion", "horarioRecuperacion", "creadoEn", "actualizadoEn") FROM stdin;
\.


--
-- Data for Name: talleres; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.talleres (id, nombre, descripcion, imagen, "cupoMaximo", precio, duracion, activo, "diasSemana", "horaInicio", "creadoEn", "actualizadoEn", horarios, precio1dia, precio2dia, tipo, "precio1diaExt", "precio2diaExt") FROM stdin;
cmllmj5a3000010ib6kix33kv	Clase ├Ünica	Clase individual de prueba	\N	10	15000	90	t	\N	\N	2026-02-14 01:14:33.721	2026-02-14 01:14:33.721	\N	0	0	REGULAR	0	0
cmkrrfxzn00011f8zhitduio9	Taller de Verano	Talleres intensivos durante Enero y Febrero.	\N	10	75000	90	t	MARTES, MIERCOLES, JUEVES, VIERNES	16:00	2026-01-24 03:38:57.107	2026-01-25 00:36:45.59	\N	75000	130000	REGULAR	260000	380000
cmkrrfxyx00001f8z9iwmicpi	Taller Regular	Curso anual de arte para todas las edades.	\N	10	25000	90	t	MARTES, MIERCOLES, JUEVES, VIERNES	16:00	2026-01-24 03:38:57.079	2026-01-24 12:39:55.755	\N	55000	100000	REGULAR	0	0
\.


--
-- Data for Name: tareas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tareas (id, titulo, descripcion, fecha, hora, prioridad, categoria, completada, "completadaEn", "creadoEn", "actualizadoEn") FROM stdin;
\.


--
-- Data for Name: testimonios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonios (id, nombre, texto, imagen, destacado, activo, "creadoEn") FROM stdin;
cmkrpzk9g000912twxgehf77b	Mar├¡a Garc├¡a	Taller Limon├® cambi├│ mi perspectiva del arte. Natalia tiene una paciencia incre├¡ble.	\N	f	t	2026-01-24 02:58:13.204
cmkrpzk9m000a12twsi91t2wg	Carlos Rodr├¡guez	Nunca pens├® que podr├¡a pintar algo tan lindo. El ambiente del taller es s├║per acogedor.	\N	f	t	2026-01-24 02:58:13.21
cmkrpzk9r000b12twq9gr68f8	Ana Mart├¡nez	Mi hija ama ir al taller. Ver c├│mo desarroll├│ su creatividad fue incre├¡ble.	\N	f	t	2026-01-24 02:58:13.216
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, email, password, nombre, telefono, rol, imagen, activo, "debeCambiarPassword", "creadoEn", "actualizadoEn") FROM stdin;
cmkrc5q8m0000jt6hljld23aw	natalia@limone.usev.app	$2a$12$PIp7Tqmdq/bCR8ox0Li7Zuk0N0vXrdYyRk.mSg5/jLhmktiOiUx4y	Natalia Fusari	\N	ADMIN	\N	t	t	2026-01-23 20:31:06.262	2026-01-24 02:58:12.44
cmkrc5qiv0001jt6hxc3lxatg	docente@limone.usev.app	$2a$10$55gf5Q2qQtoRzkNGRRSpQ.vysWWNZiyZHx67rePLr0zoIHcX4L8jS	Docente Demo	\N	DOCENTE	\N	t	f	2026-01-23 20:31:06.631	2026-01-24 12:24:10.587
cmkt3kd6c0000xak6xz0dd9il	natalia@tallerlimone.com	$2a$12$qFjjK7HKMPgKogMFiyGpFuDuzJEhP7Mb2EG/aRHKqPEIi.DiUXmYm	Natalia Fusari	\N	ADMIN	\N	t	f	2026-01-25 02:06:04.98	2026-01-25 02:57:41.518
\.


--
-- Data for Name: visitas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.visitas (id, fecha, referente, path, "userAgent", "ipSession") FROM stdin;
cmlpahcwj0000tpbsg22zz0fx	2026-02-16 14:48:19.603	direct	/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlpbrmya0000wlb0j2uj5uhm	2026-02-16 15:24:18.801	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlpbrxfk0001wlb05tlpci8m	2026-02-16 15:24:32.385	direct	/login	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlpbw1j80002wlb00543kkey	2026-02-16 15:27:44.322	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlpc1wbu0000uee2vnage9f1	2026-02-16 15:32:17.514	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlqk6pno0000tiuc5jlgwuvr	2026-02-17 12:07:45.226	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlqk6qvd0001tiucvrj8rirn	2026-02-17 12:07:46.825	direct	/login	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlqk80l30002tiuc52ji5qjd	2026-02-17 12:08:46.011	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlqkbnce0003tiuc6dr2egv0	2026-02-17 12:11:35.532	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlqke3oj0004tiuc3o6j4dy1	2026-02-17 12:13:30.017	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlqkes670005tiuca1bh949e	2026-02-17 12:14:01.758	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlqkh5eg0006tiucwztjth2i	2026-02-17 12:15:52.211	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlqkhqjl0007tiuctk7ywbvu	2026-02-17 12:16:19.617	direct	/mantenimiento	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	\N
cmlqkjyln0008tiuc2pnk1ozs	2026-02-17 12:18:03.366	direct	/login	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	\N
cmlqkk3qw0009tiuc6tt29riz	2026-02-17 12:18:10.04	direct	/mantenimiento	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	\N
cmlqkkhpq000atiuczjmczywt	2026-02-17 12:18:28.143	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlqkngr0000btiucmel97vda	2026-02-17 12:20:46.83	direct	/mantenimiento	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	\N
cmlqknmze000ctiuc5ekimc3t	2026-02-17 12:20:54.939	direct	/mantenimiento	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	\N
cmlqkzi1y000dtiucgs31u8oz	2026-02-17 12:30:08.42	direct	/mantenimiento	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	\N
\.


--
-- Name: alumnos alumnos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_pkey PRIMARY KEY (id);


--
-- Name: asistencias asistencias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT asistencias_pkey PRIMARY KEY (id);


--
-- Name: citas_nivelacion citas_nivelacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas_nivelacion
    ADD CONSTRAINT citas_nivelacion_pkey PRIMARY KEY (id);


--
-- Name: clases clases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clases
    ADD CONSTRAINT clases_pkey PRIMARY KEY (id);


--
-- Name: configuracion configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT configuracion_pkey PRIMARY KEY (id);


--
-- Name: creditos_clase_extra creditos_clase_extra_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.creditos_clase_extra
    ADD CONSTRAINT creditos_clase_extra_pkey PRIMARY KEY (id);


--
-- Name: dias_no_laborables dias_no_laborables_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dias_no_laborables
    ADD CONSTRAINT dias_no_laborables_pkey PRIMARY KEY (id);


--
-- Name: inscripciones inscripciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_pkey PRIMARY KEY (id);


--
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);


--
-- Name: obras obras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.obras
    ADD CONSTRAINT obras_pkey PRIMARY KEY (id);


--
-- Name: opciones_inscripcion opciones_inscripcion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opciones_inscripcion
    ADD CONSTRAINT opciones_inscripcion_pkey PRIMARY KEY (id);


--
-- Name: orden_productos orden_productos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_productos
    ADD CONSTRAINT orden_productos_pkey PRIMARY KEY (id);


--
-- Name: ordenes_tienda ordenes_tienda_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordenes_tienda
    ADD CONSTRAINT ordenes_tienda_pkey PRIMARY KEY (id);


--
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- Name: slider_images slider_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.slider_images
    ADD CONSTRAINT slider_images_pkey PRIMARY KEY (id);


--
-- Name: slides slides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.slides
    ADD CONSTRAINT slides_pkey PRIMARY KEY (id);


--
-- Name: solicitudes_recuperacion solicitudes_recuperacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes_recuperacion
    ADD CONSTRAINT solicitudes_recuperacion_pkey PRIMARY KEY (id);


--
-- Name: talleres talleres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.talleres
    ADD CONSTRAINT talleres_pkey PRIMARY KEY (id);


--
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- Name: testimonios testimonios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonios
    ADD CONSTRAINT testimonios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: visitas visitas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitas
    ADD CONSTRAINT visitas_pkey PRIMARY KEY (id);


--
-- Name: asistencias_alumnoId_claseId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "asistencias_alumnoId_claseId_key" ON public.asistencias USING btree ("alumnoId", "claseId");


--
-- Name: configuracion_clave_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX configuracion_clave_key ON public.configuracion USING btree (clave);


--
-- Name: dias_no_laborables_fecha_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dias_no_laborables_fecha_key ON public.dias_no_laborables USING btree (fecha);


--
-- Name: opciones_inscripcion_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX opciones_inscripcion_nombre_key ON public.opciones_inscripcion USING btree (nombre);


--
-- Name: password_reset_tokens_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX password_reset_tokens_token_key ON public.password_reset_tokens USING btree (token);


--
-- Name: talleres_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX talleres_nombre_key ON public.talleres USING btree (nombre);


--
-- Name: usuarios_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email);


--
-- Name: visitas_fecha_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitas_fecha_idx ON public.visitas USING btree (fecha);


--
-- Name: alumnos alumnos_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT "alumnos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asistencias asistencias_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT "asistencias_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asistencias asistencias_claseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT "asistencias_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES public.clases(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: citas_nivelacion citas_nivelacion_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas_nivelacion
    ADD CONSTRAINT "citas_nivelacion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: clases clases_docenteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clases
    ADD CONSTRAINT "clases_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: clases clases_tallerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clases
    ADD CONSTRAINT "clases_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES public.talleres(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: creditos_clase_extra creditos_clase_extra_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.creditos_clase_extra
    ADD CONSTRAINT "creditos_clase_extra_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: creditos_clase_extra creditos_clase_extra_tallerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.creditos_clase_extra
    ADD CONSTRAINT "creditos_clase_extra_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES public.talleres(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: inscripciones inscripciones_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT "inscripciones_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inscripciones inscripciones_tallerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT "inscripciones_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES public.talleres(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notificaciones notificaciones_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT "notificaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: obras obras_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.obras
    ADD CONSTRAINT "obras_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: obras obras_claseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.obras
    ADD CONSTRAINT "obras_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES public.clases(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orden_productos orden_productos_ordenId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_productos
    ADD CONSTRAINT "orden_productos_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES public.ordenes_tienda(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orden_productos orden_productos_productoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_productos
    ADD CONSTRAINT "orden_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES public.productos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: pagos pagos_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "pagos_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pagos pagos_inscripcionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "pagos_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES public.inscripciones(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: password_reset_tokens password_reset_tokens_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT "password_reset_tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solicitudes_recuperacion solicitudes_recuperacion_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes_recuperacion
    ADD CONSTRAINT "solicitudes_recuperacion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solicitudes_recuperacion solicitudes_recuperacion_inscripcionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes_recuperacion
    ADD CONSTRAINT "solicitudes_recuperacion_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES public.inscripciones(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict N8vfNHhtCpJ4zWo9OGRJEdA28o078erGclISdFmb0GU8hSUZ9PIJkMoLYapYSxB

