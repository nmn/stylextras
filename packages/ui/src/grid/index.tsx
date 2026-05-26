import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type GridCols = 1 | 2 | 3 | 4;

export type GridProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  cols?: GridCols;
};

/**
 * Renders a token-driven grid layout primitive.
 *
 * Search aliases: grid, columns, grid layout, card grid.
 *
 * A11y notes:
 * - Provides layout only.
 * - It does not imply data-grid semantics.
 */
export function Grid({ cols = 2, sx, ...props }: GridProps) {
  return (
    <div
      {...props}
      {...stylex.props(
        baseStyles.base,
        colStyles[String(cols) as keyof typeof colStyles],
        sx,
      )}
    />
  );
}

const baseStyles = stylex.create({
  base: { gap: spacing.md, display: "grid" },
});
const colStyles = stylex.create({
  "1": { gridTemplateColumns: "repeat(1, minmax(0, 1fr))" },
  "2": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  "3": { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
  "4": { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
});
