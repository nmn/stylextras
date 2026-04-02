import * as stylex from '@stylexjs/stylex';

const round = (value: number, precision = 2) =>
  Number(value.toFixed(precision));

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

const alpha = (color: string, opacity: number, colorSpace = 'oklab') =>
  `color-mix(in ${colorSpace}, ${color} ${round(opacity * 100)}%, transparent)`;

export const elevation_core = stylex.defineVars({
  shadowColor: lightDark(
    'rgba(15, 23, 42, 0.18)',
    'rgba(0, 0, 0, 0.42)',
  ),
});

export const elevation_derived = stylex.defineVars({
  xs: `0 1px 2px 0 ${alpha(elevation_core.shadowColor, 0.45)}`,
  sm: `0 1px 3px 0 ${alpha(elevation_core.shadowColor, 0.55)}, 0 1px 2px -1px ${alpha(elevation_core.shadowColor, 0.4)}`,
  md: `0 4px 6px -1px ${alpha(elevation_core.shadowColor, 0.5)}, 0 2px 4px -2px ${alpha(elevation_core.shadowColor, 0.35)}`,
  lg: `0 10px 15px -3px ${alpha(elevation_core.shadowColor, 0.52)}, 0 4px 6px -4px ${alpha(elevation_core.shadowColor, 0.34)}`,
  xl: `0 20px 25px -5px ${alpha(elevation_core.shadowColor, 0.56)}, 0 8px 10px -6px ${alpha(elevation_core.shadowColor, 0.3)}`,
});

export const elevation = stylex.defineConsts({
  shadowColor: elevation_core.shadowColor,
  xs: elevation_derived.xs,
  sm: elevation_derived.sm,
  md: elevation_derived.md,
  lg: elevation_derived.lg,
  xl: elevation_derived.xl,
});
