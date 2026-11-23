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
