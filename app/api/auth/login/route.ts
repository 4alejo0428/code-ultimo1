import { queryDb } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 })
    }

    console.log("[v0] Login attempt with email:", email)
    console.log("[v0] Login password:", password)

    const result = await queryDb(
      "SELECT id, nombre, email, telefono, direccion, nacionalidad, genero, rol, activo, creado_en FROM usuarios WHERE email = $1 AND contrasena = $2 AND activo = true",
      [email, password],
    )

    console.log("[v0] Login result type:", Array.isArray(result) ? "array" : typeof result)
    console.log("[v0] Login result length:", Array.isArray(result) ? result.length : "N/A")
    console.log("[v0] Login result data:", result)

    if (!result || result.length === 0) {
      console.log("[v0] No user found or invalid credentials")
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = result[0]
    console.log("[v0] User authenticated:", user.email)
    return Response.json(user)
  } catch (error) {
    console.error("[v0] Login error:", error)
    return Response.json({ error: "Login failed", details: String(error) }, { status: 500 })
  }
}
