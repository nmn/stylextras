import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type InputGroupProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a layout wrapper for grouped inputs and controls.
 *
 * Search aliases: input group, field group, control group, input cluster.
 *
 * A11y notes:
 * - Provides grouping layout only.
 * - Does not automatically apply fieldset, legend, or describedby relationships.
 */
export function InputGroup({ sx, ...props }: InputGroupProps) {
  return <div {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: {
    gap: spacing.xs,
    alignItems: "stretch",
    display: "flex",
    width: "100%",
  },
});
