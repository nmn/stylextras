import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import type { AccessibleNameProps } from "../accessibility";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"select">;

type SelectOption = string | { label: string; value: string };

export type SelectSize = "sm" | "md";

export type SelectProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "style" | "size"
> &
  AccessibleNameProps & {
    sx?: StyleXStyles;
    selectSx?: StyleXStyles;
    labelSx?: StyleXStyles;
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
      {label ? (
        <span {...stylex.props(labelStyles.base, labelSx)}>{label}</span>
      ) : null}
      <select
        {...props}
        {...stylex.props(selectStyles.base, sizeStyles[size], selectSx)}
      >
        {children ??
          options.map((option) => {
            const normalizedOption =
              typeof option === "string"
                ? { label: option, value: option }
                : option;

            return (
              <option
                key={normalizedOption.value}
                value={normalizedOption.value}
              >
                {normalizedOption.label}
              </option>
            );
          })}
      </select>
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
const selectStyles = stylex.create({
  base: {
    backgroundPosition: `calc(100% - ${spacing.md}) calc(50% - 1px), calc(100% - ${spacing.sm}) calc(50% - 1px)`,
    borderColor: {
      default: colors.borderStrong,
      ":hover": colors.borderAccent,
      ":focus": colors.primary,
    },
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    outline: {
      default: null,
      ":focus": "none",
    },
    appearance: "none",
    backgroundColor: colors.bg,
    backgroundImage: `linear-gradient(45deg, transparent 50%, ${colors.fgMuted} 50%), linear-gradient(135deg, ${colors.fgMuted} 50%, transparent 50%)`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "6px 6px, 6px 6px",
    boxShadow: {
      default: `inset 0 1px 0 ${colors.bgSubtle}`,
      ":focus": `0 0 0 ${stroke.thick} ${colors.focusRing}`,
    },
    color: colors.fg,
    fontFamily: typography.fontSans,
    transitionDuration: "150ms",
    transitionProperty: "border-color, box-shadow, background-color",
    transitionTimingFunction: "ease-in-out",
    width: "100%",
  },
});
const sizeStyles = stylex.create({
  sm: {
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    fontSize: typography.stepMinus1,
    minHeight: spacing.xxl,
    paddingRight: spacing.xl,
  },
  md: {
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    fontSize: typography.step0,
    minHeight: spacing.xxxl,
    paddingRight: spacing.xxl,
  },
});
