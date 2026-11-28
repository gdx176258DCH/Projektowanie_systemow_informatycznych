import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import { once } from 'node:events';
import { createArtVintServer } from './server.mjs';

const source = await readFile(new URL('./demo-data.js', import.meta.url), 'utf8');
const context = {};
runInNewContext(source, context);
const demo = context.ArtVintDemo;
const data = JSON.parse(JSON.stringify(demo.data));
const prefix = 'artvint_demo_clean_';
function storage(entries = []) {
  const values = new Map(entries);
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('demo scenarios have coherent artists, purchases, reviews and verification states', () => {
  assert.equal(data.artworks.length, 12);
  assert.equal(Object.keys(data.profiles).length, 3);
  assert.equal(data.artworks.filter(work => !work.sold).length, 9);
  assert.equal(new Set(data.artworks.map(work => work.id)).size, 12);
  for (const work of data.artworks) {
    assert.ok(data.profiles[work.author]);
    assert.ok(work.price > 0);
    const url = new URL(work.image);
    assert.equal(url.hostname, 'images.unsplash.com');
    if (work.verification?.analysis) {
      const { width, height, passed } = work.verification.analysis;
      assert.equal(Number(url.searchParams.get('w')), width);
      assert.equal(Number(url.searchParams.get('h')), height);
      assert.equal(passed, width >= 100 && height >= 100);
    }
  }
  assert.ok(data.artworks.some(work => work.verification?.approvedAt));
  assert.ok(data.artworks.some(work => !work.verification));
  assert.ok(data.artworks.some(work => work.verification?.analysis.passed === false));
  assert.ok(data.artworks.some(work => work.verification?.analysis.passed && !work.verification.approvedAt));
  for (const order of data.orders) {
    const work = data.artworks.find(work => work.id === order.artworkId);
    assert.equal(work.sold, true);
    assert.equal(work.author, order.seller);
    assert.ok(data.profiles[order.buyer]);
    assert.notEqual(order.buyer, order.seller);
    assert.equal(Number(order.total), order.price + Math.round(order.price * 0.05) + 6 + 20);
    assert.deepEqual(order.verification, work.verification);
  }
  for (const review of data.reviews) {
    assert.ok(data.orders.some(order => order.reviewed && order.buyer === review.author &&
      order.seller === review.artist && order.title === review.orderTitle));
    assert.ok(review.rating >= 1 && review.rating <= 5);
  }
  assert.ok(data.orders.some(order => !order.reviewed));
});

test('seed initializes demo records once without touching real accounts or sessions', () => {
  const normalKey = 'artvint_clean_artvint_v6_items';
  const store = storage([[normalKey, '[{"id":42}]'], ['artvint_clean_artvint_accounts', '{"@real":{}}']]);
  assert.equal(demo.seed(store), true);
  const first = [...store.values.entries()];
  assert.equal(demo.seed(store), false);
  assert.deepEqual([...store.values.entries()], first);
  assert.equal(store.getItem(normalKey), '[{"id":42}]');
  assert.equal(store.getItem('artvint_clean_artvint_accounts'), '{"@real":{}}');
  assert.equal(store.getItem(prefix + 'artvint_v6_user'), null);
  assert.equal(store.getItem(prefix + 'artvint_accounts'), null);
});

test('first seed preserves existing demo changes and avoids duplicates', () => {
  const changed = { ...data.artworks[0], title: 'Własny opis użytkownika', price: 1234 };
  const own = { id: 42, author: '@custom', title: 'Własna praca' };
  const store = storage([
    [prefix + 'artvint_v6_items', JSON.stringify([changed, own])],
    [prefix + 'artvint_v6_artists', JSON.stringify({ '@marta_asp': { name: 'Własna nazwa' } })]
  ]);
  demo.seed(store);
  const works = JSON.parse(store.getItem(prefix + 'artvint_v6_items'));
  assert.equal(works.length, 13);
  assert.deepEqual(works.find(work => work.id === changed.id), changed);
  assert.deepEqual(works.find(work => work.id === own.id), own);
  assert.equal(JSON.parse(store.getItem(prefix + 'artvint_v6_artists'))['@marta_asp'].name, 'Własna nazwa');
});

test('reload does not resurrect removed examples, explicit reset restores them', () => {
  const store = storage();
  demo.seed(store);
  store.setItem(prefix + 'artvint_v6_items', '[]');
  demo.seed(store);
  assert.deepEqual(JSON.parse(store.getItem(prefix + 'artvint_v6_items')), []);
  demo.seed(store, { force: true });
  assert.equal(JSON.parse(store.getItem(prefix + 'artvint_v6_items')).length, 12);
});

test('seed respects accounts deleted from the demo', () => {
  const store = storage([[prefix + 'artvint_deleted_accounts', '["@marta_asp"]']]);
  demo.seed(store);
  assert.ok(JSON.parse(store.getItem(prefix + 'artvint_v6_items')).every(work => work.author !== '@marta_asp'));
  assert.equal(JSON.parse(store.getItem(prefix + 'artvint_v6_artists'))['@marta_asp'], undefined);
  assert.ok(JSON.parse(store.getItem(prefix + 'artvint_v6_orders')).every(order => order.buyer !== '@marta_asp' && order.seller !== '@marta_asp'));
});

test('server publishes demo data as JavaScript for the application', async t => {
  const server = await createArtVintServer();
  t.after(() => new Promise(resolve => server.close(resolve)));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  const response = await fetch(origin + '/demo-data.js');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /javascript/);
  assert.equal(await response.text(), source);
  const page = await (await fetch(origin)).text();
  assert.match(page, /<script src="demo-data.js"><\/script>/);
});
