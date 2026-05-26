import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type CalendarProps = Omit<BaseProps, "className" | "style" | "type"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a minimal date-oriented calendar primitive.
 *
 * Search aliases: calendar, date calendar, month view, date grid.
 *
 * A11y notes:
 * - This is a simplified calendar surface and not a full keyboard-complete date grid.
 * - Advanced date navigation and screen-reader announcements are limited.
 */
export function Calendar({ sx, ...props }: CalendarProps) {
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
