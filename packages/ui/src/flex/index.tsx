import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type FlexDirection = "row" | "column";
export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexJustify = "start" | "center" | "end" | "between";
export type FlexGap = "sm" | "md" | "lg";

export type FlexProps = Omit<BaseProps, "className" | "style"> & {
  align?: FlexAlign;
  direction?: FlexDirection;
  gap?: FlexGap;
  justify?: FlexJustify;
  sx?: StyleXStyles;
  wrap?: boolean;
};

/**
 * Renders a small token-driven flexbox layout primitive.
 *
 * Search aliases: flex, stack, row, flex layout.
 *
 * A11y notes:
 * - Provides layout only.
 * - Reading order follows DOM order and is not changed for assistive technology.
 */
export function Flex({
  align = "stretch",
  direction = "row",
  gap = "md",
  justify = "start",
  sx,
  wrap = false,
  ...props
}: FlexProps) {
  return (
    <div
      {...props}
      {...stylex.props(
        baseStyles.base,
        directionStyles[direction],
        alignStyles[align],
        justifyStyles[justify],
        gapStyles[gap],
        wrap && wrapStyles.wrap,
        sx,
      )}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    display: "flex",
  },
});

const directionStyles = stylex.create({
  row: { flexDirection: "row" },
  column: { flexDirection: "column" },
});

const alignStyles = stylex.create({
  start: { alignItems: "flex-start" },
  center: { alignItems: "center" },
  end: { alignItems: "flex-end" },
  stretch: { alignItems: "stretch" },
});

const justifyStyles = stylex.create({
  start: { justifyContent: "flex-start" },
  center: { justifyContent: "center" },
  end: { justifyContent: "flex-end" },
  between: { justifyContent: "space-between" },
});

const gapStyles = stylex.create({
  sm: { gap: spacing.sm },
  md: { gap: spacing.md },
  lg: { gap: spacing.lg },
});

const wrapStyles = stylex.create({
  wrap: { flexWrap: "wrap" },
});
