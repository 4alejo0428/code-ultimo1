import { getDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const disponible = searchParams.get("disponible")

    const sql = getDb()

    let vehicles
    if (disponible !== null) {
      const isDisponible = disponible === "true"
      vehicles = await sql`
        SELECT id, marca, modelo, anio, precio_por_dia, categoria_id, transmision, combustible, capacidad, descripcion, disponible, imagen_url, placa, color, creado_en 
        FROM vehiculos
        WHERE disponible = ${isDisponible}
        ORDER BY creado_en DESC
      `
    } else {
      // Si no hay filtro, mostrar solo vehículos disponibles por defecto
      vehicles = await sql`
        SELECT id, marca, modelo, anio, precio_por_dia, categoria_id, transmision, combustible, capacidad, descripcion, disponible, imagen_url, placa, color, creado_en 
        FROM vehiculos
        WHERE disponible = true
        ORDER BY creado_en DESC
      `
    }

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

    const sql = getDb()
    const result = await sql`
      INSERT INTO vehiculos (marca, modelo, anio, precio_por_dia, categoria_id, transmision, combustible, capacidad, descripcion, placa, color, imagen_url, disponible)
      VALUES (${marca}, ${modelo}, ${anio}, ${precio_por_dia}, ${categoria_id}, ${transmision}, ${combustible}, ${capacidad}, ${descripcion}, ${placa}, ${color}, ${imagen_url || null}, true)
      RETURNING *
    `

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

    const sql = getDb()
    const result = await sql`
      UPDATE vehiculos 
      SET marca = ${marca}, modelo = ${modelo}, anio = ${anio}, precio_por_dia = ${precio_por_dia}, categoria_id = ${categoria_id}, 
          transmision = ${transmision}, combustible = ${combustible}, capacidad = ${capacidad}, descripcion = ${descripcion}, 
          placa = ${placa}, color = ${color}, imagen_url = ${imagen_url}, disponible = ${disponible}, actualizado_en = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

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

    const sql = getDb()
    const result = await sql`DELETE FROM vehiculos WHERE id = ${id} RETURNING id`

    if (!result || result.length === 0) {
      return Response.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Vehicle deletion error:", error)
    return Response.json({ error: "Failed to delete vehicle" }, { status: 500 })
  }
}
