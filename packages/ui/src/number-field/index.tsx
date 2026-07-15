import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import type { AccessibleNameProps } from "../accessibility";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type NumberFieldSize = "sm" | "md";

export type NumberFieldProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "style" | "type" | "size"
> &
  AccessibleNameProps & {
    sx?: StyleXStyles;
    inputSx?: StyleXStyles;
    labelSx?: StyleXStyles;
    size?: NumberFieldSize;
  };

/**
 * Renders a token-styled numeric input control.
 *
 * Search aliases: number field, numeric input, stepper field, number input.
 *
 * A11y notes:
 * - Relies on native number input behavior.
 * - Spinbutton announcements and input behavior vary by browser.
 */
export function NumberField({
  label,
  labelSx,
  inputSx,
  size = "md",
  sx,
  ...props
}: NumberFieldProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      {label ? (
        <span {...stylex.props(labelStyles.base, labelSx)}>{label}</span>
      ) : null}
      <input
        {...props}
        type="number"
        {...stylex.props(inputStyles.base, sizeStyles[size], inputSx)}
      />
    </label>
  );
}

const rootStyles = stylex.create({
  base: { gap: spacing.xs, display: "grid", width: "100%" },
});
const labelStyles = stylex.create({
  base: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
});
const inputStyles = stylex.create({
  base: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    fontFamily: typography.fontSans,
    width: "100%",
  },
});
const sizeStyles = stylex.create({
  sm: {
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    fontSize: typography.stepMinus1,
    minHeight: spacing.xxl,
  },
  md: {
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    fontSize: typography.step0,
    minHeight: spacing.xxxl,
  },
});
