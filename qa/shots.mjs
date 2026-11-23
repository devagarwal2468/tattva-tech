// Full-page screenshots of every public route at desktop and mobile width.
// Reports console errors and horizontal overflow for each.
import { BASE, OUT, launch, collectErrors, scrollThrough } from './lib.mjs';

const routes = ['/', '/services', '/services/robotics-iot', '/products', '/work', '/about', '/insights', '/careers', '/contact', '/privacy', '/terms', '/credits', '/does-not-exist'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
];
const b = await launch();
let failed = 0;
for (const vp of viewports) {
  for (const route of routes) {
    const page = await b.newPage();
    const errs = collectErrors(page);
    await page.setViewport({ ...vp, deviceScaleFactor: 1 });
    await page.goto(BASE + route, { waitUntil: 'networkidle0' });
    await scrollThrough(page);
    const slug = route === '/' ? 'home' : route.slice(1).replace(/\//g, '_');
    await page.screenshot({ path: `${OUT}${vp.name}-${slug}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')));
    if (broken.length) errs.push(`broken images: ${broken.join(', ')}`);
    const ok = overflow <= 0 && errs.length === 0;
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${vp.name.padEnd(7)} ${route.padEnd(24)} overflow=${overflow} errors=${errs.length}${errs.length ? ' ' + errs.join(' | ') : ''}`);
    await page.close();
  }
}
await b.close();
console.log(failed ? `${failed} checks failed` : 'All checks passed');
process.exit(failed ? 1 : 0);
