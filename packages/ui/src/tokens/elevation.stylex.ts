import type { VarGroup } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";

const round = (value: number) => Math.floor(value * 100) / 100;

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

const alpha = (color: string, opacity: number) =>
  `color-mix(in oklab, ${color} ${round(opacity * 100)}%, transparent)`;

type Televation = VarGroup<
  Readonly<{
    blur: string;
    lg: string;
    md: string;
    offset: string;
    shadowColor: string;
    sm: string;
    xl: string;
    xs: string;
  }>
>;

export const elevation: Televation = stylex.defineVars({
  shadowColor: lightDark("rgba(15, 23, 42, 0.18)", "rgba(0, 0, 0, 0.42)"),
  offset: "2px",
  blur: "2px",
  xs: () =>
    `0 calc(${elevation.offset} * 0.5) calc(${elevation.blur} * 1) 0 ${alpha(elevation.shadowColor, 0.45)}`,
  sm: () =>
    `0 calc(${elevation.offset} * 1) calc(${elevation.blur} * 1.5) 0 ${alpha(elevation.shadowColor, 0.55)}, 0 calc(${elevation.offset} * 0.5) calc(${elevation.blur} * 1) calc(${elevation.offset} * -0.5) ${alpha(elevation.shadowColor, 0.4)}`,
  md: () =>
    `0 calc(${elevation.offset} * 2) calc(${elevation.blur} * 3) calc(${elevation.offset} * -0.5) ${alpha(elevation.shadowColor, 0.5)}, 0 calc(${elevation.offset} * 1) calc(${elevation.blur} * 2) calc(${elevation.offset} * -1) ${alpha(elevation.shadowColor, 0.35)}`,
  lg: () =>
    `0 calc(${elevation.offset} * 4) calc(${elevation.blur} * 5) calc(${elevation.offset} * -1) ${alpha(elevation.shadowColor, 0.52)}, 0 calc(${elevation.offset} * 2) calc(${elevation.blur} * 3) calc(${elevation.offset} * -2) ${alpha(elevation.shadowColor, 0.34)}`,
  xl: () =>
    `0 calc(${elevation.offset} * 8) calc(${elevation.blur} * 8) calc(${elevation.offset} * -2) ${alpha(elevation.shadowColor, 0.56)}, 0 calc(${elevation.offset} * 4) calc(${elevation.blur} * 4) calc(${elevation.offset} * -3) ${alpha(elevation.shadowColor, 0.3)}`,
});
