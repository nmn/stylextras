import * as stylex from '@stylexjs/stylex'
import { typography } from '../tokens/typography.stylex'

export const uiTheme = stylex.createTheme(typography, {})

export const docsTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.875rem',
  fontSizeMax: '0.9375rem',
  scaleMin: '1.125',
  scaleMax: '1.2',
  fontSans: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
  fontDisplay: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
  fontMono: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  lineHeightTight: '1.2',
  lineHeightSnug: '1.35',
  lineHeightBody: '1.5',
  trackingTight: '-0.015em',
  trackingNormal: '0em',
  trackingWide: '0.015em',
  weightRegular: '400',
  weightMedium: '500',
  weightSemibold: '600',
  weightBold: '700',
})

export const editorialTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.9375rem',
  fontSizeMax: '1rem',
  scaleMin: '1.15',
  scaleMax: '1.2',
  fontSans: `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
  fontDisplay: `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
  lineHeightTight: '1.1',
  lineHeightSnug: '1.28',
  lineHeightBody: '1.62',
  trackingTight: '-0.03em',
  trackingNormal: '-0.01em',
  trackingWide: '0.01em',
})

export const monoTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.8125rem',
  fontSizeMax: '0.875rem',
  scaleMin: '1.12',
  scaleMax: '1.16',
  fontSans: `"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`,
  fontDisplay: `"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`,
  fontMono: `"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`,
  lineHeightTight: '1.12',
  lineHeightSnug: '1.28',
  lineHeightBody: '1.48',
  trackingTight: '-0.01em',
  trackingNormal: '0em',
  trackingWide: '0.03em',
})

export const industrialTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.875rem',
  fontSizeMax: '0.9375rem',
  scaleMin: '1.14',
  scaleMax: '1.2',
  fontSans: `"DIN Alternate", "Avenir Next Condensed", "Helvetica Neue", sans-serif`,
  fontDisplay: `"DIN Alternate", "Avenir Next Condensed", "Helvetica Neue", sans-serif`,
  lineHeightTight: '1.05',
  lineHeightSnug: '1.18',
  lineHeightBody: '1.42',
  trackingTight: '-0.04em',
  trackingNormal: '-0.015em',
  trackingWide: '0.04em',
  weightMedium: '600',
  weightSemibold: '700',
  weightBold: '800',
})

/** Rounded, friendly type for consumer and wellness products. */
export const humanistTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.875rem',
  fontSizeMax: '0.9375rem',
  scaleMin: '1.15',
  scaleMax: '1.22',
  fontSans: `"Quicksand", "Comfortaa", "Nunito", ui-sans-serif, system-ui, sans-serif`,
  fontDisplay: `"Quicksand", "Comfortaa", "Nunito", ui-sans-serif, system-ui, sans-serif`,
  lineHeightTight: '1.25',
  lineHeightSnug: '1.4',
  lineHeightBody: '1.6',
  trackingTight: '-0.005em',
  trackingNormal: '0.005em',
  trackingWide: '0.02em',
})

/** Small, tight type scale for data-dense dashboards and utility UI. */
export const compactTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.75rem',
  fontSizeMax: '0.8125rem',
  scaleMin: '1.1',
  scaleMax: '1.14',
  lineHeightTight: '1.1',
  lineHeightSnug: '1.2',
  lineHeightBody: '1.35',
  trackingTight: '-0.01em',
  trackingNormal: '0em',
  trackingWide: '0.02em',
})

export const typographyThemes = {
  ui: uiTheme,
  docs: docsTheme,
  editorial: editorialTheme,
  mono: monoTheme,
  industrial: industrialTheme,
  humanist: humanistTheme,
  compact: compactTheme,
} as const

export type TypographyThemeName = keyof typeof typographyThemes
