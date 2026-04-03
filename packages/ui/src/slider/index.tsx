import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type SliderSize = "sm" | "md";

export type SliderProps = Omit<BaseProps, "className" | "style" | "type"> & {
  sx?: StyleXStyles;
  inputSx?: StyleXStyles;
  labelSx?: StyleXStyles;
  label?: ReactNode;
  size?: SliderSize;
};

export const Slider = ({
  disabled,
  inputSx,
  label,
  labelSx,
  size = "md",
  sx,
  ...props
}: SliderProps) => (
  <label {...stylex.props(rootStyles.root, sx)}>
    {label ? (
      <span {...stylex.props(labelStyles.label, labelSx)}>{label}</span>
    ) : null}
    <input
      {...props}
      disabled={disabled}
      type="range"
      {...stylex.props(
        inputStyles.base,
        sizeStyles[size],
        disabled && stateStyles.disabled,
        inputSx,
      )}
    />
  </label>
);

const rootStyles = stylex.create({
  root: {
    display: "grid",
    gap: spacing.xs,
    width: "100%",
  },
});

const labelStyles = stylex.create({
  label: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
  },
});

const inputStyles = stylex.create({
  base: {
    width: "100%",
    margin: 0,
    accentColor: colors.primary,
  },
});

const sizeStyles = stylex.create({
  sm: {
    minHeight: spacing.md,
  },
  md: {
    minHeight: spacing.lg,
  },
});

const stateStyles = stylex.create({
  disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});
