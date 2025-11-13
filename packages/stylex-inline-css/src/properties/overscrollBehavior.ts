import * as stylex from "@stylexjs/stylex";

export const overscrollBehavior = stylex.create({
  auto: { overscrollBehavior: "auto" },
  contain: { overscrollBehavior: "contain" },
  none: { overscrollBehavior: "none" },
});

