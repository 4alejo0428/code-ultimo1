import { neon } from "@neondatabase/serverless"

let sql: ReturnType<typeof neon> | null = null

export function getDb() {
  if (!sql) {
    let dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    if (dbUrl.startsWith("psql '")) {
      dbUrl = dbUrl.replace(/^psql ['"](.+)['"]$/, "$1")
    }

    sql = neon(dbUrl)
  }
  return sql
}

export async function queryDb(query: string, params?: any[]) {
  const db = getDb()
  try {
    const result = params && params.length > 0 ? await db.query(query, params) : await db.query(query)

    // Neon's @neondatabase/serverless returns results directly as an array
    if (Array.isArray(result)) {
      return result
    }

    // If it's an object with rows property, return the rows
    if (result && typeof result === "object" && "rows" in result && Array.isArray(result.rows)) {
      return result.rows
    }

    // If result is a single object (e.g., INSERT RETURNING), wrap it in an array
    if (result && typeof result === "object") {
      return [result]
    }

    return []
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}
