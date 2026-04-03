import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithRef<"dialog">;

export type DrawerSide = "left" | "right";

export type DrawerProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  side?: DrawerSide;
};

/**
 * Renders a side-aligned panel using the native dialog element.
 *
 * Search aliases: drawer, sheet, side panel, offcanvas.
 *
 * A11y notes:
 * - Relies on native <dialog> behavior.
 * - Does not provide swipe gestures, stacked drawers, or custom focus restoration.
 */
export function Drawer({ ref, side = "right", sx, ...props }: DrawerProps) {
  return <dialog ref={ref} {...props} {...stylex.props(baseStyles.base, sideStyles[side], sx)} />;
}

const baseStyles = stylex.create({ base: { margin: 0, padding: spacing.lg, minHeight: "100vh", border: "none", backgroundColor: colors.bgRaised, color: colors.fg, boxShadow: elevation.lg, position: "fixed", top: 0, width: "min(420px, 100vw)" } });
const sideStyles = stylex.create({ left: { left: 0, borderRightStyle: "solid", borderRightWidth: stroke.thin, borderRightColor: colors.border }, right: { right: 0, borderLeftStyle: "solid", borderLeftWidth: stroke.thin, borderLeftColor: colors.border } });
