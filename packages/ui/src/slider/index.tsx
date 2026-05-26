import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import type { AccessibleNameProps } from "../accessibility";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type SliderSize = "sm" | "md";

export type SliderProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "size" | "style" | "type"
> &
  AccessibleNameProps & {
    sx?: StyleXStyles;
    inputSx?: StyleXStyles;
    labelSx?: StyleXStyles;
    size?: SliderSize;
  };

/**
 * Renders a token-styled native range input.
 *
 * Search aliases: slider, range input, track control, value slider.
 *
 * A11y notes:
 * - Uses native range input semantics.
 * - Value text, units, and marks need to be supplied externally where required.
 */
export function Slider({
  disabled,
  inputSx,
  label,
  labelSx,
  max = 100,
  min = 0,
  size = "md",
  step = 1,
  sx,
  ...props
}: SliderProps) {
  return (
    <label {...stylex.props(rootStyles.root, sx)}>
      {label ? (
        <span {...stylex.props(labelStyles.label, labelSx)}>{label}</span>
      ) : null}
      <input
        {...props}
        disabled={disabled}
        max={max}
        min={min}
        step={step}
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
}

const rootStyles = stylex.create({
  root: {
    gap: spacing.xs,
    display: "grid",
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
    margin: 0,
    outline: "none",
    accentColor: colors.primary,
    boxShadow: {
      default: null,
      ":focus-visible": `0 0 0 3px ${colors.focusRing}`,
    },
    cursor: "pointer",
    width: "100%",
  },
});

const sizeStyles = stylex.create({
  sm: {
    minHeight: spacing.lg,
  },
  md: {
    minHeight: spacing.xl,
  },
});

const stateStyles = stylex.create({
  disabled: {
    cursor: "not-allowed",
    opacity: 0.5,
  },
});
