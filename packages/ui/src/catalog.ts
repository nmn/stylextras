export type CatalogStatus = 'stable' | 'experimental' | 'recipe'
export type BrowserMode = 'native' | 'enhanced' | 'client'
export type FallbackMode = 'native' | 'layout' | 'bridge' | 'none'

export type CatalogEntry = {
  description: string
  export: string
  fallback: FallbackMode
  mode: BrowserMode
  name: string
  status: CatalogStatus
}

const stable = (
  name: string,
  exportPath: string,
  mode: BrowserMode,
  fallback: FallbackMode,
  description: string,
): CatalogEntry => ({
  description,
  export: exportPath,
  fallback,
  mode,
  name,
  status: 'stable',
})

const experimental = (
  name: string,
  exportPath: string,
  mode: BrowserMode,
  fallback: FallbackMode,
  description: string,
): CatalogEntry => ({
  description,
  export: `experimental/${exportPath}`,
  fallback,
  mode,
  name,
  status: 'experimental',
})

/**
 * The single public-catalog source used by package export generation, docs
 * navigation, implementation badges, and parity tests.
 */
export const componentCatalog = [
  stable(
    'Accordion',
    'accordion',
    'native',
    'native',
    'Exclusive disclosure built on details[name].',
  ),
  stable('Alert', 'alert', 'native', 'native', 'Semantic status message.'),
  stable('AlertDialog', 'alert-dialog', 'enhanced', 'bridge', 'Modal confirmation dialog.'),
  stable('AspectRatio', 'aspect-ratio', 'native', 'native', 'Ratio-preserving content frame.'),
  stable('Avatar', 'avatar', 'native', 'native', 'Image and text fallback avatar.'),
  stable('Badge', 'badge', 'native', 'native', 'Compact status label.'),
  stable('Breadcrumb', 'breadcrumb', 'native', 'native', 'Semantic breadcrumb navigation.'),
  stable('Button', 'button', 'native', 'native', 'Styled native button including icon sizes.'),
  stable(
    'ButtonGroup',
    'button-group',
    'enhanced',
    'bridge',
    'Grouped toolbar and equal-width action layouts.',
  ),
  stable('Calendar', 'calendar', 'client', 'none', 'Intl-backed calendar grid.'),
  stable('Card', 'card', 'native', 'native', 'Composed content surface.'),
  stable(
    'Carousel',
    'carousel',
    'enhanced',
    'native',
    'Scroll-snap carousel with progressive controls.',
  ),
  stable('Checkbox', 'checkbox', 'native', 'native', 'Styled native checkbox.'),
  stable(
    'Collapsible',
    'collapsible',
    'native',
    'native',
    'Disclosure built on details and summary.',
  ),
  stable('Combobox', 'combobox', 'client', 'none', 'Filterable input with a popover listbox.'),
  stable('Command', 'command', 'client', 'none', 'Filterable command collection.'),
  stable(
    'ContextMenu',
    'context-menu',
    'enhanced',
    'bridge',
    'Popover menu opened from a context gesture.',
  ),
  stable(
    'DatePicker',
    'date-picker',
    'native',
    'native',
    'Styled native date input with an optional deferred calendar enhancement.',
  ),
  stable('Dialog', 'dialog', 'enhanced', 'bridge', 'Native dialog with an opt-in legacy invoker bridge.'),
  stable(
    'Direction',
    'direction',
    'native',
    'native',
    'Direction boundary using the dir attribute.',
  ),
  stable('Drawer', 'drawer', 'enhanced', 'bridge', 'Edge-aligned native dialog.'),
  stable(
    'DropdownMenu',
    'dropdown-menu',
    'enhanced',
    'bridge',
    'Popover menu with focusgroup navigation.',
  ),
  stable('Empty', 'empty', 'native', 'native', 'Empty-state content composition.'),
  stable('Field', 'field', 'native', 'native', 'Label, description, and validation composition.'),
  stable(
    'HoverCard',
    'hover-card',
    'enhanced',
    'bridge',
    'Interest-triggered interactive hint popover.',
  ),
  stable('Input', 'input', 'native', 'native', 'Styled native input.'),
  stable('InputGroup', 'input-group', 'native', 'native', 'Input adornment composition.'),
  stable('InputOTP', 'input-otp', 'native', 'native', 'Native one-time-code input.'),
  stable('Item', 'item', 'native', 'native', 'Reusable content row composition.'),
  stable('Kbd', 'kbd', 'native', 'native', 'Keyboard-key label.'),
  stable('Label', 'label', 'native', 'native', 'Styled native label.'),
  stable('Menubar', 'menubar', 'enhanced', 'bridge', 'Horizontal native-first menu group.'),
  stable(
    'NavigationMenu',
    'navigation-menu',
    'enhanced',
    'layout',
    'Navigation with optional popover panels.',
  ),
  stable('Popover', 'popover', 'enhanced', 'layout', 'Declarative Popover API composition.'),
  stable('Progress', 'progress', 'native', 'native', 'Styled native progress element.'),
  stable('RadioGroup', 'radio-group', 'native', 'native', 'Native radio fieldset.'),
  stable('Resizable', 'resizable', 'client', 'none', 'Keyboard-accessible split pane.'),
  stable(
    'ScrollArea',
    'scroll-area',
    'native',
    'native',
    'Overflow region with tokenized scrollbars.',
  ),
  stable('Select', 'select', 'enhanced', 'native', 'Native select with customizable-select CSS.'),
  stable('Separator', 'separator', 'native', 'native', 'Semantic content separator.'),
  stable('Sheet', 'sheet', 'enhanced', 'bridge', 'Side-aligned native dialog.'),
  stable('Sidebar', 'sidebar', 'enhanced', 'native', 'Responsive application sidebar.'),
  stable('Skeleton', 'skeleton', 'native', 'native', 'Reduced-motion-aware loading placeholder.'),
  stable('Slider', 'slider', 'native', 'native', 'Native range input composition.'),
  stable('Spinner', 'spinner', 'native', 'native', 'Reduced-motion-aware progress indicator.'),
  stable('Switch', 'switch', 'native', 'native', 'Styled native checkbox switch.'),
  stable('Table', 'table', 'native', 'native', 'Styled semantic table parts.'),
  stable(
    'Tabs',
    'tabs',
    'client',
    'none',
    'Keyboard tab controller with deferred-panel support.',
  ),
  stable('Textarea', 'textarea', 'native', 'native', 'Styled native textarea.'),
  stable('Toast', 'toast', 'client', 'none', 'Announced transient notification queue.'),
  stable('Toggle', 'toggle', 'native', 'native', 'Native pressed button.'),
  stable('ToggleGroup', 'toggle-group', 'enhanced', 'bridge', 'Grouped pressed buttons.'),
  stable('Tooltip', 'tooltip', 'enhanced', 'bridge', 'Non-interactive hint popover.'),
  stable('Typography', 'typography', 'native', 'native', 'Tokenized text elements.'),

  experimental('ColorArea', 'color-area', 'native', 'native', 'Native color input with area styling.'),
  experimental('ColorField', 'color-field', 'native', 'native', 'Native color input.'),
  experimental('ColorPicker', 'color-picker', 'native', 'native', 'Native color picker.'),
  experimental('ColorSlider', 'color-slider', 'native', 'native', 'Native color-channel slider.'),
  experimental('ColorSwatch', 'color-swatch', 'native', 'native', 'Semantic color sample.'),
  experimental(
    'ColorSwatchPicker',
    'color-swatch-picker',
    'native',
    'native',
    'Native color radio collection.',
  ),
  experimental('ColorWheel', 'color-wheel', 'native', 'native', 'Native color input with wheel styling.'),
  experimental('DateField', 'date-field', 'native', 'native', 'Native date input.'),
  experimental(
    'DateRangePicker',
    'date-range-picker',
    'native',
    'native',
    'Native date-range fieldset.',
  ),
  experimental('EditableText', 'editable-text', 'native', 'native', 'Native text input or textarea.'),
  experimental('FileDropZone', 'file-drop-zone', 'native', 'native', 'Native file input target.'),
  experimental('ImageCropper', 'image-cropper', 'native', 'native', 'Accessible image crop preview.'),
  experimental(
    'RangeCalendar',
    'range-calendar',
    'native',
    'native',
    'Native date-range fieldset.',
  ),
  experimental('TagGroup', 'tag-group', 'native', 'native', 'Semantic tag list.'),
  experimental('TimeField', 'time-field', 'native', 'native', 'Native time input.'),
  experimental('Tree', 'tree', 'native', 'native', 'Nested native disclosure list.'),
] as const satisfies readonly CatalogEntry[]

export const stableCatalog = componentCatalog.filter((entry) => entry.status === 'stable')
export const experimentalCatalog = componentCatalog.filter(
  (entry) => entry.status === 'experimental',
)

export type ComponentExport = (typeof componentCatalog)[number]['export']
