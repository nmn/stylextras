import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"progress">;

export type ProgressBarProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  label?: ReactNode;
};

/**
 * Renders a token-styled native progress element.
 *
 * Search aliases: progress bar, progress, loading bar, completion bar.
 *
 * A11y notes:
 * - Uses native progress semantics.
 * - The caller should provide a visible or programmatic label.
 */
export function ProgressBar({ label, sx, ...props }: ProgressBarProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      {label ? <span {...stylex.props(labelStyles.base)}>{label}</span> : null}
      <progress {...props} {...stylex.props(progressStyles.base)} />
    </label>
  );
}

const rootStyles = stylex.create({ base: { display: "grid", gap: spacing.xs } });
const labelStyles = stylex.create({ base: { color: colors.fgSoft, fontFamily: typography.fontSans, fontSize: typography.stepMinus1, fontWeight: typography.weightMedium } });
const progressStyles = stylex.create({ base: { width: "100%", accentColor: colors.primary } });
