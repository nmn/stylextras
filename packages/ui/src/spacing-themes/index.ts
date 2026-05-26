import * as stylex from "@stylexjs/stylex";
import { spacing } from "../tokens/spacing.stylex";

export const baseTheme = stylex.createTheme(spacing, {});

export const tightTheme = stylex.createTheme(spacing, {
  base: "2px",
});
export const microTheme = tightTheme;

export const compactTheme = stylex.createTheme(spacing, {
  base: "3px",
});

export const cozyTheme = stylex.createTheme(spacing, {
  base: "4px",
});

export const roomyTheme = stylex.createTheme(spacing, {
  base: "6px",
});

export const posterTheme = stylex.createTheme(spacing, {
  base: "8px",
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
