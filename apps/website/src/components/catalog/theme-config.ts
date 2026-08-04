import type { BlurThemeName } from '@stylextras/ui/blur-themes'
import type { ColorThemeName } from '@stylextras/ui/color-themes'
import type { ElevationThemeName } from '@stylextras/ui/elevation-themes'
import type { MotionThemeName } from '@stylextras/ui/motion-themes'
import type { RadiusThemeName } from '@stylextras/ui/radius-themes'
import type { SpacingThemeName } from '@stylextras/ui/spacing-themes'
import type { StrokeThemeName } from '@stylextras/ui/stroke-themes'
import { type StylePresetName, stylePresets } from '@stylextras/ui/style-presets'
import type { TypographyThemeName } from '@stylextras/ui/typography-themes'

export type WebsiteAppearance = 'system' | 'light' | 'dark'
export type WebsiteStyleName = StylePresetName
export type WebsiteStyleSelection = WebsiteStyleName | 'custom'

export type WebsiteThemeAxes = {
  blur: BlurThemeName
  color: ColorThemeName
  elevation: ElevationThemeName
  motion: MotionThemeName
  radius: RadiusThemeName
  spacing: SpacingThemeName
  stroke: StrokeThemeName
  typography: TypographyThemeName
}

export const websiteStylePresets = stylePresets

export const themeAxisNames = [
  'blur',
  'color',
  'elevation',
  'motion',
  'radius',
  'spacing',
  'stroke',
  'typography',
] as const satisfies readonly (keyof WebsiteThemeAxes)[]

export function themeAxesForStyle(style: WebsiteStyleName): WebsiteThemeAxes {
  const { description: _description, ...axes } = websiteStylePresets[style]
  return axes
}

export function matchingStyleName(axes: WebsiteThemeAxes): WebsiteStyleSelection {
  for (const name of Object.keys(websiteStylePresets) as WebsiteStyleName[]) {
    const preset = websiteStylePresets[name]
    if (themeAxisNames.every((axis) => preset[axis] === axes[axis])) return name
  }
  return 'custom'
}

export const defaultWebsiteTheme = themeAxesForStyle('docs')
