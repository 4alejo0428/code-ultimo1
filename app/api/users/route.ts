// GET /api/users - Get user data
import { mockUsers } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("id")

  if (userId) {
    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }
    return Response.json(user)
  }

  return Response.json(mockUsers)
}

export async function PUT(request: Request) {
  // Update user profile
  const { id, ...data } = await request.json()
  const user = mockUsers.find((u) => u.id === id)

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  Object.assign(user, data)
  return Response.json(user)
}
