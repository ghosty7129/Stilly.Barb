import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST || process.env.PG_HOST,
  port: process.env.PGPORT || process.env.PG_PORT,
  database: process.env.PGDATABASE || process.env.PG_DATABASE,
  user: process.env.PGUSER || process.env.PG_USER,
  password: process.env.PGPASSWORD || process.env.PG_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

const parseJsonField = (value, fallback = []) => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') {
    try { return JSON.parse(value) } catch { return fallback }
  }
  return value
}

const mapRow = (row) => ({
  ...row,
  addons: parseJsonField(row.addons, []),
  addon_names: row.addon_names || [],
  addon_details: parseJsonField(row.addon_details, [])
})

export const getAll = async () => {
  const { rows } = await pool.query('SELECT * FROM appointments ORDER BY created_at DESC')
  return rows.map(mapRow)
}

export const getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM appointments WHERE id = $1 LIMIT 1', [id])
  return rows[0] ? mapRow(rows[0]) : null
}

export const create = async (appointment) => {
  const query = `INSERT INTO appointments(
    id, name, customer_name, email, phone, service, service_name,
    service_duration, service_price, addons, addon_names, addon_details,
    total_duration, total_price, language, date, time, notes, status, created_at
  ) VALUES(
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
  ) RETURNING *`

  const values = [
    appointment.id,
    appointment.name,
    appointment.customer_name || appointment.name,
    appointment.email,
    appointment.phone,
    appointment.service,
    appointment.service_name,
    appointment.service_duration,
    appointment.service_price,
    JSON.stringify(appointment.addons || []),
    appointment.addon_names || [],
    JSON.stringify(appointment.addon_details || []),
    appointment.total_duration,
    appointment.total_price,
    appointment.language,
    appointment.date,
    appointment.time,
    appointment.notes,
    appointment.status || 'pending',
    appointment.created_at || new Date().toISOString()
  ]

  const { rows } = await pool.query(query, values)
  return mapRow(rows[0])
}

export const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM appointments WHERE id = $1', [id])
  return rowCount > 0
}

export const update = async (id, updates) => {
  const fields = []
  const values = []
  let idx = 1
  for (const key of Object.keys(updates)) {
    fields.push(`${key} = $${idx}`)
    values.push(updates[key])
    idx++
  }
  if (fields.length === 0) return null
  values.push(id)
  const q = `UPDATE appointments SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`
  const { rows } = await pool.query(q, values)
  return rows[0] ? mapRow(rows[0]) : null
}

export default { getAll, getById, create, delete: remove, update }
