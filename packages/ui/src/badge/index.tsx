import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"span">;

export type BadgeVariant =
  | "neutral"
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type BadgeSize = "sm" | "md";

export type BadgeProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  size?: BadgeSize;
  variant?: BadgeVariant;
};

/**
 * Renders a compact token-driven status or metadata label.
 *
 * Search aliases: badge, pill, tag, status chip.
 *
 * A11y notes:
 * - Acts as static text by default.
 * - Does not expose live updates or status announcements automatically.
 */
export function Badge({
  size = "md",
  sx,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      {...stylex.props(baseStyles.base, sizeStyles[size], variantStyles[variant], sx)}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["3xs"],
    width: "fit-content",
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderRadius: radius.round,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
    whiteSpace: "nowrap",
  },
});

const sizeStyles = stylex.create({
  sm: {
    paddingInline: spacing.xs,
    paddingBlock: spacing["3xs"],
    fontSize: typography.stepMinus2,
  },
  md: {
    paddingInline: spacing.sm,
    paddingBlock: spacing["2xs"],
    fontSize: typography.stepMinus1,
  },
});

const variantStyles = stylex.create({
  neutral: {
    color: colors.fgSoft,
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
  },
  brand: {
    color: colors.primaryForeground,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  info: {
    color: colors.info,
    backgroundColor: colors.infoSoft,
    borderColor: colors.info,
  },
  success: {
    color: colors.success,
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  warning: {
    color: colors.warning,
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
  },
  danger: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
});
