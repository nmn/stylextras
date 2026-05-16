# @stylextras/ui

Token-driven UI primitives built with StyleX and native HTML/CSS features.

## Status

- All requested component entrypoints are present and exported.
- The package does not depend on `react-aria-components`.
- Components accept `sx?: StyleXStyles` and intentionally do not expose `className` or `style`.
- Popup primitives use native `<dialog>` or the `popover` attribute.
- Floating popovers/tooltips/menus use CSS anchor positioning through StyleX.

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

## Package conventions

- Import each component from its own subpath. There is no barrel export.
- Most components are thin wrappers around native elements.
- Components generally forward native props for their underlying element, except `className` and `style`.
- Aliases exist for some spaced doc names such as `combo-box`, `text-area`, `time-field`, `date-range-picker`, `breadcrumbs`, and `alert`.
- Some legacy internal aliases still exist as separate exports such as `alert-callout`, `combobox`, `textarea`, `timefield`, `breadcrumb`, `empty`, and `flez`.

## Tokens and themes

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

## Named variant / option types

| Type                    | Values      |
| ----------------------- | ----------- | --------- | -------- | ---------- | ------- | ------- | ------- | ------- |
| `ButtonVariant`         | `primary    | secondary | outline  | ghost      | danger` |
| `ButtonSize`            | `sm         | md        | lg`      |
| `CardElevation`         | `flat       | sm        | md       | lg`        |
| `TypographyScale`       | `label      | body      | title    | display`   |
| `TypographyTone`        | `default    | soft      | muted    | brand      | info    | success | warning | danger` |
| `PopoverBehavior`       | `auto       | manual`   |
| `PopoverPlacement`      | `bottom     | top       | right    | left`      |
| `PopoverSize`           | `sm         | md        | lg`      |
| `DropdownMenuBehavior`  | `auto       | manual`   |
| `DropdownMenuPlacement` | `bottom     | top       | right    | left`      |
| `ContextMenuBehavior`   | `auto       | manual`   |
| `ContextMenuPlacement`  | `bottom     | top       | right    | left`      |
| `TooltipPlacement`      | `bottom     | top       | right    | left`      |
| `HoverCardPlacement`    | `bottom     | top       | right    | left`      |
| `DialogSize`            | `sm         | md        | lg`      |
| `DrawerSide`            | `left       | right`    |
| `AspectRatioValue`      | `square     | video     | portrait | landscape` |
| `ImageCropperRatio`     | `square     | video     | portrait | landscape` |
| `ImageCropperPosition`  | `center     | top       | bottom   | left       | right`  |
| `SeparatorOrientation`  | `horizontal | vertical` |
| `SeparatorEmphasis`     | `subtle     | strong`   |
| `FlexDirection`         | `row        | column`   |
| `FlexAlign`             | `start      | center    | end      | stretch`   |
| `FlexJustify`           | `start      | center    | end      | between`   |
| `FlexGap`               | `sm         | md        | lg`      |
| `GridCols`              | `1          | 2         | 3        | 4`         |
| `ProgressCircleSize`    | `sm         | md        | lg`      |

## Component index

### Buttons

| Component             | Import                                    | Props type                   | Notes                                   |
| --------------------- | ----------------------------------------- | ---------------------------- | --------------------------------------- |
| Button                | `@stylextras/ui/button`                   | `ButtonProps`                | `variant`, `size`                       |
| Button Group          | `@stylextras/ui/button-group`             | `ButtonGroupProps`           | layout wrapper for grouped buttons      |
| CopyToClipboardButton | `@stylextras/ui/copy-to-clipboard-button` | `CopyToClipboardButtonProps` | clipboard wrapper around `Button`       |
| Icon Button           | `@stylextras/ui/icon-button`              | `IconButtonProps`            | `size` variant for square icon controls |
| Segmented Control     | `@stylextras/ui/segmented-control`        | `SegmentedControlProps`      | single-row segmented selector           |
| Toggle Button         | `@stylextras/ui/toggle`                   | `ToggleProps`                | pressed-state button primitive          |
| Toggle Button Group   | `@stylextras/ui/toggle-group`             | `ToggleGroupProps`           | grouped toggle controls                 |

### Collections

| Component    | Import                        | Props type         | Notes                             |
| ------------ | ----------------------------- | ------------------ | --------------------------------- |
| Command Menu | `@stylextras/ui/command`      | `CommandProps`     | native `<dialog>` command surface |
| Context Menu | `@stylextras/ui/context-menu` | `ContextMenuProps` | `popover` + anchor positioning    |
| List Box     | `@stylextras/ui/listbox`      | `ListboxProps`     | styled list container             |
| Menu         | `@stylextras/ui/menu`         | `MenuProps`        | alias of `DropdownMenu`           |
| Menubar      | `@stylextras/ui/menubar`      | `MenubarProps`     | horizontal menu row               |
| Table        | `@stylextras/ui/table`        | `TableProps`       | styled semantic table             |
| Tag Group    | `@stylextras/ui/tag-group`    | `TagGroupProps`    | tag collection wrapper            |
| Tree         | `@stylextras/ui/tree`         | `TreeProps`        | styled hierarchical list wrapper  |

### Color

| Component           | Import                               | Props type               | Notes                              |
| ------------------- | ------------------------------------ | ------------------------ | ---------------------------------- |
| Color Area          | `@stylextras/ui/color-area`          | `ColorAreaProps`         | simplified color-selection surface |
| Color Field         | `@stylextras/ui/color-field`         | `ColorFieldProps`        | native color/text field wrapper    |
| Color Picker        | `@stylextras/ui/color-picker`        | `ColorPickerProps`       | native color input wrapper         |
| Color Slider        | `@stylextras/ui/color-slider`        | `ColorSliderProps`       | range-based color channel control  |
| Color Swatch        | `@stylextras/ui/color-swatch`        | `ColorSwatchProps`       | visual swatch block                |
| Color Swatch Picker | `@stylextras/ui/color-swatch-picker` | `ColorSwatchPickerProps` | swatch selection group             |
| Color Wheel         | `@stylextras/ui/color-wheel`         | `ColorWheelProps`        | simplified wheel-style control     |

### Content

| Component     | Import                         | Props type          | Notes                                  |
| ------------- | ------------------------------ | ------------------- | -------------------------------------- |
| Aspect Ratio  | `@stylextras/ui/aspect-ratio`  | `AspectRatioProps`  | `ratio` presets                        |
| Avatar        | `@stylextras/ui/avatar`        | `AvatarProps`       | `size` presets                         |
| Card          | `@stylextras/ui/card`          | `CardProps`         | `elevation` presets                    |
| Content       | `@stylextras/ui/content`       | `ContentProps`      | readable long-form wrapper             |
| Editable Text | `@stylextras/ui/editable-text` | `EditableTextProps` | content-editable primitive             |
| Empty State   | `@stylextras/ui/empty-state`   | `EmptyStateProps`   | alias of `Empty`                       |
| ImageCropper  | `@stylextras/ui/image-cropper` | `ImageCropperProps` | `ratio` and `position` presets         |
| Kbd           | `@stylextras/ui/kbd`           | `KbdProps`          | `size` presets                         |
| Separator     | `@stylextras/ui/separator`     | `SeparatorProps`    | `orientation`, `emphasis`              |
| Text          | `@stylextras/ui/text`          | `TextProps`         | body-scale wrapper around `Typography` |
| Typography    | `@stylextras/ui/typography`    | `TypographyProps`   | `scale`, `tone`, `mono`, `as`          |

### Date and time

| Component         | Import                             | Props type             | Notes                          |
| ----------------- | ---------------------------------- | ---------------------- | ------------------------------ |
| Calendar          | `@stylextras/ui/calendar`          | `CalendarProps`        | native date-oriented primitive |
| Date Field        | `@stylextras/ui/date-field`        | `DateFieldProps`       | native date input wrapper      |
| Date Picker       | `@stylextras/ui/date-picker`       | `DatePickerProps`      | token-styled date control      |
| Date Range Picker | `@stylextras/ui/date-range-picker` | `DateRangePickerProps` | alias of `RangeDatePicker`     |
| Range Calendar    | `@stylextras/ui/range-calendar`    | `RangeCalendarProps`   | simplified range calendar      |
| Time Field        | `@stylextras/ui/time-field`        | `TimeFieldProps`       | alias of `timefield` export    |

### Form

| Component      | Import                          | Props type          | Notes                      |
| -------------- | ------------------------------- | ------------------- | -------------------------- |
| Checkbox       | `@stylextras/ui/checkbox`       | `CheckboxProps`     | `size` presets             |
| Combo Box      | `@stylextras/ui/combo-box`      | `ComboBoxProps`     | alias of `combobox` export |
| File Drop Zone | `@stylextras/ui/file-drop-zone` | `FileDropZoneProps` | native drop target shell   |
| Form           | `@stylextras/ui/form`           | `FormProps`         | semantic form wrapper      |
| Label          | `@stylextras/ui/label`          | `LabelProps`        | styled label element       |
| Number Field   | `@stylextras/ui/number-field`   | `NumberFieldProps`  | `size` presets             |
| Radio          | `@stylextras/ui/radio`          | `RadioProps`        | single radio control       |
| Search Field   | `@stylextras/ui/search-field`   | `SearchFieldProps`  | search input wrapper       |
| Select         | `@stylextras/ui/select`         | `SelectProps`       | `size` presets             |
| Slider         | `@stylextras/ui/slider`         | `SliderProps`       | `size` presets             |
| Switch         | `@stylextras/ui/switch`         | `SwitchProps`       | `size` presets             |
| Text Area      | `@stylextras/ui/text-area`      | `TextAreaProps`     | alias of `textarea` export |
| Text Field     | `@stylextras/ui/text-field`     | `TextFieldProps`    | `size` presets             |

### Layout

| Component       | Import                           | Props type            | Notes                                          |
| --------------- | -------------------------------- | --------------------- | ---------------------------------------------- |
| Flex            | `@stylextras/ui/flex`            | `FlexProps`           | `direction`, `align`, `justify`, `gap`, `wrap` |
| Grid            | `@stylextras/ui/grid`            | `GridProps`           | `cols` presets                                 |
| Toolbar         | `@stylextras/ui/toolbar`         | `ToolbarProps`        | toolbar row wrapper                            |
| Window Splitter | `@stylextras/ui/window-splitter` | `WindowSplitterProps` | `orientation`                                  |

### Navigation

| Component        | Import                             | Props type             | Notes                             |
| ---------------- | ---------------------------------- | ---------------------- | --------------------------------- |
| Breadcrumbs      | `@stylextras/ui/breadcrumbs`       | `BreadcrumbsProps`     | alias of `breadcrumb` export      |
| Disclosure       | `@stylextras/ui/disclosure`        | `DisclosureProps`      | native `<details>` primitive      |
| Disclosure Group | `@stylextras/ui/disclosure-group`  | `DisclosureGroupProps` | group wrapper for disclosures     |
| Footer           | `@stylextras/ui/footer`            | `FooterProps`          | page/footer layout shell          |
| HeaderLayout     | `@stylextras/ui/header-layout`     | `HeaderLayoutProps`    | header + main layout composition  |
| Link             | `@stylextras/ui/link`              | `LinkProps`            | styled anchor                     |
| Navbar           | `@stylextras/ui/navbar`            | `NavbarProps`          | top navigation row                |
| Pagination       | `@stylextras/ui/pagination`        | `PaginationProps`      | simple page navigation shell      |
| Sidebar          | `@stylextras/ui/sidebar`           | `SidebarProps`         | aside/navigation shell            |
| SidebarLayout    | `@stylextras/ui/sidebar-layout`    | `SidebarLayoutProps`   | sidebar + main layout composition |
| TableOfContents  | `@stylextras/ui/table-of-contents` | `TableOfContentsProps` | anchor list navigation            |
| Tabs             | `@stylextras/ui/tabs`              | `TabsProps`            | minimal tabs primitive            |

### Popups

| Component    | Import                        | Props type         | Notes                                   |
| ------------ | ----------------------------- | ------------------ | --------------------------------------- |
| Alert Dialog | `@stylextras/ui/alert-dialog` | `AlertDialogProps` | native `<dialog>` alert surface         |
| Dialog       | `@stylextras/ui/dialog`       | `DialogProps`      | `size` presets, native `<dialog>`       |
| Drawer       | `@stylextras/ui/drawer`       | `DrawerProps`      | `side` presets, native `<dialog>`       |
| Hover Card   | `@stylextras/ui/hover-card`   | `HoverCardProps`   | `popover` + anchor positioning          |
| Popover      | `@stylextras/ui/popover`      | `PopoverProps`     | `behavior`, `placement`, `size`         |
| Tooltip      | `@stylextras/ui/tooltip`      | `TooltipProps`     | `popover="manual"` + anchor positioning |

### Status

| Component       | Import                           | Props type            | Notes                           |
| --------------- | -------------------------------- | --------------------- | ------------------------------- |
| Alert           | `@stylextras/ui/alert`           | `AlertProps`          | alias of `alert-callout` export |
| Badge           | `@stylextras/ui/badge`           | `BadgeProps`          | `variant`, `size`               |
| Meter           | `@stylextras/ui/meter`           | `MeterProps`          | styled native meter             |
| Progress Bar    | `@stylextras/ui/progress-bar`    | `ProgressBarProps`    | styled native progress          |
| Progress Circle | `@stylextras/ui/progress-circle` | `ProgressCircleProps` | `size`, `showValue`             |
| Skeleton        | `@stylextras/ui/skeleton`        | `SkeletonProps`       | placeholder block               |
| Toast           | `@stylextras/ui/toast`           | `ToastProps`          | static toast surface            |

## Additional exports

These are not part of the main requested component set but are still exported:

- `@stylextras/ui/alert-callout` with `AlertProps` / `AlertVariant`
- `@stylextras/ui/combobox` with `ComboboxProps`
- `@stylextras/ui/textarea` with `TextareaProps` / `TextareaSize`
- `@stylextras/ui/timefield` with `TimefieldProps`
- `@stylextras/ui/range-date-picker` with `RangeDatePickerProps`
- `@stylextras/ui/breadcrumb` with `BreadcrumbProps`
- `@stylextras/ui/empty` with `EmptyProps`
- `@stylextras/ui/flez` with `FlezProps`

## Current limitations

- These components are intentionally minimal. Many are structural/styling primitives rather than full interaction systems.
- There is not feature parity with mature accessibility/interaction libraries. Keyboard navigation, roving focus, typeahead, collision handling, and advanced dismissal logic are limited or absent in many components.
- Menu-like and popover-like components rely on native `popover`, CSS anchor positioning, and browser behavior. They require modern browser support.
- Dialog-like components rely on native `<dialog>` behavior and do not add a custom focus-management layer beyond the platform.
- Collection components such as `Table`, `Tree`, `Listbox`, `Menubar`, and `TagGroup` are simplified wrappers and do not yet provide advanced selection, virtualization, treegrid behavior, or robust keyboard semantics.
- Date/time/color primitives are simplified and lean heavily on native inputs or stand-in UI rather than full custom interaction models.
- Tooltip / hover-card / context-menu triggering is not yet fully packaged as a high-level controller API; the current primitives focus on the rendered surface.
- Some alias exports remain for naming convenience and migration, so the surface area is broader than the preferred canonical names.
- Documentation prose across the website is not fully normalized yet; some MDX pages still describe the old implementation model.

## Missing or deferred features

- Full WAI-ARIA interaction parity for tabs, menus, comboboxes, listboxes, radio groups, and trees
- Portal-free popup helpers for trigger wiring, focus return, escape handling, outside click handling, and collision-aware placement
- Rich date/time selection model beyond native controls
- Rich color model beyond native inputs and simplified slider/swatch/wheel controls
- Async loading, virtualization, and large-data ergonomics for table/tree/list primitives
- More complete example coverage for every component export

## Notes for contributors

- Keep new components token-driven and prefer direct use of core token consts over unnecessary component-level indirection.
- Use function declarations for component exports.
- Prefer native platform elements and browser features first.
- Do not introduce portals for popup primitives.
- Use StyleX anchor-positioning APIs for floating surfaces.
