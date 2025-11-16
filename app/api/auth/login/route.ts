import { getDb } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 })
    }

    const sql = getDb()
    const result = await sql`
      SELECT id, nombre, email, telefono, direccion, nacionalidad, genero, rol, activo, creado_en 
      FROM usuarios 
      WHERE email = ${email} AND contrasena = ${password} AND activo = true
    `

    if (!result || result.length === 0) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = result[0]
    return Response.json(user)
  } catch (error) {
    console.error("[v0] Login error:", error)
    return Response.json({ error: "Login failed", details: String(error) }, { status: 500 })
  }
}
