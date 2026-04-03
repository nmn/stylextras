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

const forestTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.012 150)", "oklch(19% 0.018 154)"),
  fg: lightDark("oklch(27% 0.03 154)", "oklch(96% 0.01 150)"),
  tone: lightDark("oklch(56% 0.06 152)", "oklch(76% 0.05 150)"),
  fgOnBrand: lightDark("oklch(99% 0.004 150)", "oklch(12% 0.01 154)"),
  brand: lightDark("oklch(58% 0.16 152)", "oklch(73% 0.13 150)"),
  info: lightDark("oklch(60% 0.12 235)", "oklch(72% 0.1 230)"),
  success: lightDark("oklch(61% 0.17 150)", "oklch(76% 0.12 150)"),
  warning: lightDark("oklch(80% 0.15 92)", "oklch(86% 0.12 92)"),
  danger: lightDark("oklch(62% 0.18 28)", "oklch(74% 0.14 28)"),
});
const forestTheme_derived = stylex.createTheme(color_derived, {});
export const forestTheme = [forestTheme_core, forestTheme_derived] as const;

const roseTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.012 8)", "oklch(20% 0.015 350)"),
  fg: lightDark("oklch(26% 0.04 350)", "oklch(96% 0.01 8)"),
  tone: lightDark("oklch(58% 0.08 356)", "oklch(79% 0.06 356)"),
  fgOnBrand: lightDark("oklch(99% 0.004 8)", "oklch(12% 0.01 350)"),
  brand: lightDark("oklch(67% 0.18 356)", "oklch(77% 0.13 356)"),
  info: lightDark("oklch(59% 0.13 245)", "oklch(72% 0.11 242)"),
  success: lightDark("oklch(64% 0.14 155)", "oklch(77% 0.11 152)"),
  warning: lightDark("oklch(81% 0.15 86)", "oklch(87% 0.12 86)"),
  danger: lightDark("oklch(67% 0.18 18)", "oklch(76% 0.14 22)"),
});
const roseTheme_derived = stylex.createTheme(color_derived, {});
export const roseTheme = [roseTheme_core, roseTheme_derived] as const;

const cobaltTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.01 258)", "oklch(18% 0.02 262)"),
  fg: lightDark("oklch(25% 0.05 262)", "oklch(97% 0.008 258)"),
  tone: lightDark("oklch(55% 0.1 262)", "oklch(76% 0.08 258)"),
  fgOnBrand: lightDark("oklch(99% 0.004 258)", "oklch(10% 0.012 262)"),
  brand: lightDark("oklch(56% 0.2 264)", "oklch(72% 0.16 262)"),
  info: lightDark("oklch(60% 0.16 242)", "oklch(73% 0.12 238)"),
  success: lightDark("oklch(66% 0.15 160)", "oklch(77% 0.11 160)"),
  warning: lightDark("oklch(79% 0.15 88)", "oklch(85% 0.12 90)"),
  danger: lightDark("oklch(63% 0.18 26)", "oklch(74% 0.14 28)"),
});
const cobaltTheme_derived = stylex.createTheme(color_derived, {});
export const cobaltTheme = [cobaltTheme_core, cobaltTheme_derived] as const;

const paperTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(99% 0.002 85)", "oklch(24% 0.008 65)"),
  fg: lightDark("oklch(28% 0.015 55)", "oklch(96% 0.004 85)"),
  tone: lightDark("oklch(54% 0.02 75)", "oklch(78% 0.018 78)"),
  fgOnBrand: lightDark("oklch(99% 0.004 80)", "oklch(14% 0.008 60)"),
  brand: lightDark("oklch(42% 0.07 55)", "oklch(80% 0.035 80)"),
  info: lightDark("oklch(55% 0.11 240)", "oklch(72% 0.09 236)"),
  success: lightDark("oklch(55% 0.11 150)", "oklch(76% 0.08 152)"),
  warning: lightDark("oklch(78% 0.12 88)", "oklch(85% 0.1 88)"),
  danger: lightDark("oklch(58% 0.14 28)", "oklch(74% 0.1 28)"),
});
const paperTheme_derived = stylex.createTheme(color_derived, {});
export const paperTheme = [paperTheme_core, paperTheme_derived] as const;

const terminalTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(96% 0.004 150)", "oklch(14% 0.018 150)"),
  fg: lightDark("oklch(18% 0.03 150)", "oklch(92% 0.06 150)"),
  tone: lightDark("oklch(48% 0.06 150)", "oklch(74% 0.07 150)"),
  fgOnBrand: lightDark("oklch(98% 0.004 150)", "oklch(10% 0.015 150)"),
  brand: lightDark("oklch(54% 0.17 150)", "oklch(74% 0.14 150)"),
  info: lightDark("oklch(55% 0.12 240)", "oklch(72% 0.1 236)"),
  success: lightDark("oklch(54% 0.17 150)", "oklch(74% 0.14 150)"),
  warning: lightDark("oklch(79% 0.14 90)", "oklch(85% 0.12 90)"),
  danger: lightDark("oklch(60% 0.17 28)", "oklch(73% 0.13 28)"),
});
const terminalTheme_derived = stylex.createTheme(color_derived, {});
export const terminalTheme = [terminalTheme_core, terminalTheme_derived] as const;

const citrusTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(99% 0.01 105)", "oklch(20% 0.02 105)"),
  fg: lightDark("oklch(25% 0.03 90)", "oklch(96% 0.008 105)"),
  tone: lightDark("oklch(62% 0.08 105)", "oklch(78% 0.07 102)"),
  fgOnBrand: lightDark("oklch(98% 0.004 105)", "oklch(12% 0.01 105)"),
  brand: lightDark("oklch(74% 0.19 108)", "oklch(81% 0.15 106)"),
  info: lightDark("oklch(58% 0.13 245)", "oklch(72% 0.11 240)"),
  success: lightDark("oklch(66% 0.14 155)", "oklch(78% 0.1 155)"),
  warning: lightDark("oklch(79% 0.18 90)", "oklch(86% 0.14 90)"),
  danger: lightDark("oklch(62% 0.18 28)", "oklch(74% 0.13 28)"),
});
const citrusTheme_derived = stylex.createTheme(color_derived, {});
export const citrusTheme = [citrusTheme_core, citrusTheme_derived] as const;

const plumTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.01 320)", "oklch(18% 0.02 320)"),
  fg: lightDark("oklch(24% 0.04 320)", "oklch(96% 0.008 320)"),
  tone: lightDark("oklch(56% 0.08 318)", "oklch(78% 0.06 318)"),
  fgOnBrand: lightDark("oklch(99% 0.004 320)", "oklch(12% 0.01 320)"),
  brand: lightDark("oklch(58% 0.17 318)", "oklch(74% 0.13 318)"),
  info: lightDark("oklch(59% 0.13 245)", "oklch(72% 0.11 242)"),
  success: lightDark("oklch(64% 0.14 155)", "oklch(77% 0.11 155)"),
  warning: lightDark("oklch(80% 0.15 88)", "oklch(86% 0.12 88)"),
  danger: lightDark("oklch(63% 0.18 28)", "oklch(74% 0.14 28)"),
});
const plumTheme_derived = stylex.createTheme(color_derived, {});
export const plumTheme = [plumTheme_core, plumTheme_derived] as const;

const candyTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.012 345)", "oklch(22% 0.02 330)"),
  fg: lightDark("oklch(28% 0.05 340)", "oklch(97% 0.008 345)"),
  tone: lightDark("oklch(62% 0.1 338)", "oklch(80% 0.07 338)"),
  fgOnBrand: lightDark("oklch(99% 0.004 345)", "oklch(12% 0.01 330)"),
  brand: lightDark("oklch(71% 0.2 338)", "oklch(79% 0.14 338)"),
  info: lightDark("oklch(61% 0.15 250)", "oklch(73% 0.11 245)"),
  success: lightDark("oklch(66% 0.14 160)", "oklch(78% 0.1 160)"),
  warning: lightDark("oklch(82% 0.16 92)", "oklch(87% 0.13 92)"),
  danger: lightDark("oklch(68% 0.18 20)", "oklch(76% 0.14 24)"),
});
const candyTheme_derived = stylex.createTheme(color_derived, {});
export const candyTheme = [candyTheme_core, candyTheme_derived] as const;

const clayTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.006 40)", "oklch(23% 0.015 38)"),
  fg: lightDark("oklch(26% 0.025 35)", "oklch(96% 0.006 40)"),
  tone: lightDark("oklch(54% 0.04 38)", "oklch(78% 0.03 38)"),
  fgOnBrand: lightDark("oklch(99% 0.004 40)", "oklch(14% 0.008 38)"),
  brand: lightDark("oklch(55% 0.12 34)", "oklch(74% 0.09 34)"),
  info: lightDark("oklch(58% 0.12 245)", "oklch(72% 0.1 240)"),
  success: lightDark("oklch(64% 0.13 155)", "oklch(77% 0.1 155)"),
  warning: lightDark("oklch(79% 0.14 88)", "oklch(85% 0.11 88)"),
  danger: lightDark("oklch(61% 0.16 28)", "oklch(74% 0.12 28)"),
});
const clayTheme_derived = stylex.createTheme(color_derived, {});
export const clayTheme = [clayTheme_core, clayTheme_derived] as const;

const mintTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(99% 0.008 168)", "oklch(18% 0.02 168)"),
  fg: lightDark("oklch(22% 0.03 176)", "oklch(96% 0.008 168)"),
  tone: lightDark("oklch(56% 0.06 172)", "oklch(78% 0.05 170)"),
  fgOnBrand: lightDark("oklch(99% 0.004 170)", "oklch(11% 0.01 170)"),
  brand: lightDark("oklch(70% 0.15 170)", "oklch(79% 0.11 170)"),
  info: lightDark("oklch(59% 0.13 245)", "oklch(72% 0.11 240)"),
  success: lightDark("oklch(68% 0.15 166)", "oklch(79% 0.11 166)"),
  warning: lightDark("oklch(80% 0.15 92)", "oklch(86% 0.12 92)"),
  danger: lightDark("oklch(62% 0.17 28)", "oklch(74% 0.13 28)"),
});
const mintTheme_derived = stylex.createTheme(color_derived, {});
export const mintTheme = [mintTheme_core, mintTheme_derived] as const;

const amberTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(99% 0.008 85)", "oklch(20% 0.018 70)"),
  fg: lightDark("oklch(24% 0.03 62)", "oklch(96% 0.008 84)"),
  tone: lightDark("oklch(58% 0.07 72)", "oklch(80% 0.06 78)"),
  fgOnBrand: lightDark("oklch(99% 0.004 80)", "oklch(12% 0.01 70)"),
  brand: lightDark("oklch(72% 0.16 74)", "oklch(81% 0.12 78)"),
  info: lightDark("oklch(58% 0.13 245)", "oklch(72% 0.11 240)"),
  success: lightDark("oklch(65% 0.13 155)", "oklch(77% 0.1 155)"),
  warning: lightDark("oklch(76% 0.17 78)", "oklch(84% 0.13 80)"),
  danger: lightDark("oklch(63% 0.18 28)", "oklch(74% 0.14 28)"),
});
const amberTheme_derived = stylex.createTheme(color_derived, {});
export const amberTheme = [amberTheme_core, amberTheme_derived] as const;

const lavenderTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(99% 0.01 300)", "oklch(18% 0.018 300)"),
  fg: lightDark("oklch(24% 0.03 300)", "oklch(96% 0.008 300)"),
  tone: lightDark("oklch(60% 0.06 302)", "oklch(80% 0.05 300)"),
  fgOnBrand: lightDark("oklch(99% 0.004 300)", "oklch(12% 0.01 300)"),
  brand: lightDark("oklch(69% 0.13 302)", "oklch(79% 0.1 302)"),
  info: lightDark("oklch(60% 0.13 245)", "oklch(72% 0.11 240)"),
  success: lightDark("oklch(65% 0.13 155)", "oklch(77% 0.1 155)"),
  warning: lightDark("oklch(80% 0.15 88)", "oklch(86% 0.12 88)"),
  danger: lightDark("oklch(63% 0.17 28)", "oklch(74% 0.13 28)"),
});
const lavenderTheme_derived = stylex.createTheme(color_derived, {});
export const lavenderTheme = [lavenderTheme_core, lavenderTheme_derived] as const;

const cherryTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.01 18)", "oklch(17% 0.02 12)"),
  fg: lightDark("oklch(22% 0.05 18)", "oklch(96% 0.008 18)"),
  tone: lightDark("oklch(55% 0.09 18)", "oklch(77% 0.07 18)"),
  fgOnBrand: lightDark("oklch(99% 0.004 18)", "oklch(11% 0.012 12)"),
  brand: lightDark("oklch(58% 0.21 20)", "oklch(73% 0.16 20)"),
  info: lightDark("oklch(58% 0.13 245)", "oklch(72% 0.11 240)"),
  success: lightDark("oklch(65% 0.13 155)", "oklch(77% 0.1 155)"),
  warning: lightDark("oklch(80% 0.16 88)", "oklch(86% 0.13 88)"),
  danger: lightDark("oklch(58% 0.21 20)", "oklch(73% 0.16 20)"),
});
const cherryTheme_derived = stylex.createTheme(color_derived, {});
export const cherryTheme = [cherryTheme_core, cherryTheme_derived] as const;

const tealTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(99% 0.008 210)", "oklch(18% 0.02 210)"),
  fg: lightDark("oklch(22% 0.03 215)", "oklch(96% 0.008 210)"),
  tone: lightDark("oklch(56% 0.07 212)", "oklch(78% 0.06 210)"),
  fgOnBrand: lightDark("oklch(99% 0.004 210)", "oklch(11% 0.01 210)"),
  brand: lightDark("oklch(64% 0.13 214)", "oklch(77% 0.1 210)"),
  info: lightDark("oklch(60% 0.14 242)", "oklch(73% 0.11 238)"),
  success: lightDark("oklch(66% 0.14 165)", "oklch(78% 0.1 165)"),
  warning: lightDark("oklch(80% 0.15 90)", "oklch(86% 0.12 90)"),
  danger: lightDark("oklch(62% 0.18 28)", "oklch(74% 0.14 28)"),
});
const tealTheme_derived = stylex.createTheme(color_derived, {});
export const tealTheme = [tealTheme_core, tealTheme_derived] as const;

const skyTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(99% 0.006 240)", "oklch(18% 0.02 244)"),
  fg: lightDark("oklch(22% 0.03 244)", "oklch(97% 0.006 240)"),
  tone: lightDark("oklch(58% 0.06 242)", "oklch(79% 0.05 240)"),
  fgOnBrand: lightDark("oklch(99% 0.004 240)", "oklch(11% 0.01 244)"),
  brand: lightDark("oklch(72% 0.12 244)", "oklch(80% 0.09 244)"),
  info: lightDark("oklch(63% 0.13 244)", "oklch(75% 0.1 242)"),
  success: lightDark("oklch(66% 0.13 155)", "oklch(77% 0.1 155)"),
  warning: lightDark("oklch(80% 0.15 88)", "oklch(86% 0.12 88)"),
  danger: lightDark("oklch(63% 0.18 28)", "oklch(74% 0.14 28)"),
});
const skyTheme_derived = stylex.createTheme(color_derived, {});
export const skyTheme = [skyTheme_core, skyTheme_derived] as const;

const sepiaTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(99% 0.004 70)", "oklch(21% 0.012 55)"),
  fg: lightDark("oklch(25% 0.02 55)", "oklch(95% 0.005 70)"),
  tone: lightDark("oklch(52% 0.03 55)", "oklch(77% 0.025 60)"),
  fgOnBrand: lightDark("oklch(99% 0.004 70)", "oklch(13% 0.008 55)"),
  brand: lightDark("oklch(48% 0.09 45)", "oklch(76% 0.06 52)"),
  info: lightDark("oklch(58% 0.12 245)", "oklch(72% 0.1 240)"),
  success: lightDark("oklch(63% 0.12 155)", "oklch(76% 0.09 155)"),
  warning: lightDark("oklch(78% 0.14 88)", "oklch(85% 0.11 88)"),
  danger: lightDark("oklch(60% 0.16 28)", "oklch(74% 0.12 28)"),
});
const sepiaTheme_derived = stylex.createTheme(color_derived, {});
export const sepiaTheme = [sepiaTheme_core, sepiaTheme_derived] as const;

const noirTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(97% 0.002 260)", "oklch(10% 0.006 260)"),
  fg: lightDark("oklch(16% 0.004 260)", "oklch(98% 0.002 260)"),
  tone: lightDark("oklch(46% 0.008 260)", "oklch(82% 0.01 260)"),
  fgOnBrand: lightDark("oklch(99% 0.002 260)", "oklch(6% 0.004 260)"),
  brand: lightDark("oklch(14% 0.01 260)", "oklch(92% 0.008 260)"),
  info: lightDark("oklch(44% 0.02 242)", "oklch(82% 0.03 242)"),
  success: lightDark("oklch(44% 0.03 155)", "oklch(82% 0.04 155)"),
  warning: lightDark("oklch(54% 0.05 88)", "oklch(86% 0.06 88)"),
  danger: lightDark("oklch(48% 0.08 24)", "oklch(82% 0.08 24)"),
});
const noirTheme_derived = stylex.createTheme(color_derived, {});
export const noirTheme = [noirTheme_core, noirTheme_derived] as const;

const neonTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.012 140)", "oklch(12% 0.03 150)"),
  fg: lightDark("oklch(18% 0.04 150)", "oklch(96% 0.015 140)"),
  tone: lightDark("oklch(60% 0.12 150)", "oklch(80% 0.12 150)"),
  fgOnBrand: lightDark("oklch(99% 0.004 145)", "oklch(7% 0.02 150)"),
  brand: lightDark("oklch(78% 0.24 145)", "oklch(84% 0.2 145)"),
  info: lightDark("oklch(70% 0.19 225)", "oklch(79% 0.16 225)"),
  success: lightDark("oklch(78% 0.24 145)", "oklch(84% 0.2 145)"),
  warning: lightDark("oklch(84% 0.2 100)", "oklch(88% 0.16 100)"),
  danger: lightDark("oklch(72% 0.22 20)", "oklch(80% 0.18 20)"),
});
const neonTheme_derived = stylex.createTheme(color_derived, {});
export const neonTheme = [neonTheme_core, neonTheme_derived] as const;

const lagoonTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(98% 0.01 190)", "oklch(18% 0.022 196)"),
  fg: lightDark("oklch(23% 0.03 196)", "oklch(96% 0.008 190)"),
  tone: lightDark("oklch(57% 0.08 194)", "oklch(78% 0.06 192)"),
  fgOnBrand: lightDark("oklch(99% 0.004 190)", "oklch(11% 0.01 196)"),
  brand: lightDark("oklch(66% 0.16 194)", "oklch(77% 0.12 192)"),
  info: lightDark("oklch(60% 0.14 238)", "oklch(73% 0.11 236)"),
  success: lightDark("oklch(67% 0.14 165)", "oklch(78% 0.11 165)"),
  warning: lightDark("oklch(80% 0.15 90)", "oklch(86% 0.12 90)"),
  danger: lightDark("oklch(62% 0.18 28)", "oklch(74% 0.13 28)"),
});
const lagoonTheme_derived = stylex.createTheme(color_derived, {});
export const lagoonTheme = [lagoonTheme_core, lagoonTheme_derived] as const;

const sandTheme_core = stylex.createTheme(color_core, {
  bg: lightDark("oklch(99% 0.004 95)", "oklch(23% 0.012 85)"),
  fg: lightDark("oklch(26% 0.02 80)", "oklch(96% 0.005 95)"),
  tone: lightDark("oklch(54% 0.03 88)", "oklch(78% 0.025 92)"),
  fgOnBrand: lightDark("oklch(99% 0.004 95)", "oklch(14% 0.008 85)"),
  brand: lightDark("oklch(60% 0.08 85)", "oklch(78% 0.06 88)"),
  info: lightDark("oklch(58% 0.12 242)", "oklch(72% 0.1 238)"),
  success: lightDark("oklch(63% 0.12 155)", "oklch(76% 0.09 155)"),
  warning: lightDark("oklch(80% 0.14 88)", "oklch(86% 0.11 88)"),
  danger: lightDark("oklch(60% 0.16 28)", "oklch(74% 0.12 28)"),
});
const sandTheme_derived = stylex.createTheme(color_derived, {});
export const sandTheme = [sandTheme_core, sandTheme_derived] as const;

export const colorThemes = {
  base: baseTheme,
  mono: monoTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  danger: dangerTheme,
  forest: forestTheme,
  rose: roseTheme,
  cobalt: cobaltTheme,
  paper: paperTheme,
  terminal: terminalTheme,
  citrus: citrusTheme,
  plum: plumTheme,
  candy: candyTheme,
  clay: clayTheme,
  mint: mintTheme,
  amber: amberTheme,
  lavender: lavenderTheme,
  cherry: cherryTheme,
  teal: tealTheme,
  sky: skyTheme,
  sepia: sepiaTheme,
  noir: noirTheme,
  neon: neonTheme,
  lagoon: lagoonTheme,
  sand: sandTheme,
} as const;

export type ColorThemeName = keyof typeof colorThemes;
