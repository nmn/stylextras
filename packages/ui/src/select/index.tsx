import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"select">;

type SelectOption = { label: string; value: string };

export type SelectSize = "sm" | "md";

export type SelectProps = Omit<BaseProps, "className" | "style" | "size"> & {
  sx?: StyleXStyles;
  selectSx?: StyleXStyles;
  labelSx?: StyleXStyles;
  label?: ReactNode;
  options?: SelectOption[];
  size?: SelectSize;
};

const defaultOptions = [
  { label: "Option one", value: "one" },
  { label: "Option two", value: "two" },
  { label: "Option three", value: "three" },
];

/**
 * Renders a token-styled native select element.
 *
 * Search aliases: select, dropdown select, picker, select field.
 *
 * A11y notes:
 * - Uses native select semantics.
 * - Popup behavior and spoken feedback vary by browser and platform.
 */
export function Select({
  children,
  label,
  labelSx,
  options = defaultOptions,
  selectSx,
  size = "md",
  sx,
  ...props
}: SelectProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      {label ? <span {...stylex.props(labelStyles.base, labelSx)}>{label}</span> : null}
      <select {...props} {...stylex.props(selectStyles.base, sizeStyles[size], selectSx)}>
        {children ?? options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

const rootStyles = stylex.create({ base: { display: "grid", gap: spacing.xs, width: "100%" } });
const labelStyles = stylex.create({ base: { color: colors.fgSoft, fontFamily: typography.fontSans, fontSize: typography.stepMinus1, fontWeight: typography.weightMedium } });
const selectStyles = stylex.create({
  base: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    fontFamily: typography.fontSans,
  },
});
const sizeStyles = stylex.create({
  sm: { minHeight: spacing["2xl"], paddingInline: spacing.sm, paddingBlock: spacing.xs, fontSize: typography.stepMinus1 },
  md: { minHeight: spacing["3xl"], paddingInline: spacing.md, paddingBlock: spacing.sm, fontSize: typography.step0 },
});
