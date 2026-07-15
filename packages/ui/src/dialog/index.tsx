import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { Button, type ButtonProps } from '../button'
import { blur } from '../tokens/blur.stylex'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type DialogSize = 'sm' | 'md' | 'lg'
export type DialogProps = Omit<ComponentPropsWithRef<'dialog'>, 'className' | 'style'> &
  SxProp & {
    closedBy?: 'any' | 'closerequest' | 'none'
    size?: DialogSize
  }
export type DialogTriggerProps = Omit<ButtonProps, 'popoverTarget' | 'popoverTargetAction'> & {
  target: string
}
export type DialogCloseProps = ButtonProps & {
  target: string
}
export type DialogHeaderProps = Omit<ComponentPropsWithRef<'header'>, 'className' | 'style'> &
  SxProp
export type DialogTitleProps = Omit<ComponentPropsWithRef<'h2'>, 'className' | 'style'> & SxProp
export type DialogDescriptionProps = Omit<ComponentPropsWithRef<'p'>, 'className' | 'style'> &
  SxProp
export type DialogBodyProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp
export type DialogFooterProps = Omit<ComponentPropsWithRef<'footer'>, 'className' | 'style'> &
  SxProp

const commandProps = (target: string, command: 'show-modal' | 'request-close') =>
  ({ command, commandfor: target }) as Record<string, string>

/** A native dialog surface controlled by explicit invoker targets. */
export function Dialog({ closedBy = 'any', ref, size = 'md', sx, ...props }: DialogProps) {
  const closedByProps = { closedby: closedBy } as Record<string, string>
  return (
    <dialog
      ref={ref}
      {...closedByProps}
      {...props}
      {...stylex.props(styles.dialog, sizeStyles[size], sx)}
    />
  )
}

export function DialogTrigger({
  target,
  type = 'button',
  variant = 'outline',
  ...props
}: DialogTriggerProps) {
  return (
    <Button
      type={type}
      variant={variant}
      aria-haspopup="dialog"
      {...props}
      {...commandProps(target, 'show-modal')}
    />
  )
}

export function DialogClose({
  target,
  type = 'button',
  variant = 'outline',
  ...props
}: DialogCloseProps) {
  return (
    <Button type={type} variant={variant} {...props} {...commandProps(target, 'request-close')} />
  )
}

export function DialogHeader({ ref, sx, ...props }: DialogHeaderProps) {
  return <header ref={ref} {...props} {...stylex.props(styles.header, sx)} />
}

export function DialogTitle({ ref, sx, ...props }: DialogTitleProps) {
  return <h2 ref={ref} {...props} {...stylex.props(styles.title, sx)} />
}

export function DialogDescription({ ref, sx, ...props }: DialogDescriptionProps) {
  return <p ref={ref} {...props} {...stylex.props(styles.description, sx)} />
}

export function DialogBody({ ref, sx, ...props }: DialogBodyProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.body, sx)} />
}

export function DialogFooter({ ref, sx, ...props }: DialogFooterProps) {
  return <footer ref={ref} {...props} {...stylex.props(styles.footer, sx)} />
}

/* eslint-disable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
const styles = stylex.create({
  dialog: {
    backgroundColor: colors.popover,
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: elevation.lg,
    color: colors.popoverForeground,
    margin: 'auto',
    maxHeight: 'min(85dvh, 48rem)',
    maxWidth: 'calc(100vw - 2rem)',
    opacity: {
      default: 0,
      ':open': 1,
    },
    overflow: 'auto',
    padding: 0,
    transform: {
      default: 'translateY(8px) scale(0.98)',
      ':open': 'translateY(0) scale(1)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    transitionBehavior: 'allow-discrete',
    transitionDuration: {
      default: motion.durationModerate,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'display, opacity, overlay, transform',
    transitionTimingFunction: motion.easeEmphasized,
    '::backdrop': {
      backdropFilter: `blur(${blur.sm})`,
      backgroundColor: colors.overlay,
      opacity: 0,
      transitionBehavior: 'allow-discrete',
      transitionDuration: {
        default: motion.durationModerate,
        '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
      },
      transitionProperty: 'backdrop-filter, display, opacity, overlay',
      transitionTimingFunction: motion.easeStandard,
    },
    ':open::backdrop': {
      opacity: 1,
    },
  },
  header: {
    display: 'grid',
    gap: spacing.xs,
    paddingBlock: `${spacing.lg} 0`,
    paddingInline: spacing.lg,
  },
  title: {
    color: colors.fg,
    fontFamily: typography.fontDisplay,
    fontSize: typography.step1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightTight,
    margin: 0,
  },
  description: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    margin: 0,
  },
  body: {
    padding: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    paddingBlock: `0 ${spacing.lg}`,
    paddingInline: spacing.lg,
  },
})
/* eslint-enable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */

const sizeStyles = stylex.create({
  sm: { width: 'min(24rem, calc(100vw - 2rem))' },
  md: { width: 'min(32rem, calc(100vw - 2rem))' },
  lg: { width: 'min(44rem, calc(100vw - 2rem))' },
})
