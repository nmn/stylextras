import { softTheme as blurTheme } from '../blur-themes/soft'
import { meadowTheme as colorTheme } from '../color-themes/meadow'
import { neutralTheme as colorBaseTheme } from '../color-themes/neutral'
import { whisperTheme as elevationTheme } from '../elevation-themes/whisper'
import { gentleTheme as motionTheme } from '../motion-themes/gentle'
import { plushTheme as radiusTheme } from '../radius-themes/plush'
import { airyTheme as spacingTheme } from '../spacing-themes/airy'
import { hairlineTheme as strokeTheme } from '../stroke-themes/hairline'
import { humanistTheme as typographyTheme } from '../typography-themes/humanist'
import type { StylePreset, StylePresetThemes } from './types'

export const meadowPreset = {
  description: 'A fresh, airy wellness look with rounded, friendly type.',
  color: 'meadow',
  spacing: 'airy',
  radius: 'plush',
  typography: 'humanist',
  elevation: 'whisper',
  stroke: 'hairline',
  blur: 'soft',
  motion: 'gentle',
} as const satisfies StylePreset

export const meadowPresetThemes = [
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
