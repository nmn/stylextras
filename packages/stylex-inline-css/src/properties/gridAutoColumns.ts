import * as stylex from "@stylexjs/stylex";

export const gridAutoColumns = stylex.create({
  auto: { gridAutoColumns: "auto" },
  max: { gridAutoColumns: "max" },
  min: { gridAutoColumns: "min" },
  minmax_0_to_1fr: { gridAutoColumns: "minmax(0, 1fr)" },
});
