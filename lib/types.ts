export type User = {
  id: string
  nombre: string
  email: string
  contrasena: string
  telefono?: string
  direccion?: string
  nacionalidad?: string
  genero?: number // 1=Masculino, 2=Femenino
  rol: number // 1=admin, 2=cliente
  activo: boolean
  codigo_verificacion?: string
  creado_en: string
}

export type Vehicle = {
  id: string
  marca: string
  modelo: string
  anio?: number
  precio_por_dia: number
  categoria_id?: number
  transmision?: string
  combustible?: string
  capacidad?: number
  descripcion?: string
  placa?: string
  color?: string
  imagen_url?: string
  disponible: boolean
  creado_en: string
  actualizado_en?: string
}

export type Reservation = {
  id: string
  usuario_id: string
  vehiculo_id: string
  fecha_inicio: string
  fecha_fin: string
  total: number
  estado_id: number
  notas?: string
  creado_en: string
  actualizado_en?: string
}

export type Category = {
  id: number
  nombre: string
  descripcion?: string
}

export type Coupon = {
  id: number
  codigo: string
  descuento: number
  fecha_inicio?: string
  fecha_fin?: string
  activo: boolean
  fecha_creacion: string
}

export type Sobrecosto = {
  id: number
  descripcion: string
  reserva_id: number
  monto: number
}

export type Carrito = {
  id: number
  usuario_id: number
  vehiculo_id: number
  fecha_recogida: string
  fecha_devolucion: string
  creado_en: string
}

export type ImagenVehiculo = {
  id: number
  vehiculo_id: number
  nombre_imagen: string
  orden: number
}

export type Genero = {
  id: number
  nombre: string
}

export type Rol = {
  id: number
  nombre: string
}
