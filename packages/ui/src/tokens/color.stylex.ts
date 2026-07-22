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
    card: string;
    cardForeground: string;
    border: string;
    borderAccent: string;
    borderStrong: string;
    brand: string;
    code: string;
    control: string;
    controlHover: string;
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
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryActive: string;
    primaryForeground: string;
    primaryHover: string;
    secondary: string;
    secondaryActive: string;
    secondaryForeground: string;
    secondaryHover: string;
    selection: string;
    sidebar: string;
    sidebarAccent: string;
    sidebarBorder: string;
    sidebarForeground: string;
    surface: string;
    surfaceForeground: string;
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
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.5% 0 0)'),
  fg: lightDark('oklch(14.5% 0 0)', 'oklch(98.5% 0 0)'),

  tone: lightDark('oklch(55.6% 0 0)', 'oklch(70.8% 0 0)'),
  fgOnBrand: lightDark('oklch(98.5% 0 0)', 'oklch(20.5% 0 0)'),
  brand: lightDark('oklch(20.5% 0 0)', 'oklch(92.2% 0 0)'),
  info: lightDark('oklch(54.6% 0.245 262.9)', 'oklch(70.7% 0.165 254.6)'),
  success: lightDark('oklch(52.7% 0.154 150.1)', 'oklch(72.3% 0.162 149.6)'),
  warning: lightDark('oklch(66.6% 0.179 58.3)', 'oklch(79.5% 0.184 86.1)'),
  danger: lightDark('oklch(57.7% 0.245 27.3)', 'oklch(70.4% 0.191 22.2)'),

  // Dark surfaces stay translucent so every nested layer compounds lighter.
  // Light surfaces remain opaque and move from tinted/recessed to near-white.
  bgSubtle: () =>
    lightDark(mix(colors.bg, colors.tone, 96), alpha(colors.tone, 0.08)),
  bgRaised: () =>
    lightDark(mix(colors.bg, colors.tone, 98), alpha(colors.tone, 0.13)),
  bgInset: () =>
    lightDark(mix(colors.bg, colors.tone, 90), alpha('#000000', 0.18)),
  bgOverlay: () =>
    lightDark(
      alpha(mix(colors.bg, colors.tone, 99), 0.98),
      alpha(colors.tone, 0.2),
    ),

  surface: () => colors.bgSubtle,
  surfaceForeground: () => colors.fg,
  card: () => colors.bgRaised,
  cardForeground: () => colors.fg,
  // Top-layer surfaces must paint an opaque canvas; translucency belongs to
  // nested in-flow surfaces where the parent background is known.
  popover: () =>
    lightDark(mix(colors.bg, colors.tone, 99), mix(colors.bg, colors.tone, 72)),
  popoverForeground: () => colors.fg,
  // Form controls stay opaque even when raised surfaces use compositing.
  control: () => lightDark(colors.bg, mix(colors.bg, colors.tone, 96)),
  controlHover: () =>
    lightDark(colors.bgSubtle, mix(colors.bg, colors.tone, 92)),
  sidebar: () => colors.bgSubtle,
  sidebarForeground: () => colors.fg,
  sidebarAccent: () => colors.accent,
  sidebarBorder: () => mix(colors.tone, colors.bg, 18),

  fgSoft: () => mix(colors.fg, colors.bg, 78),
  fgMuted: () => mix(colors.fg, colors.bg, 58),
  fgDisabled: () => mix(colors.fg, colors.bg, 40),

  border: () => mix(colors.tone, colors.bg, 18),
  borderStrong: () => mix(colors.tone, colors.bg, 28),
  borderAccent: () => mix(colors.brand, colors.bg, 46),

  overlay: () => lightDark(alpha(colors.fg, 0.36), alpha('#000000', 0.64)),

  primary: () => colors.brand,
  primaryHover: () => mix(colors.brand, colors.bg, 90),
  primaryActive: () => mix(colors.brand, colors.fg, 88),
  primaryForeground: () => colors.fgOnBrand,

  secondary: () =>
    lightDark(mix(colors.bg, colors.tone, 92), alpha(colors.tone, 0.11)),
  secondaryHover: () =>
    lightDark(mix(colors.bg, colors.tone, 86), alpha(colors.tone, 0.16)),
  secondaryActive: () =>
    lightDark(mix(colors.bg, colors.tone, 80), alpha(colors.tone, 0.22)),
  secondaryForeground: () => colors.fg,

  accent: () =>
    lightDark(mix(colors.bg, colors.tone, 88), alpha(colors.tone, 0.18)),
  accentForeground: () => colors.fg,

  focusRing: () => alpha(colors.tone, 0.46),
  selection: () => alpha(colors.brand, 0.18),

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
