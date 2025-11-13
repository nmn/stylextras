import * as stylex from "@stylexjs/stylex";

export const willChange = stylex.create({
  auto: { willChange: "auto" },
  contents: { willChange: "contents" },
  scrollPosition: { willChange: "scroll-position" },
  transform: { willChange: "transform" },
});

