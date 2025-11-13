import * as stylex from "@stylexjs/stylex";

export const gridAutoRows = stylex.create({
  auto: { gridAutoRows: "auto" },
  max: { gridAutoRows: "max" },
  min: { gridAutoRows: "min" },
  minmax_0_to_1fr: { gridAutoRows: "minmax(0, 1fr)" },
});
