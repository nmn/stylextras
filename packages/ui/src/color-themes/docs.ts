import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** The documentation website's purple system with periwinkle-blue interaction highlights. */
export const docsTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('hsl(0, 0%, 100%)', 'hsl(0, 0%, 7%)'),
  fg: lightDark('hsl(0, 0%, 3.9%)', 'hsl(0, 0%, 92%)'),
  tone: lightDark('hsl(0, 0%, 42%)', 'hsla(0, 0%, 70%, 0.8)'),
  fgOnBrand: lightDark('hsl(0, 0%, 100%)', 'hsl(240, 23%, 9%)'),
  brand: lightDark('hsl(266, 58%, 57%)', 'hsl(270, 72%, 77%)'),
  info: 'oklch(62.3% 0.214 259.815)',
  success: 'oklch(72.3% 0.219 149.579)',
  warning: 'oklch(76.9% 0.188 70.08)',
  danger: 'oklch(63.7% 0.237 25.331)',

  bgSubtle: lightDark('hsl(0, 0%, 96.1%)', 'hsl(0, 0%, 10%)'),
  bgRaised: lightDark('hsl(0, 0%, 97%)', 'hsl(0, 0%, 13%)'),
  bgInset: lightDark('hsl(0, 0%, 93.1%)', 'hsl(0, 0%, 4.5%)'),
  bgOverlay: lightDark('hsl(0, 0%, 98%)', 'hsl(0, 0%, 16%)'),

  surface: lightDark('hsl(0, 0%, 96.1%)', 'hsl(0, 0%, 10%)'),
  surfaceForeground: lightDark('hsl(0, 0%, 3.9%)', 'hsl(0, 0%, 92%)'),
  card: lightDark('hsl(0, 0%, 97%)', 'hsl(0, 0%, 13%)'),
  cardForeground: lightDark('hsl(0, 0%, 3.9%)', 'hsl(0, 0%, 98%)'),
  popover: lightDark('hsl(0, 0%, 98%)', 'hsl(0, 0%, 16%)'),
  popoverForeground: lightDark('hsl(0, 0%, 15.1%)', 'hsl(0, 0%, 86.9%)'),
  control: lightDark('hsl(0, 0%, 97%)', 'hsl(0, 0%, 13%)'),
  controlHover: lightDark('hsl(0, 0%, 96.1%)', 'hsl(0, 0%, 16%)'),
  sidebar: lightDark('hsl(0, 0%, 97%)', 'hsl(0, 0%, 9%)'),
  sidebarForeground: lightDark('hsl(0, 0%, 3.9%)', 'hsl(0, 0%, 92%)'),
  sidebarAccent: lightDark('hsl(222, 16%, 83%)', 'hsl(222, 16%, 23%)'),
  sidebarBorder: lightDark('hsla(0, 0%, 80%, 0.55)', 'hsla(0, 0%, 30%, 0.25)'),

  fgSoft: lightDark('hsl(0, 0%, 28%)', 'hsl(0, 0%, 80%)'),
  fgMuted: lightDark('hsl(0, 0%, 42%)', 'hsla(0, 0%, 70%, 0.8)'),
  fgDisabled: lightDark('hsl(0, 0%, 60%)', 'hsl(0, 0%, 45%)'),

  border: lightDark('hsla(0, 0%, 80%, 0.55)', 'hsla(0, 0%, 30%, 0.25)'),
  borderStrong: lightDark('hsla(0, 0%, 65%, 0.65)', 'hsla(0, 0%, 45%, 0.4)'),
  borderAccent: lightDark('hsl(267, 84%, 81%)', 'hsl(267, 84%, 81%)'),

  overlay: lightDark('transparent', 'hsla(0, 0%, 0%, 0.2)'),

  primary: colors.brand,
  primaryHover: `color-mix(in oklab, ${colors.primary} 84%, ${colors.bg})`,
  primaryActive: `color-mix(in oklab, ${colors.primary} 82%, ${colors.fg})`,
  primaryForeground: colors.fgOnBrand,

  secondary: lightDark('hsl(0, 0%, 93.1%)', 'hsl(0, 0%, 12.9%)'),
  secondaryHover: lightDark('hsl(222, 16%, 83%)', 'hsl(222, 16%, 23%)'),
  secondaryActive: `color-mix(in oklab, ${colors.secondaryHover} 82%, ${colors.fg})`,
  secondaryForeground: lightDark('hsl(0, 0%, 9%)', 'hsl(0, 0%, 70%)'),

  accent: lightDark('hsl(222, 16%, 83%)', 'hsl(222, 16%, 23%)'),
  accentForeground: lightDark('hsl(222, 67%, 58%)', 'hsl(222, 87%, 78%)'),
  accentText: lightDark(
    `color-mix(in oklab, ${colors.accentForeground} 72%, ${colors.fg})`,
    colors.accentForeground,
  ),

  focusRing: lightDark('hsl(267, 84%, 81%)', 'hsl(267, 84%, 81%)'),
  selection: `color-mix(in oklab, ${colors.primary} 18%, transparent)`,

  infoSoft: `color-mix(in oklab, ${colors.info} 10%, ${colors.card})`,
  successSoft: `color-mix(in oklab, ${colors.success} 10%, ${colors.card})`,
  warningSoft: `color-mix(in oklab, ${colors.warning} 10%, ${colors.card})`,
  dangerSoft: `color-mix(in oklab, ${colors.danger} 10%, ${colors.card})`,

  dangerHover: `color-mix(in oklab, ${colors.danger} 88%, ${colors.bg})`,
  dangerActive: `color-mix(in oklab, ${colors.danger} 88%, ${colors.fg})`,
  infoHover: `color-mix(in oklab, ${colors.info} 88%, ${colors.bg})`,
  infoActive: `color-mix(in oklab, ${colors.info} 88%, ${colors.fg})`,
  successHover: `color-mix(in oklab, ${colors.success} 88%, ${colors.bg})`,
  successActive: `color-mix(in oklab, ${colors.success} 88%, ${colors.fg})`,
  warningHover: `color-mix(in oklab, ${colors.warning} 88%, ${colors.bg})`,
  warningActive: `color-mix(in oklab, ${colors.warning} 88%, ${colors.fg})`,

  code: lightDark('hsl(146, 55%, 31%)', 'hsl(146, 52%, 68%)'),
})
