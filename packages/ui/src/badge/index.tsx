import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithRef<"span">;

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
  ref,
  size = "md",
  sx,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      ref={ref}
      {...props}
      {...stylex.props(
        baseStyles.base,
        sizeStyles[size],
        variantStyles[variant],
        sx,
      )}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    borderRadius: radius.round,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    gap: spacing.xxxs,
    alignItems: "center",
    display: "inline-flex",
    fontFamily: typography.fontSans,
    fontWeight: typography.weightMedium,
    justifyContent: "center",
    lineHeight: typography.lineHeightSnug,
    maxWidth: "100%",
    minWidth: 0,
    overflowWrap: "anywhere",
    textAlign: "center",
    whiteSpace: "normal",
    width: "fit-content",
  },
});

const sizeStyles = stylex.create({
  sm: {
    paddingBlock: spacing.xxxs,
    paddingInline: spacing.xs,
    fontSize: typography.stepMinus2,
  },
  md: {
    paddingBlock: spacing.xxs,
    paddingInline: spacing.sm,
    fontSize: typography.stepMinus1,
  },
});

const variantStyles = stylex.create({
  neutral: {
    borderColor: colors.border,
    backgroundColor: colors.bgSubtle,
    color: `color-mix(in oklab, ${colors.fg} 92%, ${colors.fgMuted})`,
  },
  brand: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    color: `color-mix(in oklab, ${colors.primaryForeground} 94%, ${colors.primary})`,
  },
  info: {
    borderColor: colors.info,
    backgroundColor: colors.infoSoft,
    color: `color-mix(in oklab, ${colors.fg} 92%, ${colors.info})`,
  },
  success: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
    color: `color-mix(in oklab, ${colors.fg} 92%, ${colors.success})`,
  },
  warning: {
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
    color: `color-mix(in oklab, ${colors.fg} 92%, ${colors.warning})`,
  },
  danger: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
    color: `color-mix(in oklab, ${colors.fg} 92%, ${colors.danger})`,
  },
});
