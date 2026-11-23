# Tattva Tech website rebuild — progress log

Branch: `redesign-2026` (original code untouched on `main`).
Rule for this log: every "done" item lists **how it was verified**. Anything not verified is marked _unverified_.

## Status at a glance

| Area | Status | Verified how |
|---|---|---|
| Backend security hardening | Done | `cd server && npm test` → 24/24 pass (run by me, 2026-11-22) |
| Multi-page frontend (router, SEO per page) | Done | `npx vite build` passes; all 11 routes screenshotted, 0 console errors, 0 horizontal overflow at 1440px and 390px |
| Contact form → DB → admin | Done | Puppeteer E2E: validation errors shown, submit OK, admin login OK, enquiry visible in admin |
| Old `/#section` links redirect | Done | E2E: `/#careers` → `/careers` |
| Reference research (top competitor sites) | Done | 12 sites loaded in headless Chrome and screenshotted (hero + 3 scroll positions each) |
| Motion / animation polish pass | Done | Puppeteer: header hides on scroll-down & returns on scroll-up; explorer switches on hover + arrow keys; count-up ends at 50+/30+/5+/3; spotlight CSS vars update with a mouse pointer; route change resets scroll to 0 |
| Logo refresh (vector) | Done | SVG mark redrawn from the original PNG; rendered side-by-side at 260px/32px/16px; favicons + OG image regenerated from it |
| Lighthouse audit | Done | Production build, Lighthouse 12.2.1. Mobile: Perf 89–95, A11y 93–100, Best practices 100, SEO 100. Desktop: Perf 99–100 |
| Deploy guide + env vars | Pending | — |

## Log

### 2026-11-22 — Session 1
**Audit of the original site (what was wrong)**
- Security: anyone could `POST /api/auth/register` and become admin; `GET /api/contact` (all leads) was public; default `admin@tattvatech.com / admin123` auto-created; JWT secret fallback public on GitHub; HTML injection in notification emails; regex injection in search.
- Reliability: on Vercel cold start, enquiries could be saved to an in-memory array and **lost**; emails were fire-and-forget (often killed on serverless).
- Content: seed data published fake clients ("Apex Enterprise Group", "FinServe Global"…), a fake author ("Aarav Mehta, Head of AI"), fake job salaries and a non-existent "Bengaluru Hub", fake product metrics (10K+ users), product links to `*.tattvatech.com` (not the company domain), "partners" AWS/Google/OpenAI/Meta/Microsoft implied without evidence.
- Frontend: single long page with `#hash` nav (bad for SEO and sharing), "Admin Login" button in the public navbar, 1000-line CSS with global `!important` animation kills, 2.5 MB PNGs, Tattva vs Tattvaa spelling mixed.

**Done**
- Backend hardening (see commit `ce88083`), fake seeds removed (projects, insights, jobs; product badges/metrics/URLs blanked).
- New frontend: React Router, design system (Inter / Inter Tight, ink + logo blue), pages: Home, Services, 7 service detail pages, Products, Work, About, Insights, Article, Careers (apply with resume), Contact, Privacy, Terms, 404, `/admin`.
- Admin: moved to `/admin`, token validated on load, fixed bug where login redirected to home, enquiry detail shows phone/service/budget/source; fake product defaults removed from admin form.
- Images: office photos converted to WebP (2.5 MB → ~120 KB each); favicons + web manifest generated from the logo.

**Open questions for the owner**
- Stats shown (50+ projects, 30+ clients, 5+ products, 3 offices) are copied from the old site — confirm they are true (edit `client/src/content/site.js`).
- Products MailPilot / LeadFlow CRM / AI Agent Hub / InsightBoard: are they live? Do they have real URLs?
- Contact email is a personal Gmail; a domain email (e.g. hello@tattvatechsolutions.in) would look more professional.
- Instagram link points to a single post, not a profile — send the profile URL.
- Office photo sources/licences (Gwalior photo is from Wikimedia Commons, credit: Anuppyr007 — attribution needed).

### 2026-11-22 — Reference research
Sites actually opened and screenshotted (1440px, hero + 3 scroll depths):
- Engineering / IT services: Thoughtworks, Globant, Netguru, Codal, Fueled, Simform, GeekyAnts, Appinventiv, Tata Elxsi
- Design benchmarks (product companies known for best-in-class sites): Linear, Vercel, Stripe

Patterns worth adopting (and how we apply them):
1. **Lead case studies with the result** (Thoughtworks: "50% faster order verification") → Work cards show the impact metric first when the admin fills it in.
2. **Interactive capabilities explorer** (Codal tabs) → Home "What we do" becomes a tabbed explorer (services list + detail panel).
3. **Big numbers, thin dividers** (GeekyAnts) → stats count up when scrolled into view.
4. **Dark, restrained, product-UI hero with soft light** (Linear, Vercel, Fueled) → animated aurora light + word-by-word headline reveal.
5. **Cursor spotlight on cards** (Linear) → subtle radial highlight following the mouse on cards.
6. **Header that gets out of the way** (Stripe, Vercel) → hides on scroll down, returns on scroll up.
7. Logo walls + testimonials (Stripe, Codal, Simform) → **not added**: we have no verified client logos or testimonials. Slot can be added once the owner provides real ones.
8. Avoided: heavy cookie walls, autoplay video heroes (slow on Indian mobile networks), scroll-hijacking.

### 2026-11-22 — Motion, logo, quality pass
- Motion: aurora light in heroes (transform-only, GPU), word-by-word headline reveal, cursor spotlight on cards (mouse devices only), count-up stats, header auto-hide, page fade between routes, button sheen, animated circuit traces in the new Robotics section. All disabled automatically for users with "reduce motion" turned on.
- New Home sections: Codal-style **services explorer** (tabs, keyboard accessible), **Robotics & IoT** band, **Who we work with**.
- Logo: vector `public/logo-mark.svg` + `LogoMark` component (light/dark variants). Original PNG is still in git history on `main`.
- SEO: `robots.txt` (blocks /admin), `sitemap.xml` (17 URLs), 1200×630 `og-image.png`, per-page titles/descriptions/canonical.
- Vercel: security headers + 1-year immutable caching for hashed assets (`client/vercel.json`).
- Accessibility fixes from Lighthouse: contrast of grey text on white, count-up ARIA, logo link name, heading order on list pages.
  - Remaining Lighthouse flag: header tagline contrast — a false positive (fixed header sits over the dark hero; Lighthouse assumes white behind it). Verified visually in screenshots.
- Regression after all changes: API 24/24, E2E contact→admin pass, 13 page/viewport checks with 0 console errors and 0 horizontal overflow.

**Lighthouse (mobile, production build)**
| Page | Perf | A11y | Best pr. | SEO |
|---|---|---|---|---|
| / | 95 | 96 | 100 | 100 |
| /contact | 89 | 100 | 100 | 100 |
| /about | 94 | 96 | 100 | 100 |
| /careers | 93 | 95 | 100 | 100 |
(scores measured locally; real numbers on Vercel depend on network/CDN)

### 2026-11-23 — Recovery after power cut (22 Nov ~20:39 IST)
- Checked on disk: branch `redesign-2026`, last commit `159f1f6`, working tree clean → all work up to the motion/logo pass is safe.
- Lost: the independent review agent (its transcript shows it only read 4 files, no findings) → re-launched from scratch.
- Lost: local dev servers and the /tmp scratchpad with my QA scripts → QA scripts now live in the repo under `qa/` (seed, screenshots, E2E) so they survive restarts.
- Re-verified on the restored stack: `qa/e2e.mjs` 15/15 pass, `qa/shots.mjs` 24/24 pass (12 routes × desktop + mobile, 0 console errors, 0 sideways scroll).
