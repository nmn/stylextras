import { frostedTheme as blurTheme } from '../blur-themes/frosted'
import { auroraTheme as colorTheme } from '../color-themes/aurora'
import { neutralTheme as colorBaseTheme } from '../color-themes/neutral'
import { glassTheme as elevationTheme } from '../elevation-themes/glass'
import { fluidTheme as motionTheme } from '../motion-themes/fluid'
import { softTheme as radiusTheme } from '../radius-themes/soft'
import { roomyTheme as spacingTheme } from '../spacing-themes/roomy'
import { hairlineTheme as strokeTheme } from '../stroke-themes/hairline'
import { uiTheme as typographyTheme } from '../typography-themes/ui'
import type { StylePreset, StylePresetThemes } from './types'

export const auroraPreset = {
  description: 'A cool, nocturnal glass surface with slow, silky motion.',
  color: 'aurora',
  spacing: 'roomy',
  radius: 'soft',
  typography: 'ui',
  elevation: 'glass',
  stroke: 'hairline',
  blur: 'frosted',
  motion: 'fluid',
} as const satisfies StylePreset

export const auroraPresetThemes = [
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
