import { createServer } from 'node:http';
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { promisify } from 'node:util';
import { XMLParser } from 'fast-xml-parser';

const derive = promisify(scrypt);
const secret = () => randomBytes(32).toString('hex');
const digest = value => createHash('sha256').update(value).digest('hex');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const handlePattern = /^@[a-z0-9_.-]{1,40}$/;
const reservedHandles = new Set([
  '@admin', '@piotr_kolekcjoner', '@marta_asp', '@glina_w_ogniu', '@kuba_ryt',
  '@dluto_studio', '@alchemia_srebra', '@klisza_35mm', '@sploty_natury'
]);
const demoAccounts = [
  ['@piotr_kolekcjoner', 'Piotr Wiśniewski', 'Użytkownik'],
  ['@marta_asp', 'Marta Kowalska', 'Użytkownik'],
  ['@glina_w_ogniu', 'Anna Nowak · Glina w Ogniu', 'Użytkownik'],
  ['@admin', 'Administrator testowy', 'Administrator']
];
const validPassword = value => typeof value === 'string' && value.length >= 8 &&
  value.length <= 128 && /[A-Z]/.test(value) && /[a-z]/.test(value) &&
  /\d/.test(value) && /[^a-zA-Z0-9\s]/.test(value);
const sessionSeconds = 86400;
const publicAccount = ({ handle, name, email, role }) => ({ handle, name, email, role });
const staticFiles = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/reset-password', ['reset-password.html', 'text/html; charset=utf-8']],
  ['/activate-account', ['activate-account.html', 'text/html; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/demo-data.js', ['demo-data.js', 'text/javascript; charset=utf-8']],
  ['/artist-avatar.svg', ['artist-avatar.svg', 'image/svg+xml']]
]);
const inPostPointsUrl = 'https://api-pl-points.easypack24.net/v1/points';

const inPostResultSize = 25;
const inPostRefreshInterval = 60 * 60 * 1000;
const pickupCatalogues = new Map();

function normalizePointSearch(value) {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/ł/g, 'l');
}

function pickupRecord(point, ...fields) {
  return {
    point,
    searchText: normalizePointSearch([point.code, point.city, point.address, ...fields].filter(Boolean).join(' '))
  };
}

async function fetchInPostPage(page) {
  const url = new URL(inPostPointsUrl);
  url.search = new URLSearchParams({
    type: 'parcel_locker',
    status: 'Operating',
    functions: 'parcel_collect',
    fields: 'name,address,address_details',
    per_page: '500',
    page: String(page)
  });
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('InPost returned ' + response.status);
  const result = await response.json();
  if (!Array.isArray(result.items) || !Number.isInteger(result.total_pages) ||
      result.total_pages < 1 || result.total_pages > 200 || !result.items.length) {
    throw new Error('Invalid InPost response');
  }
  return result;
}

async function refreshInPostCatalogue() {
  const first = await fetchInPostPage(1);
  const pages = [first.items];
  for (let start = 2; start <= first.total_pages; start += 8) {
    const pageNumbers = Array.from({ length: Math.min(8, first.total_pages - start + 1) }, (_, offset) => start + offset);
    const batch = await Promise.all(pageNumbers.map(fetchInPostPage));
    pages.push(...batch.map(page => page.items));
  }
  const seen = new Set();
  const records = [];
  for (const page of pages) {
    for (const item of page) {
      if (!item.name || seen.has(item.name)) continue;
      seen.add(item.name);
      const details = item.address_details || {};
      const point = {
        code: item.name,
        city: details.city ?? '',
        address: [item.address?.line1, details.post_code].filter(Boolean).join(', ')
      };
      const postalCode = details.post_code?.replace('-', '');
      records.push(pickupRecord(point, item.address?.line2, details.province, details.street,
        details.building_number, details.flat_number, postalCode));
    }
  }
  return records;
}

async function refreshOrlenCatalogue() {
  const method = 'GiveMeAllLocationWithAllDataWithZipCode';
  const response = await fetch(`https://api.orlenpaczka.pl/WebServicePwRProd/WebServicePwR.asmx/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: '',
    signal: AbortSignal.timeout(25000)
  });
  if (!response.ok) throw new Error('ORLEN returned ' + response.status);
  const xml = await response.text();
  const parser = new XMLParser({
    removeNSPrefix: true,
    parseTagValue: false,
    isArray: name => name === 'LocationWithAllData2'
  });
  const rows = parser.parse(xml).DataSet?.diffgram?.NewDataSet?.LocationWithAllData2;
  if (!Array.isArray(rows)) throw new Error('Invalid ORLEN response');
  return rows.filter(row => row.DestinationCode && row.Available === 'T' && row.PointType === 'APM').map(row => {
    const street = [row.StreetName, row.BuildingNumber].filter(Boolean).join(' ');
    return pickupRecord({
      code: row.DestinationCode,
      city: row.City,
      address: [street, row.Zipcode].filter(Boolean).join(', ')
    }, row.Province, row.District, row.Location, row.Zipcode?.replace('-', ''));
  });
}

async function refreshDpdCatalogue(apiKey) {
  const url = new URL('https://mypudo.dpd.com.pl/api/v2/pudo/list/bycountry');
  url.search = new URLSearchParams({ countryCode: 'POL', key: apiKey });
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(25000)
  });
  if (!response.ok) throw new Error('DPD returned ' + response.status);
  const { pudoItems } = await response.json();
  if (!Array.isArray(pudoItems)) throw new Error('Invalid DPD response');
  return pudoItems.filter(row => row.pudoId && row.active === true &&
    (!row.servicePudo || row.servicePudo.split(';').includes('100'))).map(row => {
    const street = [row.address1, row.address2, row.address3].filter(Boolean).join(' ');
    const postalCode = row.zipCode?.replace(/^(\d{2})(\d{3})$/, '$1-$2');
    return pickupRecord({
      code: row.pudoId,
      city: row.city,
      address: [street, postalCode].filter(Boolean).join(', ')
    }, row.zipCode, row.name, row.partner, row.localizationInstructions);
  });
}

const pickupSources = {
  inpost: { name: 'InPost', load: refreshInPostCatalogue, interval: inPostRefreshInterval },
  orlen: { name: 'ORLEN Paczka', load: refreshOrlenCatalogue, interval: 24 * inPostRefreshInterval },
  dpd: { name: 'DPD Pickup', load: refreshDpdCatalogue, interval: inPostRefreshInterval }
};

async function listPickupPoints(carrier, query, page) {
  const source = pickupSources[carrier];
  const dpdKey = process.env.ART_VINT_DPD_API_KEY?.trim();
  if (carrier === 'dpd' && !dpdKey) throw new HttpError(503, 'Lista DPD Pickup wymaga konfiguracji klucza API MyPudo.');
  if (!pickupCatalogues.has(carrier)) pickupCatalogues.set(carrier, {});
  const catalogue = pickupCatalogues.get(carrier);
  if (!catalogue.records || catalogue.refreshAfter <= Date.now()) {
    catalogue.refresh ??= source.load(dpdKey)
      .then(records => {
        if (!records.length) throw new Error('Empty catalogue');
        catalogue.records = Array.from(new Map(records.map(record => [record.point.code, record])).values());
        catalogue.refreshAfter = Date.now() + source.interval;
      })
      .catch(() => {
        catalogue.refreshAfter = Date.now() + 60000;
      })
      .finally(() => { catalogue.refresh = null; });
    if (!catalogue.records) await catalogue.refresh;
  }
  if (!catalogue.records) throw new HttpError(502, `Lista ${source.name} jest chwilowo niedostępna. Spróbuj ponownie.`);
  const terms = normalizePointSearch(query).split(/[\s,]+/).filter(Boolean);
  const results = terms.length
    ? catalogue.records.filter(record => terms.every(term => record.searchText.includes(term)))
    : catalogue.records;
  const offset = (page - 1) * inPostResultSize;
  return {
    points: results.slice(offset, offset + inPostResultSize).map(record => record.point),
    page,
    count: results.length,
    totalPages: Math.ceil(results.length / inPostResultSize)
  };
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function readJson(request) {
  if (!/^application\/json(?:;|$)/i.test(request.headers['content-type'] || '')) {
    throw new HttpError(415, 'Wymagany jest JSON.');
  }
  let content = '';
  for await (const chunk of request) {
    content += chunk;
    if (content.length > 8192) throw new HttpError(413, 'Żądanie jest zbyt duże.');
  }
  try {
    const body = JSON.parse(content);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    return body;
  } catch {
    throw new HttpError(400, 'Nieprawidłowy JSON.');
  }
}

export async function createArtVintServer({ database = ':memory:', sendReset, sendActivation, origin, admin, demo = false, logger = console } = {}) {
  if (demo) database = ':memory:';
  if (database !== ':memory:') mkdirSync(dirname(resolve(database)), { recursive: true });
  const db = new DatabaseSync(database);
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS accounts (
      handle TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL, salt TEXT NOT NULL, hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY, handle TEXT NOT NULL REFERENCES accounts(handle) ON DELETE CASCADE,
      expires INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS resets (
      handle TEXT PRIMARY KEY REFERENCES accounts(handle) ON DELETE CASCADE,
      salt TEXT NOT NULL, hash TEXT NOT NULL, expires INTEGER NOT NULL, attempts INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS blocked_emails (email TEXT PRIMARY KEY);
    CREATE TABLE IF NOT EXISTS deleted_accounts (handle TEXT PRIMARY KEY);
    CREATE TABLE IF NOT EXISTS account_activations (
      token_hash TEXT PRIMARY KEY,
      handle TEXT UNIQUE NOT NULL REFERENCES accounts(handle) ON DELETE CASCADE,
      expires INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL REFERENCES accounts(handle) ON DELETE CASCADE,
      recipient TEXT NOT NULL REFERENCES accounts(handle) ON DELETE CASCADE,
      text TEXT NOT NULL,
      context TEXT NOT NULL DEFAULT '',
      sent_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS chat_sender_recipient ON chat_messages(sender, recipient, id);
    CREATE INDEX IF NOT EXISTS chat_recipient_sender ON chat_messages(recipient, sender, id);
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipient TEXT NOT NULL REFERENCES accounts(handle) ON DELETE CASCADE,
      sender TEXT REFERENCES accounts(handle) ON DELETE SET NULL,
      kind TEXT NOT NULL CHECK (kind IN ('message', 'demo-sale')),
      summary TEXT NOT NULL,
      created_at TEXT NOT NULL,
      read_at TEXT,
      artwork_id INTEGER,
      order_id TEXT
    );
    CREATE INDEX IF NOT EXISTS notifications_recipient ON notifications(recipient, id DESC);
    CREATE UNIQUE INDEX IF NOT EXISTS notifications_demo_sale
      ON notifications(recipient, artwork_id) WHERE kind = 'demo-sale';
  `);
  if (!db.prepare('PRAGMA table_info(accounts)').all().some(column => column.name === 'active')) {
    db.exec('ALTER TABLE accounts ADD COLUMN active INTEGER NOT NULL DEFAULT 1');
  }
  db.exec("UPDATE accounts SET role = 'Użytkownik' WHERE role IN ('Artysta', 'Kolekcjoner')");
  const byEmail = db.prepare('SELECT * FROM accounts WHERE email = ?');
  const byHandle = db.prepare('SELECT * FROM accounts WHERE handle = ?');
  const blocked = db.prepare('SELECT 1 FROM blocked_emails WHERE email = ?');
  const findSession = db.prepare(`
    SELECT accounts.* FROM sessions JOIN accounts USING (handle)
    WHERE sessions.token = ? AND sessions.expires > ? AND accounts.active = 1
  `);
  const deleteSessions = db.prepare('DELETE FROM sessions WHERE handle = ?');
  const deleteReset = db.prepare('DELETE FROM resets WHERE handle = ?');
  const chatThreads = db.prepare(`
    WITH conversations AS (
      SELECT CASE WHEN sender = ? THEN recipient ELSE sender END AS partner,
        id, sender, text, context, sent_at
      FROM chat_messages WHERE sender = ? OR recipient = ?
    ), ranked AS (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY partner ORDER BY id DESC) AS position
      FROM conversations
    )
    SELECT ranked.partner, accounts.name, ranked.text, ranked.context, ranked.sent_at AS sentAt
    FROM ranked JOIN accounts ON accounts.handle = ranked.partner
    WHERE position = 1 ORDER BY ranked.id DESC
  `);
  const chatContacts = db.prepare(`
    SELECT handle, name FROM accounts
    WHERE role = 'Użytkownik' AND active = 1 AND handle != ?
      AND email NOT IN (SELECT email FROM blocked_emails)
    ORDER BY name, handle
  `);
  const messagesByPartner = db.prepare(`
    SELECT id, sender, text, context, sent_at AS sentAt FROM chat_messages
    WHERE ((sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)) AND id < ?
    ORDER BY id DESC LIMIT 51
  `);
  const existingChat = db.prepare(`
    SELECT 1 FROM chat_messages
    WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?) LIMIT 1
  `);
  const insertChatMessage = db.prepare('INSERT INTO chat_messages (sender, recipient, text, context, sent_at) VALUES (?, ?, ?, ?, ?)');
  const insertNotification = db.prepare(`
    INSERT INTO notifications (recipient, sender, kind, summary, created_at, artwork_id, order_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const notificationList = db.prepare(`
    SELECT id, sender, kind, summary, created_at AS createdAt, read_at AS readAt
    FROM notifications WHERE recipient = ? ORDER BY id DESC LIMIT 50
  `);
  const unreadNotifications = db.prepare('SELECT count(*) AS count FROM notifications WHERE recipient = ? AND read_at IS NULL');
  const limits = new Map();
  const demoServer = demo ? null : await createArtVintServer({ demo: true, origin, logger });
  const realAccountRoutes = new Set([
    '/api/login', '/api/register', '/api/accounts', '/api/accounts/activate', '/api/accounts/resend-activation',
    '/api/password/reset-request', '/api/password/reset'
  ]);
  let cleanupAt = 0;

  async function addAccount(handle, name, email, role, password, active = 1) {
    const salt = secret();
    const hash = (await derive(password, salt, 64)).toString('hex');
    if (blocked.get(email)) throw new HttpError(403, 'Adres e-mail jest zablokowany.');
    if (byHandle.get(handle)) throw new HttpError(409, 'Ten nick jest już zajęty. Wybierz inny.');
    if (byEmail.get(email)) throw new HttpError(409, 'Ten adres e-mail jest już przypisany do konta. Zaloguj się lub zresetuj hasło.');
    db.prepare('INSERT INTO accounts (handle, name, email, role, salt, hash, active) VALUES (?, ?, ?, ?, ?, ?, ?)').run(handle, name, email, role, salt, hash, active);
    db.prepare('DELETE FROM deleted_accounts WHERE handle = ?').run(handle);
    return { handle, name, email, role };
  }

  if (demo) {
    const insert = db.prepare('INSERT INTO accounts (handle, name, email, role, salt, hash) VALUES (?, ?, ?, ?, ?, ?)');
    for (const [handle, name, role] of demoAccounts) {
      insert.run(handle, name, `${handle.slice(1)}@artvint.example`, role, secret(), secret() + secret());
    }
  } else if (admin) {
    const email = admin.email.trim().toLowerCase();
    if (!emailPattern.test(email) || !validPassword(admin.password)) {
      throw new Error('Ustaw poprawny ART_VINT_ADMIN_EMAIL i silne ART_VINT_ADMIN_PASSWORD.');
    }
    if (!byHandle.get('@admin')) await addAccount('@admin', 'Administrator', email, 'Administrator', admin.password);
  }

  function rateLimit(key, maximum) {
    const now = Date.now();
    if (now >= cleanupAt) {
      for (const [entry, value] of limits) if (value.expires <= now) limits.delete(entry);
      db.prepare('DELETE FROM sessions WHERE expires <= ?').run(now);
      db.prepare('DELETE FROM resets WHERE expires <= ?').run(now);
      db.prepare('DELETE FROM account_activations WHERE expires <= ?').run(now);
      cleanupAt = now + 60000;
    }
    const value = limits.get(key);
    if (!value || value.expires <= now) {
      limits.set(key, { count: 1, expires: now + 15 * 60000 });
    } else if (++value.count > maximum) {
      throw new HttpError(429, 'Za dużo prób. Spróbuj później.');
    }
  }

  function emailLink(path, token) {
    const base = origin || `http://127.0.0.1:${server.address().port}`;
    const url = new URL(path, base);
    url.hash = new URLSearchParams({ token }).toString();
    return url.href;
  }

  async function issueActivation(member) {
    const token = secret();
    const hash = digest(token);
    db.prepare('INSERT OR REPLACE INTO account_activations VALUES (?, ?, ?)').run(hash, member.handle, Date.now() + 86400000);
    try {
      await sendActivation(member.email, emailLink('/activate-account', token));
    } catch (error) {
      db.prepare('DELETE FROM account_activations WHERE token_hash = ?').run(hash);
      logger.error('Błąd wysyłki linku aktywacyjnego przez SMTP.', error.code || '');
      throw new HttpError(502, 'Konto czeka na aktywację. Wysyłka nie powiodła się. Użyj opcji ponownego wysłania linku.');
    }
  }

  const server = createServer(async (request, response) => {
    const json = (status, body) => {
      response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify(body));
    };
    response.setHeader('X-Content-Type-Options', 'nosniff');
    try {
      const requestUrl = new URL(request.url, 'http://localhost');
      const path = requestUrl.pathname;
      const tabHeader = request.headers['x-artvint-tab'];
      const suffix = typeof tabHeader === 'string' && /^[a-f0-9]{32}$/.test(tabHeader) ? '_' + tabHeader : '';
      const normalCookie = 'artvint_session' + suffix;
      const demoCookie = 'artvint_demo_session' + suffix;
      const cookieName = demo ? demoCookie : normalCookie;
      const getToken = name => request.headers.cookie?.match(
        new RegExp(`(?:^|;\\s*)${name}=([a-f0-9]{64})(?:;|$)`)
      )?.[1];
      if (demoServer && (path === '/api/demo/login' ||
          (path.startsWith('/api/') && getToken(demoCookie) &&
           !(request.method === 'POST' && realAccountRoutes.has(path))))) {
        demoServer.emit('request', request, response);
        return;
      }
      if (request.method === 'GET' && staticFiles.has(path)) {
        const [file, type] = staticFiles.get(path);
        const content = await readFile(new URL(file, import.meta.url));
        if (file === 'index.html') {
          response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
          return response.end(content.toString('utf8').replace('<!-- artvint-api-mode -->', `<meta name="artvint-api" content="enabled">`));
        }
        response.writeHead(200, {
          'Content-Type': type,
          ...(['/reset-password', '/activate-account'].includes(path) ? { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } : {})
        });
        return response.end(content);
      }
      const token = getToken(cookieName);
      const account = token && findSession.get(digest(token), Date.now());
      const user = account && !blocked.get(account.email) ? publicAccount(account) : null;
      function getChatPartner(handle, sending = false) {
        if (!user) throw new HttpError(401, 'Zaloguj się, aby korzystać z czatu.');
        if (!handlePattern.test(handle) || handle === user.handle) throw new HttpError(400, 'Wybierz rozmówcę.');
        const partner = byHandle.get(handle);
        if (!partner?.active || (sending && blocked.get(partner.email)) ||
            (partner.role !== 'Użytkownik' && !existingChat.get(user.handle, handle, handle, user.handle))) {
          throw new HttpError(404, 'Rozmówca jest niedostępny w czacie.');
        }
        return partner;
      }
      const match = path.match(/^\/api\/accounts\/(@[a-z0-9_.-]{1,40})$/);
      const accountHandle = match?.[1];
      const canAccessAccount = accountHandle &&
        (user?.handle === accountHandle || user?.role === 'Administrator');
      if (request.method === 'GET' && path === '/api/session') return json(200, { user, demo: demo && Boolean(user) });
      if (request.method === 'GET' && path === '/api/notifications') {
        if (!user) throw new HttpError(401, 'Zaloguj się, aby zobaczyć powiadomienia.');
        return json(200, {
          notifications: notificationList.all(user.handle),
          unread: unreadNotifications.get(user.handle).count
        });
      }
      if (request.method === 'GET' && path === '/api/chat/threads') {
        if (!user) throw new HttpError(401, 'Zaloguj się, aby korzystać z czatu.');
        return json(200, {
          threads: chatThreads.all(user.handle, user.handle, user.handle),
          contacts: chatContacts.all(user.handle)
        });
      }
      if (request.method === 'GET' && path === '/api/chat/messages') {
        const partner = getChatPartner(requestUrl.searchParams.get('partner') || '');
        const before = Number(requestUrl.searchParams.get('before') || Number.MAX_SAFE_INTEGER);
        if (!Number.isSafeInteger(before) || before < 1) throw new HttpError(400, 'Nieprawidłowa strona rozmowy.');
        const rows = messagesByPartner.all(user.handle, partner.handle, partner.handle, user.handle, before);
        return json(200, {
          partner: { handle: partner.handle, name: partner.name },
          messages: rows.slice(0, 50).reverse(),
          hasOlder: rows.length > 50
        });
      }
      const carrier = path.match(/^\/api\/pickup-points\/(inpost|orlen|dpd)$/)?.[1];
      if (request.method === 'GET' && carrier) {
        const query = (requestUrl.searchParams.get('q') || '').trim();
        const page = Number(requestUrl.searchParams.get('page') ?? '1');
        if (query.length > 80 || !Number.isInteger(page) || page < 1 || page > 10000) {
          throw new HttpError(400, 'Nieprawidłowe kryteria wyszukiwania.');
        }
        return json(200, await listPickupPoints(carrier, query, page));
      }
      if (request.method === 'GET' && accountHandle) {
        if (!canAccessAccount) throw new HttpError(403, 'Brak dostępu do tego konta.');
        const target = byHandle.get(accountHandle);
        if (!target) throw new HttpError(404, 'Konto nie istnieje.');
        return json(200, { user: publicAccount(target) });
      }
      if (request.method === 'GET' && ['/api/admin/accounts', '/api/accounts'].includes(path)) {
        if (user?.role !== 'Administrator') throw new HttpError(403, 'Wymagane konto administratora.');
        return json(200, {
          accounts: db.prepare('SELECT handle, name, email, role, active FROM accounts ORDER BY handle').all(),
          blockedEmails: db.prepare('SELECT email FROM blocked_emails ORDER BY email').all().map(row => row.email),
          deletedAccounts: db.prepare('SELECT handle FROM deleted_accounts').all().map(row => row.handle)
        });
      }
      const isAccountUpdate = request.method === 'PUT' && accountHandle;
      const isAccountDeletion = request.method === 'DELETE' && accountHandle;
      const isEmailUpdate = request.method === 'PUT' && path === '/api/admin/block-email';
      if (!path.startsWith('/api/') ||
          !(request.method === 'POST' || isAccountUpdate || isAccountDeletion || isEmailUpdate)) {
        throw new HttpError(404, 'Nie znaleziono.');
      }
      const expectedOrigin = origin || `http://${request.headers.host}`;
      if (request.headers.origin && request.headers.origin !== expectedOrigin) throw new HttpError(403, 'Niedozwolone źródło żądania.');
      const body = isAccountDeletion ? {} : await readJson(request);
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const handle = typeof body.handle === 'string' ? body.handle.trim().toLowerCase() : '';
      const cookie = (value, ttl, switching = false) => {
        const attributes = `Path=/; HttpOnly; SameSite=Lax${expectedOrigin.startsWith('https:') ? '; Secure' : ''}`;
        const current = `${cookieName}=${value}; ${attributes}; Max-Age=${ttl}`;
        const other = demo ? normalCookie : demoCookie;
        response.setHeader('Set-Cookie', switching ? [current, `${other}=; ${attributes}; Max-Age=0`] : current);
      };
      const startSession = member => {
        if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(digest(token));
        const value = secret();
        db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(digest(value), member.handle, Date.now() + sessionSeconds * 1000);
        cookie(value, sessionSeconds, true);
        return json(200, { user: publicAccount(member), demo });
      };

      if (path === '/api/demo/login') {
        if (!demo) throw new HttpError(404, 'Nie znaleziono.');
        const member = demoAccounts.some(([demoHandle]) => demoHandle === handle) && byHandle.get(handle);
        if (!member?.active || blocked.get(member.email)) throw new HttpError(403, 'Konto testowe jest niedostępne.');
        return startSession(member);
      }
      if (path === '/api/notifications/read') {
        if (!user) throw new HttpError(401, 'Zaloguj się, aby odczytać powiadomienia.');
        const now = new Date().toISOString();
        if (body.all === true) {
          db.prepare('UPDATE notifications SET read_at = ? WHERE recipient = ? AND read_at IS NULL').run(now, user.handle);
        } else {
          if (!Number.isSafeInteger(body.id) || body.id < 1) throw new HttpError(400, 'Nieprawidłowe powiadomienie.');
          const result = db.prepare('UPDATE notifications SET read_at = COALESCE(read_at, ?) WHERE recipient = ? AND id = ?')
            .run(now, user.handle, body.id);
          if (!result.changes) throw new HttpError(404, 'Powiadomienie nie istnieje.');
        }
        return json(200, { unread: unreadNotifications.get(user.handle).count });
      }
      if (path === '/api/demo/orders') {
        if (!demo) throw new HttpError(404, 'Nie znaleziono.');
        if (user?.role !== 'Użytkownik') throw new HttpError(403, 'Zamówienie testowe wymaga konta użytkownika.');
        const seller = byHandle.get(handle);
        const title = typeof body.title === 'string' ? body.title.trim() : '';
        if (!seller?.active || seller.role !== 'Użytkownik' || blocked.get(seller.email) ||
            seller.handle === user.handle || !title || title.length > 200 ||
            !Number.isSafeInteger(body.artworkId) || body.artworkId < 1) {
          throw new HttpError(400, 'Nieprawidłowe dane zamówienia testowego.');
        }
        const existing = db.prepare(`
          SELECT sender, order_id AS orderId FROM notifications
          WHERE recipient = ? AND artwork_id = ? AND kind = 'demo-sale'
        `).get(seller.handle, body.artworkId);
        if (existing) {
          if (existing.sender !== user.handle) throw new HttpError(409, 'Ta praca została już zamówiona.');
          return json(200, { orderId: existing.orderId });
        }
        rateLimit(`demo-order:${user.handle}`, 30);
        const orderId = 'ORD-' + randomBytes(8).toString('hex').toUpperCase();
        insertNotification.run(seller.handle, user.handle, 'demo-sale', title, new Date().toISOString(), body.artworkId, orderId);
        return json(201, { orderId });
      }
      if (path === '/api/chat/messages') {
        const partner = getChatPartner(handle, true);
        const liveSession = token && findSession.get(digest(token), Date.now());
        if (!liveSession || blocked.get(liveSession.email)) throw new HttpError(401, 'Sesja wygasła. Zaloguj się ponownie.');
        rateLimit(`chat:${user.handle}`, 120);
        const text = typeof body.text === 'string' ? body.text.trim() : '';
        const context = typeof body.context === 'string' ? body.context.trim() : '';
        if (!text || text.length > 2000 || context.length > 200) {
          throw new HttpError(400, 'Wiadomość musi mieć od 1 do 2000 znaków.');
        }
        const sentAt = new Date().toISOString();
        let result;
        db.exec('BEGIN');
        try {
          result = insertChatMessage.run(user.handle, partner.handle, text, context, sentAt);
          insertNotification.run(partner.handle, user.handle, 'message', text.slice(0, 140), sentAt, null, null);
          db.exec('COMMIT');
        } catch (error) {
          db.exec('ROLLBACK');
          throw error;
        }
        return json(201, { message: { id: Number(result.lastInsertRowid), sender: user.handle, text, context, sentAt } });
      }
      if (isAccountUpdate) {
        if (!canAccessAccount) throw new HttpError(403, 'Brak dostępu do tego konta.');
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        if (!name || name.length > 120 || Object.keys(body).some(key => key !== 'name')) {
          throw new HttpError(400, 'Podaj nazwę wyświetlaną od 1 do 120 znaków.');
        }
        const result = db.prepare('UPDATE accounts SET name = ? WHERE handle = ?').run(name, accountHandle);
        if (!result.changes) throw new HttpError(404, 'Konto nie istnieje.');
        return json(200, { user: publicAccount(byHandle.get(accountHandle)) });
      }
      if (path === '/api/register' || path === '/api/accounts') {
        rateLimit(`register:${request.socket.remoteAddress}`, 20);
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        if (reservedHandles.has(handle)) throw new HttpError(409, 'Ten nick jest zarezerwowany. Wybierz inny.');
        if (!handlePattern.test(handle) || !emailPattern.test(email) ||
            email.length > 254 || !name || name.length > 120 || !validPassword(body.password) ||
            (body.role !== undefined && !['Użytkownik', 'Artysta', 'Kolekcjoner'].includes(body.role))) {
          throw new HttpError(400, 'Sprawdź nick, adres e-mail i wymagania hasła.');
        }
        if (!sendActivation) throw new HttpError(503, 'Aktywacja e-mailem jest niedostępna. Skontaktuj się z administratorem.');
        const member = await addAccount(handle, name, email, 'Użytkownik', body.password, 0);
        await issueActivation(member);
        return json(201, { message: 'Sprawdź pocztę i kliknij link, aby aktywować konto.' });
      }
      if (path === '/api/accounts/resend-activation') {
        rateLimit(`activation-ip:${request.socket.remoteAddress}`, 15);
        if (!emailPattern.test(email) || email.length > 254) throw new HttpError(400, 'Wpisz poprawny adres e-mail.');
        rateLimit(`activation-email:${email}`, 3);
        if (!sendActivation) throw new HttpError(503, 'Aktywacja e-mailem jest niedostępna.');
        const member = byEmail.get(email);
        if (member && !member.active && !blocked.get(email)) {
          try {
            await issueActivation(member);
          } catch (error) {
            if (!(error instanceof HttpError)) throw error;
          }
        }
        return json(200, { message: 'Jeśli konto czeka na aktywację, wyślemy nowy link.' });
      }
      if (path === '/api/accounts/activate') {
        rateLimit(`activation-use:${request.socket.remoteAddress}`, 30);
        const token = typeof body.token === 'string' ? body.token : '';
        const hash = /^[a-f0-9]{64}$/.test(token) ? digest(token) : '';
        const activation = db.prepare('SELECT * FROM account_activations WHERE token_hash = ?').get(hash);
        const member = activation && byHandle.get(activation.handle);
        if (!member || member.active || activation.expires <= Date.now() || blocked.get(member.email)) {
          throw new HttpError(400, 'Link jest nieprawidłowy lub wygasł. Poproś o nowy link.');
        }
        db.exec('BEGIN');
        try {
          db.prepare('UPDATE accounts SET active = 1 WHERE handle = ?').run(member.handle);
          db.prepare('DELETE FROM account_activations WHERE token_hash = ?').run(hash);
          db.exec('COMMIT');
        } catch (error) {
          db.exec('ROLLBACK');
          throw error;
        }
        return json(200, {});
      }
      if (path === '/api/login') {
        rateLimit(`login:${request.socket.remoteAddress}`, 35);
        const member = byEmail.get(email);
        if (typeof body.password !== 'string' || body.password.length > 128) throw new HttpError(400, 'Nieprawidłowe dane logowania.');
        const calculated = await derive(body.password, member?.salt || 'artvint-login-placeholder', 64);
        if (!member || (handle && handle !== member.handle) ||
            !timingSafeEqual(calculated, Buffer.from(member.hash, 'hex')) ||
            byHandle.get(member.handle)?.hash !== member.hash || blocked.get(email)) {
          throw new HttpError(401, 'Nieprawidłowe dane logowania lub konto jest niedostępne.');
        }
        if (!member.active) throw new HttpError(403, 'Aktywuj konto linkiem z e-maila przed zalogowaniem.');
        return startSession(member);
      }
      if (path === '/api/logout') {
        if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(digest(token));
        cookie('', 0);
        return json(200, {});
      }
      if (path === '/api/password/reset-request') {
        rateLimit(`mail-ip:${request.socket.remoteAddress}`, 15);
        if (!emailPattern.test(email) || email.length > 254) throw new HttpError(400, 'Wpisz poprawny adres e-mail.');
        rateLimit(`mail-email:${email}`, 3);
        if (!sendReset) throw new HttpError(503, 'Wysyłka e-mail nie jest skonfigurowana.');
        const member = byEmail.get(email);
        if (member?.active && !blocked.get(email)) {
          const resetToken = secret();
          const salt = secret();
          db.prepare('INSERT OR REPLACE INTO resets VALUES (?, ?, ?, ?, 0)').run(member.handle, salt, digest(resetToken), Date.now() + 600000);
          try {
            await sendReset(email, emailLink('/reset-password', resetToken));
          } catch (error) {
            db.prepare('DELETE FROM resets WHERE handle = ? AND salt = ?').run(member.handle, salt);
            logger.error('Błąd wysyłki linku resetowania przez SMTP.', error.code || '');
          }
        }
        return json(200, { message: 'Jeżeli konto jest dostępne, wyślemy link do ustawienia nowego hasła.' });
      }
      if (path === '/api/password/reset') {
        rateLimit(`reset:${request.socket.remoteAddress}`, 30);
        if (!validPassword(body.password)) throw new HttpError(400, 'Nowe hasło nie spełnia wymogów.');
        const resetToken = typeof body.token === 'string' ? body.token : '';
        const reset = /^[a-f0-9]{64}$/.test(resetToken) &&
          db.prepare('SELECT * FROM resets WHERE hash = ?').get(digest(resetToken));
        const member = reset && byHandle.get(reset.handle);
        if (!member || reset.expires <= Date.now() || blocked.get(member.email)) {
          throw new HttpError(400, 'Link jest nieprawidłowy lub wygasł.');
        }
        const salt = secret();
        const hash = (await derive(body.password, salt, 64)).toString('hex');
        const current = db.prepare('SELECT * FROM resets WHERE handle = ?').get(member.handle);
        if (current?.salt !== reset.salt || current.expires <= Date.now() || blocked.get(member.email)) {
          throw new HttpError(400, 'Link jest nieprawidłowy lub wygasł.');
        }
        db.exec('BEGIN');
        try {
          db.prepare('UPDATE accounts SET salt = ?, hash = ? WHERE handle = ?').run(salt, hash, member.handle);
          deleteReset.run(member.handle);
          deleteSessions.run(member.handle);
          db.exec('COMMIT');
        } catch (error) {
          db.exec('ROLLBACK');
          throw error;
        }
        if (user?.handle === member.handle) cookie('', 0);
        return json(200, {});
      }
      if (path.startsWith('/api/admin/') || isAccountDeletion) {
        if (user?.role !== 'Administrator') throw new HttpError(403, 'Wymagane konto administratora.');
        if (path === '/api/admin/block-email') {
          if (!emailPattern.test(email) || email.length > 254 || email === user.email || typeof body.blocked !== 'boolean') {
            throw new HttpError(400, 'Nie można zmienić blokady tego adresu.');
          }
          if (body.blocked) {
            db.prepare('INSERT OR IGNORE INTO blocked_emails VALUES (?)').run(email);
            const target = byEmail.get(email);
            if (target) {
              deleteSessions.run(target.handle);
              deleteReset.run(target.handle);
            }
          } else {
            db.prepare('DELETE FROM blocked_emails WHERE email = ?').run(email);
          }
          return json(200, {});
        }
        if (path === '/api/admin/delete-account' || isAccountDeletion) {
          const targetHandle = accountHandle || handle;
          if (!handlePattern.test(targetHandle) || targetHandle === user.handle) throw new HttpError(400, 'Nie można usunąć tego konta.');
          if (!byHandle.get(targetHandle)) throw new HttpError(404, 'Konto nie istnieje.');
          db.exec('BEGIN');
          try {
            db.prepare('DELETE FROM accounts WHERE handle = ?').run(targetHandle);
            db.prepare('INSERT OR IGNORE INTO deleted_accounts VALUES (?)').run(targetHandle);
            db.exec('COMMIT');
          } catch (error) {
            db.exec('ROLLBACK');
            throw error;
          }
          return json(200, {});
        }
      }
      throw new HttpError(404, 'Nie znaleziono.');
    } catch (error) {
      if (!(error instanceof HttpError)) logger.error('Błąd obsługi żądania.', error);
      if (!response.headersSent) json(error.status || 500, { error: error.status ? error.message : 'Wystąpił błąd serwera.' });
    }
  });
  server.on('close', () => {
    demoServer?.emit('close');
    db.close();
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { ART_VINT_SMTP_URL, ART_VINT_SMTP_HOST, ART_VINT_SMTP_PORT = '465', ART_VINT_SMTP_USER, ART_VINT_SMTP_PASSWORD,
    ART_VINT_MAIL_FROM, ART_VINT_ADMIN_EMAIL, ART_VINT_ADMIN_PASSWORD, ART_VINT_DB,
    ART_VINT_ORIGIN, HOST = '127.0.0.1', PORT = '3000' } = process.env;
  let sendReset;
  let sendActivation;
  const smtpPassword = ART_VINT_SMTP_HOST === 'smtp.gmail.com'
    ? ART_VINT_SMTP_PASSWORD?.replace(/\s/g, '')
    : ART_VINT_SMTP_PASSWORD;
  const smtpPort = Number(ART_VINT_SMTP_PORT);
  const smtpOptions = ART_VINT_SMTP_URL ? { url: ART_VINT_SMTP_URL } :
    ART_VINT_SMTP_HOST && ART_VINT_SMTP_USER && smtpPassword && [465, 587].includes(smtpPort) ? {
      host: ART_VINT_SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: ART_VINT_SMTP_USER, pass: smtpPassword }
    } : null;
  const mailFrom = ART_VINT_MAIL_FROM || ART_VINT_SMTP_USER;
  const checkMail = process.argv.includes('--check-mail');
  if (smtpOptions && mailFrom) {
    const { default: nodemailer } = await import('nodemailer');
    const smtp = nodemailer.createTransport({
      ...smtpOptions, requireTLS: true, connectionTimeout: 10000, socketTimeout: 15000,
      disableFileAccess: true, disableUrlAccess: true
    });
    if (checkMail) {
      try {
        await smtp.verify();
        console.log('Połączenie SMTP i uwierzytelnienie działają.');
      } catch (error) {
        console.error('Weryfikacja SMTP nie powiodła się.', error.code || '');
        if (error.code === 'EAUTH' && ART_VINT_SMTP_HOST === 'smtp.gmail.com') {
          console.error('Gmail odrzucił dane logowania. Sprawdź hasło aplikacji dla adresu nadawcy w .env.');
        }
        process.exitCode = 1;
      } finally {
        smtp.close();
      }
    }
    sendReset = (to, link) => smtp.sendMail({
      from: mailFrom, to, subject: 'ArtVint – resetowanie hasła',
      text: `Ustaw nowe hasło do ArtVint:\n${link}\n\nLink jest jednorazowy i ważny przez 10 minut. Jeśli nie proszono o zmianę hasła, zignoruj wiadomość.`
    });
    sendActivation = (to, link) => smtp.sendMail({
      from: mailFrom, to, subject: 'ArtVint – aktywacja konta',
      text: `Potwierdź adres e-mail i aktywuj konto ArtVint:\n${link}\n\nLink jest jednorazowy i ważny przez 24 godziny. Jeśli nie zakładano konta, zignoruj wiadomość.`
    });
  }
  if (checkMail) {
    if (!sendReset) {
      console.error('Uzupełnij konfigurację SMTP w pliku .env, w tym hasło aplikacji.');
      process.exitCode = 1;
    }
  } else {
    const server = await createArtVintServer({
      database: ART_VINT_DB || 'data/artvint.sqlite',
      origin: ART_VINT_ORIGIN,
      admin: ART_VINT_ADMIN_EMAIL && ART_VINT_ADMIN_PASSWORD ? { email: ART_VINT_ADMIN_EMAIL, password: ART_VINT_ADMIN_PASSWORD } : undefined,
      sendReset,
      sendActivation
    });
    server.listen(Number(PORT), HOST, () => console.log(`ArtVint: http://${HOST}:${PORT}`));
  }
}
