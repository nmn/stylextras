import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type TooltipPlacement = "bottom" | "top" | "right" | "left";

export type TooltipProps = Omit<BaseProps, "className" | "style" | "popover"> & {
  placement?: TooltipPlacement;
  sx?: StyleXStyles;
};

const bottomFallback = stylex.positionTry({ positionArea: "top" });
const topFallback = stylex.positionTry({ positionArea: "bottom" });
const rightFallback = stylex.positionTry({ positionArea: "left" });
const leftFallback = stylex.positionTry({ positionArea: "right" });

/**
 * Renders a tooltip surface using native popover and anchor positioning.
 *
 * Search aliases: tooltip, hint, hover tip, floating label.
 *
 * A11y notes:
 * - This component renders the surfaced tooltip only.
 * - Trigger wiring, keyboard access, and open/close timing must be handled by the caller.
 */
export function Tooltip({ placement = "top", sx, ...props }: TooltipProps) {
  return (
    <div
      {...props}
      popover="manual"
      role="tooltip"
      {...stylex.props(
        baseStyles.base,
        placementStyles[placement],
        fallbackStyles[placement],
        sx,
      )}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    position: "fixed",
    margin: 0,
    display: "inline-flex",
    alignItems: "center",
    paddingInline: spacing.xs,
    paddingBlock: spacing["3xs"],
    borderRadius: radius.sm,
    backgroundColor: colors.fg,
    color: colors.bg,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
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
  bottom: { positionTryFallbacks: bottomFallback },
  top: { positionTryFallbacks: topFallback },
  right: { positionTryFallbacks: rightFallback },
  left: { positionTryFallbacks: leftFallback },
});
