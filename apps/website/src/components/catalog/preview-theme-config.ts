import type { BlurThemeName } from '@stylextras/ui/blur-themes'
import type { ColorThemeName } from '@stylextras/ui/color-themes'
import type { ElevationThemeName } from '@stylextras/ui/elevation-themes'
import type { MotionThemeName } from '@stylextras/ui/motion-themes'
import type { RadiusThemeName } from '@stylextras/ui/radius-themes'
import type { SpacingThemeName } from '@stylextras/ui/spacing-themes'
import type { StrokeThemeName } from '@stylextras/ui/stroke-themes'
import { type StylePreset, type StylePresetName, stylePresets } from '@stylextras/ui/style-presets'
import type { TypographyThemeName } from '@stylextras/ui/typography-themes'

export type PreviewAppearance = 'inherit' | 'light' | 'dark'
export type PreviewStyleName = StylePresetName
export type PreviewStyleSelection = PreviewStyleName | 'custom'

export type PreviewThemeSelection = {
  appearance: PreviewAppearance
  blur: BlurThemeName
  color: ColorThemeName
  elevation: ElevationThemeName
  motion: MotionThemeName
  radius: RadiusThemeName
  spacing: SpacingThemeName
  stroke: StrokeThemeName
  typography: TypographyThemeName
}

export type PreviewStylePreset = StylePreset

export const previewStylePresets = stylePresets

export function previewThemeSelection(
  style: PreviewStyleName,
  appearance: PreviewAppearance,
): PreviewThemeSelection {
  const { description: _description, ...selection } = previewStylePresets[style]
  return { ...selection, appearance }
}

export const defaultPreviewTheme = previewThemeSelection('docs', 'inherit')
