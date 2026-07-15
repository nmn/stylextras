import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type ColorSliderProps = Omit<
  BaseProps,
  "className" | "style" | "type"
> & {
  sx?: StyleXStyles;
};

/**
 * Renders a simplified slider for color channel adjustment.
 *
 * Search aliases: color slider, hue slider, channel slider, color range.
 *
 * A11y notes:
 * - Relies on native range input semantics when applicable.
 * - Channel naming and spoken value details may need additional labeling from the caller.
 */
export function ColorSlider({
  max = 360,
  min = 0,
  step = 1,
  sx,
  ...props
}: ColorSliderProps) {
  return (
    <input
      {...props}
      max={max}
      min={min}
      step={step}
      type="range"
      {...stylex.props(styles.base, sx)}
    />
  );
}

const styles = stylex.create({
  base: {
    margin: 0,
    outline: "none",
    accentColor: colors.primary,
    boxShadow: {
      default: null,
      ":focus-visible": `0 0 0 3px ${colors.focusRing}`,
    },
    cursor: "pointer",
    minHeight: spacing.lg,
    width: "100%",
  },
});
