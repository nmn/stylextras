import type { VarGroup } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";

type Tstroke = VarGroup<
  Readonly<{
    hairline: string;
    heavy: string;
    thick: string;
    thin: string;
  }>
>;

export const stroke: Tstroke = stylex.defineVars({
  thin: "1px",
  hairline: {
    default: () => `max(calc(${stroke.thin} / 2), 1px)`,
    "@media (min-device-pixel-ratio: 2)": () =>
      `max(calc(${stroke.thin} / 2), 0.5px)`,
  },
  thick: () => `calc(${stroke.thin} * 2)`,
  heavy: () => `calc(${stroke.thin} * 3)`,
});
