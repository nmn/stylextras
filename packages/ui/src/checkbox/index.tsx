import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import type { AccessibleNameProps } from "../accessibility";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type CheckboxSize = "sm" | "md";

export type CheckboxProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "style" | "type" | "size"
> &
  AccessibleNameProps & {
    sx?: StyleXStyles;
    inputSx?: StyleXStyles;
    labelSx?: StyleXStyles;
    size?: CheckboxSize;
  };

/**
 * Renders a token-styled native checkbox control.
 *
 * Search aliases: checkbox, check, toggle box, boolean field.
 *
 * A11y notes:
 * - Uses native checkbox semantics.
 * - Grouped selection patterns and validation messaging must be composed by the caller.
 */
export function Checkbox({
  label,
  labelSx,
  inputSx,
  size = "md",
  sx,
  ...props
}: CheckboxProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      <input
        {...props}
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
    boxShadow: {
      default: null,
      ":focus-visible": `0 0 0 ${stroke.thick} ${colors.focusRing}`,
    },
  },
});

const sizeStyles = stylex.create({
  sm: {
    height: spacing.md,
    width: spacing.md,
  },
  md: {
    height: spacing.lg,
    width: spacing.lg,
  },
});

const labelStyles = stylex.create({
  base: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
  },
});
