# Documentación Técnica de la Plataforma
## Limoné OS - Arquitectura y Tecnologías

Este documento técnico detalla la infraestructura, el stack tecnológico y la lógica de negocio que sustenta la plataforma de gestión integral para Taller Limoné.

---

### 1. Vision General del Proyecto
Limoné OS es una aplicación web de alto rendimiento orientada a la gestión educativa y comercial. Combina un robusto panel administrativo con un portal autogestionable para padres y alumnos, integrando pagos, facturación y seguimiento académico.

### 2. Stack Tecnológico (The Stack)
- **Frontend & Backend**: Next.js 15 (Arquitectura App Router), aprovechando Server Components para una carga ultrarrápida y optimización SEO.
- **Base de Datos**: PostgreSQL, utilizando Prisma como ORM para una gestión de datos tipada y segura.
- **Autenticación**: NextAuth.js con estrategia JWT (JSON Web Tokens) de alta seguridad.
- **Procesamiento de Imágenes**: Cloudinary API para el almacenamiento y optimización de activos visuales.
- **Estilos**: Tailwind CSS para una interfaz moderna, responsiva y de carga ligera.

### 3. Módulos Críticos del Sistema
- **Motor de Middleware**: Sistema de seguridad perimetral que gestiona roles de acceso y el estado de mantenimiento global en el borde de la aplicación.
- **Sistema de Facturación**: Integración con servicios de AFIP para la emisión de comprobantes autorizados.
- **Analytics Engine**: Rastreador de tráfico propio que analiza la procedencia de las visitas sin comprometer la privacidad del usuario (libre de cookies externas).
- **Generador de Documentos**: Implementación de lógica en servidor para la creación dinámica de archivos PDF (Fichas de inscripción y reportes).

### 4. Flujos de Trabajo Principales
- **Inscripción Inteligente**: Un flujo paso a paso que valida la disponibilidad de cupos en tiempo real antes de permitir el registro.
- **Verificación de Pagos**: Sistema de dos pasos (carga del alumno / verificación del admin) para asegurar el control total sobre los ingresos.
- **Portal del Alumno**: Dashboard personalizado donde el alumno puede ver sus cobros pendientes, su historial de asistencia y su galería de obras.

### 5. Escalabilidad y Despliegue
La aplicación está preparada para ser escalada horizontalmente. La persistencia de datos está desacoplada de la lógica de aplicación, permitiendo migraciones de base de datos sin tiempos de inactividad perceptibles.

---
Este documento ha sido desarrollado por **Vsolutions** para Taller Limoné.
