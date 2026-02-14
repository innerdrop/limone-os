--
-- PostgreSQL database dump
--

\restrict iytjFEJ1aiuYkDXcyjymEDGIhlInnVehap2ZhP77HKrkFQyNjQUAYgD2dj5n6L3

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
    "actualizadoEn" timestamp(3) without time zone NOT NULL
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
    horarios jsonb
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
-- Data for Name: alumnos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.alumnos (id, "usuarioId", nombre, apellido, dni, "fechaNacimiento", edad, domicilio, "domicilioCalle", "domicilioNumero", "domicilioTira", "domicilioPiso", "domicilioDepto", colegio, grado, "tutorNombre", "tutorApellido", "tutorDni", "tutorRelacion", "tutorDomicilio", "tutorDomicilioCalle", "tutorDomicilioNumero", "tutorDomicilioTira", "tutorDomicilioPiso", "tutorDomicilioDepto", "tutorTelefonoPrincipal", "tutorTelefonoAlternativo", "tutorEmail", "tutorProfesion", "emergenciaNombre", "emergenciaTelefono", "emergenciaRelacion", "obraSocial", "numeroAfiliado", "hospitalReferencia", alergias, "medicacionHabitual", "condicionesMedicas", "restriccionesFisicas", "autorizacionParticipacion", "autorizacionMedica", "autorizacionRetiro", "autorizacionImagenes", "aceptacionReglamento", "firmaResponsable", "aclaracionFirma", "dniFirma", "planPago", "formaPago", "firmaConformidad", "perfilCompleto", "contactoEmergencia", "telefonoEmergencia", nivel, notas, "creadoEn", "actualizadoEn", "claseUnicaAprobada") FROM stdin;
cmkzkyw6z000211caji6i1zfr	cmkzkjus2000011casc5m7t92	Mauro	Rodriguez	30222222	2018-05-22 00:00:00	7	Paseo de la plaza 2065	Paseo de la plaza	2065				Colegio Nacional de Ushuaia	4┬░ Grado Primaria	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	Natalia Fusari (DNI: 28222222), Beatriz Aguirre (DNI: 20444444)	t	t	\N	Iyad Marmoud	19094022	\N	\N	\N	t	\N	\N	PRINCIPIANTE	\N	2026-01-29 14:59:49.744	2026-01-29 15:00:00.413	f
cml1p6hea000abyqg62h4nyb2	cmkzkjus2000011casc5m7t92	Natalia	Fusari	30222222	2013-01-30 00:00:00	13	Alem 2800	Alem	2800				Colegio Provincial "Klokedten"	5┬░ Grado Primaria	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	S├ì, SE RETIRA SOLO	t	t	\N	Iyad	19094022	\N	\N	\N	t	\N	\N	PRINCIPIANTE	\N	2026-01-31 02:33:18.227	2026-01-31 02:33:18.557	f
cmllckzuo0003r61ivjlxp4ct	cmllcb7y70001r61ir6lmz2mz	Alie	Rodriguez	32123456	2018-02-24 00:00:00	7	Paseo de la plaza 2065	Paseo de la plaza	2065				Escuela N┬░ 48	3┬░ Grado Primaria	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	Juan Carlos (DNI: 32123457)	f	t	\N	Mauro	32123456	\N	\N	\N	t	\N	\N	PRINCIPIANTE	\N	2026-02-13 20:36:03.826	2026-02-13 20:36:04.216	f
cmllngyzv000165zc77fl9dv8	cmkzkjus2000011casc5m7t92	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	f	\N	\N	\N	\N	\N	\N	f	\N	\N	PRINCIPIANTE	\N	2026-02-14 01:40:51.879	2026-02-14 01:40:51.879	f
cmllnt2mp0001j9uhprv2ynya	cmkzkjus2000011casc5m7t92	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	f	\N	\N	\N	\N	\N	\N	f	\N	\N	PRINCIPIANTE	\N	2026-02-14 01:50:16.46	2026-02-14 01:50:16.46	f
cmllo868w000187f6rwj008be	cmkzkjus2000011casc5m7t92	Alie	Rodriguez	40888888	2018-10-10 00:00:00	7	Pseo 2034	Pseo	2034	\N	\N	\N	Colegio Provincial "Klokedten"	3┬░ Grado Primaria	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	S├ì, SE RETIRA SOLO	f	t	\N	AAAAAAAA	40888888	\N	\N	\N	t	\N	\N	PRINCIPIANTE	\N	2026-02-14 02:02:00.987	2026-02-14 02:02:00.987	f
cmllulfs10001810a6e4gx5af	cml31haxc0000r61icdlj8sf9	Gabriel	Rod	33333333	2018-05-22 00:00:00	7	Paseo 2065	Paseo	2065	\N	\N	\N	Colegio Nacional de Ushuaia	2┬░ Grado Primaria	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	S├ì, SE RETIRA SOLO	f	t	\N	Iyad	19094022	\N	\N	\N	t	\N	\N	PRINCIPIANTE	\N	2026-02-14 05:00:17.565	2026-02-14 05:07:24.866	t
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
\.


--
-- Data for Name: creditos_clase_extra; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.creditos_clase_extra (id, "alumnoId", motivo, usado, "fechaProgramada", "horarioProgramado", "creadoEn", "actualizadoEn", "tallerId") FROM stdin;
cmlluxdz4000q810acpw734v4	cmllulfs10001810a6e4gx5af	Clase cancelada el 17/2/2026: Carnaval	f	\N	\N	2026-02-14 05:09:35.105	2026-02-14 05:09:35.105	\N
cmlluxdyc000m810a3tg5vwio	cml1p6hea000abyqg62h4nyb2	Clase cancelada el 17/2/2026: Carnaval	t	2026-02-17 00:00:00	19:00 - 20:30	2026-02-14 05:09:35.076	2026-02-14 05:15:42.22	\N
cmllvhr3d0014810az098wreq	cmllulfs10001810a6e4gx5af	Clase cancelada el 24/2/2026: Enfermedad	f	\N	\N	2026-02-14 05:25:25.226	2026-02-14 05:25:25.226	\N
cmllvhr2j0010810afoamx8ce	cml1p6hea000abyqg62h4nyb2	Clase cancelada el 24/2/2026: Enfermedad	t	2026-02-19 00:00:00	19:10-20:30	2026-02-14 05:25:25.195	2026-02-14 05:49:52.931	\N
\.


--
-- Data for Name: dias_no_laborables; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dias_no_laborables (id, fecha, motivo, "creadoEn", "actualizadoEn") FROM stdin;
cmllux8wi000j810apq1m3c7p	2026-02-16 03:00:00	Carnaval	2026-02-14 05:09:28.508	2026-02-14 05:09:28.508
cmlluxdxr000k810a9gqktqfx	2026-02-17 03:00:00	Carnaval	2026-02-14 05:09:35.055	2026-02-14 05:09:35.055
cmllvesp3000v810awffm03ku	2026-02-20 03:00:00	Enfermedad	2026-02-14 05:23:07.331	2026-02-14 05:23:07.331
cmllvgaqi000w810atvxt5dvg	2026-02-27 03:00:00	Enfermedad	2026-02-14 05:24:17.362	2026-02-14 05:24:17.362
cmllvgqxg000x810afupap5it	2026-02-23 03:00:00	Enfermedad	2026-02-14 05:24:38.354	2026-02-14 05:24:38.354
cmllvhqzt000y810attlgfw0a	2026-02-24 03:00:00	Enfermedad	2026-02-14 05:25:25.095	2026-02-14 05:25:25.095
\.


--
-- Data for Name: inscripciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inscripciones (id, "alumnoId", "tallerId", dia, horario, pagado, "fechaInscripcion", estado, notas, fase, asiento, "creadoEn", "actualizadoEn") FROM stdin;
cml1p6hi0000dbyqgg47lk32v	cml1p6hea000abyqg62h4nyb2	cmkrrfxyx00001f8z9iwmicpi	MARTES	16:00-17:20	t	2026-01-31 02:33:18.36	ACTIVA	\N	Fase 2	2	2026-01-31 02:33:18.36	2026-02-01 00:08:56.514
cmllcl0060008r61iu4sa0yov	cmllckzuo0003r61ivjlxp4ct	cmkrrfxyx00001f8z9iwmicpi	JUEVES	19:10-20:30	f	2026-02-13 20:36:04.038	CANCELADA	[CANCELACI├ôN: 13/2/2026] Motivo: Error en el registro	Fase 1	3	2026-02-13 20:36:04.038	2026-02-14 02:32:06.351
cmllckzyr0006r61iul7wznda	cmllckzuo0003r61ivjlxp4ct	cmkrrfxyx00001f8z9iwmicpi	MARTES	17:30-18:50	t	2026-02-13 20:36:03.988	CANCELADA	[CANCELACI├ôN: 13/2/2026] Motivo: Error en el registro	Fase 1	1	2026-02-13 20:36:03.988	2026-02-14 02:32:13.595
cmllo86bw000487f6xm17984b	cmllo868w000187f6rwj008be	cmllmj5a3000010ib6kix33kv	VIERNES	19:10-20:30	f	2026-02-14 02:02:01.1	CANCELADA	[CANCELACI├ôN: 13/2/2026] Motivo: Error en el registro\n\n[CANCELACI├ôN: 13/2/2026] Motivo: Inscripci├│n duplicada	Clase ├Ünica	6	2026-02-14 02:02:01.1	2026-02-14 02:37:40.281
cmkzkyzb3000511cag9csrlae	cmkzkyw6z000211caji6i1zfr	cmkrrfxyx00001f8z9iwmicpi	MARTES	16:00-17:20	t	2026-01-29 14:59:57.374	CANCELADA	[CANCELACI├ôN: 13/2/2026] Motivo: No realiz├│ el pago	Fase 3	1	2026-01-29 14:59:57.374	2026-02-14 02:38:24.057
cmkzl0l2f000c11ca6221ezrx	cmkzkyw6z000211caji6i1zfr	cmkrrfxzn00011f8zhitduio9	JUEVES	16:00-17:20	t	2026-01-29 15:01:12.231	CANCELADA	Modalidad: BASE, Freq: 1x, Inicio: 2026-02-05\n\n[CANCELACI├ôN: 13/2/2026] Motivo: Baja solicitada por el tutor	Taller de Verano	0	2026-01-29 15:01:12.231	2026-02-14 02:38:32.899
cmllmj5hn000310ibeyvboowz	cmkzkyw6z000211caji6i1zfr	cmllmj5a3000010ib6kix33kv	LUNES	19:10-20:30	f	2026-02-14 01:14:33.994	CANCELADA	[CANCELACI├ôN: 13/2/2026] Motivo: Inscripci├│n duplicada	Clase ├Ünica	8	2026-02-14 01:14:33.994	2026-02-14 02:38:42.091
cmllngz2o000465zckawx3utj	cmllngyzv000165zc77fl9dv8	cmllmj5a3000010ib6kix33kv	VIERNES	19:10-20:30	f	2026-02-14 01:40:51.985	CANCELADA	\n[LIMPIEZA AUTOM├üTICA] Cancelada por pedido de admin para limpiar pendientes.	Clase ├Ünica	10	2026-02-14 01:40:51.985	2026-02-14 02:43:15.205
cmllnt2pc0004j9uhoj0zbwdp	cmllnt2mp0001j9uhprv2ynya	cmllmj5a3000010ib6kix33kv	JUEVES	16:00-17:20	f	2026-02-14 01:50:16.56	CANCELADA	\n[LIMPIEZA AUTOM├üTICA] Cancelada por pedido de admin para limpiar pendientes.	Clase ├Ünica	10	2026-02-14 01:50:16.56	2026-02-14 02:43:15.232
cmllulfui0004810azgpt3cr6	cmllulfs10001810a6e4gx5af	cmllmj5a3000010ib6kix33kv	MARTES	16:00-17:20	t	2026-02-14 05:00:17.658	ACTIVA	\N	Clase ├Ünica	1	2026-02-14 05:00:17.658	2026-02-14 05:04:07.904
\.


--
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notificaciones (id, "usuarioId", titulo, mensaje, leida, tipo, enlace, "fechaEnvio") FROM stdin;
cmkrs3wz600019lyab3l4r7p8	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Mar├¡a Garc├¡a avis├│ que ya realiz├│ la transferencia de $┬á50.000,00.	t	INFO	/admin/finanzas	2026-01-24 03:57:35.536
cmkrs442k00039lyaredgt0cx	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Mar├¡a Garc├¡a avis├│ que ya realiz├│ la transferencia de $┬á105.000,00.	t	INFO	/admin/finanzas	2026-01-24 03:57:44.732
cmkzl5pr2000i11caclgnwr4i	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Iyad Marmoud avis├│ que ya realiz├│ la transferencia de $┬á25.000,00.	f	INFO	/admin/finanzas	2026-01-29 15:05:11.58
cmkzll8t9000111po60ornnr2	cmkzkjus2000011casc5m7t92	┬íPago Confirmado!	Tu pago de $25.000 ha sido confirmado. Tu inscripci├│n est├í activa y tus clases ya aparecen en el calendario.	t	SUCCESS	\N	2026-01-29 15:17:16.123
cmkzl0m8w000g11calktsddfb	cmkzkjus2000011casc5m7t92	Inscripci├│n Taller de Verano	Inscripci├│n exitosa. Modalidad BASE, D├¡as: JUEVES. Valor total: $75000	t	INFO	\N	2026-01-29 15:01:13.76
cmkzkz0tt000911capelpbjlh	cmkzkjus2000011casc5m7t92	Inscripci├│n Registrada	Inscripci├│n exitosa en Fase 3. D├¡as: MARTES. Valor mensual: $25000	t	INFO	\N	2026-01-29 14:59:59.343
cmkzlxitw000411po8yrny22d	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Iyad Marmoud avis├│ que ya realiz├│ la transferencia de $┬á75.000,00.	f	INFO	/admin/finanzas	2026-01-29 15:26:48.979
cmkzlywqk000711poa22fajbq	cmkzkjus2000011casc5m7t92	┬íPago Confirmado!	Tu pago de $75.000 ha sido confirmado. Tu inscripci├│n est├í activa y tus clases ya aparecen en el calendario.	t	SUCCESS	\N	2026-01-29 15:27:53.66
cml1p6hlq000jbyqgclu9dgi9	cmkrc5q8m0000jt6hljld23aw	Nueva Inscripci├│n (Regular)	Un alumno se inscribi├│ a Fase 2. D├¡as: MARTES. Total: $25000	f	INFO	/admin/alumnos/cml1p6hea000abyqg62h4nyb2	2026-01-31 02:33:18.495
cml1p6hjw000hbyqgs1kjyj50	cmkzkjus2000011casc5m7t92	Inscripci├│n Registrada	Inscripci├│n exitosa en Fase 2. D├¡as: MARTES. Valor mensual: $25000	t	INFO	\N	2026-01-31 02:33:18.428
cml2zgoo200013cqc79mq74d8	cmkzkjus2000011casc5m7t92	┬íPago Confirmado!	Tu pago de $25.000 ha sido confirmado. Tu inscripci├│n est├í activa y tus clases ya aparecen en el calendario.	t	SUCCESS	\N	2026-02-01 00:08:56.547
cmkzlxitw000511pomdmyqghk	cmkt3kd6c0000xak6xz0dd9il	Nuevo Aviso de Pago	Iyad Marmoud avis├│ que ya realiz├│ la transferencia de $┬á75.000,00.	t	INFO	/admin/finanzas	2026-01-29 15:26:48.979
cml1p6hml000lbyqgj7n5s6er	cmkt3kd6c0000xak6xz0dd9il	Nueva Inscripci├│n (Regular)	Un alumno se inscribi├│ a Fase 2. D├¡as: MARTES. Total: $25000	t	INFO	/admin/alumnos/cml1p6hea000abyqg62h4nyb2	2026-01-31 02:33:18.525
cmllcl01s000cr61it9u1ucrp	cmllcb7y70001r61ir6lmz2mz	Inscripci├│n Registrada	Inscripci├│n exitosa en Fase 1. D├¡as: MARTES, JUEVES. Valor mensual: $50000	f	INFO	\N	2026-02-13 20:36:04.096
cmllcl03g000er61ixfqii5rj	cmkrc5q8m0000jt6hljld23aw	Nueva Inscripci├│n (Regular)	Un alumno se inscribi├│ a Fase 1. D├¡as: MARTES, JUEVES. Total: $50000	f	INFO	/admin/alumnos/cmllckzuo0003r61ivjlxp4ct	2026-02-13 20:36:04.156
cmllcmzao000kr61icaovdpqo	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Mauro Rodriguez avis├│ que ya realiz├│ la transferencia de $┬á50.000,00.	f	INFO	/admin/finanzas	2026-02-13 20:37:36.284
cmllcz7t8000mr61iboqnsobv	cmllcb7y70001r61ir6lmz2mz	┬íPago Confirmado!	Tu pago de $50.000 ha sido confirmado. Tu inscripci├│n est├í activa y tus clases ya aparecen en el calendario.	f	SUCCESS	\N	2026-02-13 20:47:07.34
cmllmj5jf000910ibk1ikadeg	cmkrc5q8m0000jt6hljld23aw	Nueva Clase ├Ünica	Mauro se inscribi├│ a una Clase ├Ünica (LUNES 19:10-20:30). Total: $15000	f	INFO	/admin/alumnos/cmkzkyw6z000211caji6i1zfr	2026-02-14 01:14:34.06
cmllngz3h000a65zcjiwhu944	cmkrc5q8m0000jt6hljld23aw	Nueva Clase ├Ünica	Un alumno se inscribi├│ a una Clase ├Ünica (VIERNES 19:10-20:30). Total: $15000	f	INFO	/admin/alumnos/cmllngyzv000165zc77fl9dv8	2026-02-14 01:40:52.013
cmllnt2qa000aj9uhxwmhvf6p	cmkrc5q8m0000jt6hljld23aw	Nueva Clase ├Ünica	Un alumno se inscribi├│ a una Clase ├Ünica (JUEVES 16:00-17:20). Total: $15000	f	INFO	/admin/alumnos/cmllnt2mp0001j9uhprv2ynya	2026-02-14 01:50:16.595
cmllmj5iw000710ib4gaem0jn	cmkzkjus2000011casc5m7t92	Inscripci├│n a Clase ├Ünica	Tu clase est├í agendada para LUNES a las 19:10-20:30. Asiento: 8. Total: $15000	t	INFO	\N	2026-02-14 01:14:34.04
cmllngz35000865zc69z46ly9	cmkzkjus2000011casc5m7t92	Inscripci├│n a Clase ├Ünica	Tu clase est├í agendada para VIERNES a las 19:10-20:30. Asiento: 10. Total: $15000	t	INFO	\N	2026-02-14 01:40:52.002
cmllnt2px0008j9uh1qn5uo0r	cmkzkjus2000011casc5m7t92	Inscripci├│n a Clase ├Ünica	Tu clase est├í agendada para JUEVES a las 16:00-17:20. Asiento: 10. Total: $15000	t	INFO	\N	2026-02-14 01:50:16.582
cmllnt2qg000cj9uh6zt1qoyn	cmkt3kd6c0000xak6xz0dd9il	Nueva Clase ├Ünica	Un alumno se inscribi├│ a una Clase ├Ünica (JUEVES 16:00-17:20). Total: $15000	t	INFO	/admin/alumnos/cmllnt2mp0001j9uhprv2ynya	2026-02-14 01:50:16.6
cmllmj5jl000b10ibwyd4l6fg	cmkt3kd6c0000xak6xz0dd9il	Nueva Clase ├Ünica	Mauro se inscribi├│ a una Clase ├Ünica (LUNES 19:10-20:30). Total: $15000	t	INFO	/admin/alumnos/cmkzkyw6z000211caji6i1zfr	2026-02-14 01:14:34.066
cmllcmz6j000ir61i0racrx7i	cmkt3kd6c0000xak6xz0dd9il	Nuevo Aviso de Pago	Mauro Rodriguez avis├│ que ya realiz├│ la transferencia de $┬á50.000,00.	t	INFO	/admin/finanzas	2026-02-13 20:37:36.284
cmllcl049000gr61ileq3koxw	cmkt3kd6c0000xak6xz0dd9il	Nueva Inscripci├│n (Regular)	Un alumno se inscribi├│ a Fase 1. D├¡as: MARTES, JUEVES. Total: $50000	t	INFO	/admin/alumnos/cmllckzuo0003r61ivjlxp4ct	2026-02-13 20:36:04.185
cmllngz3l000c65zclwyx815d	cmkt3kd6c0000xak6xz0dd9il	Nueva Clase ├Ünica	Un alumno se inscribi├│ a una Clase ├Ünica (VIERNES 19:10-20:30). Total: $15000	t	INFO	/admin/alumnos/cmllngyzv000165zc77fl9dv8	2026-02-14 01:40:52.017
cmllpavb000032v6lwe6ira1v	cmllcb7y70001r61ir6lmz2mz	Inscripci├│n Cancelada	Tu inscripci├│n al taller Taller Regular ha sido cancelada. Motivo: Error en el registro	f	ALERT	\N	2026-02-14 02:32:06.396
cmllpb0vs00052v6ln20fln7x	cmllcb7y70001r61ir6lmz2mz	Inscripci├│n Cancelada	Tu inscripci├│n al taller Taller Regular ha sido cancelada. Motivo: Error en el registro	f	ALERT	\N	2026-02-14 02:32:13.624
cmllulfv20008810a5emokkn1	cml31haxc0000r61icdlj8sf9	Inscripci├│n a Clase ├Ünica	Tu clase est├í agendada para MARTES a las 16:00-17:20. Asiento: 1. Total: $15000	f	\N	\N	2026-02-14 05:00:17.679
cmllpj5ju00054xt1tvjun8i0	cmkzkjus2000011casc5m7t92	Inscripci├│n Cancelada	Tu inscripci├│n al taller Taller de Verano ha sido cancelada. Motivo: Baja solicitada por el tutor	t	ALERT	\N	2026-02-14 02:38:32.921
cmllpiyuu00034xt1b7pqijl1	cmkzkjus2000011casc5m7t92	Inscripci├│n Cancelada	Tu inscripci├│n al taller Taller Regular ha sido cancelada. Motivo: No realiz├│ el pago	t	ALERT	\N	2026-02-14 02:38:24.243
cmllpi0z100014xt1w5c9qqp7	cmkzkjus2000011casc5m7t92	Inscripci├│n Cancelada	Tu inscripci├│n al taller Clase ├Ünica ha sido cancelada. Motivo: Inscripci├│n duplicada	t	ALERT	\N	2026-02-14 02:37:40.331
cmllp92p100012v6luwmwfr8h	cmkzkjus2000011casc5m7t92	Inscripci├│n Cancelada	Tu inscripci├│n al taller Clase ├Ünica ha sido cancelada. Motivo: Error en el registro	t	ALERT	\N	2026-02-14 02:30:42.66
cmllo86ce000887f6vc6ro8t5	cmkzkjus2000011casc5m7t92	Inscripci├│n a Clase ├Ünica	Tu clase est├í agendada para VIERNES a las 19:10-20:30. Asiento: 6. Total: $15000	t	\N	\N	2026-02-14 02:02:01.118
cmllupbla000b810a1s60o4bq	cmkrc5q8m0000jt6hljld23aw	Nuevo Aviso de Pago	Iyad Marmoud avis├│ que ya realiz├│ la transferencia de $┬á15.000,00.	f	INFO	/admin/finanzas	2026-02-14 05:03:18.766
cmlluqdif000e810a27mmn888	cml31haxc0000r61icdlj8sf9	┬íPago Confirmado!	Tu pago de $15.000 ha sido confirmado. Tu inscripci├│n est├í activa y tus clases ya aparecen en el calendario.	f	SUCCESS	\N	2026-02-14 05:04:07.912
cmlluulhu000i810acfm13wf9	cml31haxc0000r61icdlj8sf9	┬íClase ├Ünica Aprobada! Ô£¿	Ya pod├®s inscribirte en el Taller Regular. ┬íTe esperamos!	f	SUCCESS	\N	2026-02-14 05:07:24.882
cmlluxdz9000s810aua0t1fi5	cml31haxc0000r61icdlj8sf9	­ƒÄ¿ Clase Extra Disponible	El 17/2/2026 no habr├í clases por Carnaval. Ten├®s un cr├®dito disponible para agendar en otra fecha.	f	SUCCESS	\N	2026-02-14 05:09:35.11
cmlluxdyw000o810axqzf9snm	cmkzkjus2000011casc5m7t92	­ƒÄ¿ Clase Extra Disponible	El 17/2/2026 no habr├í clases por Carnaval. Ten├®s un cr├®dito disponible para agendar en otra fecha.	t	SUCCESS	\N	2026-02-14 05:09:35.096
cmllpjcn400074xt1vfhm6r0k	cmkzkjus2000011casc5m7t92	Inscripci├│n Cancelada	Tu inscripci├│n al taller Clase ├Ünica ha sido cancelada. Motivo: Inscripci├│n duplicada	t	ALERT	\N	2026-02-14 02:38:42.112
cmllv59ar000u810afgvr9r2s	cmkrc5q8m0000jt6hljld23aw	Nueva Clase Extra Agendada ­ƒÄ¿	Natalia agend├│ una clase extra para el 16/2/2026 a las 19:00 - 20:30.	f	INFO	\N	2026-02-14 05:15:42.289
cmllvhr3j0016810aeca4znyt	cml31haxc0000r61icdlj8sf9	­ƒÄ¿ Clase Extra Disponible	El 24/2/2026 no habr├í clases por Enfermedad. Ten├®s un cr├®dito disponible para agendar en otra fecha.	f	SUCCESS	\N	2026-02-14 05:25:25.231
cmllvhr300012810a0hxcdaj0	cmkzkjus2000011casc5m7t92	­ƒÄ¿ Clase Extra Disponible	El 24/2/2026 no habr├í clases por Enfermedad. Ten├®s un cr├®dito disponible para agendar en otra fecha.	t	SUCCESS	\N	2026-02-14 05:25:25.212
cmllwd7ok000111l91bc78y54	cmkrc5q8m0000jt6hljld23aw	Nueva Clase Extra Agendada ­ƒÄ¿	Natalia agend├│ una clase extra para el 18/2/2026 a las 19:10-20:30.	f	INFO	\N	2026-02-14 05:49:53.058
cmllupbla000c810a2ggh7hoj	cmkt3kd6c0000xak6xz0dd9il	Nuevo Aviso de Pago	Iyad Marmoud avis├│ que ya realiz├│ la transferencia de $┬á15.000,00.	t	INFO	/admin/finanzas	2026-02-14 05:03:18.766
\.


--
-- Data for Name: obras; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.obras (id, "alumnoId", "claseId", "imagenUrl", titulo, descripcion, tecnica, "fechaCreacion", destacada, "creadoEn") FROM stdin;
cmkzn5o8k0001e9xhla5nzzrf	cmkzkyw6z000211caji6i1zfr	\N	https://res.cloudinary.com/dxaupveuf/image/upload/v1769702467/obras/iblshdwbmbsd7hsahi79.png	Alie	La sonrisa de un lindo atardecer	acrilico	2026-01-29 16:01:08.852	f	2026-01-29 16:01:08.853
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

COPY public.pagos (id, "alumnoId", "inscripcionId", monto, "fechaPago", estado, "mercadoPagoId", "comprobantePdf", "mesCubierto", "anioCubierto", concepto, cae, "caeVencimiento", "puntoVenta", "nroComprobante", "tipoFactura", "cuitEmisor", "emisorNombre", "facturadoEn", "creadoEn", "actualizadoEn") FROM stdin;
cmkzkyzta000711ca1nrwx0ct	cmkzkyw6z000211caji6i1zfr	cmkzkyzb3000511cag9csrlae	25000	2026-01-29 14:59:57.996	CONFIRMADO	\N	\N	1	2026	Cuota Mensual - Taller Regular - Fase 3 (MARTES)	\N	\N	\N	\N	\N	\N	\N	\N	2026-01-29 14:59:57.996	2026-01-29 15:17:11.536
cmkzl0llh000e11cabxq7e2iq	cmkzkyw6z000211caji6i1zfr	cmkzl0l2f000c11ca6221ezrx	75000	2026-01-29 15:01:12.917	CONFIRMADO	\N	\N	1	2026	Taller Verano (1x) - BASE - JUEVES	\N	\N	\N	\N	\N	\N	\N	\N	2026-01-29 15:01:12.917	2026-01-29 15:27:48.867
cml1p6hiz000fbyqg6y9pseq7	cml1p6hea000abyqg62h4nyb2	cml1p6hi0000dbyqgg47lk32v	25000	2026-01-31 02:33:18.395	CONFIRMADO	\N	\N	1	2026	Cuota Mensual - Taller Regular - Fase 2 (MARTES)	\N	\N	\N	\N	\N	\N	\N	\N	2026-01-31 02:33:18.395	2026-02-01 00:08:56.305
cmllcl00l000ar61i3cx1gcm0	cmllckzuo0003r61ivjlxp4ct	cmllckzyr0006r61iul7wznda	50000	2026-02-13 20:36:04.054	CONFIRMADO	\N	\N	2	2026	Cuota Mensual - Taller Regular - Fase 1 (MARTES, JUEVES)	\N	\N	\N	\N	\N	\N	\N	\N	2026-02-13 20:36:04.054	2026-02-13 20:47:07.079
cmllo86c5000687f6f4m0tvwm	cmllo868w000187f6rwj008be	cmllo86bw000487f6xm17984b	15000	2026-02-14 02:02:01.109	RECHAZADO	\N	\N	2	2026	Clase ├Ünica - VIERNES 19:10-20:30	\N	\N	\N	\N	\N	\N	\N	\N	2026-02-14 02:02:01.109	2026-02-14 02:37:40.281
cmllmj5ih000510ibkrab0wct	cmkzkyw6z000211caji6i1zfr	cmllmj5hn000310ibeyvboowz	15000	2026-02-14 01:14:34.024	RECHAZADO	\N	\N	2	2026	Clase ├Ünica - LUNES 19:10-20:30	\N	\N	\N	\N	\N	\N	\N	\N	2026-02-14 01:14:34.024	2026-02-14 02:38:42.091
cmllngz2x000665zck8ho9ir2	cmllngyzv000165zc77fl9dv8	cmllngz2o000465zckawx3utj	15000	2026-02-14 01:40:51.993	RECHAZADO	\N	\N	2	2026	Clase ├Ünica - VIERNES 19:10-20:30	\N	\N	\N	\N	\N	\N	\N	\N	2026-02-14 01:40:51.993	2026-02-14 02:43:15.138
cmllnt2pl0006j9uhg6bs53wx	cmllnt2mp0001j9uhprv2ynya	cmllnt2pc0004j9uhoj0zbwdp	15000	2026-02-14 01:50:16.569	RECHAZADO	\N	\N	2	2026	Clase ├Ünica - JUEVES 16:00-17:20	\N	\N	\N	\N	\N	\N	\N	\N	2026-02-14 01:50:16.569	2026-02-14 02:43:15.219
cmllulfur0006810a3d835ls5	cmllulfs10001810a6e4gx5af	cmllulfui0004810azgpt3cr6	15000	2026-02-14 05:00:17.667	CONFIRMADO	\N	\N	2	2026	Clase ├Ünica - MARTES 16:00-17:20	\N	\N	\N	\N	\N	\N	\N	\N	2026-02-14 05:00:17.667	2026-02-14 05:04:07.846
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
cmllurall000g810abxuercxt	cmllulfs10001810a6e4gx5af	cmllulfui0004810azgpt3cr6	2026-02-17 19:00:00	Viaje al Miami	PENDIENTE	f	\N	\N	2026-02-14 05:04:50.792	2026-02-14 05:04:50.792
\.


--
-- Data for Name: talleres; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.talleres (id, nombre, descripcion, imagen, "cupoMaximo", precio, duracion, activo, "diasSemana", "horaInicio", "creadoEn", "actualizadoEn", horarios) FROM stdin;
cmkrrfxyx00001f8z9iwmicpi	Taller Regular	Curso anual de arte para todas las edades.	\N	10	25000	90	t	MARTES, MIERCOLES, JUEVES, VIERNES	16:00	2026-01-24 03:38:57.079	2026-01-24 12:39:55.755	\N
cmkrrfxzn00011f8zhitduio9	Taller de Verano	Talleres intensivos durante Enero y Febrero.	\N	10	75000	90	t	MARTES, MIERCOLES, JUEVES, VIERNES	16:00	2026-01-24 03:38:57.107	2026-01-25 00:36:45.59	\N
cmllmj5a3000010ib6kix33kv	Clase ├Ünica	Clase individual de prueba	\N	10	15000	90	t	\N	\N	2026-02-14 01:14:33.721	2026-02-14 01:14:33.721	\N
\.


--
-- Data for Name: tareas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tareas (id, titulo, descripcion, fecha, hora, prioridad, categoria, completada, "completadaEn", "creadoEn", "actualizadoEn") FROM stdin;
cmksajr9c000010hj6rcqv1ei	Ir al banco BBVA	Cancelar la tarjeta de cr├®dito	2026-01-29 00:00:00	09:00	MEDIA	OTRO	t	2026-01-29 15:57:54.719	2026-01-24 12:33:47.712	2026-01-29 15:57:54.72
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
cmkzkjus2000011casc5m7t92	iyadmn88@gmail.com	$2a$10$gLGQwfMMp9nVI20.K2YPqu7cFhCimwtEb2dkpxEZfYWBtVXR/a3ga	Iyad Marmoud	+54 2901611605	ALUMNO	\N	t	f	2026-01-29 14:48:11.629	2026-01-29 14:49:10.902
cml31haxc0000r61icdlj8sf9	ing.iyad@gmail.com	$2a$10$B8oKlTPaJPPJiH8I0QjJc.FVubZe8njz9iwc/d0wOdehRV9z/Tntu	Iyad Marmoud	+54 2901611605	ALUMNO	\N	t	f	2026-02-01 01:05:24.624	2026-02-02 02:28:52.044
cmllcb7y70001r61ir6lmz2mz	maugrod@gmail.com	$2a$10$vjALMrFsuGZ/kumqbARqmuRf22LboAIckFAbiYe3JO5x338lMfUvK	Mauro Rodriguez	+54 2901652974	ALUMNO	\N	t	f	2026-02-13 20:28:27.776	2026-02-13 20:29:23.061
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

\unrestrict iytjFEJ1aiuYkDXcyjymEDGIhlInnVehap2ZhP77HKrkFQyNjQUAYgD2dj5n6L3

