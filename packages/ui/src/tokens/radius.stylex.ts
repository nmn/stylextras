import * as stylex from '@stylexjs/stylex';

const calc = (expression: string) => `calc(${expression})`;

const multiply = (value: string, factor: number) =>
  calc(`${value} * ${factor}`);

const divide = (value: string, divisor: number) => calc(`${value} / ${divisor}`);

export const radius_core = stylex.defineVars({
  base: '8px',
});

export const radius_derived = stylex.defineVars({
  xs: divide(radius_core.base, 4),
  sm: divide(radius_core.base, 2),
  md: radius_core.base,
  lg: multiply(radius_core.base, 1.5),
  xl: multiply(radius_core.base, 2),
  '2xl': multiply(radius_core.base, 3),
  round: '9999px',
});

export const radius = stylex.defineConsts({
  base: radius_core.base,
  xs: radius_derived.xs,
  sm: radius_derived.sm,
  md: radius_derived.md,
  lg: radius_derived.lg,
  xl: radius_derived.xl,
  '2xl': radius_derived['2xl'],
  round: radius_derived.round,
});
