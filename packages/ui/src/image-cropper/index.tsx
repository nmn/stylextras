import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";

export type ImageCropperRatio = "square" | "video" | "portrait" | "landscape";
export type ImageCropperPosition = "center" | "top" | "bottom" | "left" | "right";

export type ImageCropperProps = Omit<ComponentPropsWithoutRef<"img">, "className" | "style"> & {
  frameSx?: StyleXStyles;
  position?: ImageCropperPosition;
  ratio?: ImageCropperRatio;
  sx?: StyleXStyles;
};

/**
 * Renders a fixed-ratio image crop preview using object-fit and object-position.
 *
 * Search aliases: image cropper, crop preview, image frame, media crop.
 *
 * A11y notes:
 * - This is a visual crop preview rather than an editing tool.
 * - Alt text and crop meaning remain the caller’s responsibility.
 */
export function ImageCropper({
  alt,
  frameSx,
  position = "center",
  ratio = "square",
  src,
  sx,
  ...props
}: ImageCropperProps) {
  return (
    <div {...stylex.props(frameStyles.base, ratioStyles[ratio], frameSx)}>
      <img
        {...props}
        alt={alt}
        src={src}
        {...stylex.props(imageStyles.base, positionStyles[position], sx)}
      />
    </div>
  );
}

const frameStyles = stylex.create({
  base: {
    overflow: "hidden",
    width: "100%",
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

const imageStyles = stylex.create({
  base: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const positionStyles = stylex.create({
  center: { objectPosition: "center" },
  top: { objectPosition: "top" },
  bottom: { objectPosition: "bottom" },
  left: { objectPosition: "left" },
  right: { objectPosition: "right" },
});
