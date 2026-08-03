import type { BlurTheme, BlurThemeName } from '../blur-themes'
import type { ColorTheme, ColorThemeName } from '../color-themes'
import type { ElevationTheme, ElevationThemeName } from '../elevation-themes'
import type { MotionTheme, MotionThemeName } from '../motion-themes'
import type { RadiusTheme, RadiusThemeName } from '../radius-themes'
import type { SpacingTheme, SpacingThemeName } from '../spacing-themes'
import type { StrokeTheme, StrokeThemeName } from '../stroke-themes'
import type { TypographyTheme, TypographyThemeName } from '../typography-themes'

export type StylePreset = Readonly<{
  /** Short description of the mood this grouping is meant to evoke. */
  description: string
  color: ColorThemeName
  spacing: SpacingThemeName
  radius: RadiusThemeName
  typography: TypographyThemeName
  elevation: ElevationThemeName
  stroke: StrokeThemeName
  blur: BlurThemeName
  motion: MotionThemeName
}>

export type StylePresetThemes = readonly [
  ColorTheme,
  ColorTheme,
  SpacingTheme,
  RadiusTheme,
  TypographyTheme,
  ElevationTheme,
  StrokeTheme,
  BlurTheme,
  MotionTheme,
]
