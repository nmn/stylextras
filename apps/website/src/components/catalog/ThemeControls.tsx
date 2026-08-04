'use client'

import * as stylex from '@stylexjs/stylex'
import { blurThemes } from '@stylextras/ui/blur-themes'
import { colorThemes } from '@stylextras/ui/color-themes'
import { elevationThemes } from '@stylextras/ui/elevation-themes'
import { motionThemes } from '@stylextras/ui/motion-themes'
import { radiusThemes } from '@stylextras/ui/radius-themes'
import { Select } from '@stylextras/ui/select'
import { spacingThemes } from '@stylextras/ui/spacing-themes'
import { strokeThemes } from '@stylextras/ui/stroke-themes'
import { colors } from '@stylextras/ui/tokens/color.stylex'
import { radius } from '@stylextras/ui/tokens/radius.stylex'
import { spacing } from '@stylextras/ui/tokens/spacing.stylex'
import { typography } from '@stylextras/ui/tokens/typography.stylex'
import { typographyThemes } from '@stylextras/ui/typography-themes'
import type { ChangeEvent } from 'react'
import { useWebsiteTheme } from '@/contexts/WebsiteThemeContext'
import {
  type WebsiteAppearance,
  type WebsiteStyleName,
  type WebsiteThemeAxes,
  websiteStylePresets,
} from './theme-config'

const appearanceNames = ['system', 'light', 'dark'] as const
const styleNames = Object.keys(websiteStylePresets) as WebsiteStyleName[]
const colorThemeNames = Object.keys(colorThemes) as (keyof typeof colorThemes)[]
const spacingThemeNames = Object.keys(spacingThemes) as (keyof typeof spacingThemes)[]
const radiusThemeNames = Object.keys(radiusThemes) as (keyof typeof radiusThemes)[]
const strokeThemeNames = Object.keys(strokeThemes) as (keyof typeof strokeThemes)[]
const typographyThemeNames = Object.keys(typographyThemes) as (keyof typeof typographyThemes)[]
const elevationThemeNames = Object.keys(elevationThemes) as (keyof typeof elevationThemes)[]
const blurThemeNames = Object.keys(blurThemes) as (keyof typeof blurThemes)[]
const motionThemeNames = Object.keys(motionThemes) as (keyof typeof motionThemes)[]

export function ThemeControls() {
  const { appearance, axes, setAppearance, setAxis, setStyle, styleName } = useWebsiteTheme()
  const presetDescription =
    styleName === 'custom'
      ? 'A custom mix of variable groups.'
      : websiteStylePresets[styleName].description

  return (
    <fieldset {...stylex.props(styles.fieldset)}>
      <legend {...stylex.props(styles.srOnly)}>Website theme settings</legend>

      <div {...stylex.props(styles.primaryGrid)}>
        <ThemeSelect
          label="Style preset"
          options={styleName === 'custom' ? [...styleNames, 'custom'] : styleNames}
          value={styleName}
          onChange={(event) => {
            const value = event.currentTarget.value
            if (value !== 'custom') setStyle(value as WebsiteStyleName)
          }}
        />
        <ThemeSelect
          label="Appearance"
          options={appearanceNames}
          value={appearance}
          onChange={(event) => setAppearance(event.currentTarget.value as WebsiteAppearance)}
        />
      </div>

      <p {...stylex.props(styles.presetDescription)}>{presetDescription}</p>

      <div {...stylex.props(styles.sectionHeading)}>
        <span>Variable groups</span>
        <span {...stylex.props(styles.sectionHint)}>Applied site-wide</span>
      </div>

      <div {...stylex.props(styles.grid)}>
        <AxisSelect
          axis="color"
          label="Color theme"
          options={colorThemeNames}
          value={axes.color}
          onChange={setAxis}
        />
        <AxisSelect
          axis="spacing"
          label="Spacing theme"
          options={spacingThemeNames}
          value={axes.spacing}
          onChange={setAxis}
        />
        <AxisSelect
          axis="radius"
          label="Radius theme"
          options={radiusThemeNames}
          value={axes.radius}
          onChange={setAxis}
        />
        <AxisSelect
          axis="typography"
          label="Typography theme"
          options={typographyThemeNames}
          value={axes.typography}
          onChange={setAxis}
        />
        <AxisSelect
          axis="stroke"
          label="Stroke theme"
          options={strokeThemeNames}
          value={axes.stroke}
          onChange={setAxis}
        />
        <AxisSelect
          axis="elevation"
          label="Elevation theme"
          options={elevationThemeNames}
          value={axes.elevation}
          onChange={setAxis}
        />
        <AxisSelect
          axis="blur"
          label="Blur theme"
          options={blurThemeNames}
          value={axes.blur}
          onChange={setAxis}
        />
        <AxisSelect
          axis="motion"
          label="Motion theme"
          options={motionThemeNames}
          value={axes.motion}
          onChange={setAxis}
        />
      </div>
    </fieldset>
  )
}

function AxisSelect<Key extends keyof WebsiteThemeAxes>({
  axis,
  label,
  onChange,
  options,
  value,
}: {
  axis: Key
  label: string
  onChange: <Axis extends keyof WebsiteThemeAxes>(axis: Axis, value: WebsiteThemeAxes[Axis]) => void
  options: readonly WebsiteThemeAxes[Key][]
  value: WebsiteThemeAxes[Key]
}) {
  return (
    <ThemeSelect
      label={label}
      options={options}
      value={value}
      onChange={(event) => onChange(axis, event.currentTarget.value as WebsiteThemeAxes[Key])}
    />
  )
}

function ThemeSelect<Name extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  options: readonly Name[]
  value: Name
}) {
  return (
    <label {...stylex.props(styles.control)}>
      <span {...stylex.props(styles.controlLabel)}>{label}</span>
      <Select value={value} onChange={onChange} sx={styles.select}>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </Select>
    </label>
  )
}

function formatOption(option: string) {
  const words = option.replaceAll('-', ' ')
  return `${words.charAt(0).toLocaleUpperCase()}${words.slice(1)}`
}

const styles = stylex.create({
  fieldset: {
    border: 0,
    margin: 0,
    minWidth: 0,
    padding: 0,
  },
  srOnly: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  primaryGrid: {
    display: 'grid',
    gap: spacing.sm,
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  presetDescription: {
    color: colors.fgMuted,
    fontSize: typography.stepMinus2,
    lineHeight: typography.lineHeightBody,
    marginBlock: `${spacing.xs} ${spacing.md}`,
  },
  sectionHeading: {
    alignItems: 'baseline',
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    color: colors.fg,
    display: 'flex',
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightSemibold,
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBlockEnd: spacing.sm,
    paddingBlockStart: spacing.md,
  },
  sectionHint: {
    color: colors.fgMuted,
    fontSize: typography.stepMinus2,
    fontWeight: typography.weightRegular,
  },
  grid: {
    display: 'grid',
    gap: spacing.sm,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 420px)': 'repeat(2, minmax(0, 1fr))',
    },
  },
  control: {
    display: 'grid',
    gap: spacing.xxxs,
    minWidth: 0,
  },
  controlLabel: {
    color: colors.fgMuted,
    fontSize: typography.stepMinus2,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
  },
  select: {
    borderRadius: radius.sm,
    minWidth: 0,
    width: '100%',
  },
})
