import mongoose from 'mongoose';
import { isProduction } from '../utils/security.js';

mongoose.set('strictQuery', true);

let connectPromise = null;

/**
 * Connects to MongoDB once per process and caches the *promise*, so concurrent
 * cold-start requests on serverless share a single connection attempt.
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectPromise) return connectPromise;

  const uri = process.env.MONGODB_URI || (isProduction() ? '' : 'mongodb://127.0.0.1:27017/tattva_tech_db');
  if (!uri) {
    throw new Error('MONGODB_URI is not configured.');
  }

  connectPromise = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 8000 })
    .then((conn) => {
      console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
      return conn.connection;
    })
    .catch((error) => {
      console.error(`[MongoDB Connection Error]: ${error.message}`);
      connectPromise = null; // allow a retry on the next request
      throw error;
    });

  return connectPromise;
};

/** Express middleware: ensure the DB is connected before handling the request. */
export const requireDB = async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable, please try again shortly.',
    });
  }
};

export const dbStatus = () => (mongoose.connection.readyState === 1 ? 'connected' : 'disconnected');
