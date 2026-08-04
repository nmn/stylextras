import * as stylex from '@stylexjs/stylex';
import { Badge } from '@stylextras/ui/badge';
import { blurThemes } from '@stylextras/ui/blur-themes';
import { Button } from '@stylextras/ui/button';
import { type ColorThemeName, colorThemes } from '@stylextras/ui/color-themes';
import { elevationThemes } from '@stylextras/ui/elevation-themes';
import { Input } from '@stylextras/ui/input';
import { motionThemes } from '@stylextras/ui/motion-themes';
import { radiusThemes } from '@stylextras/ui/radius-themes';
import { spacingThemes } from '@stylextras/ui/spacing-themes';
import { strokeThemes } from '@stylextras/ui/stroke-themes';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { elevation } from '@stylextras/ui/tokens/elevation.stylex';
import { radius } from '@stylextras/ui/tokens/radius.stylex';
import { spacing } from '@stylextras/ui/tokens/spacing.stylex';
import { stroke } from '@stylextras/ui/tokens/stroke.stylex';
import { typography } from '@stylextras/ui/tokens/typography.stylex';
import { typographyThemes } from '@stylextras/ui/typography-themes';
import { type WebsiteStyleName, websiteStylePresets } from './theme-config';

const themeNames = Object.keys(colorThemes) as ColorThemeName[];
const styleNames = Object.keys(websiteStylePresets) as WebsiteStyleName[];

export function ThemeGallery() {
  return (
    <div {...stylex.props(styles.root)}>
      <section
        aria-labelledby="style-presets-title"
        {...stylex.props(styles.section)}
      >
        <div {...stylex.props(styles.sectionHeading)}>
          <h2 id="style-presets-title" {...stylex.props(styles.sectionTitle)}>
            Style presets
          </h2>
          <p {...stylex.props(styles.intro)}>
            {styleNames.length} coordinated presets apply all eight theme axes
            together. Every variable group can still be changed independently
            from the header theme dialog.
          </p>
        </div>
        <div {...stylex.props(styles.styleGrid)}>
          {styleNames.flatMap((name) =>
            (['light', 'dark'] as const).map((appearance) => (
              <StyleTile
                appearance={appearance}
                key={`${name}-${appearance}`}
                name={name}
              />
            )),
          )}
        </div>
      </section>

      <section
        {...stylex.props(styles.section)}
        aria-labelledby="color-themes-title"
      >
        <div {...stylex.props(styles.sectionHeading)}>
          <h2 {...stylex.props(styles.sectionTitle)} id="color-themes-title">
            Color themes
          </h2>
          <p {...stylex.props(styles.intro)}>
            All {themeNames.length} color themes are ordinary StyleX theme
            objects. Each tile applies one directly with{' '}
            <code>stylex.props()</code>; accent palettes tint every surface, and
            dark layers rise lighter as they nest. Light and dark are shown side
            by side without a provider or theme context.
          </p>
        </div>
        <div {...stylex.props(styles.grid)}>
          {themeNames.flatMap((name) =>
            (['light', 'dark'] as const).map((appearance) => (
              <ThemeTile
                appearance={appearance}
                key={`${name}-${appearance}`}
                name={name}
              />
            )),
          )}
        </div>
      </section>
    </div>
  );
}

function StyleTile({
  appearance,
  name,
}: {
  appearance: 'light' | 'dark';
  name: WebsiteStyleName;
}) {
  const preset = websiteStylePresets[name];
  const displayName = `${name[0]!.toUpperCase()}${name.slice(1)}`;
  return (
    <section
      aria-label={`${displayName} ${appearance} style preset`}
      {...stylex.props(
        colorThemes.neutral,
        colorThemes[preset.color],
        spacingThemes[preset.spacing],
        radiusThemes[preset.radius],
        strokeThemes[preset.stroke],
        typographyThemes[preset.typography],
        elevationThemes[preset.elevation],
        blurThemes[preset.blur],
        motionThemes[preset.motion],
        styles.tile,
        styles.styleTile,
        appearance === 'light' ? styles.light : styles.dark,
      )}
    >
      <header {...stylex.props(styles.header)}>
        <div>
          <h3 {...stylex.props(styles.title)}>{displayName}</h3>
          <p {...stylex.props(styles.appearance)}>
            {appearance} · {preset.spacing} · {preset.radius} ·{' '}
            {preset.typography}
          </p>
        </div>
        <Badge variant="neutral">Aa</Badge>
      </header>
      <p {...stylex.props(styles.presetDescription)}>{preset.description}</p>
      <Input
        aria-label={`${displayName} sample input`}
        placeholder="Project name"
      />
      <div {...stylex.props(styles.actions)}>
        <Button size="sm">Create</Button>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
      </div>
    </section>
  );
}

function ThemeTile({
  appearance,
  name,
}: {
  appearance: 'light' | 'dark';
  name: ColorThemeName;
}) {
  const displayName = `${name[0]!.toUpperCase()}${name.slice(1)}`;
  return (
    <section
      aria-label={`${displayName} ${appearance} theme`}
      {...stylex.props(
        colorThemes.neutral,
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
        role="group"
        {...stylex.props(styles.depthSurface)}
      >
        <span {...stylex.props(styles.depthLabel)}>Surface</span>
        <div {...stylex.props(styles.depthRaised)}>
          <span {...stylex.props(styles.depthLabel)}>Raised</span>
          <span {...stylex.props(styles.depthOverlay)}>Overlay</span>
        </div>
      </div>
      <Input
        aria-label={`${displayName} sample input`}
        placeholder="Search projects…"
      />
      <div {...stylex.props(styles.actions)}>
        <Button size="sm">Create</Button>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
      </div>
    </section>
  );
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
    margin: 0,
    fontSize: 20,
    lineHeight: 1.25,
    color: 'inherit',
  },
  intro: {
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 680px)': 'repeat(2, minmax(0, 1fr))',
    },
    gap: spacing.md,
  },
  styleGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 680px)': 'repeat(2, minmax(0, 1fr))',
    },
    gap: spacing.md,
  },
  tile: {
    display: 'grid',
    gap: spacing.md,
    minWidth: 0,
    padding: spacing.lg,
    fontFamily: typography.fontSans,
    color: colors.fg,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.lg,
    boxShadow: elevation.sm,
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
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.2,
    color: 'inherit',
  },
  appearance: {
    marginBlockStart: '4px',
    marginBlockEnd: '0',
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    color: colors.fgMuted,
    textTransform: 'uppercase',
  },
  presetDescription: {
    margin: 0,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
    color: colors.fgMuted,
  },
  swatches: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: spacing.xs,
  },
  depthSurface: {
    display: 'grid',
    gap: spacing.xs,
    padding: spacing.xs,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.md,
  },
  depthRaised: {
    display: 'flex',
    gap: spacing.xs,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xs,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.sm,
  },
  depthOverlay: {
    padding: spacing.xs,
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    lineHeight: 1,
    color: colors.fg,
    textTransform: 'uppercase',
    backgroundColor: colors.popover,
    borderColor: colors.borderStrong,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.xs,
  },
  depthLabel: {
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    lineHeight: 1,
    color: colors.fgSoft,
    textTransform: 'uppercase',
  },
  actions: {
    display: 'flex',
    gap: spacing.sm,
  },
});
