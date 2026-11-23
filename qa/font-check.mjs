// Verifies the self-hosted fonts are actually applied (not a system fallback).
import { BASE, launch, wait } from './lib.mjs';
const b = await launch(); const p = await b.newPage(); await p.goto(BASE + '/', { waitUntil: 'networkidle0' }); await wait(800);
const r = await p.evaluate(async () => {
  await document.fonts.ready;
  const fam = (sel) => getComputedStyle(document.querySelector(sel)).fontFamily;
  const loaded = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''));
  return { h1: fam('h1'), body: fam('p.lead'), loaded: [...new Set(loaded)] };
});
const need = ['Inter Variable', 'Inter Tight Variable', 'Instrument Serif'];
const ok = need.every((n) => r.loaded.includes(n)) && r.h1.includes('Inter Tight Variable') && r.body.includes('Inter Variable');
console.log(ok ? 'PASS' : 'FAIL', JSON.stringify(r));
await b.close(); process.exit(ok ? 0 : 1);
