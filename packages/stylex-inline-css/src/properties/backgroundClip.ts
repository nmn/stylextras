import * as stylex from "@stylexjs/stylex";

export const backgroundClip = stylex.create({
  borderBox: { backgroundClip: "border-box" },
  contentBox: { backgroundClip: "content-box" },
  paddingBox: { backgroundClip: "padding-box" },
  text: { backgroundClip: "text" },
});

