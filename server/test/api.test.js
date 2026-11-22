// Integration tests: real Express app + real MongoDB (in-memory server).
import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

let mongod;
let app;

before(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = mongod.getUri('tattva_test');
  process.env.JWT_SECRET = 'test-secret-for-node-test-only';
  process.env.ADMIN_INVITE_CODE = 'invite-123';
  process.env.RATE_LIMIT_CONTACT_MAX = '6';
  process.env.RATE_LIMIT_AUTH_MAX = '100';
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_PASSWORD;
  ({ default: app } = await import('../app.js'));
});

after(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

const admin = { name: 'Owner', email: 'owner@tattvatechsolutions.in', password: 'correct-horse-9' };
let token;

describe('health', () => {
  test('GET /api/health returns healthy without secrets', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'healthy');
    assert.ok(['connected', 'disconnected'].includes(res.body.db));
    assert.equal(JSON.stringify(res.body).includes('secret'), false);
  });

  test('security headers are set (helmet)', async () => {
    const res = await request(app).get('/api/health');
    assert.ok(res.headers['x-content-type-options']);
    assert.equal(res.headers['x-powered-by'], undefined);
  });
});

describe('auth', () => {
  test('first registration is allowed when there are zero admins', async () => {
    const res = await request(app).post('/api/auth/register').send(admin);
    assert.equal(res.status, 201, JSON.stringify(res.body));
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, admin.email);
  });

  test('further registration without invite code is forbidden', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Attacker', email: 'evil@example.com', password: 'whatever-123' });
    assert.equal(res.status, 403);
  });

  test('registration with wrong invite code is forbidden', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'X', email: 'x@example.com', password: 'whatever-123', inviteCode: 'nope' });
    assert.equal(res.status, 403);
  });

  test('registration with valid invite code works', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Second', email: 'second@example.com', password: 'whatever-123', inviteCode: 'invite-123' });
    assert.equal(res.status, 201, JSON.stringify(res.body));
  });

  test('old default credentials admin@tattvatech.com / admin123 do not work', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@tattvatech.com', password: 'admin123' });
    assert.equal(res.status, 401);
  });

  test('login with correct password succeeds', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: admin.email, password: admin.password });
    assert.equal(res.status, 200);
    token = res.body.token;
    assert.ok(token);
  });

  test('login with wrong password fails generically', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: admin.email, password: 'wrong-password' });
    assert.equal(res.status, 401);
    assert.equal(res.body.message, 'Invalid email or password.');
  });

  test('NoSQL operator injection in login is rejected', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: { $ne: null }, password: { $ne: null } });
    assert.ok([400, 401].includes(res.status), `got ${res.status}`);
    assert.equal(res.body.token, undefined);
  });

  test('GET /api/auth/me requires a valid token', async () => {
    const bad = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not-a-token');
    assert.equal(bad.status, 401);
    const good = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    assert.equal(good.status, 200);
    assert.equal(good.body.user.password, undefined);
  });

  test('change-password enforces 8+ chars', async () => {
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: admin.password, newPassword: 'short' });
    assert.equal(res.status, 400);
  });
});

describe('contact', () => {
  test('GET /api/contact without token is 401 (leads are private)', async () => {
    const res = await request(app).get('/api/contact');
    assert.equal(res.status, 401);
  });

  test('POST /api/contact valid enquiry is stored (201)', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Priya Sharma',
      email: 'priya+site@startup.solutions',
      company: 'Startup',
      phone: '+91 90000 00000',
      service: 'AI & Automation',
      budget: '₹5L – ₹15L',
      source: '/contact',
      message: 'We would like to build an AI support assistant.',
    });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    assert.equal(res.body.success, true);
  });

  test('POST /api/contact invalid email is 400', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'A B', email: 'not-an-email', message: 'Hello there' });
    assert.equal(res.status, 400);
  });

  test('honeypot submission returns 201 but stores nothing', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Bot', email: 'bot@spam.com', message: 'Buy cheap stuff', website: 'http://spam.example',
    });
    assert.equal(res.status, 201);
    const list = await request(app).get('/api/contact').set('Authorization', `Bearer ${token}`);
    assert.equal(list.status, 200);
    assert.equal(list.body.data.some((c) => c.email === 'bot@spam.com'), false);
    assert.equal(list.body.data.some((c) => c.email === 'priya+site@startup.solutions'), true);
    const stored = list.body.data.find((c) => c.email === 'priya+site@startup.solutions');
    assert.equal(stored.service, 'AI & Automation');
    assert.equal(stored.source, '/contact');
  });

  test('search with regex special characters does not 500', async () => {
    for (const q of ['(', '.*+?', '[a-', '\\', '$where']) {
      const res = await request(app)
        .get('/api/contact')
        .query({ search: q })
        .set('Authorization', `Bearer ${token}`);
      assert.equal(res.status, 200, `search ${q} -> ${res.status}`);
    }
    const res = await request(app)
      .get('/api/projects/admin/all')
      .query({ search: '((((' })
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
  });

  test('invalid ObjectId gives 400 not 500', async () => {
    const res = await request(app)
      .patch('/api/contact/not-an-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Contacted' });
    assert.equal(res.status, 400);
  });

  test('contact endpoint is rate limited (429)', async () => {
    let got429 = false;
    for (let i = 0; i < 10; i += 1) {
      const res = await request(app).post('/api/contact').send({ name: 'Rate Test', email: 'r@example.com', message: 'Testing limits' });
      if (res.status === 429) {
        got429 = true;
        break;
      }
    }
    assert.equal(got429, true);
  });
});

describe('public content', () => {
  test('public products/projects/insights/jobs respond 200 with data arrays', async () => {
    for (const path of ['/api/products', '/api/projects', '/api/insights', '/api/jobs']) {
      const res = await request(app).get(path);
      assert.equal(res.status, 200, `${path} -> ${res.status}`);
      assert.ok(Array.isArray(res.body.data), path);
    }
  });

  test('projects and insights are NOT auto-seeded with fabricated case studies', async () => {
    for (const path of ['/api/projects', '/api/insights']) {
      const res = await request(app).get(path);
      assert.equal(res.status, 200);
      assert.deepEqual(res.body.data, [], `${path} should be empty on a fresh DB`);
    }
  });

  test('seeded products contain no fake *.tattvatech.com URLs or invented metrics', async () => {
    const res = await request(app).get('/api/products');
    for (const p of res.body.data) {
      assert.equal(/tattvatech\.com/.test(p.productUrl || ''), false);
      assert.equal(p.metrics?.activeUsers || '', '');
    }
  });

  test('admin stats require auth', async () => {
    assert.equal((await request(app).get('/api/admin/stats')).status, 401);
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
  });

  test('unknown route is 404 JSON', async () => {
    const res = await request(app).get('/api/does-not-exist');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });
});
