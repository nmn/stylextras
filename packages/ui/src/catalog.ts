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

const experimental = (name: string, exportPath: string, description: string): CatalogEntry => ({
  description,
  export: `experimental/${exportPath}`,
  fallback: 'none',
  mode: 'client',
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
    'client',
    'none',
    'Calendar, input, and popover composition.',
  ),
  stable('Dialog', 'dialog', 'enhanced', 'bridge', 'Native dialog with invoker commands.'),
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
  stable('InputOTP', 'input-otp', 'client', 'none', 'One-time-code input controller.'),
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
  stable('Slider', 'slider', 'client', 'none', 'Native range input composition.'),
  stable('Spinner', 'spinner', 'native', 'native', 'Reduced-motion-aware progress indicator.'),
  stable('Switch', 'switch', 'native', 'native', 'Styled native checkbox switch.'),
  stable('Table', 'table', 'native', 'native', 'Styled semantic table parts.'),
  stable(
    'Tabs',
    'tabs',
    'client',
    'bridge',
    'Keyboard tab controller with focusgroup enhancement.',
  ),
  stable('Textarea', 'textarea', 'native', 'native', 'Styled native textarea.'),
  stable('Toast', 'toast', 'client', 'none', 'Announced transient notification queue.'),
  stable('Toggle', 'toggle', 'native', 'native', 'Native pressed button.'),
  stable('ToggleGroup', 'toggle-group', 'enhanced', 'bridge', 'Grouped pressed buttons.'),
  stable('Tooltip', 'tooltip', 'enhanced', 'bridge', 'Non-interactive hint popover.'),
  stable('Typography', 'typography', 'native', 'native', 'Tokenized text elements.'),

  experimental('ColorArea', 'color-area', 'Two-dimensional color input.'),
  experimental('ColorField', 'color-field', 'Editable color value.'),
  experimental('ColorPicker', 'color-picker', 'Composed color editing tool.'),
  experimental('ColorSlider', 'color-slider', 'Color-channel slider.'),
  experimental('ColorSwatch', 'color-swatch', 'Color sample.'),
  experimental('ColorSwatchPicker', 'color-swatch-picker', 'Color sample collection.'),
  experimental('ColorWheel', 'color-wheel', 'Polar color input.'),
  experimental('DateField', 'date-field', 'Segmented date input.'),
  experimental('DateRangePicker', 'date-range-picker', 'Date-range input and calendar.'),
  experimental('EditableText', 'editable-text', 'Inline text editor.'),
  experimental('FileDropZone', 'file-drop-zone', 'Drag-and-drop file target.'),
  experimental('ImageCropper', 'image-cropper', 'Interactive image crop tool.'),
  experimental('RangeCalendar', 'range-calendar', 'Date-range calendar grid.'),
  experimental('TagGroup', 'tag-group', 'Interactive tag collection.'),
  experimental('TimeField', 'time-field', 'Segmented time input.'),
  experimental('Tree', 'tree', 'Hierarchical interactive collection.'),
] as const satisfies readonly CatalogEntry[]

export const stableCatalog = componentCatalog.filter((entry) => entry.status === 'stable')
export const experimentalCatalog = componentCatalog.filter(
  (entry) => entry.status === 'experimental',
)

export type ComponentExport = (typeof componentCatalog)[number]['export']
