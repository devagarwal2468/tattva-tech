// Loads server/.env (local development). Imported first so that every other
// module sees the environment when it is evaluated. On Vercel, env vars come
// from the project settings and this is a no-op.
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();
