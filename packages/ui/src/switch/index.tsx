import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import type { AccessibleNameProps } from "../accessibility";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type SwitchSize = "sm" | "md";

export type SwitchProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "style" | "type" | "size"
> &
  AccessibleNameProps & {
    sx?: StyleXStyles;
    inputSx?: StyleXStyles;
    labelSx?: StyleXStyles;
    size?: SwitchSize;
  };

/**
 * Renders a token-styled boolean switch control.
 *
 * Search aliases: switch, toggle switch, boolean toggle, on off.
 *
 * A11y notes:
 * - Uses a simplified switch pattern.
 * - The caller should ensure the control has a clear visible label and state description.
 */
export function Switch({
  label,
  labelSx,
  inputSx,
  size = "md",
  sx,
  ...props
}: SwitchProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      <input
        {...props}
        role="switch"
        type="checkbox"
        {...stylex.props(inputStyles.base, sizeStyles[size], inputSx)}
      />
      {label ? (
        <span {...stylex.props(labelStyles.base, labelSx)}>{label}</span>
      ) : null}
    </label>
  );
}

const rootStyles = stylex.create({
  base: {
    gap: spacing.xs,
    alignItems: "center",
    color: colors.fg,
    display: "inline-flex",
  },
});

const inputStyles = stylex.create({
  base: {
    margin: 0,
    accentColor: colors.primary,
  },
});

const sizeStyles = stylex.create({
  sm: {
    height: spacing.md,
    width: spacing.xl,
  },
  md: {
    height: spacing.lg,
    width: spacing.xxl,
  },
});

const labelStyles = stylex.create({
  base: {
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
  },
});
