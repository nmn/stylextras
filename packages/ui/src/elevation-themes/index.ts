import * as stylex from "@stylexjs/stylex";
import { elevation_core, elevation_derived } from "../tokens/elevation.stylex";

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

const baseTheme_core = stylex.createTheme(elevation_core, {});
const baseTheme_derived = stylex.createTheme(elevation_derived, {});
export const baseTheme = [baseTheme_core, baseTheme_derived] as const;

const softTheme_core = stylex.createTheme(elevation_core, {
  shadowColor: lightDark("rgba(15, 23, 42, 0.12)", "rgba(0, 0, 0, 0.32)"),
  offset: "2px",
  blur: "4px",
});
const softTheme_derived = stylex.createTheme(elevation_derived, {});
export const softTheme = [softTheme_core, softTheme_derived] as const;

const floatTheme_core = stylex.createTheme(elevation_core, {
  shadowColor: lightDark("rgba(15, 23, 42, 0.2)", "rgba(0, 0, 0, 0.48)"),
  offset: "4px",
  blur: "6px",
});
const floatTheme_derived = stylex.createTheme(elevation_derived, {});
export const floatTheme = [floatTheme_core, floatTheme_derived] as const;

const hardTheme_core = stylex.createTheme(elevation_core, {
  shadowColor: lightDark("rgba(17, 24, 39, 0.85)", "rgba(0, 0, 0, 0.92)"),
  offset: "6px",
  blur: "0px",
});
const hardTheme_derived = stylex.createTheme(elevation_derived, {});
export const hardTheme = [hardTheme_core, hardTheme_derived] as const;

const posterTheme_core = stylex.createTheme(elevation_core, {
  shadowColor: lightDark("rgba(17, 24, 39, 0.9)", "rgba(0, 0, 0, 0.96)"),
  offset: "10px",
  blur: "0px",
});
const posterTheme_derived = stylex.createTheme(elevation_derived, {});
export const posterTheme = [posterTheme_core, posterTheme_derived] as const;

export const elevationThemes = {
  base: baseTheme,
  soft: softTheme,
  float: floatTheme,
  hard: hardTheme,
  poster: posterTheme,
} as const;

export type ElevationThemeName = keyof typeof elevationThemes;
