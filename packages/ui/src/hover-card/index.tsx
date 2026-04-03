import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type HoverCardPlacement = "bottom" | "top" | "right" | "left";

export type HoverCardProps = Omit<BaseProps, "className" | "style" | "popover"> & {
  placement?: HoverCardPlacement;
  sx?: StyleXStyles;
};

const bottomFallback = stylex.positionTry({ positionArea: "top" });
const topFallback = stylex.positionTry({ positionArea: "bottom" });
const rightFallback = stylex.positionTry({ positionArea: "left" });
const leftFallback = stylex.positionTry({ positionArea: "right" });

/**
 * Renders a lightweight popover surface for hover-style disclosure.
 *
 * Search aliases: hover card, preview card, hover popover, info card.
 *
 * A11y notes:
 * - Rendered with native popover positioning, but trigger wiring is left to the caller.
 * - Hover-only disclosure patterns should always be paired with keyboard and touch-accessible triggers.
 */
export function HoverCard({ placement = "bottom", sx, ...props }: HoverCardProps) {
  return (
    <div
      {...props}
      popover="auto"
      role="dialog"
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
  bottom: { positionTryFallbacks: bottomFallback },
  top: { positionTryFallbacks: topFallback },
  right: { positionTryFallbacks: rightFallback },
  left: { positionTryFallbacks: leftFallback },
});
