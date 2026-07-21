import * as stylex from '@stylexjs/stylex'
import { Badge } from '@stylextras/ui/badge'
import { blurThemes } from '@stylextras/ui/blur-themes'
import { Button } from '@stylextras/ui/button'
import { type ColorThemeName, colorThemes } from '@stylextras/ui/color-themes'
import { elevationThemes } from '@stylextras/ui/elevation-themes'
import { Input } from '@stylextras/ui/input'
import { motionThemes } from '@stylextras/ui/motion-themes'
import { radiusThemes } from '@stylextras/ui/radius-themes'
import { spacingThemes } from '@stylextras/ui/spacing-themes'
import { strokeThemes } from '@stylextras/ui/stroke-themes'
import { colors } from '@stylextras/ui/tokens/color.stylex'
import { elevation } from '@stylextras/ui/tokens/elevation.stylex'
import { radius } from '@stylextras/ui/tokens/radius.stylex'
import { spacing } from '@stylextras/ui/tokens/spacing.stylex'
import { stroke } from '@stylextras/ui/tokens/stroke.stylex'
import { typography } from '@stylextras/ui/tokens/typography.stylex'
import { typographyThemes } from '@stylextras/ui/typography-themes'
import { type PreviewStyleName, previewStylePresets } from './preview-theme-config'

const themeNames = Object.keys(colorThemes) as ColorThemeName[]
const styleNames = Object.keys(previewStylePresets) as PreviewStyleName[]

export function ThemeGallery() {
  return (
    <div data-testid="theme-gallery" {...stylex.props(styles.root)}>
      <section {...stylex.props(styles.section)}>
        <div {...stylex.props(styles.sectionHeading)}>
          <h2 {...stylex.props(styles.sectionTitle)}>Style presets</h2>
          <p {...stylex.props(styles.intro)}>
            {styleNames.length} distinctly composed starting points apply the structural theme
            groups together; Docs also starts with the site’s color palette. Every selector below
            can still be changed independently.
          </p>
        </div>
        <div data-testid="style-gallery" {...stylex.props(styles.styleGrid)}>
          {styleNames.map((name) => (
            <StyleTile key={name} name={name} />
          ))}
        </div>
      </section>

      <section {...stylex.props(styles.section)}>
        <div {...stylex.props(styles.sectionHeading)}>
          <h2 {...stylex.props(styles.sectionTitle)}>Color themes</h2>
          <p {...stylex.props(styles.intro)}>
            All {themeNames.length} color themes are ordinary StyleX theme objects. Each tile
            applies one directly with <code>stylex.props()</code>; accent palettes tint every
            surface, and dark layers rise lighter as they nest. Light and dark are shown side by
            side without a provider or theme context.
          </p>
        </div>
        <div {...stylex.props(styles.grid)}>
          {themeNames.flatMap((name) =>
            (['light', 'dark'] as const).map((appearance) => (
              <ThemeTile appearance={appearance} key={`${name}-${appearance}`} name={name} />
            )),
          )}
        </div>
      </section>
    </div>
  )
}

function StyleTile({ name }: { name: PreviewStyleName }) {
  const preset = previewStylePresets[name]
  const displayName = `${name[0]!.toUpperCase()}${name.slice(1)}`
  return (
    <section
      aria-label={`${displayName} style preset`}
      {...stylex.props(
        colorThemes[preset.color ?? 'neutral'],
        spacingThemes[preset.spacing],
        radiusThemes[preset.radius],
        strokeThemes[preset.stroke],
        typographyThemes[preset.typography],
        elevationThemes[preset.elevation],
        blurThemes[preset.blur],
        motionThemes[preset.motion],
        styles.tile,
        styles.styleTile,
        styles.light,
      )}
    >
      <header {...stylex.props(styles.header)}>
        <div>
          <h3 {...stylex.props(styles.title)}>{displayName}</h3>
          <p {...stylex.props(styles.appearance)}>
            {preset.spacing} · {preset.radius} · {preset.typography}
          </p>
        </div>
        <Badge variant="neutral">Aa</Badge>
      </header>
      <Input aria-label={`${displayName} sample input`} placeholder="Project name" />
      <div {...stylex.props(styles.actions)}>
        <Button size="sm">Create</Button>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
      </div>
    </section>
  )
}

function ThemeTile({
  appearance,
  name,
}: {
  appearance: 'light' | 'dark'
  name: ColorThemeName
}) {
  const displayName = `${name[0]!.toUpperCase()}${name.slice(1)}`
  return (
    <section
      aria-label={`${displayName} ${appearance} theme`}
      {...stylex.props(
        colorThemes[name],
        spacingThemes.compact,
        radiusThemes.rounded,
        strokeThemes.base,
        typographyThemes.ui,
        elevationThemes.soft,
        styles.tile,
        appearance === 'light' ? styles.light : styles.dark,
      )}
    >
      <header {...stylex.props(styles.header)}>
        <div>
          <h3 {...stylex.props(styles.title)}>{displayName}</h3>
          <p {...stylex.props(styles.appearance)}>{appearance}</p>
        </div>
        <Badge variant="neutral">Aa</Badge>
      </header>
      <div {...stylex.props(styles.swatches)} aria-label="Theme status colors">
        <Badge variant="brand">Brand</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="danger">Danger</Badge>
      </div>
      <div
        aria-label={`${displayName} surface depth`}
        data-surface-depth={name}
        {...stylex.props(styles.depthSurface)}
      >
        <span {...stylex.props(styles.depthLabel)}>Surface</span>
        <div {...stylex.props(styles.depthRaised)}>
          <span {...stylex.props(styles.depthLabel)}>Raised</span>
          <span {...stylex.props(styles.depthOverlay)}>Overlay</span>
        </div>
      </div>
      <Input aria-label={`${displayName} sample input`} placeholder="Search projects…" />
      <div {...stylex.props(styles.actions)}>
        <Button size="sm">Create</Button>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
      </div>
    </section>
  )
}

const styles = stylex.create({
  root: {
    display: 'grid',
    gap: spacing.xxxl,
  },
  section: {
    display: 'grid',
    gap: spacing.lg,
  },
  sectionHeading: {
    display: 'grid',
    gap: spacing.xs,
  },
  sectionTitle: {
    color: 'inherit',
    fontSize: 20,
    lineHeight: 1.25,
    margin: 0,
  },
  intro: {
    margin: 0,
  },
  grid: {
    display: 'grid',
    gap: spacing.md,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 680px)': 'repeat(2, minmax(0, 1fr))',
    },
  },
  styleGrid: {
    display: 'grid',
    gap: spacing.md,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 680px)': 'repeat(2, minmax(0, 1fr))',
    },
  },
  tile: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: elevation.sm,
    color: colors.fg,
    display: 'grid',
    fontFamily: typography.fontSans,
    gap: spacing.md,
    minWidth: 0,
    padding: spacing.lg,
  },
  light: {
    colorScheme: 'light',
  },
  dark: {
    colorScheme: 'dark',
  },
  styleTile: {
    alignContent: 'start',
  },
  header: {
    alignItems: 'start',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    color: 'inherit',
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.2,
    margin: 0,
  },
  appearance: {
    color: colors.fgMuted,
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    marginBlock: '4px 0',
    textTransform: 'uppercase',
  },
  swatches: {
    display: 'grid',
    gap: spacing.xs,
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  depthSurface: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    display: 'grid',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  depthRaised: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    display: 'flex',
    gap: spacing.xs,
    justifyContent: 'space-between',
    padding: spacing.xs,
  },
  depthOverlay: {
    backgroundColor: colors.popover,
    borderColor: colors.borderStrong,
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    color: colors.fg,
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    lineHeight: 1,
    padding: spacing.xs,
    textTransform: 'uppercase',
  },
  depthLabel: {
    color: colors.fgSoft,
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  actions: {
    display: 'flex',
    gap: spacing.sm,
  },
})
