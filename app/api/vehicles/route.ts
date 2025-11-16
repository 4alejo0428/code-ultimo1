import { queryDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const disponible = searchParams.get("disponible")

    let query =
      "SELECT id, marca, modelo, anio, precio_por_dia, categoria_id, transmision, combustible, capacidad, descripcion, disponible, imagen_url, placa, color, creado_en FROM vehiculos"
    const params: any[] = []

    if (disponible !== null) {
      query += " WHERE disponible = $1"
      params.push(disponible === "true")
    } else {
      // Si no hay filtro, mostrar solo vehículos disponibles por defecto
      query += " WHERE disponible = true"
    }

    query += " ORDER BY creado_en DESC"

    const vehicles = await queryDb(query, params.length > 0 ? params : undefined)

    return Response.json(vehicles || [])
  } catch (error) {
    console.error("[v0] Vehicles fetch error:", error)
    return Response.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { marca, modelo, anio, precio_por_dia, categoria_id, transmision, combustible, capacidad, descripcion, placa, color, imagen_url } = body

    const query = `
      INSERT INTO vehiculos (marca, modelo, anio, precio_por_dia, categoria_id, transmision, combustible, capacidad, descripcion, placa, color, imagen_url, disponible)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
      RETURNING *
    `
    
    const result = await queryDb(query, [
      marca,
      modelo,
      anio,
      precio_por_dia,
      categoria_id,
      transmision,
      combustible,
      capacidad,
      descripcion,
      placa,
      color,
      imagen_url || null
    ])

    return Response.json(result[0])
  } catch (error) {
    console.error("[v0] Vehicle creation error:", error)
    return Response.json({ error: "Failed to create vehicle" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, marca, modelo, anio, precio_por_dia, categoria_id, transmision, combustible, capacidad, descripcion, placa, color, imagen_url, disponible } = body

    const query = `
      UPDATE vehiculos 
      SET marca = $1, modelo = $2, anio = $3, precio_por_dia = $4, categoria_id = $5, 
          transmision = $6, combustible = $7, capacidad = $8, descripcion = $9, 
          placa = $10, color = $11, imagen_url = $12, disponible = $13, actualizado_en = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `
    
    const result = await queryDb(query, [
      marca,
      modelo,
      anio,
      precio_por_dia,
      categoria_id,
      transmision,
      combustible,
      capacidad,
      descripcion,
      placa,
      color,
      imagen_url,
      disponible,
      id
    ])

    return Response.json(result[0])
  } catch (error) {
    console.error("[v0] Vehicle update error:", error)
    return Response.json({ error: "Failed to update vehicle" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return Response.json({ error: "Vehicle ID required" }, { status: 400 })
    }

    const query = "DELETE FROM vehiculos WHERE id = $1 RETURNING id"
    const result = await queryDb(query, [id])

    if (!result || result.length === 0) {
      return Response.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Vehicle deletion error:", error)
    return Response.json({ error: "Failed to delete vehicle" }, { status: 500 })
  }
}
