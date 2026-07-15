import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";

type BaseProps = ComponentPropsWithRef<"div">;

export type AspectRatioValue = "square" | "video" | "portrait" | "landscape";

export type AspectRatioProps = Omit<BaseProps, "className" | "style"> & {
  ratio?: AspectRatioValue;
  sx?: StyleXStyles;
};

/**
 * Renders a layout frame that preserves a predefined aspect ratio.
 *
 * Search aliases: aspect ratio, media frame, ratio box, responsive frame.
 *
 * A11y notes:
 * - Provides layout only and no media semantics.
 * - Accessible naming must come from the content rendered inside it.
 */
export function AspectRatio({
  ref,
  ratio = "video",
  sx,
  ...props
}: AspectRatioProps) {
  return (
    <div
      ref={ref}
      {...props}
      {...stylex.props(baseStyles.base, ratioStyles[ratio], sx)}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    borderRadius: radius.md,
    overflow: "hidden",
    placeItems: "center",
    backgroundColor: colors.bgSubtle,
    display: "grid",
    width: "100%",
  },
});

const ratioStyles = stylex.create({
  square: { aspectRatio: "1 / 1" },
  video: { aspectRatio: "16 / 9" },
  portrait: { aspectRatio: "4 / 5" },
  landscape: { aspectRatio: "4 / 3" },
});
