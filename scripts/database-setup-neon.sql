-- =============================================
-- CARRENTAL - BASE DE DATOS POSTGRESQL (NEON)
-- Script corregido para Next.js
-- =============================================

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id SMALLINT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles (id, nombre) VALUES
(1, 'admin'),
(2, 'cliente')
ON CONFLICT (id) DO NOTHING;

-- Tabla de géneros
CREATE TABLE IF NOT EXISTS generos (
  id SMALLINT PRIMARY KEY,
  nombre VARCHAR(30) NOT NULL
);

INSERT INTO generos (id, nombre) VALUES
(1, 'Masculino'),
(2, 'Femenino')
ON CONFLICT (id) DO NOTHING;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  telefono VARCHAR(30),
  direccion VARCHAR(255),
  nacionalidad VARCHAR(80),
  genero SMALLINT REFERENCES generos(id) ON DELETE SET NULL,
  rol SMALLINT REFERENCES roles(id) ON DELETE SET DEFAULT DEFAULT 2,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  codigo_verificacion VARCHAR(100),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías de vehículos
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255)
);

INSERT INTO categorias (id, nombre, descripcion) VALUES
(1, 'Sedán', 'Vehículos sedán compactos'),
(2, 'SUV', 'Vehículos deportivos utilitarios'),
(3, 'Económico', 'Vehículos económicos'),
(4, 'Lujo', 'Vehículos de lujo y premium')
ON CONFLICT (id) DO NOTHING;

-- Tabla de vehículos (actualizada para Next.js)
CREATE TABLE IF NOT EXISTS vehiculos (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(80) NOT NULL,
  modelo VARCHAR(80) NOT NULL,
  anio SMALLINT,
  precio_por_dia DECIMAL(10,2) NOT NULL,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  transmision VARCHAR(50),
  combustible VARCHAR(50),
  capacidad INTEGER,
  descripcion TEXT,
  placa VARCHAR(20),
  color VARCHAR(30),
  imagen_url VARCHAR(500),
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estados de reserva
CREATE TABLE IF NOT EXISTS estados_reserva (
  id SMALLINT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

INSERT INTO estados_reserva (id, nombre) VALUES
(1, 'Pendiente'),
(2, 'Confirmada'),
(3, 'En Progreso'),
(4, 'Completada'),
(5, 'Cancelada')
ON CONFLICT (id) DO NOTHING;

-- Tabla de reservas (actualizada para Next.js)
CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  vehiculo_id INTEGER NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado_id SMALLINT REFERENCES estados_reserva(id) ON DELETE SET DEFAULT DEFAULT 1,
  notas TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de cupones
CREATE TABLE IF NOT EXISTS cupones (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  tipo VARCHAR(20) DEFAULT 'porcentaje',
  valor DECIMAL(10,2) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  condiciones TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_vehiculos_disponible ON vehiculos(disponible);
CREATE INDEX IF NOT EXISTS idx_vehiculos_categoria ON vehiculos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reservas_vehiculo ON reservas(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado_id);

-- Datos de ejemplo para usuarios
INSERT INTO usuarios (nombre, email, contrasena, password, telefono, direccion, nacionalidad, genero, rol, activo, codigo_verificacion) VALUES
('Admin CarRental', 'admin@carrental.com', 'password', 'password', '3001234567', 'Calle Principal 123', 'Colombia', 1, 1, TRUE, ''),
('Cliente Demo', 'cliente@demo.com', 'password', 'password', '3009876543', 'Avenida 45 #12-34', 'Colombia', 2, 2, TRUE, '')
ON CONFLICT (email) DO NOTHING;

-- Datos de ejemplo para vehículos
INSERT INTO vehiculos (marca, modelo, anio, precio_por_dia, categoria_id, transmision, combustible, capacidad, descripcion, placa, color, imagen_url, disponible) VALUES
('Toyota', 'Corolla', 2024, 50.00, 1, 'Automática', 'Gasolina', 5, 'Sedán compacto eficiente y confiable', 'ABC123', 'Azul', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400', TRUE),
('Honda', 'Civic', 2023, 55.00, 1, 'Automática', 'Gasolina', 5, 'Sedán deportivo con excelente desempeño', 'DEF456', 'Rojo', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400', TRUE),
('Ford', 'Escape', 2024, 75.00, 2, 'Automática', 'Gasolina', 5, 'SUV compacto perfecto para familias', 'GHI789', 'Plateado', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400', TRUE),
('BMW', 'X5', 2024, 150.00, 4, 'Automática', 'Híbrido', 5, 'SUV de lujo con todas las comodidades', 'JKL012', 'Negro', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', TRUE),
('Hyundai', 'i10', 2024, 35.00, 3, 'Manual', 'Gasolina', 5, 'Vehículo económico ideal para la ciudad', 'MNO345', 'Blanco', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400', TRUE)
ON CONFLICT DO NOTHING;

-- Datos de ejemplo para cupones
INSERT INTO cupones (codigo, tipo, valor, fecha_inicio, fecha_fin, condiciones, activo) VALUES
('BIENVENIDA20', 'porcentaje', 20.00, '2025-01-01', '2025-12-31', 'Válido para nuevos usuarios en su primera reserva', TRUE),
('VERANO2025', 'porcentaje', 15.00, '2025-06-01', '2025-08-31', 'Descuento de verano en reservas superiores a 3 días', TRUE),
('FINDE10', 'porcentaje', 10.00, '2025-01-01', '2025-12-31', 'Descuento para reservas de fin de semana', TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Trigger para actualizar 'actualizado_en' automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.actualizado_en = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehiculos_updated_at BEFORE UPDATE ON vehiculos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON reservas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vista para consultas frecuentes de reservas
CREATE OR REPLACE VIEW vista_reservas_completa AS
SELECT 
  r.id,
  r.usuario_id,
  u.nombre as usuario_nombre,
  u.email as usuario_email,
  r.vehiculo_id,
  v.marca as vehiculo_marca,
  v.modelo as vehiculo_modelo,
  v.precio_por_dia,
  r.fecha_inicio,
  r.fecha_fin,
  r.total,
  r.estado_id,
  e.nombre as estado_nombre,
  r.notas,
  r.creado_en
FROM reservas r
LEFT JOIN usuarios u ON r.usuario_id = u.id
LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
LEFT JOIN estados_reserva e ON r.estado_id = e.id;

-- Función para calcular días de reserva
CREATE OR REPLACE FUNCTION calcular_dias_reserva(fecha_inicio TIMESTAMP, fecha_fin TIMESTAMP)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, EXTRACT(DAY FROM (fecha_fin - fecha_inicio))::INTEGER);
END;
$$ LANGUAGE plpgsql;

-- Función para calcular total de reserva
CREATE OR REPLACE FUNCTION calcular_total_reserva(
  p_vehiculo_id INTEGER,
  p_fecha_inicio TIMESTAMP,
  p_fecha_fin TIMESTAMP
)
RETURNS DECIMAL AS $$
DECLARE
  v_precio_dia DECIMAL;
  v_dias INTEGER;
BEGIN
  SELECT precio_por_dia INTO v_precio_dia
  FROM vehiculos
  WHERE id = p_vehiculo_id;
  
  v_dias := calcular_dias_reserva(p_fecha_inicio, p_fecha_fin);
  
  RETURN v_precio_dia * v_dias;
END;
$$ LANGUAGE plpgsql;