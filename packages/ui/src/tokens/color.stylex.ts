import * as stylex from "@stylexjs/stylex";

const round = (value: number) => Math.floor(value * 100) / 100;

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

const mix = (base: string, blend: string, weight?: number) =>
  `color-mix(in oklab, ${base} ${round(weight ?? 50)}%, ${blend})`;

const alpha = (color: string, opacity: number) =>
  `color-mix(in oklab, ${color} ${round(opacity * 100)}%, transparent)`;

export const color_core = stylex.defineVars({
  bg: lightDark("oklch(99% 0.004 286)", "oklch(17% 0.01 286)"),
  fg: lightDark("oklch(21% 0.01 286)", "oklch(97% 0.004 286)"),

  tone: lightDark("oklch(56% 0.02 286)", "oklch(78% 0.025 286)"),
  fgOnBrand: lightDark("#ffffff", "#0a0a0b"),
  brand: lightDark("oklch(63% 0.19 292)", "oklch(74% 0.16 292)"),
  info: lightDark("oklch(60% 0.15 255)", "oklch(73% 0.12 255)"),
  success: lightDark("oklch(64% 0.15 155)", "oklch(77% 0.12 155)"),
  warning: lightDark("oklch(78% 0.16 86)", "oklch(84% 0.13 86)"),
  danger: lightDark("oklch(62% 0.19 28)", "oklch(74% 0.15 28)"),
});

export const color_derived = stylex.defineVars({
  bgSubtle: mix(color_core.bg, color_core.tone, 97),
  bgRaised: mix(color_core.bg, color_core.tone, 94),
  bgInset: mix(color_core.bg, color_core.tone, 90),
  bgOverlay: lightDark(
    alpha(mix(color_core.bg, color_core.tone, 95), 0.96),
    alpha(mix(color_core.bg, color_core.tone, 84), 0.94),
  ),

  fgSoft: mix(color_core.fg, color_core.bg, 78),
  fgMuted: mix(color_core.fg, color_core.bg, 58),
  fgDisabled: mix(color_core.fg, color_core.bg, 40),

  border: mix(color_core.tone, color_core.bg, 24),
  borderStrong: mix(color_core.tone, color_core.bg, 42),
  borderAccent: mix(color_core.brand, color_core.bg, 58),

  overlay: lightDark(alpha(color_core.fg, 0.12), alpha(color_core.fg, 0.44)),

  primary: color_core.brand,
  primaryHover: mix(color_core.brand, color_core.bg, 88),
  primaryActive: mix(color_core.brand, color_core.fg, 82),
  primaryForeground: color_core.fgOnBrand,

  secondary: mix(color_core.bg, color_core.tone, 90),
  secondaryHover: mix(color_core.bg, color_core.tone, 84),
  secondaryForeground: color_core.fg,

  accent: mix(color_core.brand, color_core.bg, 24),
  accentForeground: mix(color_core.brand, color_core.fg, 76),

  focusRing: alpha(color_core.brand, 0.42),
  selection: alpha(color_core.brand, 0.22),

  infoSoft: alpha(color_core.info, 0.18),
  successSoft: alpha(color_core.success, 0.18),
  warningSoft: alpha(color_core.warning, 0.22),
  dangerSoft: alpha(color_core.danger, 0.18),

  code: lightDark(
    mix(color_core.success, color_core.fg, 70),
    mix(color_core.success, color_core.bg, 82),
  ),
});

export const colors = stylex.defineConsts({
  tone: color_core.tone,

  bg: color_core.bg,
  bgSubtle: color_derived.bgSubtle,
  bgRaised: color_derived.bgRaised,
  bgInset: color_derived.bgInset,
  bgOverlay: color_derived.bgOverlay,

  fg: color_core.fg,
  fgOnBrand: color_core.fgOnBrand,
  fgSoft: color_derived.fgSoft,
  fgMuted: color_derived.fgMuted,
  fgDisabled: color_derived.fgDisabled,

  border: color_derived.border,
  borderStrong: color_derived.borderStrong,
  borderAccent: color_derived.borderAccent,

  overlay: color_derived.overlay,

  primary: color_derived.primary,
  primaryHover: color_derived.primaryHover,
  primaryActive: color_derived.primaryActive,
  primaryForeground: color_derived.primaryForeground,

  secondary: color_derived.secondary,
  secondaryHover: color_derived.secondaryHover,
  secondaryForeground: color_derived.secondaryForeground,

  accent: color_derived.accent,
  accentForeground: color_derived.accentForeground,

  focusRing: color_derived.focusRing,
  selection: color_derived.selection,

  brand: color_core.brand,
  info: color_core.info,
  success: color_core.success,
  warning: color_core.warning,
  danger: color_core.danger,
  infoSoft: color_derived.infoSoft,
  successSoft: color_derived.successSoft,
  warningSoft: color_derived.warningSoft,
  dangerSoft: color_derived.dangerSoft,

  code: color_derived.code,
});
