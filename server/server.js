import './config/env.js'; // must stay the first import
import app from './app.js';
import { connectDB } from './config/db.js';

// Warm the connection early; every request also awaits it via the requireDB middleware.
connectDB().catch(() => {});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Tattva Tech API running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err?.message || err}`);
});

export default app;
