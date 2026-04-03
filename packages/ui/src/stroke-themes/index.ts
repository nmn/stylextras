import * as stylex from "@stylexjs/stylex";
import { stroke_core, stroke_derived } from "../tokens/stroke.stylex";

const baseTheme_core = stylex.createTheme(stroke_core, {});
const baseTheme_derived = stylex.createTheme(stroke_derived, {});
export const baseTheme = [baseTheme_core, baseTheme_derived] as const;

const boldTheme_core = stylex.createTheme(stroke_core, {
  thin: "2px",
});
const boldTheme_derived = stylex.createTheme(stroke_derived, {});
export const boldTheme = [boldTheme_core, boldTheme_derived] as const;

const posterTheme_core = stylex.createTheme(stroke_core, {
  thin: "3px",
});
const posterTheme_derived = stylex.createTheme(stroke_derived, {});
export const posterTheme = [posterTheme_core, posterTheme_derived] as const;

const brutalTheme_core = stylex.createTheme(stroke_core, {
  thin: "4px",
});
const brutalTheme_derived = stylex.createTheme(stroke_derived, {});
export const brutalTheme = [brutalTheme_core, brutalTheme_derived] as const;

export const strokeThemes = {
  base: baseTheme,
  bold: boldTheme,
  poster: posterTheme,
  brutal: brutalTheme,
} as const;

export type StrokeThemeName = keyof typeof strokeThemes;
