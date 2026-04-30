// Choose database adapter at startup.
const usePg = Boolean(process.env.PG_ENABLED === 'true' || process.env.DATABASE_URL)

let adapter
if (usePg) {
  adapter = await import('./pgdb.js')
  console.log('✅ Using PostgreSQL adapter')
} else {
  adapter = await import('./db.js')
  console.log('✅ Using file-based DB adapter')
}

export default adapter.default || adapter
