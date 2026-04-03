import * as stylex from "@stylexjs/stylex";
import { spacing_core, spacing_derived } from "../tokens/spacing.stylex";

const baseTheme_core = stylex.createTheme(spacing_core, {});
const baseTheme_derived = stylex.createTheme(spacing_derived, {});
export const baseTheme = [baseTheme_core, baseTheme_derived] as const;

const tightTheme_core = stylex.createTheme(spacing_core, {
  base: "2px",
});
const tightTheme_derived = stylex.createTheme(spacing_derived, {});
export const tightTheme = [tightTheme_core, tightTheme_derived] as const;
export const microTheme = tightTheme;

const compactTheme_core = stylex.createTheme(spacing_core, {
  base: "3px",
});
const compactTheme_derived = stylex.createTheme(spacing_derived, {});
export const compactTheme = [compactTheme_core, compactTheme_derived] as const;

const cozyTheme_core = stylex.createTheme(spacing_core, {
  base: "4px",
});
const cozyTheme_derived = stylex.createTheme(spacing_derived, {});
export const cozyTheme = [cozyTheme_core, cozyTheme_derived] as const;

const roomyTheme_core = stylex.createTheme(spacing_core, {
  base: "6px",
});
const roomyTheme_derived = stylex.createTheme(spacing_derived, {});
export const roomyTheme = [roomyTheme_core, roomyTheme_derived] as const;

const posterTheme_core = stylex.createTheme(spacing_core, {
  base: "8px",
});
const posterTheme_derived = stylex.createTheme(spacing_derived, {});
export const posterTheme = [posterTheme_core, posterTheme_derived] as const;

export const spacingThemes = {
  base: baseTheme,
  tight: tightTheme,
  compact: compactTheme,
  cozy: cozyTheme,
  roomy: roomyTheme,
  poster: posterTheme,
} as const;

export type SpacingThemeName = keyof typeof spacingThemes;
