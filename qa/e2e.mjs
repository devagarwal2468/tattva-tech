// End-to-end checks: contact form validation + submission, admin login, enquiry visible,
// legacy hash redirect, header auto-hide, home visuals, service links, count-up, spotlight, route change.
import { BASE, OUT, launch, collectErrors, wait } from './lib.mjs';

const results = [];
const check = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`); };
const b = await launch();
const p = await b.newPage();
const errs = collectErrors(p);
await p.setViewport({ width: 1366, height: 900 });
const stamp = `E2E ${Date.now()}`;

// Contact form
await p.goto(`${BASE}/contact?service=AI%20%26%20Automation`, { waitUntil: 'networkidle0' });
check('service pre-selected from URL', (await p.$eval('#f-service', (e) => e.value)) === 'AI & Automation');
await p.click('button[type=submit]'); await wait(300);
const valErrs = await p.$$eval('.field-error', (els) => els.length);
check('empty submit shows validation errors', valErrs === 3, `${valErrs} errors`);
await p.type('#f-name', stamp);
await p.type('#f-email', 'e2e+test@example.solutions');
await p.type('#f-phone', '+91 98765 00000');
await p.select('#f-budget', '₹1–5 lakh');
await p.type('#f-message', 'This is an end-to-end test enquiry from the QA script.');
await p.click('button[type=submit]');
await p.waitForSelector('[role=status] h2', { timeout: 15000 }).catch(() => null);
check('enquiry submitted', Boolean(await p.$('[role=status] h2')));

// Admin
await p.goto(`${BASE}/admin`, { waitUntil: 'networkidle0' });
await p.type('input[type=email]', 'admin@local.test');
await p.type('input[type=password]', 'localpass123');
await p.click('form button[type=submit]'); await wait(2500);
check('admin login stays on /admin', p.url().endsWith('/admin'), p.url());
await p.evaluate(() => [...document.querySelectorAll('button')].find((x) => /Client Enquiries/.test(x.textContent))?.click());
await wait(2000);
check('new enquiry visible in admin', await p.evaluate((s) => document.body.innerText.includes(s), stamp));
await p.evaluate(() => localStorage.clear());

// Legacy hash redirect
await p.goto(`${BASE}/#careers`, { waitUntil: 'networkidle0' }); await wait(500);
check('legacy /#careers redirects', p.url().endsWith('/careers'), p.url());

// Motion behaviours on home
await p.goto(`${BASE}/`, { waitUntil: 'networkidle0' }); await wait(1500);
await p.evaluate(() => window.scrollTo(0, 1500)); await wait(500);
check('header hides on scroll down', await p.$eval('header', (h) => h.className.includes('-translate-y-full')));
await p.evaluate(() => window.scrollTo(0, 1300)); await wait(500);
check('header returns on scroll up', await p.$eval('header', (h) => !h.className.includes('-translate-y-full')));
const visuals = await p.evaluate(async () => {
  const imgs = [...document.querySelectorAll('img[src^="/assets/"]')];
  imgs.forEach((i) => i.scrollIntoView());
  await new Promise((r) => setTimeout(r, 1500));
  return { total: imgs.length, broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')) };
});
check('home visuals (3D icons, illustrations, photos) load', visuals.total >= 20 && visuals.broken.length === 0, `${visuals.total} images, broken: ${visuals.broken.join(',') || 'none'}`);
await p.evaluate(() => window.scrollTo(0, 0)); await wait(400);
await p.evaluate(() => document.querySelector('main a[href="/services/ai-automation"]').click()); await wait(900);
check('service card opens its page', p.url().endsWith('/services/ai-automation') && (await p.title()).startsWith('AI & Automation'), p.url());
await p.goto(`${BASE}/`, { waitUntil: 'networkidle0' }); await wait(800);
const countUps = await p.evaluate(async () => {
  const out = [];
  for (const dd of document.querySelectorAll('dl dd')) {
    dd.scrollIntoView({ block: 'center' });
    await new Promise((r) => setTimeout(r, 1700));
    const finalText = dd.querySelector('.sr-only')?.textContent ?? dd.textContent;
    const shown = dd.querySelector('[aria-hidden="true"]')?.textContent ?? dd.textContent;
    out.push({ finalText, shown });
  }
  return out;
});
check('count-up stops at the real numbers', countUps.length > 0 && countUps.every((c) => c.shown === c.finalText), countUps.map((c) => `${c.shown}/${c.finalText}`).join(' '));
await p.evaluate(() => [...document.querySelectorAll('.card-interactive')].find((e) => e.offsetParent !== null)?.setAttribute('data-qa', 'card'));
const card = await p.$('[data-qa=card]'); await card.scrollIntoView(); await wait(300);
const box = await card.boundingBox(); await p.mouse.move(box.x + 40, box.y + 30); await wait(200);
const mx = await p.evaluate((el) => el.style.getPropertyValue('--mx'), card);
check('cursor spotlight follows mouse', mx !== '', mx);
await p.evaluate(() => document.querySelector('footer a[href="/about"]').click()); await wait(800);
check('route change scrolls to top', (await p.evaluate(() => window.scrollY)) === 0);
check('page title updates', (await p.title()).startsWith('About Us'));
// Mobile menu (regression: drawer used to be clipped inside the header)
const m = await b.newPage();
const merrs = collectErrors(m);
await m.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await m.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
await m.click('button[aria-controls=mobile-menu]'); await wait(500);
const drawer = await m.$eval('#mobile-menu', (e) => { const r = e.getBoundingClientRect(); return { vis: getComputedStyle(e).visibility, h: r.height }; });
check('mobile menu opens full-height', drawer.vis === 'visible' && drawer.h > 500, `height ${Math.round(drawer.h)}px`);
const topEl = await m.evaluate(() => { const el = document.elementFromPoint(200, 300); return el?.closest('#mobile-menu') ? 'menu' : el?.tagName; });
check('mobile menu is on top of page content', topEl === 'menu', topEl);
await m.evaluate(() => document.querySelector('#mobile-menu a[href="/services/ai-automation"]').click()); await wait(800);
check('mobile menu link navigates and closes', m.url().endsWith('/services/ai-automation') && (await m.$eval('#mobile-menu', (e) => getComputedStyle(e).visibility)) === 'hidden');
errs.push(...merrs);
check('no console/page errors', errs.length === 0, errs.join(' | '));

await b.close();
const failed = results.filter((r) => !r.pass).length;
console.log(failed ? `${failed} of ${results.length} checks failed` : `All ${results.length} checks passed`);
process.exit(failed ? 1 : 0);
