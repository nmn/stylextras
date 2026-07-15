# fumadocs-waku

This is a Waku application generated with [Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

## Cloudflare Workers

The production build uses Waku's Cloudflare adapter. Pre-rendered routes and hashed assets are served directly by Workers Static Assets, while requests without a matching asset are handled by the Waku Worker entrypoint.

```bash
bun run preview:cloudflare
bun run deploy:cloudflare
```

Wrangler uploads `dist/public` and the Cloudflare-compatible server bundle generated at `dist/server/serve-cloudflare.js`.
