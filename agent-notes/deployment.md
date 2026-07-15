# Deployment

## Cloudflare architecture

- The documentation website is a hybrid Cloudflare Workers deployment, not a static-only site.
- Use Waku's `waku/adapters/cloudflare` adapter. It builds pre-rendered content into `apps/website/dist/public` and a request handler at `apps/website/dist/server/serve-cloudflare.js`.
- Let Workers Static Assets serve matching pre-rendered pages and assets. Requests without a matching asset must fall through to the Waku Worker so future dynamic routes can execute on the server.
- Keep the `ASSETS` binding and do not configure static-asset `not_found_handling`; that would prevent unmatched requests from reaching Waku.
- Keep the `nodejs_compat` compatibility flag. Fumadocs currently relies on supported Node-compatible modules in the Worker graph.
- The static headers file belongs at `apps/website/public/_headers`, because Waku copies that directory into the built asset directory. Do not put it in `apps/website/static`.

## Browser-only modules

- The playground is a client-only feature. Its Babel, Monaco, Prettier, and browser code must remain available in the client bundle.
- Exclude the playground implementation only from the SSR graph using the targeted Vite SSR stub in `apps/website/waku.config.ts`. Do not remove or stub it from client builds.
- Avoid runtime filesystem reads in website components. Import documentation content at build time (for example with Vite `?raw`) so dynamic Worker rendering does not depend on the repository filesystem.

## Commands and checks

- Preview the Cloudflare runtime locally with `bun run preview:cloudflare` from `apps/website`.
- Deploy with `bun run deploy:cloudflare` from `apps/website`.
- Before deploying, run the website typecheck, production build, and a Wrangler dry run.
- Verify both paths through the hybrid deployment:
  - A pre-rendered documentation route returns HTML from static assets.
  - An unmatched route reaches the Waku Worker and returns its response.
  - A Waku RSC request returns its server payload.
- Verify the client-only playground in a real browser after deployment; an SSR bundle optimization must not break it.

## Size limit

- The current Cloudflare account rejects Workers larger than 3 MiB compressed.
- Keep the server bundle comfortably below that limit. The initial browser-heavy SSR graph exceeded it; the targeted playground SSR exclusion reduced the deployed Worker to about 641 KiB compressed.
- Treat a sudden server-bundle increase as a graph-boundary bug before removing user-facing functionality.
