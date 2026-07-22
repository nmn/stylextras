# Deployment

## Cloudflare architecture

- The documentation website is a pure static Waku build deployed with Cloudflare Workers Static Assets.
- Keep `apps/website/src/waku.server.ts` configured with Waku's Cloudflare adapter and `{ static: true }`.
- Wrangler must upload only `apps/website/dist/public`. Do not add a `main` Worker entrypoint unless the site needs dynamic rendering, server actions, or API routes.
- Keep `not_found_handling` set to `404-page` so unknown paths return a static 404 instead of an SPA fallback.
- The static headers file belongs at `apps/website/public/_headers`, because Waku copies that directory into the built asset directory. Do not put it in `apps/website/static`.

## Browser-only modules

- The playground is a client-only feature. Its Babel, Monaco, Prettier, and browser code must remain available in the client bundle.
- Do not remove or stub the playground from client builds.
- Avoid runtime filesystem reads in website components. Import documentation content at build time (for example with Vite `?raw`) so the static build contains everything it needs.

## Commands and checks

- Preview the Cloudflare runtime locally with `bun run preview:cloudflare` from `apps/website`.
- Deploy with `bun run deploy:cloudflare` from `apps/website`.
- Before deploying, run the website typecheck, production build, and a Wrangler dry run.
- Verify a pre-rendered documentation route and its Waku RSC asset are both available from `dist/public`.
- Verify an unmatched route returns a static 404.
- Verify the client-only playground in a real browser after deployment; an SSR bundle optimization must not break it.

## Size limit

- The current Cloudflare account rejects Workers larger than 3 MiB compressed.
- Pure SSG avoids that limit by deploying no Worker script. A Wrangler dry run should list static assets only and must not attach modules from `dist/server`.
