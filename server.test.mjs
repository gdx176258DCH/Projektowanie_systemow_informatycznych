import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { createArtVintServer } from './server.mjs';

test('registration, password reset, session revocation and account moderation', async t => {
  const messages = [];
  const activations = [];
  const server = await createArtVintServer({
    admin: { email: 'admin@example.com', password: 'Admin!12345' },
    sendActivation: async (email, link) => activations.push({ email, link }),
    sendReset: async (email, link) => messages.push({ email, link })
  });
  t.after(() => new Promise(resolve => server.close(resolve)));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;

  async function request(path, body, cookie, method = body === undefined ? 'GET' : 'POST') {
    const headers = cookie ? { cookie } : {};
    const options = body === undefined ? { headers, method } : {
      method,
      headers: { ...headers, 'Content-Type': 'application/json', Origin: origin },
      body: JSON.stringify(body)
    };
    const response = await fetch(origin + path, options);
    return {
      status: response.status,
      cookie: response.headers.get('set-cookie')?.split(';')[0],
      body: await response.json()
    };
  }

  const account = { handle: '@test', name: 'Test', email: 'test@example.com', password: 'Old!12345' };
  const page = await fetch(origin);
  assert.match(await page.text(), /<meta name="artvint-api"/);
  assert.equal((await request('/api/register', { ...account, role: 'Administrator' })).status, 400);
  const registration = await request('/api/accounts', account);
  assert.equal(registration.status, 201);
  assert.equal(registration.cookie, undefined);
  assert.equal((await request('/api/login', account)).status, 403);
  const firstLink = new URL(activations[0].link);
  assert.equal(activations[0].email, account.email);
  assert.equal(firstLink.pathname, '/activate-account');
  assert.match(await (await fetch(firstLink)).text(), /Aktywacja konta/);
  const tokenFrom = link => new URLSearchParams(new URL(link).hash.slice(1)).get('token');
  assert.equal((await request('/api/accounts/resend-activation', { email: account.email })).status, 200);
  assert.equal((await request('/api/accounts/activate', { token: tokenFrom(firstLink) })).status, 400);
  const activation = { token: tokenFrom(activations[1].link) };
  assert.equal((await request('/api/accounts/activate', activation)).status, 200);
  assert.equal((await request('/api/accounts/activate', activation)).status, 400);
  const session = await request('/api/login', account);
  assert.equal(session.body.user.role, 'Użytkownik');
  assert.equal((await request('/api/session', undefined, session.cookie)).body.user.handle, account.handle);
  assert.equal((await request('/api/admin/accounts', undefined, session.cookie)).status, 403);
  assert.equal((await request('/api/accounts/@test')).status, 403);
  assert.equal((await request('/api/accounts/@test', undefined, session.cookie)).body.user.name, 'Test');
  assert.equal((await request('/api/accounts/@test', { name: 'Nowa nazwa' }, session.cookie, 'PUT')).body.user.name, 'Nowa nazwa');
  assert.equal((await request('/api/accounts/@test', { name: 'Test', role: 'Administrator' }, session.cookie, 'PUT')).status, 400);
  assert.equal((await request('/api/accounts/@admin', { name: 'Test' }, session.cookie, 'PUT')).status, 403);
  assert.equal((await request('/api/accounts/@test', undefined, session.cookie, 'DELETE')).status, 403);
  assert.equal((await request('/api/login', { ...account, password: 'Wrong!12345' })).status, 401);

  const missing = await request('/api/password/reset-request', { email: 'missing@example.com' });
  const result = await request('/api/password/reset-request', { email: 'TEST@example.com' });
  assert.deepEqual(result.body, missing.body);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].email, account.email);
  const link = new URL(messages[0].link);
  assert.equal(link.origin, origin);
  assert.equal(link.pathname, '/reset-password');
  assert.equal(link.search, '');
  const resetPage = await fetch(link);
  assert.equal(resetPage.status, 200);
  assert.match(await resetPage.text(), /Ustaw nowe hasło/);
  assert.equal(resetPage.headers.get('cache-control'), 'no-store');
  const token = new URLSearchParams(link.hash.slice(1)).get('token');
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.ok(!JSON.stringify(result.body).includes(token));
  const reset = { token, password: 'New!12345' };
  assert.equal((await request('/api/password/reset', { ...reset, token: 'invalid' })).status, 400);
  assert.equal((await request('/api/password/reset', reset)).status, 200);
  assert.equal((await request('/api/password/reset', reset)).status, 400);
  assert.equal((await request('/api/session', undefined, session.cookie)).body.user, null);
  assert.equal((await request('/api/login', account)).status, 401);
  const loggedIn = await request('/api/login', { ...account, password: reset.password });
  assert.equal(loggedIn.status, 200);

  const admin = await request('/api/login', { email: 'admin@example.com', password: 'Admin!12345' });
  assert.equal(admin.body.user.role, 'Administrator');
  assert.equal((await request('/api/accounts', undefined, admin.cookie)).body.accounts.length, 2);
  assert.equal((await request('/api/admin/block-email', { email: account.email, blocked: true }, admin.cookie, 'PUT')).status, 200);
  assert.equal((await request('/api/session', undefined, loggedIn.cookie)).body.user, null);
  assert.equal((await request('/api/accounts/@test', undefined, admin.cookie, 'DELETE')).status, 200);
  assert.equal((await request('/api/accounts/@test', undefined, admin.cookie)).status, 404);
  assert.equal((await request('/api/register', account)).status, 403);
  assert.equal((await request('/api/admin/block-email', { email: account.email, blocked: false }, admin.cookie)).status, 200);
  assert.equal((await request('/api/register', account)).status, 201);
});

test('registered accounts can chat without exposing conversations to other accounts', async t => {
  const links = new Map();
  const server = await createArtVintServer({
    admin: { email: 'admin@example.com', password: 'Admin!12345' },
    sendActivation: async (email, link) => links.set(email, link)
  });
  t.after(() => new Promise(resolve => server.close(resolve)));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  const page = await (await fetch(origin)).text();
  assert.match(page, /name="artvint-api" content="enabled"/);
  assert.match(page, /id="demo-login-options"/);
  assert.doesNotMatch(page, /id="login-role"/);
  assert.match(page, /const initialArtworks = \[\];/);
  assert.match(page, /const initialArtistProfiles = \{\};/);
  async function post(path, body) {
    return fetch(origin + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
  }
  const demoLogin = await post('/api/demo/login', { handle: '@admin' });
  assert.equal(demoLogin.status, 200);
  assert.equal((await demoLogin.json()).demo, true);
  const demoCookie = demoLogin.headers.getSetCookie()[0].split(';')[0];
  const demoList = await fetch(origin + '/api/accounts', { headers: { cookie: demoCookie } });
  assert.equal((await demoList.json()).accounts.length, 4);
  const cookies = new Map();
  const admin = await post('/api/login', { email: 'admin@example.com', password: 'Admin!12345' });
  assert.equal(admin.status, 200);
  cookies.set('@admin', admin.headers.get('set-cookie').split(';')[0]);
  const accountList = await fetch(origin + '/api/accounts', { headers: { cookie: cookies.get('@admin') } });
  assert.deepEqual((await accountList.json()).accounts.map(account => account.handle), ['@admin']);
  for (const handle of ['@buyer', '@artist', '@other']) {
    const email = handle.slice(1) + '@example.com';
    const password = 'Pass!12345';
    assert.equal((await post('/api/accounts', { handle, name: handle, email, password })).status, 201);
    const link = new URL(links.get(email));
    const token = new URLSearchParams(link.hash.slice(1)).get('token');
    assert.equal((await post('/api/accounts/activate', { token })).status, 200);
    const response = await post('/api/login', { email, password });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).user.role, 'Użytkownik');
    cookies.set(handle, response.headers.get('set-cookie').split(';')[0]);
  }
  async function chat(path, handle, body) {
    const headers = { cookie: cookies.get(handle) || '' };
    const options = body ? {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    } : { headers };
    return fetch(origin + '/api/chat/' + path, options);
  }
  const buyer = '@buyer';
  const artist = '@artist';
  const third = '@other';
  assert.equal((await chat('threads')).status, 401);
  assert.equal((await chat('messages', buyer, { handle: artist, text: '   ' })).status, 400);
  assert.equal((await chat('messages', buyer, { handle: artist, text: 'Zapytanie o obraz', context: 'Na wymiar' })).status, 201);
  const received = await chat('messages?partner=' + buyer, artist);
  assert.equal((await received.json()).messages[0].sender, buyer);
  assert.equal((await chat('messages', artist, { handle: buyer, text: 'Odpowiedź artysty' })).status, 201);
  const buyerThread = await (await chat('messages?partner=' + artist, buyer)).json();
  assert.deepEqual(buyerThread.messages.map(message => message.text), ['Zapytanie o obraz', 'Odpowiedź artysty']);
  const otherThread = await (await chat('messages?partner=' + artist, third)).json();
  assert.deepEqual(otherThread.messages, []);
  assert.equal((await (await chat('threads', third)).json()).threads.length, 0);
  assert.equal((await (await chat('threads', '@admin')).json()).threads.length, 0);
});
