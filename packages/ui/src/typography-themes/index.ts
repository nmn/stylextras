import * as stylex from "@stylexjs/stylex";
import { typography } from "../tokens/typography.stylex";

export const uiTheme = stylex.createTheme(typography, {});

export const editorialTheme = stylex.createTheme(typography, {
  fontSizeMin: "15px",
  fontSizeMax: "16px",
  scaleMin: "1.15",
  scaleMax: "1.2",
  fontSans: `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
  fontDisplay: `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
  lineHeightTight: "1.1",
  lineHeightSnug: "1.28",
  lineHeightBody: "1.62",
  trackingTight: "-0.03em",
  trackingNormal: "-0.01em",
  trackingWide: "0.01em",
});

export const monoTheme = stylex.createTheme(typography, {
  fontSizeMin: "13px",
  fontSizeMax: "14px",
  scaleMin: "1.12",
  scaleMax: "1.16",
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

export const industrialTheme = stylex.createTheme(typography, {
  fontSizeMin: "14px",
  fontSizeMax: "15px",
  scaleMin: "1.14",
  scaleMax: "1.2",
  fontSans: `"DIN Alternate", "Avenir Next Condensed", "Helvetica Neue", sans-serif`,
  fontDisplay: `"DIN Alternate", "Avenir Next Condensed", "Helvetica Neue", sans-serif`,
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

export const typographyThemes = {
  ui: uiTheme,
  editorial: editorialTheme,
  mono: monoTheme,
  industrial: industrialTheme,
} as const;

export type TypographyThemeName = keyof typeof typographyThemes;
