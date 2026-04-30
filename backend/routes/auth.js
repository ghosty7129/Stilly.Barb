import express from 'express';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const router = express.Router();

// Check if using PostgreSQL
const usePg = Boolean(process.env.PG_ENABLED === 'true' || process.env.DATABASE_URL);

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
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`🔐 Login attempt: username="${username}"`);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    let adminUser = null;

    if (usePg && pgPool) {
      // PostgreSQL mode
      try {
        const result = await pgPool.query('SELECT id, username, password_hash FROM admin_users WHERE username = $1', [username]);
        adminUser = result.rows ? result.rows[0] : null;
      } catch (pgError) {
        console.error('PostgreSQL query error:', pgError);
        return res.status(500).json({
          success: false,
          message: 'Database connection error'
        });
      }
    } else {
      // File-based mode - check hardcoded credentials
      console.log('📁 Using file-based mode');
      if (username === 'barber_admin') {
        adminUser = {
          id: '1',
          username: 'barber_admin',
          password_hash: '$2b$10$lKQn4.BFtzsxNQ28NBzp6eXcghqs4yQmGUNB9nq8iVNEmDPu4jOTa' // bcrypt hash of "Barb3r@2024!Secure#Admin"
        };
        console.log('✅ User found in file-based mode');
      } else {
        console.log('❌ Username not found in file-based mode');
      }
    }

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Compare password with hash
    console.log('🔒 Comparing password...');
    const passwordMatch = await bcrypt.compare(password, adminUser.password_hash);
    console.log(`Password match result: ${passwordMatch}`);

    if (!passwordMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Login successful
    console.log('✅ Login successful');
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: adminUser.id,
        username: adminUser.username
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
