import * as stylex from "@stylexjs/stylex";

export const touchAction = stylex.create({
  auto: { touchAction: "auto" },
  manipulation: { touchAction: "manipulation" },
  none: { touchAction: "none" },
  panDown: { touchAction: "pan-down" },
  panLeft: { touchAction: "pan-left" },
  panRight: { touchAction: "pan-right" },
  panUp: { touchAction: "pan-up" },
  panX: { touchAction: "pan-x" },
  panY: { touchAction: "pan-y" },
  pinchZoom: { touchAction: "pinch-zoom" },
});

