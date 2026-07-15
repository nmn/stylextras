import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type FieldErrorsProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a token-styled field error message container.
 *
 * Search aliases: field errors, field error, validation message, error text.
 *
 * A11y notes:
 * - Does not automatically bind itself to an input via aria-describedby.
 * - Validation announcement behavior must be composed by the caller.
 */
export function FieldErrors({ sx, ...props }: FieldErrorsProps) {
  return <div {...props} role="alert" {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: {
    gap: spacing.xxxs,
    color: colors.danger,
    display: "grid",
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightBody,
  },
});
