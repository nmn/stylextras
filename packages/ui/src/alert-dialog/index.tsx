import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import {
  Button,
  type AccessibleButtonPropsWithout,
} from '../button'
import { blur } from '../tokens/blur.stylex'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type AlertDialogProps = Omit<
  ComponentPropsWithRef<'dialog'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'role' | 'style'
> &
  AccessibleAriaNameProps &
  { 'aria-describedby': string } &
  SxProp
export type AlertDialogTriggerProps = AccessibleButtonPropsWithout<
  'aria-controls' | 'aria-haspopup'
> & { target: string }
export type AlertDialogCancelProps = AccessibleButtonPropsWithout<'aria-controls'> & {
  target: string
}
export type AlertDialogActionProps = AccessibleButtonPropsWithout<'aria-controls'> & {
  target: string
}
export type AlertDialogHeaderProps = Omit<ComponentPropsWithRef<'header'>, 'className' | 'style'> &
  SxProp
export type AlertDialogFooterProps = Omit<ComponentPropsWithRef<'footer'>, 'className' | 'style'> &
  SxProp
export type AlertDialogTitleProps = Omit<ComponentPropsWithRef<'h2'>, 'className' | 'style'> &
  SxProp
export type AlertDialogDescriptionProps = Omit<ComponentPropsWithRef<'p'>, 'className' | 'style'> &
  SxProp

const commandProps = (target: string, command: 'show-modal' | 'request-close') =>
  ({ command, commandfor: target }) as Record<string, string>

export function AlertDialog({ ref, sx, ...props }: AlertDialogProps) {
  const closedByProps = { closedby: 'closerequest' } as Record<string, string>
  return (
    <dialog
      ref={ref}
      role="alertdialog"
      {...closedByProps}
      {...props}
      {...stylex.props(styles.dialog, sx)}
    />
  )
}

export function AlertDialogTrigger({ target, type = 'button', ...props }: AlertDialogTriggerProps) {
  return (
    <Button
      {...props}
      type={type}
      aria-controls={target}
      aria-haspopup="dialog"
      {...commandProps(target, 'show-modal')}
    />
  )
}

export function AlertDialogCancel({
  target,
  type = 'button',
  variant = 'outline',
  ...props
}: AlertDialogCancelProps) {
  return (
    <Button
      {...props}
      type={type}
      variant={variant}
      aria-controls={target}
      {...commandProps(target, 'request-close')}
    />
  )
}

export function AlertDialogAction({
  target,
  type = 'button',
  variant = 'danger',
  ...props
}: AlertDialogActionProps) {
  return (
    <Button
      {...props}
      type={type}
      variant={variant}
      aria-controls={target}
      {...commandProps(target, 'request-close')}
    />
  )
}

export function AlertDialogHeader({ ref, sx, ...props }: AlertDialogHeaderProps) {
  return <header ref={ref} {...props} {...stylex.props(styles.header, sx)} />
}

export function AlertDialogTitle({ ref, sx, ...props }: AlertDialogTitleProps) {
  return <h2 ref={ref} {...props} {...stylex.props(styles.title, sx)} />
}

export function AlertDialogDescription({ ref, sx, ...props }: AlertDialogDescriptionProps) {
  return <p ref={ref} {...props} {...stylex.props(styles.description, sx)} />
}

export function AlertDialogFooter({ ref, sx, ...props }: AlertDialogFooterProps) {
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
    maxWidth: 'calc(100vw - 2rem)',
    maxHeight: 'min(85dvh, 36rem)',
    opacity: { default: 0, ':open': 1 },
    overflow: 'auto',
    overflowWrap: 'anywhere',
    padding: spacing.lg,
    transform: {
      default: 'scale(0.98)',
      ':open': 'scale(1)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    transitionBehavior: 'allow-discrete',
    transitionDuration: {
      default: motion.durationModerate,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'display, opacity, overlay, transform',
    transitionTimingFunction: motion.easeEmphasized,
    width: 'min(28rem, calc(100vw - 2rem))',
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
  },
  title: {
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
    textWrap: 'pretty',
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    marginBlockStart: spacing.lg,
  },
})
/* eslint-enable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
