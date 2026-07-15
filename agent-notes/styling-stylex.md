# Styling and StyleX

- Author all component styling with StyleX. Do not add handwritten source CSS files.
- Use logical properties and `start`/`end` APIs for the inline direction so placement follows writing direction. Keep the block axis physical: use `top`/`bottom`, not `block-start`/`block-end` or `insetBlock*` replacements.
- The distributed `styles.css` is compiled StyleX output only; it must not append handwritten CSS.
- Never use selectors based on `data-*` attributes, including inside StyleX.
- Do not add library-owned `data-stylextras-*` attributes to component DOM.
- Express native state with pseudo-classes such as `:open`, `:checked`, `:indeterminate`, and `:popover-open`.
- For disclosure chevrons, put the decorative icon in a named subcomponent and style that element through `stylex.when.ancestor(':open', marker)`. Do not put an ancestor condition inside a `::before`/`::after` block: StyleX 0.18 emits the ancestor selector after the pseudo-element, producing an invalid selector.
- If state already exists in component logic, apply a StyleX style conditionally through `stylex.props()` instead of reflecting the state into a styling attribute.
- Keep `sx` last in `stylex.props()` so consumer overrides merge deterministically.
- Components intentionally omit `className` and inline `style` from public props.
- Component shadows must use the derived `elevation` variables; do not hardcode shadow geometry or substitute a color token.
- Tune state surfaces against their actual parent in light and dark modes independently; preserving active-state contrast must not make the whole control too prominent against the page.
- Accent color themes must tint the light-mode core background itself. Tinting only derived surfaces leaves the overall light scheme visually white; use an overwhelmingly white `color-mix()` with the theme's accent, then derive the remaining surfaces normally.
- Status text should remain foreground-dominant. Use a subtle `color-mix(in oklab, foreground 92%, status)`-style tint for semantic variants instead of using the status color directly.
- Avoid mixing two StyleX color variables when both variables are themselves derived through `color-mix()`. Playwright WebKit crashes on that nested combination; mix a core foreground with one derived/status color instead.
- Keep reduced-motion, forced-colors, responsive, and feature-query declarations in the owning component's StyleX definition.
- Native `<dialog>` user-agent styles may resolve both inline insets to `0`. For edge-pinned sheets, expose logical `start`/`end` placement, set the requested `insetInline*` edge to `0`, and explicitly reset the opposite logical edge to `auto` so placement follows RTL.
- A compiled StyleX package must hash `defineVars()` groups from their canonical published module paths, not their source-only paths. Consumer-authored StyleX resolves `@stylextras/ui/tokens/*` through `dist`; mismatched source/dist identities produce undefined custom properties and transparent or inherited colors. Keep the packed-consumer token-identity regression when changing the build.
