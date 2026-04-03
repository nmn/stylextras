import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

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
export function AspectRatio({ ratio = "video", sx, ...props }: AspectRatioProps) {
  return <div {...props} {...stylex.props(baseStyles.base, ratioStyles[ratio], sx)} />;
}

const baseStyles = stylex.create({
  base: {
    display: "grid",
    placeItems: "center",
    width: "100%",
    overflow: "hidden",
    borderRadius: radius.md,
    backgroundColor: colors.bgSubtle,
  },
});

const ratioStyles = stylex.create({
  square: { aspectRatio: "1 / 1" },
  video: { aspectRatio: "16 / 9" },
  portrait: { aspectRatio: "4 / 5" },
  landscape: { aspectRatio: "4 / 3" },
});
