import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef, PointerEvent } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
type BaseProps = ComponentPropsWithRef<"div">;
export type WindowSplitterOrientation = "horizontal" | "vertical";
export type WindowSplitterProps = Omit<BaseProps, "className" | "style"> & {
  defaultValue?: number;
  label: string;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  orientation?: WindowSplitterOrientation;
  sx?: StyleXStyles;
  value?: number;
};
/**
 * Renders a visual splitter between regions.
 *
 * Search aliases: window splitter, splitter, resizer, pane divider.
 *
 * A11y notes:
 * - Uses a focusable separator with value semantics.
 * - Supports pointer resizing, arrow-key resizing, Home, and End.
 */
export function WindowSplitter({
  defaultValue = 50,
  label,
  max = 90,
  min = 10,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onValueChange,
  orientation = "vertical",
  ref,
  sx,
  tabIndex = 0,
  value,
  ...props
}: WindowSplitterProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const isControlled = value !== undefined;
  function setValue(nextValue: number) {
    const clampedValue = Math.min(max, Math.max(min, Math.round(nextValue)));
    if (!isControlled) {
      setInternalValue(clampedValue);
    }
    onValueChange?.(clampedValue);
  }
  function updateFromPointer(event: PointerEvent<HTMLDivElement>) {
    const container = event.currentTarget.parentElement;
    if (!container) {
      return;
    }
    const rect = container.getBoundingClientRect();
    const nextValue =
      orientation === "vertical"
        ? ((event.clientX - rect.left) / rect.width) * 100
        : ((event.clientY - rect.top) / rect.height) * 100;
    setValue(nextValue);
  }
  return (
    <div
      {...props}
      aria-label={label}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={currentValue}
      aria-orientation={orientation}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) {
          return;
        }
        const largeStep = event.shiftKey ? 10 : 2;
        if (
          (orientation === "vertical" && event.key === "ArrowLeft") ||
          (orientation === "horizontal" && event.key === "ArrowUp")
        ) {
          event.preventDefault();
          setValue(currentValue - largeStep);
        }
        if (
          (orientation === "vertical" && event.key === "ArrowRight") ||
          (orientation === "horizontal" && event.key === "ArrowDown")
        ) {
          event.preventDefault();
          setValue(currentValue + largeStep);
        }
        if (event.key === "Home") {
          event.preventDefault();
          setValue(min);
        }
        if (event.key === "End") {
          event.preventDefault();
          setValue(max);
        }
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (!event.defaultPrevented) {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event);
        }
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (
          !event.defaultPrevented &&
          event.currentTarget.hasPointerCapture(event.pointerId)
        ) {
          updateFromPointer(event);
        }
      }}
      ref={ref}
      role="separator"
      tabIndex={tabIndex}
      {...stylex.props(baseStyles.base, orientationStyles[orientation], sx)}
    />
  );
}
const baseStyles = stylex.create({
  base: {
    borderRadius: radius.round,
    borderWidth: 0,
    outline: "none",
    backgroundColor: {
      default: colors.borderStrong,
      ":focus-visible": colors.accent,
      ":hover": colors.accent,
    },
    flexShrink: 0,
    position: "relative",
  },
});
const orientationStyles = stylex.create({
  horizontal: {
    marginBlock: spacing.md,
    cursor: "row-resize",
    height: stroke.thick,
    width: "100%",
  },
  vertical: {
    marginInline: spacing.md,
    cursor: "col-resize",
    height: "100%",
    minHeight: spacing.xxxxl,
    width: stroke.thick,
  },
});
