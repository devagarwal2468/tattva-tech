# Deploying the new Tattva Tech website

The site is two Vercel projects, same as before:

| Vercel project | Root directory | What it is |
|---|---|---|
| Frontend | `client/` | Static React build served at tattvatechsolutions.in |
| Backend API | `server/` | Express API (serverless) |

## 1. Backend environment variables (Vercel → API project → Settings → Environment Variables)

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | **Yes** | Your existing MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | Long random string. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. **Without it admin login is disabled in production.** Setting it logs out existing admin sessions (they were signed with a secret that was public on GitHub). |
| `SMTP_USER`, `SMTP_PASS` | For emails | For Gmail use an App Password. Optional: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM` |
| `COMPANY_HEAD_EMAIL` | For emails | Who receives new enquiries |
| `HR_EMAIL` | For emails | Who receives job applications |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | For uploads | Resumes and admin images. New resumes are stored **private** (Cloudinary "authenticated" delivery) and open only through the admin panel. `CLOUDINARY_RESUME_TYPE=upload` switches back to public links |
| `ADMIN_INVITE_CODE` | Optional | Required for anyone to register as admin through the API in production. Easier: use `npm run create-admin` (below) |
| `SEND_AUTO_REPLY` | Optional | `true` sends a short "we received your message" email to people who submit forms. Off by default to avoid the form being abused for spam |
| `CORS_ORIGINS` | Optional | Defaults allow tattvatechsolutions.in, www. and localhost. Add Vercel preview URLs here (comma-separated) if you test on previews |

Full list with comments: `server/.env.example`.

## 2. Frontend environment variable (Vercel → frontend project)

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | Your API URL ending in `/api`, e.g. `https://<your-api-project>.vercel.app/api` |

## 3. Admin account

The old default login `admin@tattvatech.com / admin123` **no longer works** and public sign-up is closed.
Create or reset your admin from your computer (uses the production database):

```bash
cd server
npm install
MONGODB_URI="<your Atlas URI>" npm run create-admin -- --email you@tattvatechsolutions.in --password "a-strong-password" --name "Your Name"
```
Then log in at `https://tattvatechsolutions.in/admin`.

## 4. Clean up old demo content in the live database

The old code auto-inserted demo records into the database. A script removes exactly those records (and nothing you created yourself):

```bash
cd server
MONGODB_URI="<your Atlas URI>" npm run remove-demo-content            # dry run: shows what would change
MONGODB_URI="<your Atlas URI>" npm run remove-demo-content -- --apply # actually change it
```

What it targets (you can also do this by hand in `/admin`):
- **Work & Projects:** "AI-Powered CRM Platform" (Apex Enterprise Group), "E-commerce Mobile App" (Vogue & Style Marketplace), "Analytics Dashboard" (CloudScale Telemetry), "Autonomous Support Copilot" (FinServe Global) — these clients are not real.
- **Insights:** articles by "Aarav Mehta, Head of AI" — this person is not real.
- **Job Vacancies:** roles with salaries like ₹22L–₹40L and "Bengaluru Hub".
- **Products:** remove made-up metrics (10K+ users, 98%…), the "Top Rated / New AI / Enterprise" badges, and links to `*.tattvatech.com` unless they are real.

## 5. Domain

Pick one canonical domain (the code uses `https://tattvatechsolutions.in`). In Vercel → Domains, set `www.tattvatechsolutions.in` to redirect to it.

## 6. After deploying — quick checks

1. `https://<api>/api/health` → `{"status":"healthy","db":"connected"}`
2. Submit the contact form → enquiry appears in `/admin` → email arrives (if SMTP set).
3. Apply to a test job with a PDF → in `/admin` → Candidate Applications, the resume downloads; the raw Cloudinary link from the database should NOT open in a browser (it is private). *This step could not be tested before deployment because it needs your Cloudinary account.*
4. Visit `/sitemap.xml`, `/robots.txt`, and share the homepage link on WhatsApp to see the preview image.
5. Submit `https://tattvatechsolutions.in/sitemap.xml` in Google Search Console.
