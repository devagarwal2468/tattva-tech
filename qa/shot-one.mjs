// Usage: node shot-one.mjs <path> <name> [width] [mobile]
import { BASE, OUT, launch, collectErrors, scrollThrough } from './lib.mjs';
const [, , path = '/', name = 'page', width = '1440', mobile] = process.argv;
const b = await launch(); const p = await b.newPage(); const errs = collectErrors(p);
await p.setViewport({ width: +width, height: mobile ? 844 : 900, isMobile: !!mobile, hasTouch: !!mobile });
await p.goto(BASE + path, { waitUntil: 'networkidle0' }); await scrollThrough(p);
await p.screenshot({ path: `${OUT}${name}.png`, fullPage: true });
const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const broken = await p.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')));
console.log(JSON.stringify({ name, overflow, errors: errs, brokenImages: broken }));
await b.close();
