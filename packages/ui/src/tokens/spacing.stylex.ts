import * as stylex from '@stylexjs/stylex';

const calc = (expression: string) => `calc(${expression})`;

const multiply = (value: string, factor: number) =>
  calc(`${value} * ${factor}`);

const divide = (value: string, divisor: number) => calc(`${value} / ${divisor}`);

export const spacing_core = stylex.defineVars({
  base: '4px',
});

export const spacing_derived = stylex.defineVars({
  '3xs': divide(spacing_core.base, 2),
  '2xs': spacing_core.base,
  xs: multiply(spacing_core.base, 1.5),
  sm: multiply(spacing_core.base, 2),
  md: multiply(spacing_core.base, 3),
  lg: multiply(spacing_core.base, 4),
  xl: multiply(spacing_core.base, 6),
  '2xl': multiply(spacing_core.base, 8),
  '3xl': multiply(spacing_core.base, 12),
  '4xl': multiply(spacing_core.base, 16),
});

export const spacing = stylex.defineConsts({
  base: spacing_core.base,
  '3xs': spacing_derived['3xs'],
  '2xs': spacing_derived['2xs'],
  xs: spacing_derived.xs,
  sm: spacing_derived.sm,
  md: spacing_derived.md,
  lg: spacing_derived.lg,
  xl: spacing_derived.xl,
  '2xl': spacing_derived['2xl'],
  '3xl': spacing_derived['3xl'],
  '4xl': spacing_derived['4xl'],
});
