import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"button">;

export type IconButtonSize = "sm" | "md" | "lg";

export type IconButtonProps = Omit<
  BaseProps,
  "aria-label" | "className" | "style"
> & {
  label: string;
  sx?: StyleXStyles;
  size?: IconButtonSize;
};

/**
 * Renders a square token-driven button for icon-only actions.
 *
 * Search aliases: icon button, icon action, square button, glyph button.
 *
 * A11y notes:
 * - Uses native button semantics.
 * - Requires label so icon-only actions always have an accessible name.
 */
export function IconButton({
  label,
  size = "md",
  sx,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={label}
      type={type}
      {...stylex.props(baseStyles.base, sizeStyles[size], sx)}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    borderColor: colors.borderStrong,
    borderRadius: radius.round,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    outline: {
      default: null,
      ":focus-visible": "none",
    },
    alignItems: "center",
    backgroundColor: {
      default: colors.bg,
      ":hover": colors.bgRaised,
      ":active": colors.bgInset,
    },
    boxShadow: {
      default: `0 1px 2px ${colors.overlay}`,
      ":focus-visible": `0 0 0 ${stroke.thick} ${colors.focusRing}`,
    },
    color: colors.fg,
    cursor: "pointer",
    display: "inline-flex",
    fontFamily: typography.fontSans,
    justifyContent: "center",
    transitionDuration: "150ms",
    transitionProperty: "background-color, border-color, box-shadow, transform",
    transitionTimingFunction: "ease-in-out",
  },
});
const sizeStyles = stylex.create({
  sm: { height: spacing.xxl, width: spacing.xxl },
  md: { height: spacing.xxxl, width: spacing.xxxl },
  lg: { height: spacing.xxxxl, width: spacing.xxxxl },
});
