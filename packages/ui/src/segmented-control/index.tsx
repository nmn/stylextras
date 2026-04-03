"use client";

import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

type SegmentOption = { label: string; value: string };

export type SegmentedControlProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  options?: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const defaultOptions = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

/**
 * Renders a segmented selection control.
 *
 * Search aliases: segmented control, segments, option chips, toggle segments.
 *
 * A11y notes:
 * - Selection semantics are simplified.
 * - It does not yet provide a full radio-group style keyboard interaction model.
 */
export function SegmentedControl({
  defaultValue,
  onValueChange,
  options = defaultOptions,
  sx,
  value,
  ...props
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const currentValue = value ?? internalValue;

  function handleChange(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  return (
    <div {...props} role="group" {...stylex.props(groupStyles.base, sx)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleChange(option.value)}
          {...stylex.props(buttonStyles.base, currentValue === option.value ? stateStyles.active : stateStyles.inactive)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

const groupStyles = stylex.create({ base: { display: "inline-flex", alignItems: "center", gap: spacing["3xs"], padding: spacing["3xs"], borderStyle: "solid", borderWidth: stroke.thin, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.bgSubtle } });
const buttonStyles = stylex.create({ base: { minHeight: spacing["2xl"], paddingInline: spacing.md, paddingBlock: spacing.xs, border: "none", borderRadius: radius.md, fontFamily: typography.fontSans, fontSize: typography.stepMinus1, fontWeight: typography.weightMedium, backgroundColor: "transparent", color: colors.fgSoft } });
const stateStyles = stylex.create({ active: { backgroundColor: colors.bgRaised, color: colors.fg }, inactive: { backgroundColor: "transparent", color: colors.fgMuted } });
