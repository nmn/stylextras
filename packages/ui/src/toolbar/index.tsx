import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
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
 * - Provides grouping layout only.
 * - It does not add roving focus or full toolbar keyboard behavior automatically.
 */
export function Toolbar({ sx, ...props }: ToolbarProps) {
  return <div {...props} role="toolbar" {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({ base: { display: "flex", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" } });
