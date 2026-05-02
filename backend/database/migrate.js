import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MIGRATIONS_DIR = path.join(__dirname, 'migrations')

/**
 * Run all SQL migration files in the migrations directory, in alphabetical
 * order.  Each file is executed as a single statement block so that
 * CREATE TABLE … and its associated CREATE INDEX statements all run together.
 *
 * Safe to call on every startup — all statements use IF NOT EXISTS guards.
 */
export async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not set — skipping migrations')
    return
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    connectionTimeoutMillis: 5000,
  })

  let client
  try {
    client = await pool.connect()
    console.log('🗄️  Running database migrations…')

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort()

    if (files.length === 0) {
      console.log('   No migration files found.')
      return
    }

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file)
      const sql = fs.readFileSync(filePath, 'utf8')
      try {
        await client.query(sql)
        console.log(`   ✅ ${file}`)
      } catch (err) {
        console.error(`   ❌ ${file}: ${err.message}`)
        throw err
      }
    }

    console.log('✅ All migrations completed successfully')
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    throw err
  } finally {
    if (client) client.release()
    await pool.end()
  }
}

export default runMigrations
