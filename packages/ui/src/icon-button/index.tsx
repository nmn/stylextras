import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"button">;

export type IconButtonSize = "sm" | "md" | "lg";

export type IconButtonProps = Omit<BaseProps, "className" | "style"> & {
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
 * - The caller must provide an accessible name, usually via aria-label.
 */
export function IconButton({ size = "md", sx, type = "button", ...props }: IconButtonProps) {
  return <button {...props} type={type} {...stylex.props(baseStyles.base, sizeStyles[size], sx)} />;
}

const baseStyles = stylex.create({ base: { display: "inline-flex", alignItems: "center", justifyContent: "center", borderStyle: "solid", borderWidth: stroke.thin, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.secondary, color: colors.fg } });
const sizeStyles = stylex.create({
  sm: { width: spacing["2xl"], height: spacing["2xl"] },
  md: { width: spacing["3xl"], height: spacing["3xl"] },
  lg: { width: spacing["4xl"], height: spacing["4xl"] },
});
