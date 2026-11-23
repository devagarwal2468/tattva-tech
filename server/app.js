import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import projectRoutes from './routes/project.routes.js';
import productRoutes from './routes/product.routes.js';
import insightRoutes from './routes/insight.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { sanitizeRequest } from './middleware/sanitize.js';
import { requireDB, dbStatus } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_ORIGINS = [
  'https://tattvatechsolutions.in',
  'https://www.tattvatechsolutions.in',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const configuredOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);
const allowAllOrigins = configuredOrigins.includes('*');
const allowedOrigins = new Set(configuredOrigins.length ? configuredOrigins : DEFAULT_ORIGINS);

const corsOptions = {
  origin(origin, callback) {
    // Same-origin / server-to-server / curl requests carry no Origin header.
    if (!origin || allowAllOrigins) return callback(null, true);
    const normalized = origin.replace(/\/$/, '');
    if (allowedOrigins.has(normalized)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
};

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(sanitizeRequest);

// Legacy local uploads (current uploads go to Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Health check (does not require the database)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    db: dbStatus(),
    timestamp: new Date().toISOString(),
    version: '2.1.0',
  });
});

// Every other API route needs a live DB connection (awaited — safe on serverless cold starts)
app.use('/api', requireDB);

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/products', productRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
