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
  shadowColor: lightDark("rgba(9, 9, 11, 0.16)", "rgba(0, 0, 0, 0.56)"),
  offset: "1px",
  blur: "3px",
  xs: () =>
    `0 calc(${elevation.offset} * 1) calc(${elevation.blur} * 0.66) 0 ${alpha(elevation.shadowColor, 0.28)}`,
  sm: () =>
    `0 calc(${elevation.offset} * 1) calc(${elevation.blur} * 1) 0 ${alpha(elevation.shadowColor, 0.3)}, 0 calc(${elevation.offset} * 1) calc(${elevation.blur} * 0.66) calc(${elevation.offset} * -1) ${alpha(elevation.shadowColor, 0.24)}`,
  md: () =>
    `0 calc(${elevation.offset} * 2) calc(${elevation.blur} * 2) calc(${elevation.offset} * -1) ${alpha(elevation.shadowColor, 0.32)}, 0 calc(${elevation.offset} * 1) calc(${elevation.blur} * 1) calc(${elevation.offset} * -1) ${alpha(elevation.shadowColor, 0.2)}`,
  lg: () =>
    `0 calc(${elevation.offset} * 4) calc(${elevation.blur} * 4) calc(${elevation.offset} * -2) ${alpha(elevation.shadowColor, 0.36)}, 0 calc(${elevation.offset} * 2) calc(${elevation.blur} * 2) calc(${elevation.offset} * -1) ${alpha(elevation.shadowColor, 0.18)}`,
  xl: () =>
    `0 calc(${elevation.offset} * 6) calc(${elevation.blur} * 6) calc(${elevation.offset} * -3) ${alpha(elevation.shadowColor, 0.4)}, 0 calc(${elevation.offset} * 2) calc(${elevation.blur} * 3) calc(${elevation.offset} * -2) ${alpha(elevation.shadowColor, 0.18)}`,
});
