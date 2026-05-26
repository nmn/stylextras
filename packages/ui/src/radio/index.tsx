import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import type { AccessibleNameProps } from "../accessibility";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type RadioProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "style" | "type"
> &
  AccessibleNameProps & {
    sx?: StyleXStyles;
  };

/**
 * Renders a single native radio input with optional label content.
 *
 * Search aliases: radio, radio button, single choice, option control.
 *
 * A11y notes:
 * - Uses native radio semantics.
 * - Standalone use is fine, but grouped radios should still share a name and visible legend supplied by the caller.
 */
export function Radio({ label, sx, ...props }: RadioProps) {
  return (
    <label {...stylex.props(styles.root, sx)}>
      <input {...props} type="radio" {...stylex.props(styles.input)} />
      {label ? <span {...stylex.props(styles.label)}>{label}</span> : null}
    </label>
  );
}

const styles = stylex.create({
  root: {
    gap: spacing.xs,
    alignItems: "center",
    color: colors.fg,
    display: "inline-flex",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
  },
  input: {
    margin: 0,
    accentColor: colors.primary,
    boxShadow: {
      default: null,
      ":focus-visible": `0 0 0 ${stroke.thick} ${colors.focusRing}`,
    },
    height: spacing.lg,
    width: spacing.lg,
  },
  label: {
    lineHeight: typography.lineHeightBody,
  },
});
