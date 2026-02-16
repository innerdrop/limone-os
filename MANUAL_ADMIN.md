# Manual del Administrador - Limoné OS

Bienvenido al manual de administración de **Limoné OS**. Este documento detalla cada una de las secciones del panel administrativo para ayudarte a gestionar el taller de manera eficiente.

---

## 📋 Índice
1. [Tablero (Dashboard)](#1-tablero-dashboard)
2. [Gestión de Alumnos y Usuarios](#2-gestión-de-alumnos-y-usuarios)
3. [Agenda y Clases](#3-agenda-y-clases)
4. [Módulo Financiero (Pagos y Cuotas)](#4-módulo-financiero-pagos-y-cuotas)
5. [Configuración de Talleres y Precios](#5-configuración-de-talleres-y-precios)
6. [Contenido y Galería](#6-contenido-y-galería)
7. [Inscripciones y Clase Única](#7-inscripciones-y-clase-única)
8. [Comunicación y Marketing](#8-comunicación-y-marketing)
9. [Ajustes y Mantenimiento](#9-ajustes-y-mantenimiento)

---

## 1. Tablero (Dashboard)
El centro de control de tu taller. Aquí encontrarás un resumen rápido del estado actual:
- **Resumen Estadístico:** Cantidad de alumnos activos, inscripciones del mes y pagos pendientes.
- **Próximas Clases:** Visualización de los talleres que se dictarán hoy y mañana.
- **Actividad Reciente:** Registro de las últimas inscripciones, pagos confirmados y tareas completadas.
- **Tareas Pendientes:** Una lista de recordatorios rápidos para la gestión diaria.

---

## 2. Gestión de Alumnos y Usuarios

### Registros Usuarios (`/admin/registros`)
Muestra la lista de **padres o tutores** registrados en la plataforma.
- Podrás ver quién se registró recientemente.
- Incluye el nombre del tutor y la cantidad de niños (alumnos) asociados a su cuenta.
- Útil para seguimiento de contactos iniciales.

### Lista de Alumnos (`/admin/alumnos`)
Es la ficha central de cada niño/a. 
- **Filtros Avanzados:** Buscá por nombre, estado de pago, taller principal o incluso por **fecha de actividad** (para saber quién viene hoy).
- **Ficha del Alumno:** Al ingresar a "Ver ficha", podés editar datos médicos, nivel de arte (Principiante, Intermedio, Avanzado) y ver su historial de inasistencias.
- **Exportación:** Botón para descargar la lista completa en formato Excel.

---

## 3. Agenda y Clases

### Agenda (`/admin/agenda`)
Vista detallada de lo que sucede cada día.
- Muestra los talleres con alumnos confirmados.
- **Citas de Nivelación:** Si hay nuevos alumnos con citas programadas, aparecerán aquí.
- **Control de Asistencia:** Al hacer clic en "Ver más", verás la lista de alumnos que deben asistir a ese horario específico.

### Recupero de Clases (`/admin/recuperos`)
Gestión de inasistencias avisadas por los padres.
- **Revisión:** Verás los motivos de la falta y la fecha original.
- **Asignación de Recupero:** Podés decidir si la clase es recuperable y asignar una nueva fecha y bloque horario.
- El sistema notificará automáticamente al usuario sobre la aprobación del recupero.

---

## 4. Módulo Financiero (Pagos y Cuotas)

### Pagos y Cuotas (`/admin/finanzas`)
Gestión de ingresos y facturación.
- **Historial de Pagos:** Lista de todas las transacciones.
- **Verificación de Transferencias:** Cuando un usuario sube un comprobante, el estado aparecerá como "VERIFICAR". Al confirmarlo, el pago impacta en la cuenta del alumno.
- **Inscripciones Pendientes:** Lista rápida de alumnos que se inscribieron pero aún no registraron el pago.
- **Facturación Electrónica:** Botón para generar facturas de AFIP (si está configurado) o cargar comprobantes PDF manualmente.
- **Reportes:** Gráfico de recaudación mensual de los últimos 6 meses.

---

## 5. Configuración de Talleres y Precios

### Configuración Talleres (`/admin/talleres`)
Definición de la oferta educativa.
- **Creación/Edición:** Nombre, descripción, cupo máximo y duración.
- **Horarios Dinámicos:** Podés configurar múltiples días y bloques horarios para un mismo taller.
- **Asignación de Precios:** Vinculá el taller a una configuración de precios específica.

### Gestión de Precios (`/admin/precios`)
Centraliza los costos de todos los servicios.
- Permite definir precios por cantidad de días (1 día/semana, 2 días/semana).
- **Precios de Verano:** Configuración especial para talleres temporales, incluyendo precios para jornadas extendidas.

---

## 6. Contenido y Galería

### Galería de Obras (`/admin/contenido`)
Gestión de la parte visual del taller.
- **Subir Obras:** Permite cargar fotos de las creaciones de los alumnos, asignándolas a su ficha personal.
- **Galería Principal:** Gestión de las fotos que aparecen en la página pública para atraer nuevos alumnos.

### Tienda (`/admin/tienda`)
Administración de la tienda online (E-commerce).
- **Productos:** Carga de materiales artísticos u obras originales.
- **Stock y Precios:** Control de inventario y valores de venta.
- **Destacados:** Opción para mostrar productos específicos en la portada de la tienda.

### Slider / Publicidad (`/admin/slider`)
Gestión del banner principal de la página de inicio.
- Permite cargar hasta 7 imágenes con títulos, botones y enlaces personalizados.
- Podés cambiar el orden de aparición y personalizar los colores de los textos para que combinen con la imagen de fondo.

---

## 7. Inscripciones y Clase Única

### Opciones Inscripción (`/admin/opciones-inscripcion`)
Personaliza los botones que ven los usuarios al iniciar su inscripción.
- Podés crear opciones como "Taller Regular", "Taller de Verano" o "Clase Única".
- Permite asignar colores, iconos (emojis) y badges de "NUEVO".

### Aprobar Clase Única (`/admin/clase-unica`)
Flujo de seguridad para nuevos alumnos.
- Lista de alumnos que realizaron su clase de prueba.
- Una vez que el alumno es aprobado por el docente, podés habilitarlo aquí para que pueda inscribirse al Taller Regular.

---

## 8. Comunicación y Marketing

### Comunicación (`/admin/comunicacion`)
Herramienta de envío de correos institucionales.
- **Destinatarios:** Podés enviar mensajes a **todos** los alumnos, a un **taller específico** o a un **alumno individual**.
- **Diseño Corporativo:** El sistema aplica automáticamente el diseño de Taller Limoné (colores, logo y tipografía).
- **Botones de Acción:** Incluí botones con enlaces directos (por ejemplo, para invitarlos a un evento).

### Gestión de Popup (`/admin/popup`)
Configura el cartel informativo que aparece apenas se carga la web.
- Ideal para anunciar inscripciones abiertas, feriados o promociones.
- Podés activarlo y desactivarlo al instante.

---

## 9. Ajustes y Mantenimiento

### Ajustes del Sistema (`/admin/ajustes`)
Configuraciones técnicas globales.
- **Modo Mantenimiento:** Actívalo si estás realizando cambios grandes y querés que los usuarios no ingresen temporalmente (verán una página de "Volvemos pronto").
- **Estadísticas de Tráfico:** Conocé cuántas personas visitaron la web hoy y desde qué fuentes (Google, Instagram, Directo, etc.).
- **Datos de Contacto:** (Próximamente) Centralización de teléfono y redes sociales.

---
*Manual generado para la administración de Taller Limoné.*
