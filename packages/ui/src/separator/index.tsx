import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorEmphasis = "subtle" | "strong";

export type SeparatorProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  orientation?: SeparatorOrientation;
  emphasis?: SeparatorEmphasis;
  decorative?: boolean;
};

/**
 * Renders a horizontal or vertical separator.
 *
 * Search aliases: separator, divider, rule, line.
 *
 * A11y notes:
 * - Can render as decorative or semantic.
 * - The caller must opt into semantic separator behavior when it conveys structure.
 */
export function Separator({
  decorative = true,
  emphasis = "subtle",
  orientation = "horizontal",
  sx,
  ...props
}: SeparatorProps) {
  return (
    <div
      {...props}
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
      role={decorative ? undefined : "separator"}
      {...stylex.props(
        baseStyles.base,
        orientationStyles[orientation],
        emphasisStyles[emphasis],
        sx,
      )}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    display: "block",
    flexShrink: 0,
    backgroundColor: colors.border,
  },
});

const orientationStyles = stylex.create({
  horizontal: {
    width: "100%",
    height: stroke.thin,
    marginBlock: spacing.md,
  },
  vertical: {
    width: stroke.thin,
    height: "100%",
    minHeight: spacing["3xl"],
    marginInline: spacing.md,
  },
});

const emphasisStyles = stylex.create({
  subtle: {
    backgroundColor: colors.border,
  },
  strong: {
    backgroundColor: colors.borderStrong,
  },
});
