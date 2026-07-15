import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { componentCatalog } from '@stylextras/ui/catalog'
import componentPropsJson from '@/generated/component-props.json'
import componentSizesJson from '@/generated/component-sizes.json'
import { vars } from '@/theming/vars.stylex'

type PropRow = {
  default?: string
  description?: string
  name: string
  required: boolean
  type: string
}

type PartReference = {
  inherited: string[]
  name: string
  native: string[]
  props: PropRow[]
  typeName: string
}

type GeneratedReference = Record<string, { parts: PartReference[] }>
type GeneratedSizes = Record<string, { budgetBytes: number; gzipBytes: number }>

const componentProps = componentPropsJson as GeneratedReference
const componentSizes = componentSizesJson as GeneratedSizes

const modeCopy = {
  native:
    'No behavior JavaScript. State, forms, focus, validation, and keyboard behavior remain native.',
  enhanced:
    'Native browser behavior is the foundation; newer presentation and interaction APIs are progressively enhanced.',
  client:
    'A focused client controller supplies composite-widget state while native elements retain form and focus semantics.',
} as const

const fallbackCopy = {
  native:
    "Unsupported presentation features fall back to the browser's native control without changing its semantics.",
  layout:
    'Unsupported anchor placement uses a simpler, usable fixed layout. No large positioning polyfill is loaded.',
  bridge:
    'A small feature-detected bridge is loaded only when the browser lacks the narrowly scoped interaction API.',
  none: 'This composite requires its small client controller; it has no platform polyfill.',
} as const

export function CatalogEntry({ exportPath }: { exportPath: string }) {
  const entry = componentCatalog.find((item) => item.export === exportPath)
  if (!entry) {
    return <p>Unknown catalog entry: {exportPath}</p>
  }

  const reference = componentProps[exportPath]
  const size = componentSizes[exportPath]
  const packagePath = `@stylextras/ui/${entry.export}`
  const importNames = reference?.parts.map((part) => part.name) ?? [entry.name]

  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.badges)} aria-label="Implementation status">
        <Badge tone={entry.status === 'experimental' ? 'warning' : 'stable'}>{entry.status}</Badge>
        <Badge>{entry.mode === 'client' ? 'client JS' : entry.mode}</Badge>
        <Badge>{entry.fallback} fallback</Badge>
        {size ? <Badge>{(size.gzipBytes / 1024).toFixed(2)} KB gzip</Badge> : null}
      </div>

      <section {...stylex.props(styles.behaviorGrid)}>
        <Info title="Implementation">{modeCopy[entry.mode]}</Info>
        <Info title="Fallback">{fallbackCopy[entry.fallback]}</Info>
      </section>

      {entry.status === 'experimental' ? (
        <aside {...stylex.props(styles.experimental)}>
          This entrypoint is namespaced under <code>{packagePath}</code>. Its API, accessibility
          behavior, and bundle budget can change before graduation.
        </aside>
      ) : null}

      <section>
        <h2 {...stylex.props(styles.sectionTitle)}>Import</h2>
        <pre {...stylex.props(styles.code)}>
          <code>{`import { ${importNames.join(', ')} } from "${packagePath}";`}</code>
        </pre>
      </section>

      <section>
        <h2 {...stylex.props(styles.sectionTitle)}>Anatomy</h2>
        {reference?.parts.length ? (
          <ul {...stylex.props(styles.anatomy)}>
            {reference.parts.map((part) => (
              <li
                key={part.typeName}
                data-docs-anatomy-part={part.typeName}
                {...stylex.props(styles.anatomyItem)}
              >
                <code>{part.name}</code>
                <span {...stylex.props(styles.anatomyCopy)}>
                  {part.native.length
                    ? `Styled native ${part.native.map((element) => `<${element}>`).join(' or ')}.`
                    : 'Styled compound component part.'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p {...stylex.props(styles.muted)}>No public component parts were found.</p>
        )}
      </section>

      <section>
        <h2 {...stylex.props(styles.sectionTitle)}>Accessibility and native behavior</h2>
        <p {...stylex.props(styles.paragraph)}>
          Every part renders and styles its real native element, forwards a React 19 ref, extends
          that element&apos;s native props, omits <code>className</code> and inline{' '}
          <code>style</code>, and composes <code>sx</code> last.
        </p>
        <p {...stylex.props(styles.paragraph, styles.followingParagraph)}>
          {modeCopy[entry.mode]} {fallbackCopy[entry.fallback]}
        </p>
      </section>

      <section>
        <h2 {...stylex.props(styles.sectionTitle)}>API reference</h2>
        {reference?.parts.length ? (
          <div {...stylex.props(styles.parts)}>
            {reference.parts.map((part) => (
              <PartTable key={part.typeName} part={part} />
            ))}
          </div>
        ) : (
          <p {...stylex.props(styles.muted)}>No public prop types were found.</p>
        )}
      </section>
    </div>
  )
}

function Info({ children, title }: { children: string; title: string }) {
  return (
    <div {...stylex.props(styles.info)}>
      <h2 {...stylex.props(styles.infoTitle)}>{title}</h2>
      <p {...stylex.props(styles.infoCopy)}>{children}</p>
    </div>
  )
}

function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'stable' | 'warning'
}) {
  return (
    <span
      {...stylex.props(
        styles.badge,
        tone === 'stable' && styles.badgeStable,
        tone === 'warning' && styles.badgeWarning,
      )}
    >
      {children}
    </span>
  )
}

function PartTable({ part }: { part: PartReference }) {
  const capability = [
    ...part.native.map((element) => `<${element}> props`),
    ...part.inherited.map((typeName) => typeName),
  ]

  return (
    <article data-docs-api-part={part.typeName} {...stylex.props(styles.part)}>
      <div {...stylex.props(styles.partHeading)}>
        <h3 {...stylex.props(styles.partTitle)}>{part.name}</h3>
        <code {...stylex.props(styles.typeName)}>{part.typeName}</code>
      </div>
      {capability.length ? (
        <p {...stylex.props(styles.nativeProps)}>
          Includes {capability.join(' and ')} in addition to the props below.
        </p>
      ) : null}
      {part.props.length ? (
        <div {...stylex.props(styles.tableScroller)}>
          <table {...stylex.props(styles.table)}>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Required</th>
              </tr>
            </thead>
            <tbody>
              {part.props.map((prop) => (
                <tr key={prop.name} data-docs-prop={prop.name}>
                  <td>
                    <code>{prop.name}</code>
                    {prop.description ? (
                      <span {...stylex.props(styles.propDescription)}>{prop.description}</span>
                    ) : null}
                  </td>
                  <td>
                    <code {...stylex.props(styles.typeValue)}>{prop.type}</code>
                  </td>
                  <td>{prop.default ? <code>{prop.default}</code> : '—'}</td>
                  <td>{prop.required ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p {...stylex.props(styles.muted)}>No component-specific props.</p>
      )}
    </article>
  )
}

const styles = stylex.create({
  root: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    rowGap: 28,
    columnGap: 28,
    minWidth: 0,
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: 8,
    columnGap: 8,
  },
  badge: {
    paddingBlock: 6,
    paddingInline: 9,
    fontFamily: 'var(--default-mono-font-family)',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1,
    color: vars['--color-fd-muted-foreground'],
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    backgroundColor: vars['--color-fd-muted'],
    borderColor: vars['--color-fd-border'],
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 999,
  },
  badgeStable: {
    color: 'light-dark(oklch(36% 0.12 150), oklch(88% 0.09 150))',
    backgroundColor: 'light-dark(oklch(96% 0.04 150), oklch(24% 0.05 150))',
    borderColor: 'light-dark(oklch(78% 0.12 150), oklch(45% 0.1 150))',
  },
  badgeWarning: {
    color: 'light-dark(oklch(40% 0.12 70), oklch(90% 0.1 80))',
    backgroundColor: 'light-dark(oklch(97% 0.04 80), oklch(25% 0.05 80))',
    borderColor: 'light-dark(oklch(82% 0.12 80), oklch(48% 0.1 80))',
  },
  behaviorGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 720px)': 'repeat(2, minmax(0, 1fr))',
    },
    rowGap: 12,
    columnGap: 12,
    minWidth: 0,
  },
  info: {
    display: 'grid',
    rowGap: 7,
    columnGap: 7,
    padding: 16,
    backgroundColor: `color-mix(in oklab, ${vars['--color-fd-background']} 92%, ${vars['--color-fd-muted']})`,
    borderColor: vars['--color-fd-border'],
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
  },
  infoTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 650,
    color: vars['--color-fd-foreground'],
  },
  infoCopy: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.55,
    color: vars['--color-fd-muted-foreground'],
  },
  experimental: {
    padding: 16,
    fontSize: 14,
    lineHeight: 1.55,
    color: vars['--color-fd-foreground'],
    backgroundColor: 'light-dark(oklch(98% 0.025 80), oklch(20% 0.025 80))',
    borderColor: 'light-dark(oklch(84% 0.08 80), oklch(42% 0.07 80))',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
  },
  sectionTitle: {
    marginBlockStart: '0',
    marginBlockEnd: '12px',
    fontSize: 20,
    fontWeight: 650,
    lineHeight: 1.3,
    color: vars['--color-fd-foreground'],
  },
  paragraph: {
    margin: 0,
    lineHeight: 1.65,
    color: vars['--color-fd-muted-foreground'],
  },
  followingParagraph: {
    marginBlockStart: 10,
  },
  anatomy: {
    display: 'grid',
    rowGap: 8,
    columnGap: 8,
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
  anatomyItem: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 720px)': 'minmax(9rem, max-content) minmax(0, 1fr)',
    },
    rowGap: 8,
    columnGap: 8,
    alignItems: 'baseline',
  },
  anatomyCopy: {
    fontSize: 14,
    color: vars['--color-fd-muted-foreground'],
  },
  code: {
    minWidth: 0,
    padding: 16,
    margin: 0,
    overflowX: 'auto',
    fontFamily: 'var(--default-mono-font-family)',
    fontSize: 13,
    lineHeight: 1.6,
    color: vars['--color-fd-foreground'],
    backgroundColor: vars['--color-fd-muted'],
    borderColor: vars['--color-fd-border'],
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
  },
  parts: {
    display: 'grid',
    rowGap: 18,
    columnGap: 18,
    minWidth: 0,
  },
  part: {
    minWidth: 0,
    paddingBlockStart: 18,
    borderBlockStartColor: vars['--color-fd-border'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
  },
  partHeading: {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: 8,
    columnGap: 8,
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  partTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 650,
    color: vars['--color-fd-foreground'],
  },
  typeName: {
    fontSize: 12,
    color: vars['--color-fd-muted-foreground'],
  },
  nativeProps: {
    marginBlockStart: '6px',
    marginBlockEnd: '12px',
    fontSize: 13,
    color: vars['--color-fd-muted-foreground'],
  },
  tableScroller: {
    width: '100%',
    minWidth: 0,
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    minWidth: 520,
    fontSize: 13,
    borderCollapse: 'collapse',
  },
  propDescription: {
    display: 'block',
    maxWidth: 320,
    marginBlockStart: 4,
    fontSize: 12,
    lineHeight: 1.45,
    color: vars['--color-fd-muted-foreground'],
  },
  typeValue: {
    overflowWrap: 'anywhere',
    whiteSpace: 'normal',
  },
  muted: {
    margin: 0,
    fontSize: 14,
    color: vars['--color-fd-muted-foreground'],
  },
})
