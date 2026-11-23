# Tattva Tech — website

Company website for **Tattva Tech** (tattvatechsolutions.in): software, AI, robotics and digital solutions.

- `client/` — React 18 + Vite + Tailwind CSS + React Router. One page per route, per-page SEO, admin panel at `/admin`.
- `server/` — Express + MongoDB (Mongoose) API, deployed on Vercel serverless.
- `qa/` — browser checks (screenshots of every page, end-to-end contact → admin flow).

## Run locally

```bash
# API (needs MongoDB; any local instance works)
cd server && npm install
cp .env.example .env            # fill MONGODB_URI and JWT_SECRET
npm run dev                     # http://localhost:5000/api/health

# Website
cd client && npm install
npm run dev                     # http://localhost:5173  (proxies /api to :5000)
```

## Edit content

| What | Where |
|---|---|
| Company name, email, phone, offices, stats, leadership, FAQ | `client/src/content/site.js` |
| Services and service pages | `client/src/content/services.js` |
| Products, work/case studies, insights, jobs | Admin panel at `/admin` (stored in MongoDB) |
| Logo | `client/src/components/ui/Logo.jsx`, `client/public/logo-mark.svg` |

## Tests

```bash
cd server && npm test           # API tests (in-memory MongoDB)
cd client && npm run build      # production build
cd qa && npm install && npm run seed && npm run shots && npm run e2e
```

Deploying: see [DEPLOY.md](DEPLOY.md). Work log: [PROGRESS.md](PROGRESS.md). Design references: [REFERENCES.md](REFERENCES.md).

  
  
  Deployment sync check
