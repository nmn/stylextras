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
import { stroke } from '@stylextras/ui/tokens/stroke.stylex'
import { typography } from '@stylextras/ui/tokens/typography.stylex'
import { typographyThemes } from '@stylextras/ui/typography-themes'
import type { ChangeEvent } from 'react'
import {
  type PreviewAppearance,
  type PreviewStyleName,
  type PreviewStyleSelection,
  type PreviewThemeSelection,
  previewStylePresets,
} from './preview-theme-config'

export type {
  PreviewAppearance,
  PreviewStyleName,
  PreviewStyleSelection,
  PreviewThemeSelection,
} from './preview-theme-config'

type BlurThemeName = keyof typeof blurThemes
type ColorThemeName = keyof typeof colorThemes
type ElevationThemeName = keyof typeof elevationThemes
type MotionThemeName = keyof typeof motionThemes
type RadiusThemeName = keyof typeof radiusThemes
type SpacingThemeName = keyof typeof spacingThemes
type StrokeThemeName = keyof typeof strokeThemes
type TypographyThemeName = keyof typeof typographyThemes

const appearanceNames = ['light', 'dark'] as const
const styleNames = Object.keys(previewStylePresets) as PreviewStyleName[]
const colorThemeNames = Object.keys(colorThemes) as ColorThemeName[]
const spacingThemeNames = Object.keys(spacingThemes) as SpacingThemeName[]
const radiusThemeNames = Object.keys(radiusThemes) as RadiusThemeName[]
const strokeThemeNames = Object.keys(strokeThemes) as StrokeThemeName[]
const typographyThemeNames = Object.keys(typographyThemes) as TypographyThemeName[]
const elevationThemeNames = Object.keys(elevationThemes) as ElevationThemeName[]
const blurThemeNames = Object.keys(blurThemes) as BlurThemeName[]
const motionThemeNames = Object.keys(motionThemes) as MotionThemeName[]

type PreviewThemeControlsProps = {
  onSelectionChange: (key: keyof PreviewThemeSelection, value: string) => void
  onStyleChange: (style: PreviewStyleSelection) => void
  selection: PreviewThemeSelection
  styleName: PreviewStyleSelection
}

export function PreviewThemeControls({
  onSelectionChange,
  onStyleChange,
  selection,
  styleName,
}: PreviewThemeControlsProps) {
  return (
    <fieldset {...stylex.props(styles.fieldset)}>
      <legend {...stylex.props(styles.legend)}>Theme controls</legend>
      <div {...stylex.props(styles.grid)}>
        <ThemeSelect
          label="Style preset"
          options={[...styleNames, 'custom']}
          value={styleName}
          onChange={(event) => onStyleChange(event.currentTarget.value as PreviewStyleSelection)}
        />
        <ThemeSelect
          label="Appearance"
          options={appearanceNames}
          value={selection.appearance}
          onChange={(event) => onSelectionChange('appearance', event.currentTarget.value)}
        />
        <ThemeSelect
          label="Color theme"
          options={colorThemeNames}
          value={selection.color}
          onChange={(event) => onSelectionChange('color', event.currentTarget.value)}
        />
        <ThemeSelect
          label="Spacing theme"
          options={spacingThemeNames}
          value={selection.spacing}
          onChange={(event) => onSelectionChange('spacing', event.currentTarget.value)}
        />
        <ThemeSelect
          label="Radius theme"
          options={radiusThemeNames}
          value={selection.radius}
          onChange={(event) => onSelectionChange('radius', event.currentTarget.value)}
        />
        <ThemeSelect
          label="Typography theme"
          options={typographyThemeNames}
          value={selection.typography}
          onChange={(event) => onSelectionChange('typography', event.currentTarget.value)}
        />
        <ThemeSelect
          label="Stroke theme"
          options={strokeThemeNames}
          value={selection.stroke}
          onChange={(event) => onSelectionChange('stroke', event.currentTarget.value)}
        />
        <ThemeSelect
          label="Elevation theme"
          options={elevationThemeNames}
          value={selection.elevation}
          onChange={(event) => onSelectionChange('elevation', event.currentTarget.value)}
        />
        <ThemeSelect
          label="Blur theme"
          options={blurThemeNames}
          value={selection.blur}
          onChange={(event) => onSelectionChange('blur', event.currentTarget.value)}
        />
        <ThemeSelect
          label="Motion theme"
          options={motionThemeNames}
          value={selection.motion}
          onChange={(event) => onSelectionChange('motion', event.currentTarget.value)}
        />
      </div>
    </fieldset>
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
            {option}
          </option>
        ))}
      </Select>
    </label>
  )
}

const styles = stylex.create({
  fieldset: {
    backgroundColor: colors.bgSubtle,
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: stroke.thin,
    borderInline: 0,
    borderBlockStart: 0,
    margin: 0,
    minWidth: 0,
    padding: spacing.md,
  },
  legend: {
    color: colors.fgMuted,
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    fontWeight: typography.weightSemibold,
    letterSpacing: typography.trackingWide,
    paddingInline: 0,
    textTransform: 'uppercase',
  },
  grid: {
    display: 'grid',
    gap: spacing.sm,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 8rem), 1fr))',
    marginBlockStart: spacing.xxs,
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
    textTransform: 'capitalize',
    width: '100%',
  },
})
