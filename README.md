# StockScore Data API

This public repository contains the **limited developer API contract and reference client**. The StockScore application, scoring engine, collector, trading code, and provider adapters remain in a separate private repository.

**Access is not open yet.** The developer endpoint returns HTTP 503 until StockScore enables key-based access. No public API keys have been issued. Key requests will be accepted by email when the preview opens; the verified request address will be published here first. Keys will be issued manually, without automatic approval.

The product's browser-facing endpoints support [stockscore.pro](https://stockscore.pro) itself. They are not the key-gated developer API described here.

## Endpoint

`GET https://stockscore.pro/api/v1/asset?id=prestock-anthropic`

Send `Authorization: Bearer <api-key>` from a server. The response distinguishes an observed Solana pool price from a provider mark or independent reference. It includes score confidence, category points, methodology version, observation IDs when committed, timestamps, and source labels. A missing input stays `null`; no historical values are invented.

Status codes: `200` data available, `400` invalid asset ID, `401` missing or invalid key, `404` asset unavailable, `503` preview closed or upstream evidence unavailable. The exact contract is in [openapi.yaml](openapi.yaml).

## Node.js example

Requires Node.js 22 or later. Keep keys in server-side environment variables, never browser code or a public repository.

```js
import { createStockScoreClient } from './src/index.js';

const client = createStockScoreClient({ apiKey: process.env.STOCKSCORE_API_KEY });
const asset = await client.getAsset('prestock-anthropic');
console.log(asset.observation.score, asset.observation.confidence);
```

The client does not retry failed requests or replace missing data with samples. Run `npm test` for its offline tests.

## Data meaning

- `observedPoolPriceUsd` is observed market data, not an executable quote.
- `referencePriceUsd` may be a provider mark. Check `referenceKind`, `referenceLabel`, and `sources` before comparing values.
- A score describes available market evidence, not expected returns or investment safety.
- PreStocks private-market coverage contains official PreStocks products only. Provider terms and availability still apply.

The MIT license covers this client and API contract, not StockScore's private service code or third-party market data. This repository does not grant rights to redistribute provider data.
