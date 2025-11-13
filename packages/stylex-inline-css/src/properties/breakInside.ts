import * as stylex from "@stylexjs/stylex";

export const breakInside = stylex.create({
  auto: { breakInside: "auto" },
  avoid: { breakInside: "avoid" },
  avoidPage: { breakInside: "avoid-page" },
  column: { breakInside: "column" },
});

