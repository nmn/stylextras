import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ContextMenuPlacement = "bottom" | "top" | "right" | "left";
export type ContextMenuBehavior = "auto" | "manual";

export type ContextMenuProps = Omit<BaseProps, "className" | "style" | "popover"> & {
  behavior?: ContextMenuBehavior;
  placement?: ContextMenuPlacement;
  sx?: StyleXStyles;
};

const bottomFallback = stylex.positionTry({ positionArea: "top" });
const topFallback = stylex.positionTry({ positionArea: "bottom" });
const rightFallback = stylex.positionTry({ positionArea: "left" });
const leftFallback = stylex.positionTry({ positionArea: "right" });

/**
 * Renders a menu surface using the native popover attribute and anchor positioning.
 *
 * Search aliases: context menu, right click menu, menu surface, popover menu.
 *
 * A11y notes:
 * - Does not implement full context-menu keyboard behavior or invocation handling.
 * - Opening, focus management, and item navigation must be composed by the caller.
 */
export function ContextMenu({
  behavior = "manual",
  placement = "bottom",
  sx,
  ...props
}: ContextMenuProps) {
  return (
    <div
      {...props}
      popover={behavior}
      role="menu"
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
    display: "grid",
    gap: spacing["3xs"],
    minWidth: spacing["4xl"],
    padding: spacing.sm,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
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
