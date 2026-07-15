import type { VarGroup } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";

const calc = (expression: string) => `calc(${expression})`;

const multiply = (value: string, factor: number) =>
  calc(`${value} * ${factor}`);

const divide = (value: string, divisor: number) =>
  calc(`${value} / ${divisor}`);

type Tspacing = VarGroup<
  Readonly<{
    base: string;
    controlGap: string;
    controlLg: string;
    controlMd: string;
    controlSm: string;
    lg: string;
    md: string;
    sm: string;
    xl: string;
    xs: string;
    xxl: string;
    xxs: string;
    xxxl: string;
    xxxs: string;
    xxxxl: string;
  }>
>;

export const spacing: Tspacing = stylex.defineVars({
  base: "4px",
  controlGap: () => multiply(spacing.base, 2),
  controlSm: () => multiply(spacing.base, 8),
  controlMd: () => multiply(spacing.base, 9),
  controlLg: () => multiply(spacing.base, 10),
  xxxs: () => divide(spacing.base, 2),
  xxs: () => spacing.base,
  xs: () => multiply(spacing.base, 1.5),
  sm: () => multiply(spacing.base, 2),
  md: () => multiply(spacing.base, 3),
  lg: () => multiply(spacing.base, 4),
  xl: () => multiply(spacing.base, 6),
  xxl: () => multiply(spacing.base, 8),
  xxxl: () => multiply(spacing.base, 12),
  xxxxl: () => multiply(spacing.base, 16),
});
