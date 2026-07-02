import type { VarGroup } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';

const round = (value: number) => Math.floor(value * 100) / 100;

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

const mix = (base: string, blend: string, weight?: number) =>
  `color-mix(in oklab, ${base} ${round(weight ?? 50)}%, ${blend})`;

const alpha = (color: string, opacity: number) =>
  `color-mix(in oklab, ${color} ${round(opacity * 100)}%, transparent)`;

type Tcolors = VarGroup<
  Readonly<{
    accent: string;
    accentForeground: string;
    bg: string;
    bgInset: string;
    bgOverlay: string;
    bgRaised: string;
    bgSubtle: string;
    border: string;
    borderAccent: string;
    borderStrong: string;
    brand: string;
    code: string;
    danger: string;
    dangerActive: string;
    dangerHover: string;
    dangerSoft: string;
    fg: string;
    fgDisabled: string;
    fgMuted: string;
    fgOnBrand: string;
    fgSoft: string;
    focusRing: string;
    info: string;
    infoActive: string;
    infoHover: string;
    infoSoft: string;
    overlay: string;
    primary: string;
    primaryActive: string;
    primaryForeground: string;
    primaryHover: string;
    secondary: string;
    secondaryActive: string;
    secondaryForeground: string;
    secondaryHover: string;
    selection: string;
    success: string;
    successActive: string;
    successHover: string;
    successSoft: string;
    tone: string;
    warning: string;
    warningActive: string;
    warningHover: string;
    warningSoft: string;
  }>
>;

export const colors: Tcolors = stylex.defineVars({
  bg: lightDark('oklch(99% 0.004 286)', 'oklch(17% 0.01 286)'),
  fg: lightDark('oklch(21% 0.01 286)', 'oklch(97% 0.004 286)'),

  tone: lightDark('oklch(56% 0.02 286)', 'oklch(78% 0.025 286)'),
  fgOnBrand: lightDark('#ffffff', '#0a0a0b'),
  brand: lightDark('oklch(63% 0.19 292)', 'oklch(74% 0.16 292)'),
  info: lightDark('oklch(60% 0.15 255)', 'oklch(73% 0.12 255)'),
  success: lightDark('oklch(64% 0.15 155)', 'oklch(77% 0.12 155)'),
  warning: lightDark('oklch(78% 0.16 86)', 'oklch(84% 0.13 86)'),
  danger: lightDark('oklch(62% 0.19 28)', 'oklch(74% 0.15 28)'),

  bgSubtle: () => mix(colors.bg, colors.tone, 97),
  bgRaised: () => mix(colors.bg, colors.tone, 94),
  bgInset: () => mix(colors.bg, colors.tone, 90),
  bgOverlay: () =>
    lightDark(
      alpha(mix(colors.bg, colors.tone, 95), 0.96),
      alpha(mix(colors.bg, colors.tone, 84), 0.94),
    ),

  fgSoft: () => mix(colors.fg, colors.bg, 78),
  fgMuted: () => mix(colors.fg, colors.bg, 58),
  fgDisabled: () => mix(colors.fg, colors.bg, 40),

  border: () => mix(colors.tone, colors.bg, 24),
  borderStrong: () => mix(colors.tone, colors.bg, 42),
  borderAccent: () => mix(colors.brand, colors.bg, 58),

  overlay: () => lightDark(alpha(colors.fg, 0.12), alpha(colors.fg, 0.44)),

  primary: () => colors.brand,
  primaryHover: () => mix(colors.brand, colors.bg, 88),
  primaryActive: () => mix(colors.brand, colors.fg, 94),
  primaryForeground: () => colors.fgOnBrand,

  secondary: () => mix(colors.bg, colors.tone, 90),
  secondaryHover: () => mix(colors.bg, colors.tone, 86),
  secondaryActive: () => mix(colors.bg, colors.fg, 96),
  secondaryForeground: () => colors.fg,

  accent: () => mix(colors.brand, colors.bg, 24),
  accentForeground: () => mix(colors.brand, colors.fg, 76),

  focusRing: () => alpha(colors.brand, 0.42),
  selection: () => alpha(colors.brand, 0.22),

  infoSoft: () => alpha(colors.info, 0.18),
  successSoft: () => alpha(colors.success, 0.18),
  warningSoft: () => alpha(colors.warning, 0.22),
  dangerSoft: () => alpha(colors.danger, 0.18),

  dangerHover: () => mix(colors.danger, colors.bg, 88),
  dangerActive: () => mix(colors.danger, colors.fg, 94),
  infoHover: () => mix(colors.info, colors.bg, 88),
  infoActive: () => mix(colors.info, colors.fg, 94),
  successHover: () => mix(colors.success, colors.bg, 88),
  successActive: () => mix(colors.success, colors.fg, 94),
  warningHover: () => mix(colors.warning, colors.bg, 88),
  warningActive: () => mix(colors.warning, colors.fg, 94),

  code: () =>
    lightDark(
      mix(colors.success, colors.fg, 70),
      mix(colors.success, colors.bg, 82),
    ),
});
