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

### 2026-11-23 — Independent review (re-run after power cut) and fixes
A fresh reviewer agent read the full `main..redesign-2026` diff. Each finding was checked in the code by me before fixing.

| # | Finding | Status | Verified how |
|---|---|---|---|
| 1 | Old fake demo rows (fake clients/authors/jobs/product metrics) are probably still in the live DB | Fixed (tool) | New `npm run remove-demo-content` (dry run by default, `--apply` to change). Tested on planted data: fake rows removed, a real project with the same title but a different client and a real job with the same title were kept |
| 2 | Products were still auto-seeded when the collection was empty | Fixed | Seed removed; test "products are not auto-seeded" |
| 3 | Public forms could make the server email any address (auto-replies echoed the user's name) | Fixed | Auto-replies are off unless `SEND_AUTO_REPLY=true` and never include user text |
| 4 | Rejected job applications left resume files in Cloudinary | Fixed | Upload is deleted on every rejection or error path (code review; Cloudinary not available locally) |
| 5 | Empty production DB → first stranger could register as admin | Fixed | Production always needs `ADMIN_INVITE_CODE`; test with NODE_ENV=production + 0 users → 403 |
| 6 | CORS regex accepted `tattva-tech-anything.vercel.app` | Fixed | Regex removed (use `CORS_ORIGINS` for previews); test: look-alike origin gets no CORS header |
| 7 | Old tokens kept working after a password change | Fixed | `passwordChangedAt`; test: old token → 401, new login works |
| 8 | Multipart bodies not sanitised; project update accepted any field | Fixed | Sanitiser runs after multer; project/job updates whitelist fields; test: `createdAt` cannot be overwritten |
| 9 | Honeypot field named `website` could be autofilled | Fixed | Renamed to `hp_check`, drops are logged; test added |
| 10 | Collapsed FAQ answers still read by screen readers | Fixed | `aria-hidden` when closed |
| 11 | Pages without a description kept the previous page's meta description | Fixed | Falls back to the company summary |
| — | "5+ In-house products" was stronger than the old site's "5+ Products in development" | Fixed | Wording reverted to "Products in development"; product copy says "we are building" |

**Also found by me during recovery testing:** the mobile hamburger menu opened but was invisible (the drawer was clipped inside the header because of its blur/transform). Fixed by moving the drawer outside the header; 3 regression checks added to `qa/e2e.mjs`.

Not changed (owner decision): stats 50+/30+/5+/3, "international clients" wording (both from the old site), decorative hero mock-ups.
Not done: resumes are still publicly accessible Cloudinary URLs (same as before) — switching to authenticated delivery needs the owner's Cloudinary settings.

Verification after all fixes: API tests **30/30**, `qa/e2e.mjs` **18/18**, `qa/shots.mjs` **24/24** (12 routes × desktop/mobile, 0 console errors, 0 sideways scroll), `vite build` OK.

### 2026-11-23 — Reference list for the owner + product previews
- `REFERENCES.md`: the 12 reference sites (9 engineering/IT-services companies incl. GeekyAnts, Appinventiv and Tata Elxsi from India; 3 design benchmarks: Linear, Vercel, Stripe), what we took from each, and what we deliberately did not copy.
- Product cards now show drawn product-UI previews (email, CRM pipeline, AI agent chat, analytics) chosen by `previewType`, Stripe-style, instead of a plain gradient. Decorative only, with no numbers.
- Verified: desktop + mobile screenshots of /products, `qa/e2e.mjs` 18/18, `qa/shots.mjs` 24/24, Lighthouse mobile: / Perf 96, A11y 96, BP 100, SEO 100; /products Perf 93, A11y 96, BP 100, SEO 100.

### 2026-11-23 — Measured comparison with reference sites + private resumes
- Lighthouse (mobile) run on all 12 reference sites and on our build (`qa/lh-compare.sh`); table in `REFERENCES.md`. Fair comparison (network-independent): our page weight 185 KiB vs 1.4–27 MB, total blocking time 40 ms vs 300–15,330 ms, A11y 96 / Best practices 100 / SEO 100. Our Performance score (96) is flattered because our build was served locally — re-measure after deploy.
- Resumes: new uploads use Cloudinary authenticated (private) delivery; admin download signs a 5-minute URL; old public resumes keep working; HR email points to the admin panel instead of a raw link. Verified: 3 new unit tests (upload params, URL parsing for old/new URLs, signed URL fields) → API suite 33/33; library source checked to confirm `type` is passed to Cloudinary. **Not verified: a real upload/download against Cloudinary** (needs the owner's account) — listed as a post-deploy check in DEPLOY.md.

### 2026-11-23 — Owner answers + local preview
- Owner: stats (50+/30+/5+/3) confirmed true; some products are live (links not yet given); do NOT push yet — "pehle dikhao mujhe local chalake".
- Local preview running: http://localhost:5173 (also http://192.168.50.1:5173 and http://172.30.3.192:5173), local admin admin@local.test / localpass123 (in-memory DB, local only).
- Verified: setting a product's `productUrl` in the admin panel shows a "Visit <name>" button on that card; others keep "Request early access" (tested with a temporary example URL, then reverted).
- Waiting on owner: review of the local site, product names + live URLs, permission to push.

### 2026-11-23 — Visual redesign v2 ("calm & precise")
Owner feedback: old UI looked bad, no visuals; wants professional, minimalistic, simple, elegant colours, with real vector/PNG imagery; Home most important.

**Direction:** light ivory canvas (#f8f7f4), deep navy text, logo blue as a sparing accent, Instrument Serif italics for emphasis, lots of whitespace, rounded cards with soft shadows. Dark, glow-heavy sections removed.

**Visual assets (all free for commercial use, every licence checked at the source — see `design-assets/README.md`, `/credits` page):**
- 13 3D icons from 3dicons V1 (CC0 confirmed on each icon page), background removed + recoloured to brand blue.
- 26 unDraw illustrations recoloured to brand blue.
- 8 CC0 photos (Wikimedia Commons robotics/drone, StockSnap workspace/design/analytics, NASA electronics). Rawpixel images with visible watermarks were rejected; Unsplash/Pexels blocked automated access, so not used.

**Pages rebuilt:** Home (hero with illustration + floating 3D objects, service cards with illustrations, robotics photo showcase, principles with 3D icons, process with serif numerals, audiences, FAQ), Services (zig-zag rows), Service detail, About, Contact, Careers, Products, Work, Insights, 404, new `/credits`. Header/footer light; mobile drawer kept outside header.

**Bugs found & fixed while verifying:** 3D icons had an opaque white square (source files are RGB) → background keyed out; gear hole + one over-keyed pie-chart area fixed; robotics checklist covered the photo on phones → moved below; count-up test was too weak (didn't check final values) → strengthened; LCP was the hero paragraph held at opacity 0 → transform-only animation; fonts self-hosted (no Google requests).

**Verified:** `qa/shots.mjs` 26/26 (13 routes × desktop/mobile, 0 console errors, 0 broken images, 0 sideways scroll); `qa/e2e.mjs` 18/18 (incl. 52 home images load, service card navigation, count-up final values); API 33/33; Lighthouse mobile: Home 90/100/100/100, Services 93/100/100/100, Contact 90/100/100/100, About 94/100/100/100 (Perf/A11y/BP/SEO).
- Technology strip now shows monochrome logos (Simple Icons 13.21.0, CC0; trademarks noted on /credits).
- Found while checking the strip: the dev server was still on the old Tailwind config, so text fell back to a system font. Restarted; added `qa/font-check.mjs` (`npm run fonts`) which fails if Inter / Inter Tight / Instrument Serif are not actually applied. Re-verified: fonts PASS, e2e 18/18, shots 26/26.
- Note for future: restart `vite` after editing `tailwind.config.js`.

### 2026-11-23 — Independent design critique + fixes
A fresh reviewer agent critiqued 22 screenshots against Linear/Vercel/Stripe/Codal-level sites. I checked each point myself before acting:
- Fixed: hero de-cluttered (cube + dot grid removed, scene ~2× larger, chips stay on-screen on phones); service cards now one visual each (duplicate 3D title icons removed); dark "Not sure?" tile made light; serif italic accent limited to page titles + CTA (was in ~10 section headings); step numbers/stats in the display font; "Why Tattva" uses a stronger photo, no duplicated stats; robotics photo no longer used twice (service card uses the electronics photo) and its checklist sits inside the photo on desktop; product mock-ups show real-looking UI text instead of grey bars; mobile: less vertical padding, 2-column audience cards, WhatsApp button appears after scrolling, balanced heading wraps; Work grid adapts to 1–2 projects.
- Not a site bug: the "blank FAQ/CTA" in the reviewer's mobile shots came from my screenshot script stopping at the page's initial height — fixed in `qa/lib.mjs`.
- Owner decisions still open: company-domain email (footer shows Gmail).
- Verified after fixes: fonts PASS, e2e 18/18, shots 26/26, Lighthouse mobile Home 92/100/100/100, Services 93/100/100/100.
