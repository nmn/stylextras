import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type NumberFieldSize = "sm" | "md";

export type NumberFieldProps = Omit<BaseProps, "className" | "style" | "type" | "size"> & {
  sx?: StyleXStyles;
  inputSx?: StyleXStyles;
  labelSx?: StyleXStyles;
  label?: ReactNode;
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
      {label ? <span {...stylex.props(labelStyles.base, labelSx)}>{label}</span> : null}
      <input
        {...props}
        type="number"
        {...stylex.props(inputStyles.base, sizeStyles[size], inputSx)}
      />
    </label>
  );
}

const rootStyles = stylex.create({ base: { display: "grid", gap: spacing.xs, width: "100%" } });
const labelStyles = stylex.create({ base: { color: colors.fgSoft, fontFamily: typography.fontSans, fontSize: typography.stepMinus1, fontWeight: typography.weightMedium } });
const inputStyles = stylex.create({ base: { width: "100%", borderStyle: "solid", borderWidth: stroke.thin, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.bgRaised, color: colors.fg, fontFamily: typography.fontSans } });
const sizeStyles = stylex.create({
  sm: { minHeight: spacing["2xl"], paddingInline: spacing.sm, paddingBlock: spacing.xs, fontSize: typography.stepMinus1 },
  md: { minHeight: spacing["3xl"], paddingInline: spacing.md, paddingBlock: spacing.sm, fontSize: typography.step0 },
});
