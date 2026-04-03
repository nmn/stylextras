import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"kbd">;

export type KbdSize = "sm" | "md";

export type KbdProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  size?: KbdSize;
};

/**
 * Renders a token-styled keyboard key annotation.
 *
 * Search aliases: kbd, keycap, keyboard hint, shortcut key.
 *
 * A11y notes:
 * - Acts as static inline content.
 * - Shortcut meaning and interaction context must be described by nearby text.
 */
export function Kbd({ size = "md", sx, ...props }: KbdProps) {
  return <kbd {...props} {...stylex.props(baseStyles.base, sizeStyles[size], sx)} />;
}

const baseStyles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: spacing.lg,
    paddingInline: spacing.xs,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    backgroundColor: colors.bgInset,
    color: colors.fgSoft,
    fontFamily: typography.fontMono,
    fontWeight: typography.weightMedium,
    whiteSpace: "nowrap",
  },
});

const sizeStyles = stylex.create({
  sm: {
    minHeight: spacing.lg,
    paddingBlock: spacing["3xs"],
    fontSize: typography.stepMinus2,
    lineHeight: typography.lineHeightSnug,
  },
  md: {
    minHeight: spacing.xl,
    paddingBlock: spacing["2xs"],
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightSnug,
  },
});
