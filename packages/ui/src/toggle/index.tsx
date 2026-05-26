import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type ToggleSize = "sm" | "md" | "lg";

export type ToggleProps = Omit<
  BaseProps,
  "children" | "className" | "style" | "type" | "size"
> & {
  children?: ReactNode;
  sx?: StyleXStyles;
  inputSx?: StyleXStyles;
  size?: ToggleSize;
};

/**
 * Renders a checkbox-backed toggle button with a button-like surface.
 *
 * Search aliases: toggle, toggle button, checkbox button, on off control.
 *
 * A11y notes:
 * - Uses native checkbox semantics instead of aria-pressed button semantics.
 * - The caller is responsible for grouping and higher-level selection rules when multiple toggles are related.
 */
export function Toggle({
  children,
  disabled,
  inputSx,
  size = "md",
  sx,
  ...props
}: ToggleProps) {
  return (
    <label
      {...stylex.props(
        rootStyles.base,
        sizeStyles[size],
        disabled && stateStyles.disabled,
        sx,
      )}
    >
      <input
        {...props}
        disabled={disabled}
        type="checkbox"
        {...stylex.props(inputStyles.base, inputSx)}
      />
      {children ? (
        <span {...stylex.props(labelStyles.base)}>{children}</span>
      ) : null}
    </label>
  );
}

const rootStyles = stylex.create({
  base: {
    borderColor: {
      default: colors.border,
      ":has(input:checked)": colors.primary,
    },
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    gap: spacing.xs,
    alignItems: "center",
    backgroundColor: {
      default: colors.bg,
      ":has(input:checked)": colors.primary,
    },
    color: {
      default: colors.fg,
      ":has(input:checked)": colors.primaryForeground,
    },
    cursor: "pointer",
    display: "inline-flex",
    justifyContent: "center",
    position: "relative",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
});

const sizeStyles = stylex.create({
  sm: {
    paddingBlock: spacing.xxs,
    paddingInline: spacing.sm,
    minHeight: spacing.xl,
  },
  md: {
    paddingBlock: spacing.xs,
    paddingInline: spacing.md,
    minHeight: spacing.xxl,
  },
  lg: {
    paddingBlock: spacing.sm,
    paddingInline: spacing.lg,
    minHeight: spacing.xxxl,
  },
});

const stateStyles = stylex.create({
  disabled: {
    cursor: "not-allowed",
    opacity: 0.5,
  },
});

const inputStyles = stylex.create({
  base: {
    inset: 0,
    margin: 0,
    cursor: "inherit",
    opacity: 0,
    position: "absolute",
  },
});

const labelStyles = stylex.create({
  base: {
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
  },
});
