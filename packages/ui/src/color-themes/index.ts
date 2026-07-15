import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

/** The default achromatic palette. */
export const neutralTheme = stylex.createTheme(colors, {})

/** Warm mineral neutrals. */
export const stoneTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.7% 0.004 49.25)'),
  fg: lightDark('oklch(14.7% 0.004 49.25)', 'oklch(98.5% 0.001 106.42)'),
  tone: lightDark('oklch(55.3% 0.013 58.07)', 'oklch(70.9% 0.01 56.26)'),
  brand: lightDark('oklch(21.6% 0.006 56.04)', 'oklch(92.3% 0.003 48.72)'),
  fgOnBrand: lightDark('oklch(98.5% 0.001 106.42)', 'oklch(21.6% 0.006 56.04)'),
})

/** Cool graphite neutrals. */
export const zincTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.1% 0.005 285.82)'),
  fg: lightDark('oklch(14.1% 0.005 285.82)', 'oklch(98.5% 0 0)'),
  tone: lightDark('oklch(55.2% 0.016 285.94)', 'oklch(70.5% 0.015 286.07)'),
  brand: lightDark('oklch(21% 0.006 285.89)', 'oklch(92% 0.004 286.32)'),
  fgOnBrand: lightDark('oklch(98.5% 0 0)', 'oklch(21% 0.006 285.89)'),
})

/** Plum-leaning neutral surfaces. */
export const mauveTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.5% 0.008 326)'),
  fg: lightDark('oklch(14.5% 0.008 326)', 'oklch(98.5% 0 0)'),
  tone: lightDark('oklch(54.2% 0.034 322.5)', 'oklch(71.1% 0.019 323.02)'),
  brand: lightDark('oklch(21.2% 0.019 322.12)', 'oklch(92.2% 0.005 325.62)'),
  fgOnBrand: lightDark('oklch(98.5% 0 0)', 'oklch(21.2% 0.019 322.12)'),
})

/** Botanical gray-green neutrals. */
export const oliveTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(15.3% 0.006 107.1)'),
  fg: lightDark('oklch(15.3% 0.006 107.1)', 'oklch(98.8% 0.003 106.5)'),
  tone: lightDark('oklch(58% 0.031 107.3)', 'oklch(73.7% 0.021 106.9)'),
  brand: lightDark('oklch(22.8% 0.013 107.4)', 'oklch(93% 0.007 106.5)'),
  fgOnBrand: lightDark('oklch(98.8% 0.003 106.5)', 'oklch(22.8% 0.013 107.4)'),
})

/** Airy blue-gray neutrals. */
export const mistTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.8% 0.004 228.8)'),
  fg: lightDark('oklch(14.8% 0.004 228.8)', 'oklch(98.7% 0.002 197.1)'),
  tone: lightDark('oklch(56% 0.021 213.5)', 'oklch(72.3% 0.014 214.4)'),
  brand: lightDark('oklch(21.8% 0.008 223.9)', 'oklch(92.5% 0.005 214.3)'),
  fgOnBrand: lightDark('oklch(98.7% 0.002 197.1)', 'oklch(21.8% 0.008 223.9)'),
})

/** Earthy brown-gray neutrals. */
export const taupeTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.8% 0.004 49.3)'),
  fg: lightDark('oklch(14.8% 0.004 49.3)', 'oklch(98.6% 0.002 67.8)'),
  tone: lightDark('oklch(55.6% 0.014 58.1)', 'oklch(71% 0.012 56.3)'),
  brand: lightDark('oklch(21.4% 0.009 43.1)', 'oklch(92.2% 0.005 34.3)'),
  fgOnBrand: lightDark('oklch(98.6% 0.002 67.8)', 'oklch(21.4% 0.009 43.1)'),
})

export const amberTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(55.5% 0.163 49)'),
  tone: lightDark('oklch(66.6% 0.035 58.3)', 'oklch(79.5% 0.04 86.1)'),
  brand: lightDark('oklch(55.5% 0.163 49)', 'oklch(47.3% 0.137 46.2)'),
  fgOnBrand: lightDark('oklch(98.7% 0.022 95.3)', 'oklch(98.7% 0.022 95.3)'),
})

export const blueTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(48.8% 0.243 264.38)'),
  tone: lightDark('oklch(54.6% 0.04 262.9)', 'oklch(70.7% 0.035 254.6)'),
  brand: lightDark('oklch(48.8% 0.243 264.38)', 'oklch(42.4% 0.199 265.64)'),
  fgOnBrand: lightDark('oklch(97% 0.014 254.6)', 'oklch(97% 0.014 254.6)'),
})

export const cyanTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(52% 0.105 223.13)'),
  tone: lightDark('oklch(60.9% 0.03 221.72)', 'oklch(78.9% 0.035 211.53)'),
  brand: lightDark('oklch(52% 0.105 223.13)', 'oklch(45% 0.085 224.28)'),
  fgOnBrand: lightDark('oklch(98.4% 0.019 200.87)', 'oklch(98.4% 0.019 200.87)'),
})

export const emeraldTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(50.8% 0.118 165.61)'),
  tone: lightDark('oklch(59.6% 0.03 163.23)', 'oklch(76.5% 0.035 163.22)'),
  brand: lightDark('oklch(50.8% 0.118 165.61)', 'oklch(43.2% 0.095 166.91)'),
  fgOnBrand: lightDark('oklch(97.9% 0.021 166.11)', 'oklch(97.9% 0.021 166.11)'),
})

export const fuchsiaTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(51.8% 0.253 323.95)'),
  tone: lightDark('oklch(59.1% 0.045 322.9)', 'oklch(74% 0.04 322.16)'),
  brand: lightDark('oklch(51.8% 0.253 323.95)', 'oklch(45.2% 0.211 324.59)'),
  fgOnBrand: lightDark('oklch(97.7% 0.017 320.06)', 'oklch(97.7% 0.017 320.06)'),
})

export const greenTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(52.7% 0.154 150.07)'),
  tone: lightDark('oklch(62.7% 0.035 149.21)', 'oklch(79.2% 0.04 151.71)'),
  brand: lightDark('oklch(52.7% 0.154 150.07)', 'oklch(44.8% 0.119 151.33)'),
  fgOnBrand: lightDark('oklch(98.2% 0.018 155.83)', 'oklch(98.2% 0.018 155.83)'),
})

export const indigoTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(45.7% 0.24 277.02)'),
  tone: lightDark('oklch(51.1% 0.04 276.97)', 'oklch(68.5% 0.035 277.73)'),
  brand: lightDark('oklch(45.7% 0.24 277.02)', 'oklch(39.8% 0.195 277.37)'),
  fgOnBrand: lightDark('oklch(96.2% 0.018 272.31)', 'oklch(96.2% 0.018 272.31)'),
})

export const limeTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(84.1% 0.238 128.85)'),
  tone: lightDark('oklch(64.8% 0.035 131.68)', 'oklch(86.5% 0.04 128.4)'),
  brand: lightDark('oklch(84.1% 0.238 128.85)', 'oklch(76.8% 0.233 130.85)'),
  fgOnBrand: lightDark('oklch(40.5% 0.101 131.06)', 'oklch(40.5% 0.101 131.06)'),
})

export const orangeTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(55.3% 0.195 38.4)'),
  tone: lightDark('oklch(64.6% 0.04 41.12)', 'oklch(75% 0.035 55.93)'),
  brand: lightDark('oklch(55.3% 0.195 38.4)', 'oklch(47% 0.157 37.3)'),
  fgOnBrand: lightDark('oklch(98% 0.016 73.68)', 'oklch(98% 0.016 73.68)'),
})

export const pinkTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(52.5% 0.223 3.96)'),
  tone: lightDark('oklch(59.2% 0.04 0.58)', 'oklch(71.8% 0.04 349.76)'),
  brand: lightDark('oklch(52.5% 0.223 3.96)', 'oklch(45.9% 0.187 3.82)'),
  fgOnBrand: lightDark('oklch(97.1% 0.014 343.2)', 'oklch(97.1% 0.014 343.2)'),
})

export const purpleTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(49.6% 0.265 301.92)'),
  tone: lightDark('oklch(55.8% 0.045 302.32)', 'oklch(71.4% 0.04 305.5)'),
  brand: lightDark('oklch(49.6% 0.265 301.92)', 'oklch(43.8% 0.218 303.72)'),
  fgOnBrand: lightDark('oklch(97.7% 0.014 308.3)', 'oklch(97.7% 0.014 308.3)'),
})

export const redTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(50.5% 0.213 27.52)'),
  tone: lightDark('oklch(57.7% 0.04 27.33)', 'oklch(70.4% 0.04 22.22)'),
  brand: lightDark('oklch(50.5% 0.213 27.52)', 'oklch(44.4% 0.177 26.9)'),
  fgOnBrand: lightDark('oklch(97.1% 0.013 17.38)', 'oklch(97.1% 0.013 17.38)'),
})

export const roseTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(51.4% 0.222 16.94)'),
  tone: lightDark('oklch(58.6% 0.04 17.59)', 'oklch(71.2% 0.04 13.43)'),
  brand: lightDark('oklch(51.4% 0.222 16.94)', 'oklch(45.5% 0.188 13.7)'),
  fgOnBrand: lightDark('oklch(96.9% 0.015 12.42)', 'oklch(96.9% 0.015 12.42)'),
})

export const skyTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(50% 0.134 242.75)'),
  tone: lightDark('oklch(58.8% 0.03 241.97)', 'oklch(74.6% 0.035 232.66)'),
  brand: lightDark('oklch(50% 0.134 242.75)', 'oklch(44.3% 0.11 240.79)'),
  fgOnBrand: lightDark('oklch(97.7% 0.013 236.62)', 'oklch(97.7% 0.013 236.62)'),
})

export const tealTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(51.1% 0.096 186.39)'),
  tone: lightDark('oklch(60% 0.025 184.7)', 'oklch(77.7% 0.03 181.91)'),
  brand: lightDark('oklch(51.1% 0.096 186.39)', 'oklch(43.7% 0.078 188.22)'),
  fgOnBrand: lightDark('oklch(98.4% 0.014 180.72)', 'oklch(98.4% 0.014 180.72)'),
})

export const violetTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(49.1% 0.27 292.58)'),
  tone: lightDark('oklch(54.1% 0.045 293.01)', 'oklch(70.2% 0.04 293.54)'),
  brand: lightDark('oklch(49.1% 0.27 292.58)', 'oklch(43.2% 0.232 292.76)'),
  fgOnBrand: lightDark('oklch(96.9% 0.016 293.76)', 'oklch(96.9% 0.016 293.76)'),
})

export const yellowTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(85.2% 0.199 91.94)'),
  tone: lightDark('oklch(68.1% 0.035 75.83)', 'oklch(85.2% 0.04 91.94)'),
  brand: lightDark('oklch(85.2% 0.199 91.94)', 'oklch(79.5% 0.184 86.05)'),
  fgOnBrand: lightDark('oklch(42.1% 0.095 57.71)', 'oklch(42.1% 0.095 57.71)'),
})

export const colorThemes = {
  neutral: neutralTheme,
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
} as const

export type ColorThemeName = keyof typeof colorThemes
