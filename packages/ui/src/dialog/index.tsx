import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"dialog">;

export type DialogSize = "sm" | "md" | "lg";

export type DialogProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  size?: DialogSize;
};

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  { size = "md", sx, ...props },
  ref,
) {
  return (
    <dialog
      ref={ref}
      {...props}
      {...stylex.props(styles.base, styles[size], sx)}
    />
  );
});

const styles = stylex.create({
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
