import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type AlertVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type AlertProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  variant?: AlertVariant;
};

/**
 * Renders a token-driven status message surface for inline feedback.
 *
 * Search aliases: alert, callout, notice, message.
 *
 * A11y notes:
 * - Uses native container semantics only.
 * - Does not manage live-region priority beyond the provided role prop.
 */
export function AlertCallout({
  role = "status",
  sx,
  variant = "neutral",
  ...props
}: AlertProps) {
  return (
    <div
      {...props}
      role={role}
      {...stylex.props(baseStyles.base, variantStyles[variant], sx)}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    gap: spacing.sm,
    display: "flex",
    flexDirection: "column",
  },
});

const variantStyles = stylex.create({
  neutral: {
    borderColor: colors.border,
    backgroundColor: colors.bgSubtle,
    color: colors.fg,
  },
  info: {
    borderColor: colors.info,
    backgroundColor: colors.infoSoft,
    color: colors.info,
  },
  success: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
    color: colors.success,
  },
  warning: {
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
    color: colors.warning,
  },
  danger: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
  },
});
