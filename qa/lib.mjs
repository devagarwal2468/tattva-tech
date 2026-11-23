import puppeteer from 'puppeteer-core';
import fs from 'fs';

export const BASE = process.env.QA_BASE || 'http://127.0.0.1:5173';
export const API = process.env.QA_API || 'http://127.0.0.1:5000/api';
export const OUT = new URL('./out/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Pretend to be a desktop with a real mouse (headless Chrome reports no hover otherwise).
const MOUSE = '--blink-settings=primaryPointerType=4,primaryHoverType=2,availablePointerTypes=4,availableHoverTypes=2';

export async function launch() {
  return puppeteer.launch({
    executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', MOUSE],
  });
}

export function collectErrors(page) {
  const errs = [];
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && errs.push(`console: ${m.text()}`));
  return errs;
}

/** Scroll through the page like a person so scroll-reveal animations run. */
export async function scrollThrough(page) {
  // Re-read the height every step: the page grows while lazy content loads.
  for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 400) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await wait(60);
  }
  await wait(900);
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(400);
}
