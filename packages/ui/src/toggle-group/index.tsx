import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ToggleGroupProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a group of toggle controls.
 *
 * Search aliases: toggle group, toggle buttons, pressed group, option toggles.
 *
 * A11y notes:
 * - Provides grouping layout only.
 * - It does not yet implement a full composite widget keyboard model.
 */
export function ToggleGroup({ sx, ...props }: ToggleGroupProps) {
  return <div {...props} role="group" {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({ base: { display: "inline-flex", alignItems: "center", gap: spacing.xs, flexWrap: "wrap" } });
