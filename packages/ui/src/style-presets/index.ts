import { blurThemes, type BlurThemeName } from '../blur-themes'
import { colorThemes, type ColorThemeName } from '../color-themes'
import { elevationThemes, type ElevationThemeName } from '../elevation-themes'
import { motionThemes, type MotionThemeName } from '../motion-themes'
import { radiusThemes, type RadiusThemeName } from '../radius-themes'
import { spacingThemes, type SpacingThemeName } from '../spacing-themes'
import { strokeThemes, type StrokeThemeName } from '../stroke-themes'
import { typographyThemes, type TypographyThemeName } from '../typography-themes'

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

/**
 * Curated combinations of one theme per token axis that are designed to be
 * used together. Pass the result of `stylePresetThemes(name)` into
 * `stylex.props` (or spread it alongside component-level themes) to apply an
 * entire look in one step, or read the individual names off `stylePresets` to
 * drive a per-axis theme picker that defaults to a cohesive combination.
 */
export const stylePresets = {
  docs: {
    description: 'The Stylextras documentation site: calm, precise, and legible.',
    color: 'docs',
    spacing: 'docs',
    radius: 'docs',
    typography: 'docs',
    elevation: 'docs',
    stroke: 'docs',
    blur: 'docs',
    motion: 'docs',
  },
  aurora: {
    description: 'A cool, nocturnal glass surface with slow, silky motion.',
    color: 'aurora',
    spacing: 'roomy',
    radius: 'soft',
    typography: 'ui',
    elevation: 'glass',
    stroke: 'hairline',
    blur: 'frosted',
    motion: 'fluid',
  },
  ember: {
    description: 'A warm, parchment-toned editorial layout with gentle motion.',
    color: 'ember',
    spacing: 'cozy',
    radius: 'rounded',
    typography: 'editorial',
    elevation: 'soft',
    stroke: 'base',
    blur: 'subtle',
    motion: 'gentle',
  },
  meadow: {
    description: 'A fresh, airy wellness look with rounded, friendly type.',
    color: 'meadow',
    spacing: 'airy',
    radius: 'plush',
    typography: 'humanist',
    elevation: 'whisper',
    stroke: 'hairline',
    blur: 'soft',
    motion: 'gentle',
  },
  playful: {
    description: 'A bouncy, saturated look for consumer and marketing surfaces.',
    color: 'pink',
    spacing: 'roomy',
    radius: 'pill',
    typography: 'humanist',
    elevation: 'float',
    stroke: 'bold',
    blur: 'soft',
    motion: 'expressive',
  },
  brutalist: {
    description: 'A high-contrast, graphic look with hard edges and instant motion.',
    color: 'zinc',
    spacing: 'poster',
    radius: 'sharp',
    typography: 'industrial',
    elevation: 'poster',
    stroke: 'block',
    blur: 'crisp',
    motion: 'instant',
  },
  focus: {
    description: 'A dense, quiet utility look for data-heavy dashboards.',
    color: 'zinc',
    spacing: 'dense',
    radius: 'snug',
    typography: 'compact',
    elevation: 'flat',
    stroke: 'wireframe',
    blur: 'crisp',
    motion: 'brisk',
  },
} as const satisfies Record<string, StylePreset>

export type StylePresetName = keyof typeof stylePresets

/**
 * Resolves a named grouping to the concrete `stylex.createTheme` result for
 * every axis, ready to spread into `stylex.props(...stylePresetThemes(name))`.
 */
export function stylePresetThemes(name: StylePresetName) {
  const preset = stylePresets[name]
  return [
    colorThemes[preset.color],
    spacingThemes[preset.spacing],
    radiusThemes[preset.radius],
    typographyThemes[preset.typography],
    elevationThemes[preset.elevation],
    strokeThemes[preset.stroke],
    blurThemes[preset.blur],
    motionThemes[preset.motion],
  ] as const
}
