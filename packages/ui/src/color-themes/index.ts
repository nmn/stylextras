import * as stylex from "@stylexjs/stylex";
import { color_core, color_derived } from "../tokens/color.stylex";

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

const baseTheme_core = stylex.createTheme(color_core, {});
const baseTheme_derived = stylex.createTheme(color_derived, {});
export const baseTheme = [baseTheme_core, baseTheme_derived] as const;

const monoTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(99% 0 0)", "oklch(12% 0 0)"),
  fg: lightDark("oklch(18% 0 0)", "oklch(96% 0 0)"),
  tone: lightDark("oklch(52% 0 0)", "oklch(76% 0 0)"),
  fgOnBrand: lightDark("oklch(98% 0 0)", "oklch(10% 0 0)"),
  brand: lightDark("oklch(20% 0 0)", "oklch(92% 0 0)"),
  info: lightDark("oklch(44% 0 0)", "oklch(82% 0 0)"),
  success: lightDark("oklch(44% 0 0)", "oklch(82% 0 0)"),
  warning: lightDark("oklch(44% 0 0)", "oklch(82% 0 0)"),
  danger: lightDark("oklch(44% 0 0)", "oklch(82% 0 0)"),
});
const monoTheme_derived = stylex.createTheme(color_derived, {});
export const monoTheme = [monoTheme_core, monoTheme_derived] as const;

const oceanTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.012 216)", "oklch(20% 0.022 226)"),
  fg: lightDark("oklch(28% 0.03 230)", "oklch(95% 0.012 206)"),
  tone: lightDark("oklch(58% 0.05 214)", "oklch(76% 0.04 196)"),
  fgOnBrand: lightDark("oklch(98% 0.004 220)", "oklch(11% 0.01 220)"),
  brand: lightDark("oklch(64% 0.15 220)", "oklch(74% 0.12 196)"),
  info: lightDark("oklch(60% 0.14 242)", "oklch(74% 0.11 230)"),
  success: lightDark("oklch(68% 0.14 170)", "oklch(78% 0.11 168)"),
  warning: lightDark("oklch(82% 0.14 90)", "oklch(86% 0.12 92)"),
  danger: lightDark("oklch(66% 0.16 28)", "oklch(75% 0.13 24)"),
});
const oceanTheme_derived = stylex.createTheme(color_derived, {});
export const oceanTheme = [oceanTheme_core, oceanTheme_derived] as const;

const sunsetTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.02 75)", "oklch(22% 0.025 32)"),
  fg: lightDark("oklch(30% 0.04 35)", "oklch(95% 0.012 70)"),
  tone: lightDark("oklch(62% 0.08 40)", "oklch(79% 0.06 58)"),
  fgOnBrand: lightDark("oklch(99% 0.004 70)", "oklch(14% 0.01 32)"),
  brand: lightDark("oklch(70% 0.17 42)", "oklch(78% 0.14 58)"),
  info: lightDark("oklch(60% 0.13 250)", "oklch(72% 0.11 242)"),
  success: lightDark("oklch(68% 0.13 155)", "oklch(79% 0.1 150)"),
  warning: lightDark("oklch(82% 0.16 88)", "oklch(88% 0.13 86)"),
  danger: lightDark("oklch(65% 0.18 26)", "oklch(76% 0.14 28)"),
});
const sunsetTheme_derived = stylex.createTheme(color_derived, {});
export const sunsetTheme = [sunsetTheme_core, sunsetTheme_derived] as const;

const dangerTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.012 18)", "oklch(18% 0.018 18)"),
  fg: lightDark("oklch(28% 0.05 24)", "oklch(96% 0.01 20)"),
  tone: lightDark("oklch(62% 0.19 28)", "oklch(74% 0.15 28)"),
  fgOnBrand: lightDark("oklch(99% 0.004 18)", "oklch(12% 0.015 18)"),
  brand: lightDark("oklch(62% 0.19 28)", "oklch(74% 0.15 28)"),
  info: lightDark("oklch(58% 0.11 250)", "oklch(71% 0.1 242)"),
  success: lightDark("oklch(66% 0.13 160)", "oklch(77% 0.11 158)"),
  warning: lightDark("oklch(80% 0.15 88)", "oklch(86% 0.13 86)"),
  danger: lightDark("oklch(62% 0.19 28)", "oklch(74% 0.15 28)"),
});
const dangerTheme_derived = stylex.createTheme(color_derived, {});
export const dangerTheme = [dangerTheme_core, dangerTheme_derived] as const;

export const colorThemes = {
  base: baseTheme,
  mono: monoTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  danger: dangerTheme,
} as const;

export type ColorThemeName = keyof typeof colorThemes;
