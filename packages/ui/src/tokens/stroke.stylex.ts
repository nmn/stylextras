import type { VarGroup } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";

type Tstroke = VarGroup<
  Readonly<{
    hairline: string;
    heavy: string;
    focusRing: string;
    focusRingOffset: string;
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
  /** Focus indication remains at least 2px across every decorative stroke theme. */
  focusRing: "2px",
  focusRingOffset: () => stroke.thin,
});
