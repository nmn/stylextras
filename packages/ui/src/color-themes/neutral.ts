import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const mix = (base: string, blend: string, weight: number) =>
  `color-mix(in oklab, ${base} ${weight}%, ${blend})`

const alpha = (color: string, opacity: number) =>
  `color-mix(in oklab, ${color} ${opacity * 100}%, transparent)`

/**
 * The complete default achromatic palette. Applying this before a partial
 * accent theme prevents semantic colors inherited from an outer theme from
 * leaking into the nested color axis.
 */
export const neutralTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.5% 0 0)'),
  fg: lightDark('oklch(14.5% 0 0)', 'oklch(98.5% 0 0)'),
  tone: lightDark('oklch(55.6% 0 0)', 'oklch(70.8% 0 0)'),
  fgOnBrand: lightDark('oklch(98.5% 0 0)', 'oklch(20.5% 0 0)'),
  brand: lightDark('oklch(20.5% 0 0)', 'oklch(92.2% 0 0)'),
  info: lightDark('oklch(54.6% 0.245 262.9)', 'oklch(70.7% 0.165 254.6)'),
  success: lightDark('oklch(52.7% 0.154 150.1)', 'oklch(72.3% 0.162 149.6)'),
  warning: lightDark('oklch(66.6% 0.179 58.3)', 'oklch(79.5% 0.184 86.1)'),
  danger: lightDark('oklch(57.7% 0.245 27.3)', 'oklch(70.4% 0.191 22.2)'),
  bgSubtle: lightDark(mix(colors.bg, colors.tone, 96), alpha(colors.tone, 0.08)),
  bgRaised: lightDark(mix(colors.bg, colors.tone, 98), alpha(colors.tone, 0.13)),
  bgInset: lightDark(mix(colors.bg, colors.tone, 90), alpha('#000000', 0.18)),
  bgOverlay: lightDark(alpha(mix(colors.bg, colors.tone, 99), 0.98), alpha(colors.tone, 0.2)),
  surface: colors.bgSubtle,
  surfaceForeground: colors.fg,
  surfaceSelected: lightDark(colors.bg, mix(colors.bg, colors.tone, 88)),
  card: colors.bgRaised,
  cardForeground: colors.fg,
  popover: lightDark(mix(colors.bg, colors.tone, 99), mix(colors.bg, colors.tone, 72)),
  popoverForeground: colors.fg,
  control: lightDark(colors.bg, mix(colors.bg, colors.tone, 96)),
  controlHover: lightDark(colors.bgSubtle, mix(colors.bg, colors.tone, 92)),
  sidebar: colors.bgSubtle,
  sidebarForeground: colors.fg,
  sidebarAccent: colors.accent,
  sidebarBorder: mix(colors.tone, colors.bg, 18),
  fgSoft: mix(colors.fg, colors.bg, 78),
  fgMuted: mix(colors.fg, colors.bg, 58),
  fgDisabled: mix(colors.fg, colors.bg, 40),
  border: mix(colors.tone, colors.bg, 18),
  borderStrong: mix(colors.tone, colors.bg, 28),
  borderAccent: mix(colors.brand, colors.bg, 46),
  overlay: lightDark(alpha(colors.fg, 0.36), alpha('#000000', 0.64)),
  primary: colors.brand,
  primaryHover: mix(colors.brand, colors.bg, 90),
  primaryActive: mix(colors.brand, colors.fg, 88),
  primaryForeground: colors.fgOnBrand,
  secondary: lightDark(mix(colors.bg, colors.tone, 92), alpha(colors.tone, 0.11)),
  secondaryHover: lightDark(mix(colors.bg, colors.tone, 86), alpha(colors.tone, 0.16)),
  secondaryActive: lightDark(mix(colors.bg, colors.tone, 80), alpha(colors.tone, 0.22)),
  secondaryForeground: colors.fg,
  accent: lightDark(mix(colors.bg, colors.tone, 88), alpha(colors.tone, 0.18)),
  accentForeground: colors.fg,
  accentText: lightDark(mix(colors.accentForeground, colors.fg, 72), colors.accentForeground),
  focusRing: alpha(colors.tone, 0.46),
  selection: alpha(colors.brand, 0.18),
  infoSoft: alpha(colors.info, 0.18),
  successSoft: alpha(colors.success, 0.18),
  warningSoft: alpha(colors.warning, 0.22),
  dangerSoft: alpha(colors.danger, 0.18),
  dangerForeground: lightDark(colors.fg, colors.bg),
  dangerText: lightDark(mix(colors.danger, colors.fg, 82), colors.danger),
  dangerHover: mix(colors.danger, colors.bg, 88),
  dangerActive: mix(colors.danger, colors.fg, 94),
  infoHover: mix(colors.info, colors.bg, 88),
  infoActive: mix(colors.info, colors.fg, 94),
  successHover: mix(colors.success, colors.bg, 88),
  successActive: mix(colors.success, colors.fg, 94),
  warningHover: mix(colors.warning, colors.bg, 88),
  warningActive: mix(colors.warning, colors.fg, 94),
  code: lightDark(mix(colors.success, colors.fg, 70), mix(colors.success, colors.bg, 82)),
})
