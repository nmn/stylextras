import * as stylex from "@stylexjs/stylex";
import { spacing } from "../tokens/spacing.stylex";

export const baseTheme = stylex.createTheme(spacing, {});

export const tightTheme = stylex.createTheme(spacing, {
  base: "3px",
});
export const microTheme = tightTheme;

export const compactTheme = stylex.createTheme(spacing, {
  base: "3.5px",
});

export const cozyTheme = stylex.createTheme(spacing, {
  base: "4.5px",
});

export const roomyTheme = stylex.createTheme(spacing, {
  base: "5px",
});

export const posterTheme = stylex.createTheme(spacing, {
  base: "6px",
});

export const spacingThemes = {
  base: baseTheme,
  tight: tightTheme,
  compact: compactTheme,
  cozy: cozyTheme,
  roomy: roomyTheme,
  poster: posterTheme,
} as const;

export type SpacingThemeName = keyof typeof spacingThemes;
