import { queryDb } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { nombre, email, password, telefono, direccion, nacionalidad, genero } = await request.json()

    // Validation
    if (!nombre || !email || !password) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Registration attempt for email:", email)

    const existingUser = await queryDb("SELECT id FROM usuarios WHERE email = $1", [email])

    if (existingUser && existingUser.length > 0) {
      console.log("[v0] User already exists")
      return Response.json({ error: "User already exists" }, { status: 409 })
    }

    const result = await queryDb(
      `INSERT INTO usuarios (nombre, email, password, contrasena, telefono, direccion, nacionalidad, genero, rol, activo, codigo_verificacion, creado_en)
       VALUES ($1, $2, $3, $3, $4, $5, $6, $7, 2, true, '', NOW())
       RETURNING id, nombre, email, telefono, direccion, nacionalidad, genero, rol, activo, creado_en`,
      [nombre, email, password, telefono || null, direccion || null, nacionalidad || null, genero || null],
    )

    if (!result || result.length === 0) {
      console.log("[v0] Failed to create user")
      return Response.json({ error: "Failed to create user" }, { status: 500 })
    }

    const newUser = result[0]
    console.log("[v0] User created successfully:", newUser.email)
    return Response.json(newUser, { status: 201 })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return Response.json({ error: "Registration failed", details: String(error) }, { status: 500 })
  }
}
