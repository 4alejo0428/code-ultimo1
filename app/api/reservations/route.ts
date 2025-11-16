import { getDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    console.log("[v0] Fetching reservations for userId:", userId)

    const sql = getDb()

    if (userId) {
      const reservations = await sql`
        SELECT r.id, r.usuario_id, r.vehiculo_id, r.fecha_inicio, r.fecha_fin, 
                r.total, r.estado_id, r.notas, r.creado_en,
                v.marca as vehiculo_marca, v.modelo as vehiculo_modelo, v.precio_por_dia,
                e.nombre as estado_nombre
         FROM reservas r
         LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
         LEFT JOIN estados_reserva e ON r.estado_id = e.id
         WHERE r.usuario_id = ${Number.parseInt(userId)}
         ORDER BY r.creado_en DESC
      `
      console.log("[v0] User reservations:", reservations)
      return Response.json(reservations || [])
    }

    const reservations = await sql`
      SELECT r.id, r.usuario_id, r.vehiculo_id, r.fecha_inicio, r.fecha_fin,
              r.total, r.estado_id, r.notas, r.creado_en,
              v.marca as vehiculo_marca, v.modelo as vehiculo_modelo, v.precio_por_dia,
              e.nombre as estado_nombre
       FROM reservas r
       LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
       LEFT JOIN estados_reserva e ON r.estado_id = e.id
       ORDER BY r.creado_en DESC
    `
    console.log("[v0] All reservations:", reservations)
    return Response.json(reservations || [])
  } catch (error) {
    console.error("[v0] Reservations fetch error:", error)
    return Response.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { user_id, vehicle_id, fecha_inicio, fecha_fin, total, notas } = await request.json()

    console.log("[v0] Creating reservation with user_id:", user_id, "vehicle_id:", vehicle_id)

    const sql = getDb()
    const result = await sql`
      INSERT INTO reservas (usuario_id, vehiculo_id, fecha_inicio, fecha_fin, total, estado_id, notas, creado_en)
      VALUES (${user_id}, ${vehicle_id}, ${fecha_inicio}, ${fecha_fin}, ${total}, 1, ${notas || null}, NOW())
      RETURNING id, usuario_id, vehiculo_id, fecha_inicio, fecha_fin, total, estado_id, notas, creado_en
    `

    console.log("[v0] Reservation created successfully:", result)

    if (!result || result.length === 0) {
      return Response.json({ error: "Failed to create reservation" }, { status: 500 })
    }

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Reservation creation error:", error)
    return Response.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reservaId = searchParams.get("id")
    const action = searchParams.get("action") // "cancel" or "delete"

    if (!reservaId) {
      return Response.json({ error: "Reservation ID is required" }, { status: 400 })
    }

    console.log("[v0] Processing reservation action:", action, "for ID:", reservaId)

    const sql = getDb()

    if (action === "delete") {
      const result = await sql`
        DELETE FROM reservas WHERE id = ${Number.parseInt(reservaId)} RETURNING id
      `

      console.log("[v0] Reservation deleted:", result)

      if (!result || result.length === 0) {
        return Response.json({ error: "Reservation not found" }, { status: 404 })
      }

      return Response.json({ message: "Reservation deleted successfully" }, { status: 200 })
    }

    const result = await sql`
      UPDATE reservas 
      SET estado_id = 5, actualizado_en = NOW()
      WHERE id = ${Number.parseInt(reservaId)}
      RETURNING id, estado_id
    `

    console.log("[v0] Reservation canceled:", result)

    if (!result || result.length === 0) {
      return Response.json({ error: "Reservation not found" }, { status: 404 })
    }

    return Response.json(result[0], { status: 200 })
  } catch (error) {
    console.error("[v0] Reservation operation error:", error)
    return Response.json({ error: String(error) }, { status: 500 })
  }
}
