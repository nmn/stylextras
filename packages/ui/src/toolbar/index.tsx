import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { focusgroupProps } from "../focusgroup";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ToolbarProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a token-driven toolbar container.
 *
 * Search aliases: toolbar, action bar, control bar, button row.
 *
 * A11y notes:
 * - Uses toolbar semantics.
 * - Arrow-key focus movement is provided by focusgroup with a lazy polyfill.
 */
export function Toolbar({ sx, ...props }: ToolbarProps) {
  return (
    <div
      {...props}
      role="toolbar"
      {...focusgroupProps<HTMLDivElement>("toolbar wrap")}
      {...stylex.props(styles.base, sx)}
    />
  );
}

const styles = stylex.create({
  base: {
    gap: spacing.sm,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
  },
});
