import * as stylex from "@stylexjs/stylex";
import { radius } from "../tokens/radius.stylex";

export const baseTheme = stylex.createTheme(radius, {});

export const sharpTheme = stylex.createTheme(radius, {
  base: "2px",
});

export const roundedTheme = stylex.createTheme(radius, {
  base: "10px",
});

export const softTheme = stylex.createTheme(radius, {
  base: "14px",
});

export const pillTheme = stylex.createTheme(radius, {
  base: "18px",
});

export const radiusThemes = {
  base: baseTheme,
  sharp: sharpTheme,
  rounded: roundedTheme,
  soft: softTheme,
  pill: pillTheme,
} as const;

export type RadiusThemeName = keyof typeof radiusThemes;
