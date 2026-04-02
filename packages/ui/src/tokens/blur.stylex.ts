import * as stylex from "@stylexjs/stylex";

export const blur_core = stylex.defineVars({
  md: "8px",
});

export const blur_derived = stylex.defineVars({
  xs: `calc(${blur_core.md} / 4)`,
  sm: `calc(${blur_core.md} / 2)`,
  lg: `calc(${blur_core.md} * 1.5)`,
  xl: `calc(${blur_core.md} * 2.5)`,
});

export const blur = stylex.defineConsts({
  xs: blur_derived.xs,
  sm: blur_derived.sm,
  md: blur_core.md,
  lg: blur_derived.lg,
  xl: blur_derived.xl,
});
