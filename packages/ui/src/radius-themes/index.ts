import * as stylex from "@stylexjs/stylex";
import { radius } from "../tokens/radius.stylex";

export const baseTheme = stylex.createTheme(radius, {});

export const sharpTheme = stylex.createTheme(radius, {
  base: "0px",
});

export const roundedTheme = stylex.createTheme(radius, {
  base: "10px",
});

export const subtleTheme = stylex.createTheme(radius, {
  base: "6px",
});

export const softTheme = stylex.createTheme(radius, {
  base: "14px",
});

export const pillTheme = stylex.createTheme(radius, {
  base: "20px",
});

export const radiusThemes = {
  base: baseTheme,
  sharp: sharpTheme,
  subtle: subtleTheme,
  rounded: roundedTheme,
  soft: softTheme,
  pill: pillTheme,
} as const;

export type RadiusThemeName = keyof typeof radiusThemes;
