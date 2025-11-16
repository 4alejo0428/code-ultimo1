import { getDb } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { nombre, email, password, telefono, direccion, nacionalidad, genero } = await request.json()

    // Validation
    if (!nombre || !email || !password) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const sql = getDb()
    const existingUser = await sql`SELECT id FROM usuarios WHERE email = ${email}`

    if (existingUser && existingUser.length > 0) {
      return Response.json({ error: "User already exists" }, { status: 409 })
    }

    const result = await sql`
      INSERT INTO usuarios (nombre, email, contrasena, telefono, direccion, nacionalidad, genero, rol, activo, codigo_verificacion, creado_en)
      VALUES (${nombre}, ${email}, ${password}, ${telefono || null}, ${direccion || null}, ${nacionalidad || null}, ${genero || null}, 2, true, '', NOW())
      RETURNING id, nombre, email, telefono, direccion, nacionalidad, genero, rol, activo, creado_en
    `

    if (!result || result.length === 0) {
      return Response.json({ error: "Failed to create user" }, { status: 500 })
    }

    const newUser = result[0]
    return Response.json(newUser, { status: 201 })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return Response.json({ error: "Registration failed", details: String(error) }, { status: 500 })
  }
}
