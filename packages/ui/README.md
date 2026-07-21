# @stylextras/ui

Native-first React components with their StyleX styling built in. The package uses native controls, `<dialog>`, the Popover API, invoker commands, anchor positioning, and focusgroup before adding JavaScript.

This is the breaking `0.2.0-beta.0` redesign. React and StyleX are peer dependencies; Radix UI, Base UI, and React Aria are not runtime dependencies.

## Install

```sh
bun add @stylextras/ui@0.2.0-beta.0 @stylexjs/stylex react
```

Import the compiled package CSS once:

```tsx
import "@stylextras/ui/styles.css";
```

Components use canonical subpath imports. There is intentionally no package barrel:

```tsx
import { Button } from "@stylextras/ui/button";
import { Card, CardContent, CardTitle } from "@stylextras/ui/card";

export function Example() {
  return (
    <Card>
      <CardTitle>Native-first UI</CardTitle>
      <CardContent>
        <Button>Continue</Button>
      </CardContent>
    </Card>
  );
}
```

Every component renders and styles its actual element, extends that element's native props, forwards its React 19 ref, and composes `sx` last. `className` and inline `style` are intentionally omitted.

## Themes and variables

There is no provider, context, or `ThemeRoot`. Themes are ordinary `stylex.createTheme()` objects and can be applied to any element:

```tsx
import * as stylex from "@stylexjs/stylex";
import { colorThemes } from "@stylextras/ui/color-themes";
import { radiusThemes } from "@stylextras/ui/radius-themes";
import { spacingThemes } from "@stylextras/ui/spacing-themes";

export function ThemeBoundary({ children }: { children: React.ReactNode }) {
  return (
    <section
      {...stylex.props(
        colorThemes.zinc,
        spacingThemes.compact,
        radiusThemes.rounded,
      )}
    >
      {children}
    </section>
  );
}
```

The color catalog includes neutral bases, the coordinated `docs` palette used by the Stylextras documentation website, plus amber, blue, cyan, emerald, fuchsia, green, indigo, lime, orange, pink, purple, red, rose, sky, teal, violet, and yellow accents. Independent theme maps are exported for color, spacing, radius, stroke, typography, elevation, blur, and motion, and every map exposes a matching `docs` key. Each set keeps a small themeable core and same-set derived values; there is no foundation/semantic/component-token layering.

```tsx
import { colors } from "@stylextras/ui/tokens/color";
import { spacing } from "@stylextras/ui/tokens/spacing";
```

## Select is native

`Select` always renders a native `<select>`. Options and groups are native children, so submission, validation, reset, autofill, keyboard behavior, accessibility, and platform pickers remain intact.

```tsx
import { Select } from "@stylextras/ui/select";

<Select name="region" required defaultValue="">
  <option value="" disabled>Choose a region</option>
  <optgroup label="Americas">
    <option value="pdx">Portland</option>
    <option value="nyc">New York</option>
  </optgroup>
</Select>;
```

Supporting Chromium versions receive customizable-select styling through `appearance: base-select`, `::picker(select)`, option checkmarks, and discrete transitions. Other engines retain a polished conventional native select; touch-first devices keep their platform picker.

## Combobox is the custom typeahead

`Combobox` is the separate enhanced input/listbox control. It uses a text input, `popover="auto"`, anchor positioning, `aria-activedescendant`, native form integration, filtering, keyboard selection, and reset behavior.

```tsx
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
} from "@stylextras/ui/combobox";

<Combobox name="framework" defaultValue="react">
  <ComboboxInput aria-label="Framework" />
  <ComboboxContent>
    <ComboboxItem value="react">React</ComboboxItem>
    <ComboboxItem value="svelte">Svelte</ComboboxItem>
    <ComboboxEmpty>No results found.</ComboboxEmpty>
  </ComboboxContent>
</Combobox>;
```

## Native layers

Dialog and popover relationships are explicit and remain server-renderable:

```tsx
import { Dialog, DialogClose, DialogTrigger } from "@stylextras/ui/dialog";

<>
  <DialogTrigger target="rename">Rename</DialogTrigger>
  <Dialog id="rename" aria-labelledby="rename-title">
    <h2 id="rename-title">Rename project</h2>
    <DialogClose target="rename">Done</DialogClose>
  </Dialog>
</>;
```

The default dialog and popover entries do not own React state. Applications needing controlled state or the focused cross-engine nested-layer bridge can opt into `@stylextras/ui/dialog/client` or `@stylextras/ui/popover/client`.

Focusgroup and interest-invoker behavior is feature detected. Unsupported engines lazy-load only focused bridges; anchor-positioning fallback is usable fixed placement rather than a large layout polyfill.

## Catalog

Stable entries include Accordion, Alert, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button, ButtonGroup, Calendar, Card, Carousel, Checkbox, Collapsible, Combobox, Command, ContextMenu, DatePicker, Dialog, Direction, Drawer, DropdownMenu, Empty, Field, HoverCard, Input, InputGroup, InputOTP, Item, Kbd, Label, Menubar, NavigationMenu, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, ToggleGroup, Tooltip, and Typography.

Advanced color controls, range date/time controls, editable text, file drop zones, image cropper, tag group, and tree are available only from `@stylextras/ui/experimental/*` until they meet the stable accessibility, browser, visual, and size gates.

## Browser behavior

- Current Chromium receives the newest native presentation enhancements when supported without flags.
- Safari and Firefox preserve semantic, form, and keyboard behavior with simpler placement or presentation where platform APIs differ.
- Reduced motion, forced colors, RTL, zoom, and narrow layouts are part of the browser test matrix.
- Native-only entries contain no `"use client"` boundary.

## Migrating from 0.1

There are no compatibility aliases in 0.2.

| Removed import | Replacement |
| --- | --- |
| `alert-callout` | `alert` |
| `breadcrumbs` | `breadcrumb` |
| `combo-box` | `combobox` |
| `empty-state` | `empty` |
| `text-area` | `textarea` |
| `disclosure` | `collapsible` |
| `disclosure-group` | `accordion` |
| `progress-bar` | `progress` |
| `window-splitter` | `resizable` |
| `icon-button` | `Button` with an icon size |
| `menu` | `dropdown-menu` |

The old component-token export and source/example production exports are removed. Import `@stylextras/ui/styles.css`, switch to canonical subpaths, and apply theme objects directly with `stylex.props()`.

## Verification

```sh
bun run test
bun run test:package
```

The package build emits tree-shakable ESM, declarations, compiled CSS, and a size report. The packed-artifact test installs the tarball into a clean consumer, checks public imports and types, and rejects leaked TSX/example source.
