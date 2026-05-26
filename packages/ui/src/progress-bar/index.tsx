import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import type { AccessibleNameProps } from "../accessibility";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"progress">;

export type ProgressBarProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "style"
> &
  AccessibleNameProps & {
    sx?: StyleXStyles;
  };

/**
 * Renders a token-styled native progress element.
 *
 * Search aliases: progress bar, progress, loading bar, completion bar.
 *
 * A11y notes:
 * - Uses native progress semantics.
 * - The caller should provide a visible or programmatic label.
 */
export function ProgressBar({ label, sx, ...props }: ProgressBarProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      {label ? <span {...stylex.props(labelStyles.base)}>{label}</span> : null}
      <progress {...props} {...stylex.props(progressStyles.base)} />
    </label>
  );
}

const rootStyles = stylex.create({
  base: { gap: spacing.xs, display: "grid" },
});
const labelStyles = stylex.create({
  base: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
});
const progressStyles = stylex.create({
  base: { accentColor: colors.primary, width: "100%" },
});
