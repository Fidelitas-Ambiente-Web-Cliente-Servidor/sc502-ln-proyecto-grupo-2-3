CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('Administrador', 'Usuario') NOT NULL DEFAULT 'Usuario',
  estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parqueos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  provincia VARCHAR(80) NOT NULL,
  zona VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(255) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  espacios_disponibles INT UNSIGNED NOT NULL DEFAULT 0,
  calificacion DECIMAL(2,1) NOT NULL DEFAULT 0,
  imagen VARCHAR(500),
  disponible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reservas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  parqueo_id BIGINT UNSIGNED NOT NULL,
  placa VARCHAR(15) NOT NULL,
  espacio VARCHAR(20) NOT NULL,
  fecha DATE NOT NULL,
  hora_entrada TIME NOT NULL,
  hora_salida TIME NOT NULL,
  estado ENUM('Activa', 'Confirmada', 'Cancelada') NOT NULL DEFAULT 'Activa',
  monto DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_reserva_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  CONSTRAINT fk_reserva_parqueo FOREIGN KEY (parqueo_id) REFERENCES parqueos(id)
);
