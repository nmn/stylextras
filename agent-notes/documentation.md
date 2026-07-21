# Component documentation

- Every individual component page must keep its live demos.
- Import documentation examples eagerly with static imports; do not wrap them in `React.lazy()` or `Suspense`.
- Import UI components and examples through `@stylextras/ui/*` package subpaths, never through relative paths into `packages/ui/src`.
- Keep every component page as a manually maintained MDX file. Do not generate component documentation, prop references, example registries, or badge metadata with a script.
- Render each colocated example directly, then place the source for that example immediately after the live demo in a TSX code block.
- Variant-rich components need examples covering their materially different uses.
- Every page documents all public compound parts and the complete accepted prop surface: the exact React or inherited prop base, every omitted native prop, all component-specific props, and all effective defaults (including defaults inherited from composed package components).
- Documentation pages include Examples, Import, Anatomy, accessibility/native behavior, and API reference sections.
- Keep examples typechecked and colocated with their components.
- Do not restore duplicated headings, stale props, nonexistent variants, or per-demo copies of global documentation controls.
- Do not show unexplained implementation, fallback, or bundle-size badges on component pages. Describe browser behavior in plain language where it matters.
