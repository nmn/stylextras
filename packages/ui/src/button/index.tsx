"use client";

import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"button">;

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = ({
  disabled,
  size = "md",
  sx,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) => (
  <button
    {...props}
    disabled={disabled}
    type={type}
    {...stylex.props(
      baseStyles.base,
      sizeStyles[size],
      variantStyles[variant],
      disabled && stateStyles.disabled,
      sx,
    )}
  />
);

const baseStyles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderRadius: radius.md,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
});

const sizeStyles = stylex.create({
  sm: {
    minHeight: spacing.xl,
    paddingInline: spacing.sm,
    paddingBlock: spacing["2xs"],
    fontSize: typography.stepMinus1,
  },
  md: {
    minHeight: spacing["2xl"],
    paddingInline: spacing.md,
    paddingBlock: spacing.xs,
    fontSize: typography.step0,
  },
  lg: {
    minHeight: spacing["3xl"],
    paddingInline: spacing.lg,
    paddingBlock: spacing.sm,
    fontSize: typography.step1,
  },
});

const variantStyles = stylex.create({
  primary: {
    color: colors.primaryForeground,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    color: colors.secondaryForeground,
    backgroundColor: colors.secondary,
    borderColor: colors.border,
  },
  outline: {
    color: colors.fg,
    backgroundColor: colors.bg,
    borderColor: colors.borderStrong,
  },
  ghost: {
    color: colors.fgSoft,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  danger: {
    color: colors.fgOnBrand,
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
});

const stateStyles = stylex.create({
  disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});
