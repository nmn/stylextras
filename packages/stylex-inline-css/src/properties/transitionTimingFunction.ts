import * as stylex from "@stylexjs/stylex";

export const transitionTimingFunction = stylex.create({
  ease_linear: { transitionTimingFunction: "linear" },
  ease_in: { transitionTimingFunction: "cubic-bezier(0.4, 0, 1, 1)" },
  ease_out: { transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
  ease_in_out: { transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" },
});
