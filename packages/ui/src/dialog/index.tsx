import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithRef<"dialog">;

export type DialogSize = "sm" | "md" | "lg";

export type DialogProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  size?: DialogSize;
};

/**
 * Renders a modal or non-modal surface using the native dialog element.
 *
 * Search aliases: dialog, modal, modal dialog, popup dialog.
 *
 * A11y notes:
 * - Relies on native <dialog> behavior for focus and modality.
 * - Does not add custom focus restoration, layered dismissal, or inert polyfills.
 */
export function Dialog({ ref, size = "md", sx, ...props }: DialogProps) {
  return (
    <dialog
      ref={ref}
      {...props}
      {...stylex.props(baseStyles.base, sizeStyles[size], sx)}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    margin: "auto",
    padding: spacing.lg,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    boxShadow: elevation.lg,
  },
});

const sizeStyles = stylex.create({
  sm: {
    width: "min(360px, calc(100vw - 32px))",
  },
  md: {
    width: "min(480px, calc(100vw - 32px))",
  },
  lg: {
    width: "min(640px, calc(100vw - 32px))",
  },
});
