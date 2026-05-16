"use client";

import * as React from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"fieldset">;

export type SegmentOption =
  | string
  | {
      description?: ReactNode;
      label: ReactNode;
      value: string;
    };

export type SegmentedControlProps = Omit<BaseProps, "className" | "style"> & {
  legend?: ReactNode;
  name?: string;
  onValueChange?: (value: string) => void;
  options?: SegmentOption[];
  sx?: StyleXStyles;
  value?: string;
  defaultValue?: string;
};

const defaultOptions: SegmentOption[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

/**
 * Renders a radio-backed segmented control that reads like tabs or a switcher.
 *
 * Search aliases: segmented control, segments, radio tabs, segmented switch.
 *
 * A11y notes:
 * - Uses native fieldset and radio semantics.
 * - It behaves like a single-choice control, not a full tab widget with panel relationships.
 */
export function SegmentedControl({
  defaultValue,
  disabled,
  legend,
  name,
  onValueChange,
  options = defaultOptions,
  sx,
  value,
  ...props
}: SegmentedControlProps) {
  const generatedName = React.useId();
  const groupName = name ?? generatedName;
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? normalizedOptions[0]?.value ?? "",
  );
  const currentValue = value ?? internalValue;

  function handleChange(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  return (
    <fieldset
      {...props}
      disabled={disabled}
      {...stylex.props(rootStyles.base, sx)}
    >
      {legend ? (
        <legend {...stylex.props(rootStyles.legend)}>{legend}</legend>
      ) : null}
      <div {...stylex.props(trackStyles.base)}>
        {normalizedOptions.map((option) => {
          const checked = currentValue === option.value;

          return (
            <label
              key={option.value}
              {...stylex.props(
                segmentStyles.base,
                checked ? stateStyles.on : stateStyles.off,
              )}
            >
              <input
                checked={checked}
                name={groupName}
                onChange={() => handleChange(option.value)}
                type="radio"
                value={option.value}
                {...stylex.props(inputStyles.base)}
              />
              <span {...stylex.props(copyStyles.base)}>
                <span {...stylex.props(copyStyles.label)}>{option.label}</span>
                {option.description ? (
                  <span {...stylex.props(copyStyles.description)}>
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const rootStyles = stylex.create({
  base: {
    display: "grid",
    gap: spacing.xs,
    minWidth: 0,
    borderStyle: "solid",
    borderWidth: 0,
    borderColor: "transparent",
    padding: 0,
    margin: 0,
  },
  legend: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
});

const trackStyles = stylex.create({
  base: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: spacing["3xs"],
    width: "fit-content",
    maxWidth: "100%",
    padding: spacing["3xs"],
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    boxShadow: `inset 0 0 0 1px ${colors.bgInset}`,
  },
});

const segmentStyles = stylex.create({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "1 1 auto",
    minHeight: spacing["3xl"],
    minWidth: `calc(${spacing["4xl"]} + ${spacing.md})`,
    paddingInline: spacing.md,
    paddingBlock: spacing.xs,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: "transparent",
    borderRadius: radius.lg,
    backgroundColor: {
      default: "transparent",
      ":hover": colors.bgSubtle,
      ":has(input:checked)": colors.bgRaised,
    },
    color: {
      default: colors.fgMuted,
      ":hover": colors.fgSoft,
      ":has(input:checked)": colors.fg,
    },
    boxShadow: {
      default: null,
      ":has(input:checked)": `0 1px 2px ${colors.overlay}`,
      ":has(input:focus-visible)": `0 0 0 ${stroke.thick} ${colors.focusRing}`,
    },
    cursor: "pointer",
    userSelect: "none",
    textAlign: "center",
    transitionDuration: "150ms",
    transitionProperty: "background-color, border-color, box-shadow, color",
    transitionTimingFunction: "ease-in-out",
  },
});

const inputStyles = stylex.create({
  base: {
    position: "absolute",
    inset: 0,
    margin: 0,
    opacity: 0,
    cursor: "inherit",
  },
});

const copyStyles = stylex.create({
  base: {
    display: "grid",
    gap: spacing["2xs"],
    minWidth: 0,
    pointerEvents: "none",
  },
  label: {
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightSnug,
    whiteSpace: "nowrap",
  },
  description: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus2,
    lineHeight: typography.lineHeightBody,
  },
});

const stateStyles = stylex.create({
  on: {
    borderColor: colors.borderStrong,
  },
  off: {
    borderColor: "transparent",
  },
});
