import * as stylex from "@stylexjs/stylex";
import { typography_core, typography_derived } from "../tokens/typography.stylex";

const uiTheme_core = stylex.createTheme(typography_core, {});
const uiTheme_derived = stylex.createTheme(typography_derived, {});
export const uiTheme = [uiTheme_core, uiTheme_derived] as const;

const editorialTheme_core = stylex.createTheme(typography_core, {
  fontSizeMin: '19px',
  fontSizeMax: '21px',
  scaleMin: '1.18',
  scaleMax: '1.24',
  fontSans: `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
  fontDisplay: `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
  lineHeightTight: "1.1",
  lineHeightSnug: "1.28",
  lineHeightBody: "1.62",
  trackingTight: "-0.03em",
  trackingNormal: "-0.01em",
  trackingWide: "0.01em",
});
const editorialTheme_derived = stylex.createTheme(typography_derived, {});
export const editorialTheme = [editorialTheme_core, editorialTheme_derived] as const;

const monoTheme_core = stylex.createTheme(typography_core, {
  fontSizeMin: '17px',
  fontSizeMax: '19px',
  scaleMin: '1.14',
  scaleMax: '1.18',
  fontSans: `"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`,
  fontDisplay: `"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`,
  fontMono: `"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`,
  lineHeightTight: "1.12",
  lineHeightSnug: "1.28",
  lineHeightBody: "1.48",
  trackingTight: "-0.01em",
  trackingNormal: "0em",
  trackingWide: "0.03em",
});
const monoTheme_derived = stylex.createTheme(typography_derived, {});
export const monoTheme = [monoTheme_core, monoTheme_derived] as const;

const industrialTheme_core = stylex.createTheme(typography_core, {
  fontSizeMin: '18px',
  fontSizeMax: '22px',
  scaleMin: '1.24',
  scaleMax: '1.32',
  fontSans: `"Arial Narrow", "Helvetica Neue", Arial, sans-serif`,
  fontDisplay: `"Arial Narrow", "Helvetica Neue", Arial, sans-serif`,
  lineHeightTight: "1.05",
  lineHeightSnug: "1.18",
  lineHeightBody: "1.42",
  trackingTight: "-0.04em",
  trackingNormal: "-0.015em",
  trackingWide: "0.04em",
  weightMedium: "600",
  weightSemibold: "700",
  weightBold: "800",
});
const industrialTheme_derived = stylex.createTheme(typography_derived, {});
export const industrialTheme = [industrialTheme_core, industrialTheme_derived] as const;

export const typographyThemes = {
  ui: uiTheme,
  editorial: editorialTheme,
  mono: monoTheme,
  industrial: industrialTheme,
} as const;

export type TypographyThemeName = keyof typeof typographyThemes;
