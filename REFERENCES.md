# Reference websites studied for the redesign

All 12 sites below were actually opened in Chrome (1440 px wide) on 2026-11-22 and screenshotted at the top of the page and at three scroll depths. "Took" = the pattern we adopted; nothing was copied (no text, images, code or layouts).

## Engineering / IT-services companies (same kind of work as Tattva Tech)

| # | Company | URL | What stood out | Took for Tattva Tech |
|---|---|---|---|---|
| 1 | Thoughtworks | https://www.thoughtworks.com/ | Case studies lead with the result ("50% faster order verification") | Work cards show the impact metric first, large |
| 2 | Globant | https://www.globant.com/ | Big statement headline, product-UI imagery | Product-UI style hero visual |
| 3 | Netguru | https://www.netguru.com/ | Dark hero, large project imagery | Dark hero sections on every page |
| 4 | Codal | https://codal.com/ | Tabbed "capabilities" explorer | Home "What we do" tabbed services explorer (hover + keyboard) |
| 5 | Fueled | https://fueled.com/ | Soft glowing gradient light in hero | Animated "aurora" light behind heroes |
| 6 | Simform | https://www.simform.com/ | Clear service mega-menu, consultation CTA | Services mega-menu with "Book a free consultation" panel |
| 7 | GeekyAnts (India) | https://geekyants.com/ | Big numbers with thin dividers | Stats row with count-up animation |
| 8 | Appinventiv (India) | https://appinventiv.com/ | Service directory grouped by area, strong CTA | Services page: each service with "What we deliver" list |
| 9 | Tata Elxsi (India) | https://www.tataelxsi.com/ | Engineering + design + embedded/robotics positioning | Dedicated Robotics & IoT section as our differentiator |

## Best-in-class design benchmarks (product companies)

| # | Company | URL | What stood out | Took for Tattva Tech |
|---|---|---|---|---|
| 10 | Linear | https://linear.app/ | Restrained dark UI, cursor spotlight on cards | Cursor spotlight effect on cards (mouse devices only) |
| 11 | Vercel | https://vercel.com/ | Minimal typography, header that stays out of the way | Header hides on scroll down, returns on scroll up |
| 12 | Stripe | https://stripe.com/ | Rich product mock-ups instead of stock photos | Drawn product-UI previews on product cards |

## Deliberately NOT copied

- **Client logo walls and testimonials** (Stripe, Codal, Simform, Fueled): we have no verified client logos or quotes. Add them only when real ones are available.
- **Award badges** (Simform, Codal): none to show.
- **Cookie walls** (Netguru, Globant, Tata Elxsi, Thoughtworks): the site sets no tracking cookies, so none are needed.
- **Autoplay video heroes** (Codal, Appinventiv): heavy on Indian mobile networks; we use CSS-only motion instead (Lighthouse mobile performance 89–95).
- **Scroll-hijacking / forced smooth-scroll libraries**: they hurt accessibility and feel laggy on low-end phones.

## How we compare (measured, local production build)

- Lighthouse mobile: Performance 89–95, Accessibility 93–100, Best practices 100, SEO 100.
- All motion turns off automatically for visitors who enable "reduce motion" in their OS.

## Measured comparison (Lighthouse 12.2.1, mobile preset, 2026-11-23)

| Site | Perf | A11y | Best pr. | SEO | LCP | Total blocking time | Page weight |
|---|---|---|---|---|---|---|---|
| **Tattva Tech (new, local build)** | **96** | **96** | **100** | **100** | 2.7 s | **40 ms** | **185 KiB** |
| Appinventiv | 82 | 94 | 89 | 100 | 3.1 s | 300 ms | 9,228 KiB |
| Vercel | 56 | 91 | 96 | 100 | 4.7 s | 860 ms | 1,918 KiB |
| Netguru | 59 | 100 | 79 | 100 | 4.1 s | 560 ms | 8,275 KiB |
| Tata Elxsi | 54 | 78 | 79 | 100 | 12.8 s | 440 ms | 22,295 KiB |
| Thoughtworks | 49 | 95 | 100 | 77 | 13.5 s | 460 ms | 2,749 KiB |
| Codal | 48 | 85 | 79 | 100 | 70.8 s | 450 ms | 27,489 KiB |
| GeekyAnts | 46 | 94 | 75 | 100 | 4.2 s | 1,600 ms | 1,720 KiB |
| Simform | 46 | 92 | 100 | 92 | 4.6 s | 1,780 ms | 1,402 KiB |
| Fueled | 43 | 100 | 61 | 100 | 4.9 s | 15,330 ms | 1,707 KiB |
| Linear | 34 | 85 | 96 | 100 | 26.3 s | 1,020 ms | 3,031 KiB |
| Stripe | 30 | 97 | 79 | 92 | 7.9 s | 8,500 ms | 2,665 KiB |
| Globant | 6 | 100 | 75 | 100 | 29.6 s | 1,520 ms | 11,284 KiB |

**Read this fairly:** our site was served from this computer (no internet latency) while the others were loaded over the lab network, so the Performance and LCP columns favour us. Page weight, total blocking time, accessibility, best practices and SEO do not depend on the network and are a fair comparison. Re-run against the deployed site with `qa/lh-compare.sh` plus a Lighthouse run on https://tattvatechsolutions.in once it is live.
