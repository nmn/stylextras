# Verification expectations

- Run package typechecking, docs typechecking, unit tests, bundle budgets, and relevant Playwright coverage after changes.
- Exercise native form behavior, keyboard behavior, focus restoration, light dismiss, reduced motion, forced colors, RTL, zoom, and narrow layouts where relevant.
- Keep a catalog crawl that verifies every stable and experimental component page has a demo and complete generated documentation.
- Run browser checks in Chromium, Firefox, and WebKit for cross-engine behavior.
- Preserve zero behavior JavaScript for native-only components and keep entries within their bundle budgets.
- The website imports `@stylextras/ui/*` through the package export map, so it executes `packages/ui/dist`, not `packages/ui/src`. Rebuild `@stylextras/ui` before docs or browser verification after UI source changes; inspect the browser's attached React handlers if behavior appears stale.
