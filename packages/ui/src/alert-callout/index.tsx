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
export function Alert({
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
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
    padding: spacing.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderRadius: radius.md,
  },
});

const variantStyles = stylex.create({
  neutral: {
    color: colors.fg,
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
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
