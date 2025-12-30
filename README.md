# Taller Limoné - LimoneOS

Plataforma SaaS para gestión de taller de arte en Ushuaia, Argentina.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Inicializar base de datos
npm run db:push

# Iniciar servidor de desarrollo
npm run dev
```

## 🔧 Variables de Entorno

Crear archivo `.env` con:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/limone_db"
NEXTAUTH_SECRET="tu-secret-seguro-32-caracteres"
NEXTAUTH_URL="http://localhost:3000"
```

## 📁 Estructura del Proyecto

```
src/
├── app/                  # App Router (páginas)
│   ├── (landing)/       # Landing page pública
│   ├── portal/          # Portal del alumno
│   ├── admin/           # Panel administrativo
│   └── api/             # API routes
├── components/          # Componentes reutilizables
├── lib/                 # Utilidades y configuraciones
└── types/               # TypeScript types
```

## 🎨 Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Base de Datos**: PostgreSQL + Prisma
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS
- **Pagos**: Mercado Pago (próximamente)

## 📝 Licencia

Desarrollado para Taller Limoné - Natalia Fusari
