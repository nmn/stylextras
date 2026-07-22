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

The production build uses Waku's pure SSG mode. All routes are pre-rendered into `dist/public`, and Wrangler deploys that directory through Workers Static Assets without a Worker script.

```bash
bun run preview:cloudflare
bun run deploy:cloudflare
```

Pure SSG does not support dynamic rendering, server actions, or API routes. Add a Worker entrypoint back to `wrangler.jsonc` before introducing any of those features.
