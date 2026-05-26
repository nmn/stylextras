import * as stylex from "@stylexjs/stylex";
import { stroke } from "../tokens/stroke.stylex";

export const baseTheme = stylex.createTheme(stroke, {});

export const boldTheme = stylex.createTheme(stroke, {
  thin: "2px",
});

export const posterTheme = stylex.createTheme(stroke, {
  thin: "3px",
});

export const brutalTheme = stylex.createTheme(stroke, {
  thin: "4px",
});

export const strokeThemes = {
  base: baseTheme,
  bold: boldTheme,
  poster: posterTheme,
  brutal: brutalTheme,
} as const;

export type StrokeThemeName = keyof typeof strokeThemes;
