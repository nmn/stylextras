import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";

type BaseProps = ComponentPropsWithoutRef<"progress">;

export type SpinnerProps = Omit<BaseProps, "className" | "style" | "value"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a visual spinner for loading states.
 *
 * Search aliases: spinner, loader, busy indicator, loading spinner.
 *
 * A11y notes:
 * - Primarily visual.
 * - It does not announce busy status or live updates automatically.
 */
export function Spinner({ sx, ...props }: SpinnerProps) {
  return <progress {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({ base: { accentColor: colors.primary } });
