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

export const Badge = ({
  size = "md",
  sx,
  variant = "neutral",
  ...props
}: BadgeProps) => (
  <span {...props} {...stylex.props(styles.base, styles[size], styles[variant], sx)} />
);

const styles = stylex.create({
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
