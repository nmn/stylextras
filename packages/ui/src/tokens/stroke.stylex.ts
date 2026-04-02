import * as stylex from "@stylexjs/stylex";

export const stroke_core = stylex.defineVars({
  thin: "1px",
});

export const stroke_derived = stylex.defineVars({
  hairline: {
    default: `max(calc(${stroke_core.thin} / 2), 1px)`,
    "@media (min-device-pixel-ratio: 2)": `max(calc(${stroke_core.thin} / 2), 0.5px)`,
  },
  thick: `calc(${stroke_core.thin} * 2)`,
  heavy: `calc(${stroke_core.thin} * 3)`,
});

export const stroke = stylex.defineConsts({
  hairline: stroke_derived.hairline,
  thin: stroke_core.thin,
  thick: stroke_derived.thick,
  heavy: stroke_derived.heavy,
});
