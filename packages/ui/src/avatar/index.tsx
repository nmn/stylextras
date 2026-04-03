import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"img">;

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  fallback?: string;
  size?: AvatarSize;
};

/**
 * Renders a token-styled avatar surface for initials or media.
 *
 * Search aliases: avatar, profile image, user icon, identity chip.
 *
 * A11y notes:
 * - Does not enforce image alt text or fallback announcement behavior.
 * - When used as a pure decoration it should be hidden from assistive technology by the caller.
 */
export function Avatar({ alt = "", fallback = "SX", size = "md", src, sx, ...props }: AvatarProps) {
  if (src) {
    return <img {...props} alt={alt} src={src} {...stylex.props(baseStyles.base, sizeStyles[size], sx)} />;
  }

  return <span aria-hidden="true" {...stylex.props(baseStyles.base, sizeStyles[size], fallbackStyles.base, sx)}>{fallback}</span>;
}

const baseStyles = stylex.create({ base: { display: "inline-flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: radius.round, backgroundColor: colors.accent, color: colors.accentForeground, fontFamily: typography.fontSans, fontWeight: typography.weightSemibold } });
const sizeStyles = stylex.create({ sm: { width: spacing["2xl"], height: spacing["2xl"], fontSize: typography.stepMinus1 }, md: { width: spacing["3xl"], height: spacing["3xl"], fontSize: typography.step0 }, lg: { width: spacing["4xl"], height: spacing["4xl"], fontSize: typography.step1 } });
const fallbackStyles = stylex.create({ base: { textTransform: "uppercase" } });
