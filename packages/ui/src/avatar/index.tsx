import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }
export type AvatarSize = 'sm' | 'md' | 'lg'
type AvatarAccessibilityProps =
  | (AccessibleAriaNameProps & { 'aria-hidden'?: false })
  | { 'aria-hidden': true; 'aria-label'?: never; 'aria-labelledby'?: never }
export type AvatarProps = Omit<
  ComponentPropsWithRef<'span'>,
  'aria-hidden' | 'aria-label' | 'aria-labelledby' | 'className' | 'role' | 'style'
> &
  AvatarAccessibilityProps &
  SxProp & { size?: AvatarSize }
export type AvatarImageProps = Omit<
  ComponentPropsWithRef<'img'>,
  'alt' | 'className' | 'style'
> &
  SxProp & { alt: string }
export type AvatarFallbackProps = Omit<
  ComponentPropsWithRef<'span'>,
  'aria-hidden' | 'className' | 'style'
> &
  SxProp

export function Avatar({ 'aria-hidden': ariaHidden, ref, size = 'md', sx, ...props }: AvatarProps) {
  return (
    <span
      ref={ref}
      role={ariaHidden ? undefined : 'img'}
      aria-hidden={ariaHidden}
      {...props}
      {...stylex.props(styles.avatar, sizeStyles[size], sx)}
    />
  )
}

export function AvatarImage({ alt, ref, sx, ...props }: AvatarImageProps) {
  return <img ref={ref} alt={alt} {...props} {...stylex.props(styles.image, sx)} />
}

export function AvatarFallback({ ref, sx, ...props }: AvatarFallbackProps) {
  return <span ref={ref} {...props} aria-hidden="true" {...stylex.props(styles.fallback, sx)} />
}

const styles = stylex.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.round,
    color: colors.accentForeground,
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightSemibold,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    userSelect: 'none',
  },
  image: {
    height: '100%',
    inset: 0,
    objectFit: 'cover',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  fallback: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    textTransform: 'uppercase',
    width: '100%',
  },
})

const sizeStyles = stylex.create({
  sm: { fontSize: typography.stepMinus1, height: spacing.controlSm, width: spacing.controlSm },
  md: { fontSize: typography.step0, height: spacing.controlMd, width: spacing.controlMd },
  lg: { fontSize: typography.step1, height: spacing.controlLg, width: spacing.controlLg },
})
