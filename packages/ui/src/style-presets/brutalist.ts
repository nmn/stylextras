import { crispTheme as blurTheme } from '../blur-themes/crisp'
import { neutralTheme as colorBaseTheme } from '../color-themes/neutral'
import { zincTheme as colorTheme } from '../color-themes/zinc'
import { posterTheme as elevationTheme } from '../elevation-themes/poster'
import { instantTheme as motionTheme } from '../motion-themes/instant'
import { sharpTheme as radiusTheme } from '../radius-themes/sharp'
import { posterTheme as spacingTheme } from '../spacing-themes/poster'
import { blockTheme as strokeTheme } from '../stroke-themes/block'
import { industrialTheme as typographyTheme } from '../typography-themes/industrial'
import type { StylePreset, StylePresetThemes } from './types'

export const brutalistPreset = {
  description: 'A high-contrast, graphic look with hard edges and instant motion.',
  color: 'zinc',
  spacing: 'poster',
  radius: 'sharp',
  typography: 'industrial',
  elevation: 'poster',
  stroke: 'block',
  blur: 'crisp',
  motion: 'instant',
} as const satisfies StylePreset

export const brutalistPresetThemes = [
  colorBaseTheme,
  colorTheme,
  spacingTheme,
  radiusTheme,
  typographyTheme,
  elevationTheme,
  strokeTheme,
  blurTheme,
  motionTheme,
] as const satisfies StylePresetThemes
