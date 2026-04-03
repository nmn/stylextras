import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type PopoverSize = "sm" | "md" | "lg";
export type PopoverBehavior = "auto" | "manual";
export type PopoverPlacement = "bottom" | "top" | "right" | "left";

export type PopoverProps = Omit<BaseProps, "className" | "style" | "popover"> & {
  behavior?: PopoverBehavior;
  placement?: PopoverPlacement;
  size?: PopoverSize;
  sx?: StyleXStyles;
};

const bottomFallback = stylex.positionTry({ positionArea: "top" });
const topFallback = stylex.positionTry({ positionArea: "bottom" });
const rightFallback = stylex.positionTry({ positionArea: "left" });
const leftFallback = stylex.positionTry({ positionArea: "right" });

/**
 * Renders a floating surface using the native popover attribute and CSS anchor positioning.
 *
 * Search aliases: popover, popup, floating panel, anchored overlay.
 *
 * A11y notes:
 * - Focus and trigger behavior are not fully managed by the component.
 * - The caller is responsible for opening, closing, and announcing the relationship to its trigger.
 */
export function Popover({
  behavior = "auto",
  placement = "bottom",
  size = "md",
  sx,
  ...props
}: PopoverProps) {
  return (
    <div
      {...props}
      popover={behavior}
      {...stylex.props(
        baseStyles.base,
        placementStyles[placement],
        fallbackStyles[placement],
        sizeStyles[size],
        sx,
      )}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    position: "fixed",
    margin: 0,
    padding: spacing.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    boxShadow: elevation.md,
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: "auto",
  },
});

const placementStyles = stylex.create({
  bottom: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: "bottom",
  },
  top: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: "top",
  },
  right: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: "right",
  },
  left: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: "left",
  },
});

const fallbackStyles = stylex.create({
  bottom: {
    positionTryFallbacks: bottomFallback,
  },
  top: {
    positionTryFallbacks: topFallback,
  },
  right: {
    positionTryFallbacks: rightFallback,
  },
  left: {
    positionTryFallbacks: leftFallback,
  },
});

const sizeStyles = stylex.create({
  sm: {
    width: "min(240px, calc(100vw - 32px))",
  },
  md: {
    width: "min(320px, calc(100vw - 32px))",
  },
  lg: {
    width: "min(420px, calc(100vw - 32px))",
  },
});
