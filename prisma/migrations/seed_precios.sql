-- Insert price configuration values

INSERT INTO configuracion (id, clave, valor, descripcion) VALUES
('cfg_precio_taller_regular', 'precio_taller_regular', '25000', 'Precio mensual del Taller Regular'),
('cfg_precio_clase_unica', 'precio_clase_unica', '15000', 'Precio de la Clase Única'),
('cfg_precio_verano_base_1x', 'precio_verano_base_1x', '75000', 'Precio mensual Taller de Verano Base - 1 día'),
('cfg_precio_verano_base_2x', 'precio_verano_base_2x', '130000', 'Precio mensual Taller de Verano Base - 2 días'),
('cfg_precio_verano_extended_1x', 'precio_verano_extended_1x', '145000', 'Precio mensual Taller de Verano Extended - 1 día'),
('cfg_precio_verano_extended_2x', 'precio_verano_extended_2x', '210000', 'Precio mensual Taller de Verano Extended - 2 días')
ON CONFLICT (clave) DO UPDATE SET 
    valor = EXCLUDED.valor,
    descripcion = EXCLUDED.descripcion;
