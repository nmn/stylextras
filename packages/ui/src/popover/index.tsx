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

export type PopoverProps = Omit<BaseProps, "className" | "style" | "popover"> & {
  sx?: StyleXStyles;
  size?: PopoverSize;
  behavior?: PopoverBehavior;
};

export const Popover = ({
  behavior = "auto",
  size = "md",
  sx,
  ...props
}: PopoverProps) => (
  <div
    {...props}
    popover={behavior}
    {...stylex.props(styles.base, styles[size], sx)}
  />
);

const styles = stylex.create({
  base: {
    margin: spacing.md,
    padding: spacing.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    boxShadow: elevation.md,
  },
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
