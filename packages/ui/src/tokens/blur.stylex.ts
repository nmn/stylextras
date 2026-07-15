import type { VarGroup } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";

type Tblur = VarGroup<
  Readonly<{
    md: string;
    xs: string;
    sm: string;
    lg: string;
    xl: string;
  }>
>;

export const blur: Tblur = stylex.defineVars({
  md: "4px",
  xs: () => `calc(${blur.md} / 4)`,
  sm: () => `calc(${blur.md} / 2)`,
  lg: () => `calc(${blur.md} * 1.5)`,
  xl: () => `calc(${blur.md} * 2)`,
});
