import * as stylex from "@stylexjs/stylex";

export const animationTimingFunction = stylex.create({
  ease_linear: { animationTimingFunction: "linear" },
  ease_in: { animationTimingFunction: "cubic-bezier(0.4, 0, 1, 1)" },
  ease_out: { animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
  ease_in_out: { animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" },
});
