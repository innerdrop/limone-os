-- Clear existing slides
DELETE FROM slides;

-- Insert slides
INSERT INTO slides (id, titulo, subtitulo, descripcion, tags, "badgeTexto", "textoBoton", enlace, "imagenUrl", "estiloOverlay", "colorTitulo", "colorSubtitulo", "colorDescripcion", "colorBadge", "colorBoton", "colorFondoBoton", orden, activo, "aplicarBlur", "botonOffset", "creadoEn", "actualizadoEn")
VALUES
(gen_random_uuid(), '', '', '', '[]', '', 'INSCRIBITE HOY', '/inscripcion', 'https://res.cloudinary.com/dxaupveuf/image/upload/v1771884331/slider/wyphxy4y9ce3worxcpmr.jpg', 'none', '#ffffff', '#f1d413', '#57534E', '#ab00ad', '#ffffff', '#f10ed3', 0, true, false, 20, NOW(), NOW()),
(gen_random_uuid(), 'Clase Única', '', 'Vení a conocer Taller Limoné. Probá materiales, conocé el espacio y descubrí tu potencial artístico.', '["🎿 Experiencia Real","👩‍🎿 Docentes Especializados","🎫 Todos los niveles"]', '¡Probá!', 'Agendar Clase Única', '/inscripcion', '/taller-aula.png', 'dark', '#ffffff', '#8E44AD', '#ffffff', '#FFFFFF', '#2D2D2D', '#F1C40F', 1, false, false, 0, NOW(), NOW()),
(gen_random_uuid(), 'Taller de Verano', 'Edición 2026', 'Más que una colonia, un taller de arte especializado para crear y divertirse.', '["📅 6 Ene - 28 Feb","🧒 5 a 12 años","✏ Materiales Incluidos"]', '¡No te lo Pierdas!', 'Regístrate Ahora', '/taller-verano', 'https://res.cloudinary.com/dxaupveuf/image/upload/v1769440147/slider/vdgianybpjg1gutndhws.jpg', 'dark', '#ffffff', '#ffde0a', '#ffffff', '#FFFFFF', '#2D2D2D', '#F1C40F', 2, false, true, 0, NOW(), NOW());
