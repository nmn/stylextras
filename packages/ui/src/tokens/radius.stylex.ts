import type { VarGroup } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";

const calc = (expression: string) => `calc(${expression})`;

const multiply = (value: string, factor: number) =>
  calc(`${value} * ${factor}`);

const divide = (value: string, divisor: number) =>
  calc(`${value} / ${divisor}`);

type Tradius = VarGroup<
  Readonly<{
    base: string;
    lg: string;
    md: string;
    round: string;
    sm: string;
    xl: string;
    xs: string;
    xxl: string;
  }>
>;

export const radius: Tradius = stylex.defineVars({
  base: "10px",
  xs: () => divide(radius.base, 2.5),
  sm: () => multiply(radius.base, 0.6),
  md: () => radius.base,
  lg: () => multiply(radius.base, 1.2),
  xl: () => multiply(radius.base, 1.6),
  xxl: () => multiply(radius.base, 2.4),
  round: "9999px",
});
