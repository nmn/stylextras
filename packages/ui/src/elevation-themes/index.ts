import * as stylex from "@stylexjs/stylex";
import { elevation } from "../tokens/elevation.stylex";

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

export const baseTheme = stylex.createTheme(elevation, {});

export const flatTheme = stylex.createTheme(elevation, {
  shadowColor: "transparent",
  offset: "0px",
  blur: "0px",
});

export const softTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark("rgba(9, 9, 11, 0.12)", "rgba(0, 0, 0, 0.4)"),
  offset: "1px",
  blur: "4px",
});

export const floatTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark("rgba(9, 9, 11, 0.16)", "rgba(0, 0, 0, 0.52)"),
  offset: "2px",
  blur: "5px",
});

export const hardTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark("rgba(9, 9, 11, 0.28)", "rgba(0, 0, 0, 0.72)"),
  offset: "2px",
  blur: "2px",
});

export const posterTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark("rgba(9, 9, 11, 0.36)", "rgba(0, 0, 0, 0.8)"),
  offset: "3px",
  blur: "1px",
});

export const elevationThemes = {
  base: baseTheme,
  flat: flatTheme,
  soft: softTheme,
  float: floatTheme,
  hard: hardTheme,
  poster: posterTheme,
} as const;

export type ElevationThemeName = keyof typeof elevationThemes;
