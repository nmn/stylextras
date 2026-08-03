import { auroraPreset, auroraPresetThemes } from './aurora'
import { brutalistPreset, brutalistPresetThemes } from './brutalist'
import { docsPreset, docsPresetThemes } from './docs'
import { emberPreset, emberPresetThemes } from './ember'
import { focusPreset, focusPresetThemes } from './focus'
import { meadowPreset, meadowPresetThemes } from './meadow'
import { playfulPreset, playfulPresetThemes } from './playful'
import type { StylePreset, StylePresetThemes } from './types'

export type { StylePreset, StylePresetThemes } from './types'
export { auroraPreset, auroraPresetThemes } from './aurora'
export { brutalistPreset, brutalistPresetThemes } from './brutalist'
export { docsPreset, docsPresetThemes } from './docs'
export { emberPreset, emberPresetThemes } from './ember'
export { focusPreset, focusPresetThemes } from './focus'
export { meadowPreset, meadowPresetThemes } from './meadow'
export { playfulPreset, playfulPresetThemes } from './playful'

/** The complete preset catalog. Import a named subpath to include only one preset's themes. */
export const stylePresets = {
  docs: docsPreset,
  aurora: auroraPreset,
  ember: emberPreset,
  meadow: meadowPreset,
  playful: playfulPreset,
  brutalist: brutalistPreset,
  focus: focusPreset,
} as const satisfies Record<string, StylePreset>

export type StylePresetName = keyof typeof stylePresets

const presetThemes = {
  docs: docsPresetThemes,
  aurora: auroraPresetThemes,
  ember: emberPresetThemes,
  meadow: meadowPresetThemes,
  playful: playfulPresetThemes,
  brutalist: brutalistPresetThemes,
  focus: focusPresetThemes,
} as const satisfies Record<StylePresetName, StylePresetThemes>

/** Resolves a catalog name to a color reset plus all eight concrete theme axes. */
export function stylePresetThemes(name: StylePresetName): StylePresetThemes {
  return presetThemes[name]
}
