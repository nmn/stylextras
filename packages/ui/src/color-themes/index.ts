import { amberTheme } from './amber'
import { auroraTheme } from './aurora'
import { blueTheme } from './blue'
import { cyanTheme } from './cyan'
import { docsTheme } from './docs'
import { emberTheme } from './ember'
import { emeraldTheme } from './emerald'
import { fuchsiaTheme } from './fuchsia'
import { greenTheme } from './green'
import { indigoTheme } from './indigo'
import { limeTheme } from './lime'
import { mauveTheme } from './mauve'
import { meadowTheme } from './meadow'
import { mistTheme } from './mist'
import { neutralTheme } from './neutral'
import { oliveTheme } from './olive'
import { orangeTheme } from './orange'
import { pinkTheme } from './pink'
import { purpleTheme } from './purple'
import { redTheme } from './red'
import { roseTheme } from './rose'
import { skyTheme } from './sky'
import { stoneTheme } from './stone'
import { taupeTheme } from './taupe'
import { tealTheme } from './teal'
import type { ColorTheme } from './types'
import { violetTheme } from './violet'
import { yellowTheme } from './yellow'
import { zincTheme } from './zinc'

export type { ColorTheme } from './types'
export { neutralTheme } from './neutral'
export { docsTheme } from './docs'
export { stoneTheme } from './stone'
export { zincTheme } from './zinc'
export { mauveTheme } from './mauve'
export { oliveTheme } from './olive'
export { mistTheme } from './mist'
export { taupeTheme } from './taupe'
export { amberTheme } from './amber'
export { blueTheme } from './blue'
export { cyanTheme } from './cyan'
export { emeraldTheme } from './emerald'
export { fuchsiaTheme } from './fuchsia'
export { greenTheme } from './green'
export { indigoTheme } from './indigo'
export { limeTheme } from './lime'
export { orangeTheme } from './orange'
export { pinkTheme } from './pink'
export { purpleTheme } from './purple'
export { redTheme } from './red'
export { roseTheme } from './rose'
export { skyTheme } from './sky'
export { tealTheme } from './teal'
export { violetTheme } from './violet'
export { yellowTheme } from './yellow'
export { auroraTheme } from './aurora'
export { emberTheme } from './ember'
export { meadowTheme } from './meadow'

export const colorThemes = {
  neutral: neutralTheme,
  docs: docsTheme,
  aurora: auroraTheme,
  ember: emberTheme,
  meadow: meadowTheme,
  stone: stoneTheme,
  zinc: zincTheme,
  mauve: mauveTheme,
  olive: oliveTheme,
  mist: mistTheme,
  taupe: taupeTheme,
  amber: amberTheme,
  blue: blueTheme,
  cyan: cyanTheme,
  emerald: emeraldTheme,
  fuchsia: fuchsiaTheme,
  green: greenTheme,
  indigo: indigoTheme,
  lime: limeTheme,
  orange: orangeTheme,
  pink: pinkTheme,
  purple: purpleTheme,
  red: redTheme,
  rose: roseTheme,
  sky: skyTheme,
  teal: tealTheme,
  violet: violetTheme,
  yellow: yellowTheme,
} as const satisfies Readonly<Record<string, ColorTheme>>

export type ColorThemeName = keyof typeof colorThemes
