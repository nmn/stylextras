# @stylextras/ui

Token-driven UI primitives built with StyleX and native HTML/CSS features.

## Status

- Component entrypoints are exported by subpath. There is no package barrel.
- Components accept `sx?: StyleXStyles` and intentionally do not expose `className` or `style`.
- Most components are thin wrappers around native elements and browser behavior.
- Dialog-style components use native `<dialog>`.
- Floating components use the `popover` attribute and CSS anchor positioning.
- Components should keep working without JavaScript wherever the platform gives us a native behavior.

## Installation

```bash
bun add @stylextras/ui @stylexjs/stylex react react-dom
```

## Usage

```tsx
import { Button } from "@stylextras/ui/button";
import { Card } from "@stylextras/ui/card";
import { Typography } from "@stylextras/ui/typography";

export function Example() {
  return (
    <Card elevation="sm">
      <Typography scale="title">StyleXtras UI</Typography>
      <Button variant="primary">Continue</Button>
    </Card>
  );
}
```

## Package Conventions

- Import each component from its own subpath.
- Prefer the canonical dashed exports in docs: `combo-box`, `text-area`, `time-field`, `date-range-picker`, `breadcrumbs`, `empty-state`, and `alert`.
- Legacy aliases still exist for compatibility and search only: `combobox`, `textarea`, `timefield`, `range-date-picker`, `breadcrumb`, `empty`, and `alert-callout`. They should not get separate docs pages.
- Use StyleX and token variables for all component styling.
- Prefer platform primitives first: native form controls, `<details>`, `<dialog>`, `popover`, CSS anchor positioning, semantic tables, and semantic lists.
- Do not introduce portals for dialog, popover, menu, tooltip, or hover-card primitives.

## Tokens And Themes

Token exports:

- `@stylextras/ui/tokens/color`
- `@stylextras/ui/tokens/spacing`
- `@stylextras/ui/tokens/radius`
- `@stylextras/ui/tokens/stroke`
- `@stylextras/ui/tokens/typography`
- `@stylextras/ui/tokens/elevation`
- `@stylextras/ui/tokens/blur`
- `@stylextras/ui/tokens/motion`
- `@stylextras/ui/tokens/components`

Theme exports:

- `@stylextras/ui/color-themes`
- `@stylextras/ui/spacing-themes`
- `@stylextras/ui/radius-themes`
- `@stylextras/ui/typography-themes`
- `@stylextras/ui/example-theme`

## Component Groups

### Actions

- `button`
- `button-group`
- `copy-to-clipboard-button`
- `icon-button`
- `segmented-control`
- `toggle`
- `toggle-group`

### Inputs And Forms

- `checkbox`
- `combo-box`
- `field-errors`
- `file-drop-zone`
- `file-trigger`
- `form`
- `input-fields`
- `input-group`
- `label`
- `number-field`
- `radio`
- `radio-group`
- `search-field`
- `select`
- `slider`
- `switch`
- `text-area`
- `text-field`

### Date And Time

- `calendar`
- `date-field`
- `date-picker`
- `date-range-picker`
- `range-calendar`
- `time-field`

### Color

- `color-area`
- `color-field`
- `color-picker`
- `color-slider`
- `color-swatch`
- `color-swatch-picker`
- `color-wheel`

### Menus And Collections

- `command`
- `context-menu`
- `data-table`
- `dropdown-menu`
- `listbox`
- `menu`
- `menu/menu-content`
- `menubar`
- `table`
- `tag-group`
- `tree`

### Dialogs And Popovers

- `alert-dialog`
- `dialog`
- `drawer`
- `hover-card`
- `popover`
- `tooltip`

### Layout

- `flex`
- `grid`
- `header-layout`
- `sidebar-layout`
- `toolbar`
- `window-splitter`

### Navigation

- `breadcrumbs`
- `disclosure`
- `disclosure-group`
- `footer`
- `link`
- `navbar`
- `pagination`
- `sidebar`
- `table-of-contents`
- `tabs`

### Content And Media

- `aspect-ratio`
- `avatar`
- `card`
- `content`
- `editable-text`
- `empty-state`
- `image-cropper`
- `kbd`
- `separator`
- `text`
- `typography`

### Feedback

- `alert`
- `badge`
- `meter`
- `progress-bar`
- `progress-circle`
- `skeleton`
- `spinner`
- `toast`

## JavaScript Dependency Inventory

These components currently use JavaScript for layout or core behavior and should be the first targets when reducing runtime requirements.

| Component                                          | Current JS use                                                                                                                    | Platform-first direction                                                                                                              |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `window-splitter`                                  | Tracks pointer position, computes percentages from `getBoundingClientRect`, and stores uncontrolled split state.                  | Keep the semantic separator, but explore CSS grid/custom-property patterns and native range fallbacks for non-JS layouts.             |
| `dialog`, `alert-dialog`, `drawer`, `command`      | Trigger variants lazy-load content and call `showModal()`. Programmatic dialogs hold open state in React.                         | Keep content components as plain `<dialog>` surfaces. Prefer declarative rendered content and platform close behavior where possible. |
| `popover`, `dropdown-menu`, `menu`, `context-menu` | Trigger variants lazy-load content and call `showPopover({ source })`; menu items close parent popovers with DOM lookups.         | Prefer static `popovertarget` wiring when lazy loading is not needed. Keep CSS anchor positioning as the placement layer.             |
| `tooltip`                                          | Hover/focus triggers mount lazy content and call `showPopover`.                                                                   | Prefer CSS-only disclosure for simple labels and reserve JS for lazy content.                                                         |
| `hover-card`                                       | Hover/focus opens an inert tooltip preview, ArrowDown or preview hover upgrades it to `showModal()`, and dismissal returns focus. | Keep the tooltip-to-dialog split; reduce JS only where platform popover/dialog and anchor behavior can take over directly.            |
| `menubar`                                          | Depends on menu trigger behavior so sibling menus open on hover after one menu is active.                                         | Keep markup semantic and use JS only for the cross-trigger hover handoff.                                                             |
| `tabs`                                             | Uses React state to switch active tab and panel content.                                                                          | Consider a radio-backed or anchor-backed variant so baseline content remains navigable without hydration.                             |
| `segmented-control`                                | Uses React state for uncontrolled value management, while the underlying controls are native radios.                              | Keep the radio foundation; avoid adding layout JS.                                                                                    |
| `color-swatch-picker`                              | Uses React state for uncontrolled selected swatch.                                                                                | Keep the radio foundation and make form submission useful without hydration.                                                          |
| `copy-to-clipboard-button`                         | Uses `navigator.clipboard`, timeout state, and popover feedback.                                                                  | Clipboard requires JS; keep feedback optional and avoid layout work.                                                                  |
| `editable-text`                                    | Uses a paste handler and `document.execCommand` to force plain-text insertion.                                                    | Keep native `contenteditable`; replace deprecated paste handling when a better platform path is available.                            |
| `lazy-component`                                   | Caches `React.lazy` components and preloads async content.                                                                        | Keep this as an optional trigger helper, not a requirement for content components.                                                    |

Low-JS or no-JS components include the structural wrappers, native inputs, `disclosure`, `disclosure-group`, `meter`, `progress-bar`, `table`, typography/content components, and most layout shells. They should remain mostly declarative.

Demo-only state exists in examples and theme demos. That state should not be treated as required component behavior.

## Variant Types

- `ButtonVariant`: `primary`, `secondary`, `outline`, `ghost`, `danger`
- `ButtonSize`: `sm`, `md`, `lg`
- `CardElevation`: `flat`, `sm`, `md`, `lg`
- `TypographyScale`: `label`, `body`, `title`, `display`
- `TypographyTone`: `default`, `soft`, `muted`, `brand`, `info`, `success`, `warning`, `danger`
- `PopoverBehavior`: `auto`, `manual`
- `PopoverPlacement`: `bottom`, `top`, `right`, `left`
- `PopoverSize`: `sm`, `md`, `lg`
- `DropdownMenuBehavior`: `auto`, `manual`
- `DropdownMenuPlacement`: `bottom`, `top`, `right`, `left`
- `ContextMenuBehavior`: `auto`, `manual`
- `ContextMenuPlacement`: `bottom`, `top`, `right`, `left`
- `TooltipPlacement`: `bottom`, `top`, `right`, `left`
- `HoverCardPlacement`: `bottom`, `top`, `right`, `left`
- `DialogSize`: `sm`, `md`, `lg`
- `DrawerSide`: `left`, `right`
- `AspectRatioValue`: `square`, `video`, `portrait`, `landscape`
- `ImageCropperRatio`: `square`, `video`, `portrait`, `landscape`
- `ImageCropperPosition`: `center`, `top`, `bottom`, `left`, `right`
- `SeparatorOrientation`: `horizontal`, `vertical`
- `SeparatorEmphasis`: `subtle`, `strong`
- `FlexDirection`: `row`, `column`
- `FlexAlign`: `start`, `center`, `end`, `stretch`
- `FlexJustify`: `start`, `center`, `end`, `between`
- `FlexGap`: `sm`, `md`, `lg`
- `GridCols`: `1`, `2`, `3`, `4`
- `ProgressCircleSize`: `sm`, `md`, `lg`

## Current Limitations

- These components are intentionally minimal. Many are structural or styling primitives rather than full interaction systems.
- Keyboard navigation, roving focus, typeahead, collision handling, and advanced dismissal logic are limited in several composite components.
- Menu-like and popover-like components require modern browser support for `popover` and CSS anchor positioning.
- Dialog-like components rely on native `<dialog>` behavior and do not add a custom focus-management layer beyond the platform.
- Date/time/color primitives lean heavily on native inputs or simplified UI instead of a custom interaction model.
- Some alias exports remain for naming compatibility, but canonical docs should prefer the dashed names listed above.

## Notes For Contributors

- Keep new components token-driven and prefer direct use of core token constants over unnecessary component-level indirection.
- Use function declarations for component exports.
- Prefer native platform elements and browser features first.
- Use ref callback cleanup instead of effects when a small DOM bridge is required.
- Keep JavaScript out of layout unless the component cannot work without measurement or pointer tracking.
- Do not add `useCallback` or `useMemo`; React Compiler handles memoization.
- Do not introduce portals for dialog, popover, menu, tooltip, hover-card, drawer, or command primitives.
- Use StyleX anchor-positioning APIs for floating surfaces.
