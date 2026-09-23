const defaultBaseUrl = 'https://stockscore.pro';

export class StockScoreApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'StockScoreApiError';
    this.status = status;
  }
}

/** Keep the API key on your server. This client is not intended for browser bundles. */
export function createStockScoreClient({ apiKey, baseUrl = defaultBaseUrl, fetcher = fetch }) {
  if (typeof apiKey !== 'string' || apiKey.length < 32) throw new Error('A StockScore API key is required.');
  const base = new URL(baseUrl);
  if (base.protocol !== 'https:' && base.hostname !== 'localhost') throw new Error('A secure API base URL is required.');
  return {
    async getAsset(id, { signal } = {}) {
      if (!/^[a-z0-9-]{3,50}$/.test(id)) throw new Error('Invalid asset ID.');
      const url = new URL('/api/v1/asset', base);
      url.searchParams.set('id', id);
      const response = await fetcher(url, { headers: { authorization: `Bearer ${apiKey}` }, signal });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new StockScoreApiError(response.status, body.error || `StockScore API returned HTTP ${response.status}.`);
      return body;
    },
  };
}
