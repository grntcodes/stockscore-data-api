import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createStockScoreClient, StockScoreApiError } from '../src/index.js';

const key = 'ss_test_0123456789abcdef0123456789abcdef';

test('client sends a key only in the Authorization header', async () => {
  let requested;
  const client = createStockScoreClient({ apiKey: key, fetcher: async (url, options) => {
    requested = { url: String(url), options };
    return new Response(JSON.stringify({ schemaVersion: '1' }), { status: 200 });
  } });
  assert.equal((await client.getAsset('prestock-anthropic')).schemaVersion, '1');
  assert.equal(requested.options.headers.authorization, `Bearer ${key}`);
  assert.equal(requested.url.includes(key), false);
});

test('client reports closed preview without logging or retrying the key', async () => {
  const client = createStockScoreClient({ apiKey: key, fetcher: async () => new Response(JSON.stringify({ error: 'Data API access is not open.' }), { status: 503 }) });
  await assert.rejects(client.getAsset('apple-xstock'), error => error instanceof StockScoreApiError && error.status === 503);
});
