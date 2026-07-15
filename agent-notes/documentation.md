# Component documentation

- Every individual component page must keep its live demos.
- Import documentation examples eagerly with static imports; do not wrap them in `React.lazy()` or `Suspense`.
- Import UI components and examples through `@stylextras/ui/*` package subpaths, never through relative paths into `packages/ui/src`.
- Variant-rich components need examples covering their materially different uses.
- Every page documents all public compound parts and component-specific props, including inherited package props and defaults.
- Documentation pages include Examples, Import, Anatomy, accessibility/native behavior, and API reference sections.
- Generate prop references with the TypeScript type checker so imported and re-exported prop types are not lost.
- Keep examples typechecked and colocated with their components.
- Do not restore duplicated headings, stale props, nonexistent variants, or per-demo copies of global documentation controls.
