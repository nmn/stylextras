import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import type { AccessibleNameProps } from "../accessibility";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"meter">;

export type MeterProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "style"
> &
  AccessibleNameProps & {
    sx?: StyleXStyles;
  };

/**
 * Renders a token-styled native meter element.
 *
 * Search aliases: meter, gauge, value meter, level indicator.
 *
 * A11y notes:
 * - Uses native meter semantics.
 * - Meaningful labeling still needs to be provided by the caller.
 */
export function Meter({ label, sx, ...props }: MeterProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      {label ? <span {...stylex.props(labelStyles.base)}>{label}</span> : null}
      <meter {...props} {...stylex.props(meterStyles.base)} />
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
const meterStyles = stylex.create({
  base: { accentColor: colors.primary, width: "100%" },
});
