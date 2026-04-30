import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import appointmentsRouter from './routes/appointments.js';
import authRouter from './routes/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.disable('x-powered-by');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS policy: origin not allowed'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 200),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(apiLimiter);
app.use(express.json({ limit: '20kb' }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message?.includes('CORS')) {
    res.status(403).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT} (${NODE_ENV})`);
  console.log(`🔐 Allowed CORS origins: ${allowedOrigins.join(', ')}`);
  console.log(`📧 Email notifications: ${process.env.EMAIL_ENABLED === 'true' ? 'ENABLED' : 'DISABLED'}`);
});
