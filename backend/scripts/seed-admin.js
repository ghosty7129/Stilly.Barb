import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';

// Strong admin credentials
const ADMIN_USERNAME = 'barber_admin';
const ADMIN_PASSWORD = 'Barb3r@2024!Secure#Admin';

// Check if using PostgreSQL
const usePg = Boolean(process.env.PG_ENABLED === 'true' || process.env.DATABASE_URL);

async function seedAdminUser() {
  if (!usePg) {
    console.log('⚠️  File-based database detected.');
    console.log('Admin credentials are hardcoded in the backend/routes/auth.js file.');
    console.log('');
    console.log('=== ADMIN CREDENTIALS ===');
    console.log(`Username: ${ADMIN_USERNAME}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('========================');
    console.log('');
    console.log('🔒 Credentials are verified securely on login.');
    return;
  }

  try {
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
    });

    console.log('🔐 Connecting to PostgreSQL database...');

    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');

    // Check if admin user already exists
    const checkQuery = 'SELECT id FROM admin_users WHERE username = $1';
    const checkResult = await pool.query(checkQuery, [ADMIN_USERNAME]);

    if (checkResult.rows.length > 0) {
      console.log('⚠️  Admin user already exists. Skipping seed.');
      await pool.end();
      return;
    }

    // Hash the password with bcrypt (10 rounds for security)
    console.log('🔒 Hashing password with bcrypt...');
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Insert admin user
    const insertQuery = `
      INSERT INTO admin_users (id, username, password_hash, created_at, updated_at)
      VALUES ($1, $2, $3, now(), now())
    `;

    const id = uuidv4();
    await pool.query(insertQuery, [id, ADMIN_USERNAME, passwordHash]);

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('=== ADMIN CREDENTIALS ===');
    console.log(`Username: ${ADMIN_USERNAME}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('========================');
    console.log('');
    console.log('🔒 Credentials are stored securely in the database with bcrypt hashing.');
    console.log('💾 DO NOT share these credentials or commit them to version control.');

    await pool.end();
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdminUser();
