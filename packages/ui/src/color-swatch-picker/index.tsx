"use client";

import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";
import { ColorSwatch } from "../color-swatch";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ColorSwatchPickerProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  colors?: string[];
  value?: string;
  onValueChange?: (value: string) => void;
};

const defaultColors = ["#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

/**
 * Renders a group of selectable color swatches.
 *
 * Search aliases: color swatch picker, swatch picker, palette picker, color palette.
 *
 * A11y notes:
 * - Selection behavior is simplified.
 * - Does not yet provide a robust radio-group style keyboard model.
 */
export function ColorSwatchPicker({ colors = defaultColors, onValueChange, sx, value, ...props }: ColorSwatchPickerProps) {
  const [internalValue, setInternalValue] = useState(colors[0] ?? "#7c3aed");
  const currentValue = value ?? internalValue;

  function handleSelect(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  return (
    <div {...props} {...stylex.props(styles.base, sx)}>
      {colors.map((item) => (
        <button key={item} type="button" onClick={() => handleSelect(item)} aria-pressed={currentValue === item}>
          <ColorSwatch color={item} />
        </button>
      ))}
    </div>
  );
}

const styles = stylex.create({ base: { display: "flex", alignItems: "center", gap: spacing.xs, flexWrap: "wrap" } });
