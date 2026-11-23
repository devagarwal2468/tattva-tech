// Seeds a LOCAL dev database with clearly-labelled sample data for layout checks.
// Never point this at production.
import { API } from './lib.mjs';
if (!/127\.0\.0\.1|localhost/.test(API)) throw new Error('Refusing to seed a non-local API');

const post = async (path, body, token, form = false) => {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { ...(form ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form ? body : JSON.stringify(body),
  });
  return res.json();
};

const creds = { name: 'Local Admin', email: 'admin@local.test', password: 'localpass123' };
let r = await post('/auth/register', creds);
if (!r.token) r = await post('/auth/login', { email: creds.email, password: creds.password });
const token = r.token;
if (!token) throw new Error(`Could not get admin token: ${r.message}`);

await post('/jobs', { title: 'Sample Role — Frontend Engineer', department: 'Engineering', employmentType: 'Full-Time', location: 'Gurugram / Remote', description: 'LOCAL TEST DATA ONLY.', requirements: ['React'], responsibilities: ['Build UI'] }, token);
const fd = new FormData();
Object.entries({ title: 'Sample Project', clientName: 'Local Test', category: 'Web Apps', description: 'LOCAL TEST DATA ONLY — used to preview the card layout.', technologies: 'React' }).forEach(([k, v]) => fd.append(k, v));
await post('/projects', fd, token, true);
const fi = new FormData();
Object.entries({ title: 'Sample article for layout preview', tag: 'AI & Automation', summary: 'Local test data only.', content: '## Heading\n\nParagraph with **bold**.\n\n- bullet a\n- bullet b' }).forEach(([k, v]) => fi.append(k, v));
await post('/insights', fi, token, true);
console.log('Seeded local sample data. Admin login: admin@local.test / localpass123');
