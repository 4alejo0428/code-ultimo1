export function getDb() {
  if (!sql) {
    let dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    // Limpiar la URL si viene con formato psql
    dbUrl = dbUrl.trim()
    if (dbUrl.startsWith("psql")) {
      dbUrl = dbUrl.replace(/^psql\s*['"]?/, '').replace(/['"]?\s*$/, '')
    }

    // Remover parámetros problemáticos
    dbUrl = dbUrl.replace(/&channel_binding=require/g, '')

    sql = neon(dbUrl)
  }
  return sql
} 