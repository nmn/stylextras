import { DocsBody, DocsDescription, DocsPage, DocsTitle } from '@/components/layout/page';
import { Link } from 'fumadocs-core/framework';
import * as stylex from '@stylexjs/stylex';
import { vars } from '@/theming/vars.stylex';

const groups = [
  {
    title: 'Buttons',
    items: [
      ['Button', '/docs/buttons/button'],
      ['Button Group', '/docs/buttons/button-group'],
      ['Icon Button', '/docs/buttons/icon-button'],
      ['Segmented Control', '/docs/buttons/segmented-control'],
      ['Toggle Button', '/docs/buttons/toggle'],
      ['Toggle Button Group', '/docs/buttons/toggle-group'],
    ],
  },
  {
    title: 'Collections',
    items: [
      ['Command Menu', '/docs/collections/command'],
      ['Context Menu', '/docs/collections/context-menu'],
      ['List Box', '/docs/collections/listbox'],
      ['Menu', '/docs/collections/dropdown-menu'],
      ['Menubar', '/docs/collections/menubar'],
      ['Table', '/docs/collections/table'],
      ['Data Table', '/docs/collections/data-table'],
      ['Tag Group', '/docs/collections/tag-group'],
      ['Tree', '/docs/collections/tree'],
    ],
  },
  {
    title: 'Color',
    items: [
      ['Color Area', '/docs/color/color-area'],
      ['Color Field', '/docs/color/color-field'],
      ['Color Picker', '/docs/color/color-picker'],
      ['Color Slider', '/docs/color/color-slider'],
      ['Color Swatch', '/docs/color/color-swatch'],
      ['Color Swatch Picker', '/docs/color/color-swatch-picker'],
      ['Color Wheel', '/docs/color/color-wheel'],
    ],
  },
  {
    title: 'Content',
    items: [
      ['Avatar', '/docs/content/avatar'],
      ['Card', '/docs/content/card'],
      ['Empty State', '/docs/content/empty'],
      ['Flex', '/docs/content/flez'],
      ['Kbd', '/docs/content/kbd'],
      ['Separator', '/docs/content/separator'],
      ['Typography', '/docs/content/typography'],
    ],
  },
  {
    title: 'Date and time',
    items: [
      ['Calendar', '/docs/date-and-time/calendar'],
      ['Date Field', '/docs/date-and-time/date-field'],
      ['Date Picker', '/docs/date-and-time/date-picker'],
      ['Date Range Picker', '/docs/date-and-time/range-date-picker'],
      ['Range Calendar', '/docs/date-and-time/range-calendar'],
      ['Time Field', '/docs/date-and-time/timefield'],
    ],
  },
  {
    title: 'Form',
    items: [
      ['Checkbox', '/docs/form/checkbox'],
      ['Combo Box', '/docs/form/combobox'],
      ['Field Errors', '/docs/form/field-errors'],
      ['File Drop Zone', '/docs/form/file-drop-zone'],
      ['File Trigger', '/docs/form/file-trigger'],
      ['Form', '/docs/form/form'],
      ['Input', '/docs/form/input-fields'],
      ['Input Group', '/docs/form/input-group'],
      ['Label', '/docs/form/label'],
      ['Number Field', '/docs/form/number-field'],
      ['Radio Group', '/docs/form/radio-group'],
      ['Search Field', '/docs/form/search-field'],
      ['Select', '/docs/form/select'],
      ['Slider', '/docs/form/slider'],
      ['Switch', '/docs/form/switch'],
      ['Text Area', '/docs/form/textarea'],
      ['Text Field', '/docs/form/text-field'],
    ],
  },
  {
    title: 'Layout',
    items: [
      ['Grid', '/docs/layout/grid'],
      ['Toolbar', '/docs/layout/toolbar'],
      ['Window Splitter', '/docs/layout/window-splitter'],
    ],
  },
  {
    title: 'Navigation',
    items: [
      ['Breadcrumbs', '/docs/navigation/breadcrumb'],
      ['Disclosure', '/docs/navigation/disclosure'],
      ['Disclosure Group', '/docs/navigation/disclosure-group'],
      ['Link', '/docs/navigation/link'],
      ['Pagination', '/docs/navigation/pagination'],
      ['Sidebar', '/docs/navigation/sidebar'],
      ['Tabs', '/docs/navigation/tabs'],
    ],
  },
  {
    title: 'Overlays',
    items: [
      ['Alert Dialog', '/docs/overlays/alert-dialog'],
      ['Dialog', '/docs/overlays/dialog'],
      ['Drawer', '/docs/overlays/drawer'],
      ['Hover Card', '/docs/overlays/hover-card'],
      ['Popover', '/docs/overlays/popover'],
      ['Tooltip', '/docs/overlays/tooltip'],
    ],
  },
  {
    title: 'Status',
    items: [
      ['Alert', '/docs/status/alert-callout'],
      ['Badge', '/docs/status/badge'],
      ['Meter', '/docs/status/meter'],
      ['Progress Bar', '/docs/status/progress-bar'],
      ['Skeleton', '/docs/status/skeleton'],
      ['Spinner', '/docs/status/spinner'],
      ['Toast', '/docs/status/toast'],
    ],
  },
] as const;

export default function DocsIndexPage() {
  return (
    <DocsPage>
      <title>Docs | StyleX</title>
      <DocsTitle>Components</DocsTitle>
      <DocsDescription>
        Browse the component library from the sidebar or jump into a category below.
      </DocsDescription>
      <DocsBody>
        <div {...stylex.props(styles.grid)}>
          {groups.map((group) => (
            <section key={group.title} {...stylex.props(styles.card)}>
              <h2 {...stylex.props(styles.heading)}>{group.title}</h2>
              <ul {...stylex.props(styles.list)}>
                {group.items.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} {...stylex.props(styles.link)}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DocsBody>
    </DocsPage>
  );
}

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 960px)': 'repeat(2, minmax(0, 1fr))',
    },
    gap: 16,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: vars['--color-fd-border'],
    borderRadius: 12,
    backgroundColor: `color-mix(in oklab, ${vars['--color-fd-background']} 92%, ${vars['--color-fd-muted']})`,
  },
  heading: {
    marginTop: 0,
    marginBottom: 12,
    fontSize: '1.125rem',
    lineHeight: 1.3,
    color: vars['--color-fd-foreground'],
  },
  list: {
    margin: 0,
    paddingLeft: 18,
    display: 'grid',
    gap: 6,
  },
  link: {
    color: vars['--color-fd-primary'],
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
});
