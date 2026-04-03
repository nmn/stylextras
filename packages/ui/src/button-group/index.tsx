import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ButtonGroupProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a layout wrapper for visually grouped buttons.
 *
 * Search aliases: button group, actions row, control group, button cluster.
 *
 * A11y notes:
 * - Provides grouping layout only.
 * - Does not add toolbar roving focus or composite keyboard behavior by itself.
 */
export function ButtonGroup({ sx, ...props }: ButtonGroupProps) {
  return <div {...props} role="group" {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({ base: { display: "inline-flex", alignItems: "center", gap: spacing.xs, flexWrap: "wrap" } });
