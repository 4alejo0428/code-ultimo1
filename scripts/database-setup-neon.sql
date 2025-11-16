-- =============================================
-- SCRIPT POSTGRESQL PARA NEON
-- =============================================

CREATE TABLE categorias (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255)
);

CREATE TABLE roles (
  id SMALLINT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles (id, nombre) VALUES
(1, 'admin'),
(2, 'cliente');

CREATE TABLE generos (
  id SMALLINT PRIMARY KEY,
  nombre VARCHAR(30) NOT NULL
);

INSERT INTO generos (id, nombre) VALUES
(1, 'Masculino'),
(2, 'Femenino');

CREATE TABLE usuarios (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  telefono VARCHAR(30),
  direccion VARCHAR(255),
  nacionalidad VARCHAR(80),
  genero SMALLINT REFERENCES generos(id) ON DELETE SET NULL,
  rol SMALLINT REFERENCES roles(id) ON DELETE SET DEFAULT DEFAULT 2,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  codigo_verificacion VARCHAR(100),
  creado_en TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE vehiculos (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  marca VARCHAR(80) NOT NULL,
  modelo VARCHAR(80) NOT NULL,
  anio SMALLINT,
  precio DECIMAL(10,2) NOT NULL,
  categoria INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  transmision VARCHAR(50),
  combustible VARCHAR(50),
  capacidad VARCHAR(50),
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'disponible',
  creado_en TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE carrito (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  vehiculo_id INTEGER NOT NULL,
  fecha_recogida TIMESTAMP NOT NULL,
  fecha_devolucion TIMESTAMP NOT NULL,
  creado_en TIMESTAMP DEFAULT current_timestamp,
  CONSTRAINT fk_carrito_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_carrito_vehiculo FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

CREATE TABLE imagenes_vehiculos (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  vehiculo_id INTEGER NOT NULL,
  nombre_imagen VARCHAR(255) NOT NULL,
  orden INTEGER DEFAULT 0,
  CONSTRAINT fk_imagenes_vehiculos_vehiculo FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

CREATE TABLE reservas (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  vehiculo_id INTEGER NOT NULL,
  fecha_recogida TIMESTAMP NOT NULL,
  fecha_devolucion TIMESTAMP NOT NULL,
  costo_total DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(50),
  estado VARCHAR(50) DEFAULT 'confirmada',
  creado_en TIMESTAMP DEFAULT current_timestamp,
  CONSTRAINT fk_reservas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_reservas_vehiculo FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

CREATE TABLE sobrecostos (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  reserva_id INTEGER NOT NULL,
  monto DECIMAL(10,2) DEFAULT 0.00,
  CONSTRAINT fk_sobrecostos_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE
);

CREATE INDEX idx_carrito_usuario ON carrito(usuario_id);
CREATE INDEX idx_carrito_vehiculo ON carrito(vehiculo_id);
CREATE INDEX idx_imagenes_vehiculo ON imagenes_vehiculos(vehiculo_id);
CREATE INDEX idx_reserva_usuario ON reservas(usuario_id);
CREATE INDEX idx_reserva_vehiculo ON reservas(vehiculo_id);
CREATE INDEX idx_sobrecostos_reserva ON sobrecostos(reserva_id);
CREATE INDEX idx_usuarios_genero ON usuarios(genero);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_vehiculos_categoria ON vehiculos(categoria);

-- INSERCIONES DE USUARIOS
INSERT INTO usuarios (nombre, email, contrasena, telefono, direccion, nacionalidad, genero, rol, activo, codigo_verificacion, creado_en) VALUES
('jose alejandro idrobo dorado', 'josealejo3228@gmail.com', '1234', '3152282763', 'manzana 4 #4-11', 'colombia', 1, 2, TRUE, 'd5be5afdbed0507cacce19f971cdd682', '2025-11-07 17:33:08'),
('jose', 'joseidrobo@unicomfacauca.edu.co', '12345', '31234567890', 'cra1', 'colombia', 1, 2, TRUE, 'a8d234665285e2b189d7e172da5e210d', '2025-11-07 17:37:34'),
('admin', 'admin@carrental.com', '123456', '0000000000000', 'cra1', 'colombia', 1, 1, TRUE, 'e1e2913cdd90a682a6335de0235835fc', '2025-11-07 17:52:46');

-- INSERCIONES DE VEHÍCULOS
INSERT INTO vehiculos (marca, modelo, anio, precio, categoria, transmision, combustible, capacidad, descripcion, estado) VALUES
('Toyota', 'Corolla', 2024, 50.00, 1, 'Automática', 'Gasolina', '5 pasajeros', 'Sedán compacto eficiente y confiable', 'disponible'),
('Honda', 'Civic', 2023, 55.00, 1, 'Automática', 'Gasolina', '5 pasajeros', 'Sedán deportivo con excelente desempeño', 'disponible'),
('Ford', 'Escape', 2024, 75.00, 2, 'Automática', 'Gasolina', '5 pasajeros', 'SUV compacto perfecto para familias', 'disponible'),
('BMW', 'X5', 2024, 150.00, 4, 'Automática', 'Gasolina', '5 pasajeros', 'SUV de lujo con todas las comodidades', 'disponible'),
('Hyundai', 'i10', 2024, 35.00, 3, 'Manual', 'Gasolina', '5 pasajeros', 'Vehículo económico ideal para la ciudad', 'disponible');
