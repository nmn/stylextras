import * as stylex from "@stylexjs/stylex";

const round = (value: number) => Math.floor(value * 100) / 100;

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

const alpha = (color: string, opacity: number) =>
  `color-mix(in oklab, ${color} ${round(opacity * 100)}%, transparent)`;

export const elevation_core = stylex.defineVars({
  shadowColor: lightDark("rgba(15, 23, 42, 0.18)", "rgba(0, 0, 0, 0.42)"),
  offset: "2px",
  blur: "2px",
});

export const elevation_derived = stylex.defineVars({
  xs: `0 calc(${elevation_core.offset} * 0.5) calc(${elevation_core.blur} * 1) 0 ${alpha(elevation_core.shadowColor, 0.45)}`,
  sm: `0 calc(${elevation_core.offset} * 1) calc(${elevation_core.blur} * 1.5) 0 ${alpha(elevation_core.shadowColor, 0.55)}, 0 calc(${elevation_core.offset} * 0.5) calc(${elevation_core.blur} * 1) calc(${elevation_core.offset} * -0.5) ${alpha(elevation_core.shadowColor, 0.4)}`,
  md: `0 calc(${elevation_core.offset} * 2) calc(${elevation_core.blur} * 3) calc(${elevation_core.offset} * -0.5) ${alpha(elevation_core.shadowColor, 0.5)}, 0 calc(${elevation_core.offset} * 1) calc(${elevation_core.blur} * 2) calc(${elevation_core.offset} * -1) ${alpha(elevation_core.shadowColor, 0.35)}`,
  lg: `0 calc(${elevation_core.offset} * 4) calc(${elevation_core.blur} * 5) calc(${elevation_core.offset} * -1) ${alpha(elevation_core.shadowColor, 0.52)}, 0 calc(${elevation_core.offset} * 2) calc(${elevation_core.blur} * 3) calc(${elevation_core.offset} * -2) ${alpha(elevation_core.shadowColor, 0.34)}`,
  xl: `0 calc(${elevation_core.offset} * 8) calc(${elevation_core.blur} * 8) calc(${elevation_core.offset} * -2) ${alpha(elevation_core.shadowColor, 0.56)}, 0 calc(${elevation_core.offset} * 4) calc(${elevation_core.blur} * 4) calc(${elevation_core.offset} * -3) ${alpha(elevation_core.shadowColor, 0.3)}`,
});

export const elevation = stylex.defineConsts({
  shadowColor: elevation_core.shadowColor,
  offset: elevation_core.offset,
  blur: elevation_core.blur,
  xs: elevation_derived.xs,
  sm: elevation_derived.sm,
  md: elevation_derived.md,
  lg: elevation_derived.lg,
  xl: elevation_derived.xl,
});
