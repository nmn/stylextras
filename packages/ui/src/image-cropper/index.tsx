import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'

export type ImageCropperRatio = 'square' | 'video' | 'portrait' | 'landscape'
export type ImageCropperPosition = 'center' | 'top' | 'bottom' | 'start' | 'end'

export type ImageCropperProps = Omit<
  ComponentPropsWithoutRef<'img'>,
  'alt' | 'className' | 'style'
> & {
  alt: string
  frameSx?: StyleXStyles
  position?: ImageCropperPosition
  ratio?: ImageCropperRatio
  sx?: StyleXStyles
}

export type ImageCropPreviewProps = ImageCropperProps

/**
 * Renders a fixed-ratio image crop preview using object-fit and object-position.
 *
 * Search aliases: image cropper, crop preview, image frame, media crop.
 *
 * A11y notes:
 * - This is a visual crop preview rather than an editing tool.
 * - Alt text and crop meaning remain the caller’s responsibility.
 */
export function ImageCropPreview({
  alt,
  frameSx,
  position = 'center',
  ratio = 'square',
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
  )
}

/** @deprecated This component is a crop preview, not an interactive crop editor. */
export const ImageCropper = ImageCropPreview

const frameStyles = stylex.create({
  base: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.bgSubtle,
    width: '100%',
  },
})

const ratioStyles = stylex.create({
  square: { aspectRatio: '1 / 1' },
  video: { aspectRatio: '16 / 9' },
  portrait: { aspectRatio: '4 / 5' },
  landscape: { aspectRatio: '4 / 3' },
})

const imageStyles = stylex.create({
  base: {
    display: 'block',
    objectFit: 'cover',
    height: '100%',
    width: '100%',
  },
})

const positionStyles = stylex.create({
  center: { objectPosition: 'center' },
  top: { objectPosition: 'top' },
  bottom: { objectPosition: 'bottom' },
  start: {
    objectPosition: { default: '0% 50%', ':dir(rtl)': '100% 50%' },
  },
  end: {
    objectPosition: { default: '100% 50%', ':dir(rtl)': '0% 50%' },
  },
})
