import * as stylex from "@stylexjs/stylex";
import { elevation } from "../tokens/elevation.stylex";

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

export const baseTheme = stylex.createTheme(elevation, {});

export const softTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark("rgba(15, 23, 42, 0.12)", "rgba(0, 0, 0, 0.32)"),
  offset: "2px",
  blur: "4px",
});

export const floatTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark("rgba(15, 23, 42, 0.2)", "rgba(0, 0, 0, 0.48)"),
  offset: "4px",
  blur: "6px",
});

export const hardTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark("rgba(17, 24, 39, 0.85)", "rgba(0, 0, 0, 0.92)"),
  offset: "6px",
  blur: "0px",
});

export const posterTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark("rgba(17, 24, 39, 0.9)", "rgba(0, 0, 0, 0.96)"),
  offset: "10px",
  blur: "0px",
});

export const elevationThemes = {
  base: baseTheme,
  soft: softTheme,
  float: floatTheme,
  hard: hardTheme,
  poster: posterTheme,
} as const;

export type ElevationThemeName = keyof typeof elevationThemes;
