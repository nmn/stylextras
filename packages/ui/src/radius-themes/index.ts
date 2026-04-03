import * as stylex from "@stylexjs/stylex";
import { radius_core, radius_derived } from "../tokens/radius.stylex";

const baseTheme_core = stylex.createTheme(radius_core, {});
const baseTheme_derived = stylex.createTheme(radius_derived, {});
export const baseTheme = [baseTheme_core, baseTheme_derived] as const;

const sharpTheme_core = stylex.createTheme(radius_core, {
  base: "2px",
});
const sharpTheme_derived = stylex.createTheme(radius_derived, {});
export const sharpTheme = [sharpTheme_core, sharpTheme_derived] as const;

const roundedTheme_core = stylex.createTheme(radius_core, {
  base: "10px",
});
const roundedTheme_derived = stylex.createTheme(radius_derived, {});
export const roundedTheme = [roundedTheme_core, roundedTheme_derived] as const;

const softTheme_core = stylex.createTheme(radius_core, {
  base: "14px",
});
const softTheme_derived = stylex.createTheme(radius_derived, {});
export const softTheme = [softTheme_core, softTheme_derived] as const;

const pillTheme_core = stylex.createTheme(radius_core, {
  base: "18px",
});
const pillTheme_derived = stylex.createTheme(radius_derived, {});
export const pillTheme = [pillTheme_core, pillTheme_derived] as const;

export const radiusThemes = {
  base: baseTheme,
  sharp: sharpTheme,
  rounded: roundedTheme,
  soft: softTheme,
  pill: pillTheme,
} as const;

export type RadiusThemeName = keyof typeof radiusThemes;
