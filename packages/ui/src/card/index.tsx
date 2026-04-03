import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { blur } from "../tokens/blur.stylex";
import { colors } from "../tokens/color.stylex";
import { elevation as tokenElevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type CardElevation = "flat" | "sm" | "md" | "lg";

export type CardProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  elevation?: CardElevation;
};

/**
 * Renders a token-driven surface for grouping related content.
 *
 * Search aliases: card, panel, surface, container.
 *
 * A11y notes:
 * - Provides visual grouping only.
 * - Landmark or region semantics must be supplied by the caller when needed.
 */
export function Card({
  elevation = "md",
  sx,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      {...stylex.props(baseStyles.base, elevationStyles[elevation], sx)}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
    padding: spacing.lg,
    color: colors.fg,
    backgroundColor: colors.bgRaised,
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderRadius: radius.lg,
    backdropFilter: `blur(${blur.xs})`,
  },
});

const elevationStyles = stylex.create({
  flat: {
    boxShadow: tokenElevation.none,
  },
  sm: {
    boxShadow: tokenElevation.sm,
  },
  md: {
    boxShadow: tokenElevation.md,
  },
  lg: {
    boxShadow: tokenElevation.lg,
  },
});
