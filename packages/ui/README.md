# @stylextras/ui

Native-first React components written in TypeScript and StyleX. The package uses native controls, `<dialog>`, the Popover API, invoker commands, anchor positioning, and focusgroup before adding JavaScript.

This is the breaking `0.2.0-beta.0` redesign. React and StyleX are peer dependencies; Radix UI, Base UI, and React Aria are not runtime dependencies.

## Install

```sh
bun add @stylextras/ui@0.2.0-beta.0 @stylexjs/stylex react
```

The package exports its original `src` files. It does not ship precompiled
JavaScript or CSS and has no build lifecycle of its own. The consuming
application must compile TypeScript, JSX, and StyleX for `@stylextras/ui` along
with its local source files.

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
import { neutralTheme } from "@stylextras/ui/color-themes/neutral";
import { zincTheme } from "@stylextras/ui/color-themes/zinc";
import { roundedTheme } from "@stylextras/ui/radius-themes/rounded";
import { compactTheme } from "@stylextras/ui/spacing-themes/compact";

export function ThemeBoundary({ children }: { children: React.ReactNode }) {
  return (
    <section
      {...stylex.props(
        neutralTheme,
        zincTheme,
        compactTheme,
        roundedTheme,
      )}
    >
      {children}
    </section>
  );
}
```

The color catalog includes neutral bases, the coordinated `docs` palette used
by the documentation website and component galleries, plus amber, blue, cyan,
emerald, fuchsia, green, indigo, lime, orange, pink, purple, red, rose, sky,
teal, violet, and yellow accents. Independent theme maps are exported for
color, spacing, radius, stroke, typography, elevation, blur, and motion, and
every map exposes a matching `docs` key. The documentation design system is
available as the existing `docs` style preset:

```tsx
import * as stylex from "@stylexjs/stylex";
import { docsPresetThemes } from "@stylextras/ui/style-presets/docs";

export function DocsTheme({ children }: { children: React.ReactNode }) {
  return (
    <section {...stylex.props(...docsPresetThemes)}>
      {children}
    </section>
  );
}
```

Components consume the low-level token axes directly, so changing those themes
changes the package components without replacing their built-in styles. Use
`sx` for isolated layout or product-specific exceptions.

Import named theme and preset subpaths to include only their CSS. Family roots
such as `@stylextras/ui/color-themes` and the `style-presets` root are complete
catalogs intended for runtime theme pickers.

Accent color themes are deliberately small overrides. Apply `neutralTheme`
first when using one directly so a nested boundary resets every color token;
named style presets already include that reset.

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
  ComboboxList,
  ComboboxStatus,
} from "@stylextras/ui/combobox";

<Combobox name="framework" defaultValue="react">
  <ComboboxInput aria-label="Framework" />
  <ComboboxContent>
    <ComboboxList>
      <ComboboxItem value="react">React</ComboboxItem>
      <ComboboxItem value="svelte">Svelte</ComboboxItem>
    </ComboboxList>
    <ComboboxEmpty>No results found.</ComboboxEmpty>
  </ComboboxContent>
</Combobox>;
```

## Native layers

Dialog and popover relationships are explicit and remain server-renderable:

```tsx
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@stylextras/ui/dialog";

<>
  <DialogTrigger target="rename">Rename</DialogTrigger>
  <Dialog
    id="rename"
    aria-labelledby="rename-title"
    aria-describedby="rename-description"
  >
    <DialogTitle id="rename-title">Rename project</DialogTitle>
    <DialogDescription id="rename-description">
      Enter the new project name.
    </DialogDescription>
    <DialogClose target="rename">Done</DialogClose>
  </Dialog>
</>;
```

The default dialog and popover entries do not own React state. Applications needing controlled state or the focused cross-engine nested-layer bridge can opt into `@stylextras/ui/dialog/client` or `@stylextras/ui/popover/client`.

Interaction-only content can use the trigger-first lazy entry. The trigger is
the only initial DOM and component payload; focus, pointer hover, or touch
intent preloads the application module, and activation mounts then opens it:

```tsx
"use client";

import {
  LazyDialog,
  LazyDialogTrigger,
} from "@stylextras/ui/dialog/lazy";

export function RenameAction() {
  return (
    <LazyDialog
      id="rename"
      aria-label="Rename project"
      contentProps={{}}
      load={() => import("./rename-dialog-content")}
      loadErrorLabel="Could not open rename dialog"
    >
      <LazyDialogTrigger>Rename</LazyDialogTrigger>
    </LazyDialog>
  );
}
```

The imported module default-exports a component accepting `id` and the
accessible-name props and must render the matching native `Dialog`. Failed
loads remain retryable and are announced without moving focus. Equivalent lazy
entries exist for alert dialogs, drawers, sheets, commands, popovers, dropdown
menus, context menus, navigation menus, and sidebars. Tooltip text is kept in
the initial DOM because it is the trigger's accessible description. Deferred
menu boundaries require `aria-label` or `aria-labelledby`; that name is passed
to the loaded menu content automatically.

Focusgroup and interest-invoker behavior is feature detected. Unsupported engines lazy-load only focused bridges; anchor-positioning fallback is usable fixed placement rather than a large layout polyfill.

## DatePicker is native by default

`DatePicker` renders a styled `<input type="date">`, preserving external form
association, constraints, validation, reset, localization, mobile keyboards,
and the platform date picker without a client controller. A custom calendar is
an explicit enhanced/lazy choice rather than part of the initial field bundle.

## Catalog

Stable entries include Accordion, Alert, AlertDialog, AnchoredDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button, ButtonGroup, Calendar, Card, Carousel, Checkbox, Collapsible, Combobox, Command, CopyToClipboardButton, ContextMenu, DatePicker, Dialog, Direction, Drawer, DropdownMenu, Empty, Field, HoverCard, Input, InputGroup, InputOTP, Item, Kbd, Label, Link, Menubar, NavigationMenu, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Spinner, Switch, Table, TableOfContents, Tabs, Textarea, Toast, Toggle, ToggleGroup, Tooltip, and Typography.

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

The old component-token export is removed. Compile the package source in the
consumer application, switch to canonical subpaths, and apply theme objects
directly with `stylex.props()`.

### Accessibility contract changes in 0.2 beta

These are intentional beta-breaking changes. They favor native relationships,
explicit names, and composite controls with one keyboard focus owner.

| Previous composition | 0.2 beta composition |
| --- | --- |
| Static `Alert`, `FieldError`, or `FieldErrors` announced automatically | Static by default; pass `role="status"` or `role="alert"` only for a dynamic update |
| `Link` or `ButtonLink` without a destination | A real `href` is required |
| Combobox options directly in `ComboboxContent` | Put only options in `ComboboxList`; keep empty/status output beside the listbox |
| Command options were buttons in the Tab order | `CommandItem` is a non-tabbable option controlled by the focused input |
| `TableOfContentsItem level={…}` | Nest `TableOfContentsList` inside the parent item |
| Unnamed navigation/widget regions | `Navbar`, `Toolbar`, `TableOfContents`, `Sidebar`, and `SidebarNavigation` require `aria-label` or `aria-labelledby` |
| `ResizableHandle label="…"` | Supply `aria-label` or `aria-labelledby` and required `aria-controls` |
| Rich toast content inferred from rendered React nodes | Supply an explicit plain-text `announcement`; primitive `Toast` announcements default to `off` |

```tsx
'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
} from "@stylextras/ui/combobox";

<Combobox name="framework" required>
  <ComboboxInput aria-label="Framework" />
  <ComboboxContent>
    <ComboboxList>
      <ComboboxItem value="react">React</ComboboxItem>
      <ComboboxItem value="svelte">Svelte</ComboboxItem>
    </ComboboxList>
    <ComboboxEmpty>No matching framework.</ComboboxEmpty>
    <ComboboxStatus>
      {(count) => `${count} framework${count === 1 ? "" : "s"} available.`}
    </ComboboxStatus>
  </ComboboxContent>
</Combobox>
```

```tsx
import {
  TableOfContents,
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
  TableOfContentsTitle,
} from "@stylextras/ui/table-of-contents";

<TableOfContents aria-labelledby="outline-title">
  <TableOfContentsTitle id="outline-title">On this page</TableOfContentsTitle>
  <TableOfContentsList>
    <TableOfContentsItem>
      <TableOfContentsLink href="#overview">Overview</TableOfContentsLink>
      <TableOfContentsList>
        <TableOfContentsItem>
          <TableOfContentsLink href="#examples">Examples</TableOfContentsLink>
        </TableOfContentsItem>
      </TableOfContentsList>
    </TableOfContentsItem>
  </TableOfContentsList>
</TableOfContents>
```

Layout primitives are neutral unless semantics are requested: `Content`
defaults to `div`, and `HeaderLayout`/`SidebarLayout` render `main`, `header`, or
`aside` only through their explicit `*As` options. `ScrollArea` and
`TableScrollArea` enter the Tab order only with `tabIndex={0}`, which also
requires an accessible name. Range inputs expose `startProps` and `endProps`,
and experimental `TagList` now requires explicit `TagItem` children.

## Verification

```sh
bun run test:ui
```

Verification is owned by the repository and its consumer application. Shared
implementation modules remain separate, so the consumer can keep lazy content
and optional browser bridges in async chunks.
