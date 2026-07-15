import type { VarGroup } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";

const calc = (expression: string) => `calc(${expression})`;

const multiply = (value: string, factor: number) =>
  calc(`${value} * ${factor}`);

type Tmotion = VarGroup<
  Readonly<{
    durationBase: string;
    durationFast: string;
    durationInstant: string;
    durationModerate: string;
    durationSlow: string;
    durationSlower: string;
    easeEmphasized: string;
    easeStandard: string;
  }>
>;

export const motion: Tmotion = stylex.defineVars({
  durationBase: "160ms",
  easeStandard: "cubic-bezier(0.2, 0, 0, 1)",
  easeEmphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
  durationInstant: "0ms",
  durationFast: () => multiply(motion.durationBase, 0.75),
  durationModerate: () => motion.durationBase,
  durationSlow: () => multiply(motion.durationBase, 1.25),
  durationSlower: () => multiply(motion.durationBase, 1.25),
});
