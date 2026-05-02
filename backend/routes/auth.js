import express from 'express';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const router = express.Router();

// Check if using PostgreSQL
const usePg = Boolean(process.env.PG_ENABLED === 'true' || process.env.DATABASE_URL);
console.log(`🔧 Auth module loaded — PostgreSQL mode: ${usePg}`);

// Hardcoded fallback credentials (file-based mode)
// password_hash is bcrypt hash of "Barb3r@2024!Secure#Admin"
const FILE_BASED_ADMIN = {
  id: '1',
  username: 'barber_admin',
  password_hash: '$2b$10$lKQn4.BFtzsxNQ28NBzp6eXcghqs4yQmGUNB9nq8iVNEmDPu4jOTa'
};

// Setup PostgreSQL pool if enabled
let pgPool = null;
if (usePg) {
  pgPool = new Pool({
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
  console.log('🗄️  PostgreSQL pool initialised for auth');
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`🔐 Login attempt: username="${username}"`);

    if (!username || !password) {
      console.log('⚠️  Login rejected: missing username or password');
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    let adminUser = null;
    let usingFallback = false;

    console.log(`🔍 Checking auth mode — usePg=${usePg}, pgPool=${pgPool !== null}`);

    if (usePg && pgPool) {
      // PostgreSQL mode — attempt DB lookup first
      console.log('🗄️  Querying PostgreSQL for user...');
      try {
        const result = await pgPool.query(
          'SELECT id, username, password_hash FROM admin_users WHERE username = $1',
          [username]
        );
        adminUser = result.rows && result.rows.length > 0 ? result.rows[0] : null;
        console.log(`🗄️  PostgreSQL query succeeded — rows returned: ${result.rows ? result.rows.length : 0}`);
      } catch (pgError) {
        console.error('❌ PostgreSQL query failed:', pgError.message);
        console.error('   Error code:', pgError.code);
        console.error('   Full error:', pgError);
        console.log('📁 Falling back to file-based credentials due to PostgreSQL error');
        usingFallback = true;
      }
    } else {
      console.log('📁 PostgreSQL not configured — using file-based mode directly');
      usingFallback = true;
    }

    // File-based fallback: use hardcoded admin credentials
    if (usingFallback) {
      console.log('📁 File-based mode: checking hardcoded credentials');
      if (username === FILE_BASED_ADMIN.username) {
        adminUser = FILE_BASED_ADMIN;
        console.log('✅ User found in file-based mode');
      } else {
        console.log(`❌ Username "${username}" not found in file-based mode`);
      }
    }

    if (!adminUser) {
      console.log(`❌ Admin user not found for username="${username}"`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Compare password with stored bcrypt hash
    console.log('🔒 Comparing password with bcrypt hash...');
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, adminUser.password_hash);
      console.log(`🔒 Password comparison result: ${passwordMatch}`);
    } catch (bcryptError) {
      console.error('❌ bcrypt.compare threw an error:', bcryptError.message);
      console.error('   Full error:', bcryptError);
      return res.status(500).json({
        success: false,
        message: 'Server error during authentication'
      });
    }

    if (!passwordMatch) {
      console.log('❌ Password does not match — login denied');
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Login successful
    console.log(`✅ Login successful for username="${adminUser.username}" (mode: ${usingFallback ? 'file-based' : 'postgresql'})`);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: adminUser.id,
        username: adminUser.username
      }
    });
  } catch (error) {
    console.error('❌ Unexpected auth error:', error.message);
    console.error('   Full error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
