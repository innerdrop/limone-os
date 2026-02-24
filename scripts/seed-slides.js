// Script to seed slides data into any database
// Usage: node scripts/seed-slides.js
const { PrismaClient } = require('@prisma/client')

const slides = [
    {
        titulo: "",
        subtitulo: "",
        descripcion: "",
        tags: "[]",
        badgeTexto: "",
        textoBoton: "INSCRIBITE HOY",
        enlace: "/inscripcion",
        imagenUrl: "https://res.cloudinary.com/dxaupveuf/image/upload/v1771884331/slider/wyphxy4y9ce3worxcpmr.jpg",
        estiloOverlay: "none",
        colorTitulo: "#ffffff",
        colorSubtitulo: "#f1d413",
        colorDescripcion: "#57534E",
        colorBadge: "#ab00ad",
        colorBoton: "#ffffff",
        colorFondoBoton: "#f10ed3",
        orden: 0,
        activo: true,
        aplicarBlur: false,
        botonOffset: 20,
    },
    {
        titulo: "Clase Única",
        subtitulo: "",
        descripcion: "Vení a conocer Taller Limoné. Probá materiales, conocé el espacio y descubrí tu potencial artístico.",
        tags: JSON.stringify(["🎿 Experiencia Real", "👩‍🎿 Docentes Especializados", "🎫 Todos los niveles"]),
        badgeTexto: "¡Probá!",
        textoBoton: "Agendar Clase Única",
        enlace: "/inscripcion",
        imagenUrl: "/taller-aula.png",
        estiloOverlay: "dark",
        colorTitulo: "#ffffff",
        colorSubtitulo: "#8E44AD",
        colorDescripcion: "#ffffff",
        colorBadge: "#FFFFFF",
        colorBoton: "#2D2D2D",
        colorFondoBoton: "#F1C40F",
        orden: 1,
        activo: false,
        aplicarBlur: false,
        botonOffset: 0,
    },
    {
        titulo: "Taller de Verano",
        subtitulo: "Edición 2026",
        descripcion: "Más que una colonia, un taller de arte especializado para crear y divertirse.",
        tags: JSON.stringify(["📅 6 Ene - 28 Feb", "🧒 5 a 12 años", "✏ Materiales Incluidos"]),
        badgeTexto: "¡No te lo Pierdas!",
        textoBoton: "Regístrate Ahora",
        enlace: "/taller-verano",
        imagenUrl: "https://res.cloudinary.com/dxaupveuf/image/upload/v1769440147/slider/vdgianybpjg1gutndhws.jpg",
        estiloOverlay: "dark",
        colorTitulo: "#ffffff",
        colorSubtitulo: "#ffde0a",
        colorDescripcion: "#ffffff",
        colorBadge: "#FFFFFF",
        colorBoton: "#2D2D2D",
        colorFondoBoton: "#F1C40F",
        orden: 2,
        activo: false,
        aplicarBlur: true,
        botonOffset: 0,
    },
]

async function main() {
    const prisma = new PrismaClient()

    try {
        // Delete existing slides first
        await prisma.slide.deleteMany()
        console.log('[SEED] Slides existentes eliminados')

        // Create all slides
        for (const slide of slides) {
            const created = await prisma.slide.create({ data: slide })
            console.log(`[SEED] ✅ Slide creado: "${slide.titulo || slide.textoBoton}" (orden: ${slide.orden})`)
        }

        console.log(`\n[SEED] ✅ ${slides.length} slides importados exitosamente`)
    } catch (e) {
        console.error('[SEED] ❌ Error:', e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
