import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type DateFieldProps = Omit<BaseProps, "className" | "style" | "type"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a token-styled native date field.
 *
 * Search aliases: date field, date input, date entry, calendar field.
 *
 * A11y notes:
 * - Uses native date input behavior.
 * - Accessibility details vary by browser and platform.
 */
export function DateField({ sx, ...props }: DateFieldProps) {
  return <input {...props} type="date" {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: spacing.xxxl,
  },
});
