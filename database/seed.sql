INSERT INTO usuarios (nombre, correo, telefono, password_hash, rol, estado) VALUES
('Santiago Mora', 'santiago@parkeate.com', '8888-8888', 'Parqueate2026!', 'Administrador', 'Activo'),
('María González', 'maria@email.com', '8888-1111', 'Parqueate2026!', 'Usuario', 'Activo'),
('Daniel Vargas', 'daniel@email.com', '8888-2222', 'Parqueate2026!', 'Usuario', 'Activo')
ON DUPLICATE KEY UPDATE
nombre = VALUES(nombre),
telefono = VALUES(telefono),
rol = VALUES(rol),
estado = VALUES(estado);

INSERT INTO catalogo_estado_reserva (id, nombre) VALUES
(1, 'Activa'),
(2, 'Confirmada'),
(3, 'Cancelada')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO catalogo_tipo_alerta (id, nombre) VALUES
(1, 'Reserva'),
(2, 'Recordatorio'),
(3, 'Disponibilidad'),
(4, 'Favorito'),
(5, 'Promoción')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO parqueos (nombre, provincia, zona, ubicacion, precio, espacios, calificacion, disponible, imagen, origen) VALUES
('Parqueo Central', 'San José', 'Escazú', 'Escazú Centro', 1500, 30, 4.90, 1, 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800', 'base'),
('City Parking', 'Heredia', 'Belén', 'Belén', 1200, 30, 4.70, 1, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'base'),
('Parking Plaza', 'Alajuela', 'Centro', 'Alajuela Centro', 1000, 30, 4.80, 1, 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800', 'base'),
('Safe Parking', 'Cartago', 'Centro', 'Cartago Centro', 1800, 30, 5.00, 1, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 'base'),
('Pacific Parking', 'Puntarenas', 'Puntarenas', 'Paseo de los Turistas', 1400, 30, 4.60, 1, 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800', 'base'),
('Limon Parking', 'Limón', 'Centro', 'Puerto Limón', 1100, 30, 4.50, 1, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'base'),
('Liberia Park', 'Guanacaste', 'Liberia', 'Liberia Centro', 1300, 30, 4.70, 1, 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800', 'base'),
('Atenas Parking', 'Alajuela', 'Atenas', 'Atenas Centro', 900, 30, 4.80, 1, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800', 'base'),
('Airport Parking', 'Alajuela', 'Río Segundo', 'Aeropuerto Juan Santamaría', 2500, 30, 5.00, 1, 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800', 'base'),
('Mall Parking', 'San José', 'Curridabat', 'Multiplaza Curridabat', 1700, 30, 4.90, 1, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800', 'base'),
('Premium Parking', 'Heredia', 'San Pablo', 'San Pablo', 2000, 30, 5.00, 1, 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800', 'base'),
('Eco Parking', 'Cartago', 'Paraíso', 'Paraíso', 950, 30, 4.60, 1, 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800', 'base'),
('Sabana Parking Tower', 'San José', 'Sabana', 'Sabana Norte', 1600, 30, 4.70, 1, 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800', 'base'),
('Heredia Centro Parking', 'Heredia', 'Centro', 'Avenida Central, Heredia', 1250, 30, 4.55, 1, 'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?w=800', 'base'),
('Cartago Express Parking', 'Cartago', 'Oriental', 'Calle 2, Cartago', 1050, 30, 4.40, 1, 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800', 'base')
ON DUPLICATE KEY UPDATE
provincia = VALUES(provincia),
zona = VALUES(zona),
ubicacion = VALUES(ubicacion),
precio = VALUES(precio),
espacios = VALUES(espacios),
calificacion = VALUES(calificacion),
disponible = VALUES(disponible),
imagen = VALUES(imagen),
origen = VALUES(origen);

INSERT INTO reservas (external_id, usuario, placa, parqueo, espacio, fecha, hora, hora_salida, estado, monto)
SELECT * FROM (
  SELECT 'res-1', 'Juan Pérez', 'ABC-123', 'Parqueo Central', 'A-01', '2026-07-07', '08:00:00', '10:00:00', 'Confirmada', 1500.00
  UNION ALL
  SELECT 'res-2', 'María González', 'XYZ-789', 'City Parking', 'B-02', '2026-07-08', '10:30:00', '12:30:00', 'Activa', 1200.00
) AS seed_reservas
ON DUPLICATE KEY UPDATE
usuario = VALUES(usuario),
placa = VALUES(placa),
parqueo = VALUES(parqueo),
espacio = VALUES(espacio),
fecha = VALUES(fecha),
hora = VALUES(hora),
hora_salida = VALUES(hora_salida),
estado = VALUES(estado),
monto = VALUES(monto);

DELETE FROM espacios;

INSERT INTO espacios (parqueo_id, codigo, zona, estado, tarifa, placa)
SELECT
  p.id,
  CONCAT(
    CASE
      WHEN nums.n BETWEEN 1 AND 10 THEN 'A'
      WHEN nums.n BETWEEN 11 AND 20 THEN 'B'
      ELSE 'C'
    END,
    '-',
    LPAD(CAST(((nums.n - 1) % 10) + 1 AS CHAR), 2, '0')
  ) AS codigo,
  CASE
    WHEN nums.n BETWEEN 1 AND 10 THEN 'A'
    WHEN nums.n BETWEEN 11 AND 20 THEN 'B'
    ELSE 'C'
  END AS zona,
  'Disponible' AS estado,
  p.precio AS tarifa,
  '-' AS placa
FROM parqueos p
CROSS JOIN (
  SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
  UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
  UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
  UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25
  UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
) AS nums;

INSERT INTO alertas (usuario_id, tipo_alerta_id, titulo, mensaje, referencia, leida)
SELECT u.id, 1, 'Reserva Confirmada', 'Tu reserva en Parqueo Central fue confirmada para hoy.', 'res-1', 0
FROM usuarios u
WHERE u.correo = 'maria@email.com'
  AND NOT EXISTS (
      SELECT 1 FROM alertas a WHERE a.referencia = 'res-1' AND a.titulo = 'Reserva Confirmada'
  );

INSERT INTO alertas (usuario_id, tipo_alerta_id, titulo, mensaje, referencia, leida)
SELECT u.id, 3, 'Espacio Disponible', 'Se liberó un espacio en tu zona de interés.', 'park-availability', 0
FROM usuarios u
WHERE u.correo = 'daniel@email.com'
  AND NOT EXISTS (
      SELECT 1 FROM alertas a WHERE a.referencia = 'park-availability' AND a.titulo = 'Espacio Disponible'
  );

INSERT INTO app_state (state_key, state_value) VALUES
('parkeate-solicitudes-parqueo', JSON_ARRAY(
  JSON_OBJECT('id', 'sol-1', 'nombre', 'Parqueo La Sabana', 'provincia', 'San José', 'zona', 'Sabana', 'estado', 'Pendiente'),
  JSON_OBJECT('id', 'sol-2', 'nombre', 'Heredia Centro Park', 'provincia', 'Heredia', 'zona', 'Centro', 'estado', 'Pendiente')
)),
('parkeate-resenas', JSON_ARRAY(
  JSON_OBJECT('id', 'rev-1', 'calificacion', 5, 'comentario', 'Muy seguro y bien ubicado.', 'fecha', '2026-07-07'),
  JSON_OBJECT('id', 'rev-2', 'calificacion', 4, 'comentario', 'Buen precio y entrada rápida.', 'fecha', '2026-07-08')
)),
('parkeate-incidentes', JSON_ARRAY(
  JSON_OBJECT('id', 'inc-1', 'tipo', 'Iluminación', 'descripcion', 'Zona B con poca iluminación.', 'fecha', '2026-07-07', 'estado', 'Publicado')
)),
('parkeate-config-alertas', JSON_OBJECT('zona', '', 'parqueo', '')),
('espacios-admin-parkeate', JSON_ARRAY(
  JSON_OBJECT('zona', 'A', 'espacio', 'A-01', 'estado', 'Disponible', 'placa', '-', 'tarifa', 1500),
  JSON_OBJECT('zona', 'A', 'espacio', 'A-02', 'estado', 'Reservado', 'placa', 'ABC-123', 'tarifa', 1500),
  JSON_OBJECT('zona', 'B', 'espacio', 'B-01', 'estado', 'Ocupado', 'placa', 'XYZ-789', 'tarifa', 1200),
  JSON_OBJECT('zona', 'C', 'espacio', 'C-01', 'estado', 'Mantenimiento', 'placa', '-', 'tarifa', 1000)
)),
('alertas-leidas-parkeate', JSON_ARRAY())
ON DUPLICATE KEY UPDATE
state_value = VALUES(state_value),
updated_at = CURRENT_TIMESTAMP;

INSERT INTO app_state (state_key, state_value)
SELECT
  'espacios-admin-parkeate',
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'zona', CASE
        WHEN nums.n BETWEEN 1 AND 10 THEN 'A'
        WHEN nums.n BETWEEN 11 AND 20 THEN 'B'
        ELSE 'C'
      END,
      'espacio', CONCAT(
        CASE
          WHEN nums.n BETWEEN 1 AND 10 THEN 'A'
          WHEN nums.n BETWEEN 11 AND 20 THEN 'B'
          ELSE 'C'
        END,
        '-',
        LPAD(CAST(((nums.n - 1) % 10) + 1 AS CHAR), 2, '0')
      ),
      'estado', 'Disponible',
      'placa', '-',
      'tarifa', 1500
    )
  )
FROM (
  SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
  UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
  UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
  UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25
  UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
) AS nums
ON DUPLICATE KEY UPDATE
state_value = VALUES(state_value),
updated_at = CURRENT_TIMESTAMP;
