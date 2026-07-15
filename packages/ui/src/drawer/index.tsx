import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { Button, type ButtonProps } from '../button'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type SxProp = { sx?: StyleXStyles }
type DrawerSectionProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp

export type DrawerSide = 'top' | 'bottom'
export type DrawerProps = Omit<ComponentPropsWithRef<'dialog'>, 'className' | 'style'> &
  SxProp & { side?: DrawerSide }
export type DrawerTriggerProps = ButtonProps & { target: string }
export type DrawerCloseProps = DrawerTriggerProps
export type DrawerHeaderProps = DrawerSectionProps
export type DrawerBodyProps = DrawerSectionProps
export type DrawerFooterProps = DrawerSectionProps

const commandProps = (target: string, command: 'show-modal' | 'request-close') =>
  ({ command, commandfor: target }) as Record<string, string>

export function Drawer({ ref, side = 'bottom', sx, ...props }: DrawerProps) {
  const closedByProps = { closedby: 'any' } as Record<string, string>
  return (
    <dialog
      ref={ref}
      {...closedByProps}
      {...props}
      {...stylex.props(styles.drawer, sideStyles[side], sx)}
    />
  )
}

export function DrawerTrigger({ target, type = 'button', ...props }: DrawerTriggerProps) {
  return <Button type={type} {...props} {...commandProps(target, 'show-modal')} />
}

export function DrawerClose({
  target,
  type = 'button',
  variant = 'outline',
  ...props
}: DrawerCloseProps) {
  return (
    <Button type={type} variant={variant} {...props} {...commandProps(target, 'request-close')} />
  )
}

export function DrawerHeader({ ref, sx, ...props }: DrawerHeaderProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.header, sx)} />
}

export function DrawerBody({ ref, sx, ...props }: DrawerBodyProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.body, sx)} />
}

export function DrawerFooter({ ref, sx, ...props }: DrawerFooterProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.footer, sx)} />
}

/* eslint-disable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
const styles = stylex.create({
  drawer: {
    transitionBehavior: 'allow-discrete',
    margin: 0,
    padding: 0,
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    overflow: 'auto',
    backgroundColor: colors.popover,
    boxShadow: elevation.lg,
    color: colors.popoverForeground,
    opacity: { default: 0, ':open': 1 },
    position: 'fixed',
    maxHeight: '85dvh',
    maxWidth: '100vw',
    transitionDuration: {
      default: motion.durationModerate,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'display, opacity, overlay, transform',
    transitionTimingFunction: motion.easeEmphasized,
    width: '100vw',
    '::backdrop': {
      backgroundColor: colors.overlay,
      opacity: 0,
      transitionDuration: {
        default: motion.durationModerate,
        '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
      },
    },
    ':open::backdrop': {
      opacity: 1,
    },
  },
  header: {
    padding: spacing.lg,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: `0 0 ${stroke.thin}`,
  },
  body: { padding: spacing.lg },
  footer: {
    padding: spacing.lg,
    gap: spacing.sm,
    display: 'flex',
    justifyContent: 'flex-end',
  },
})
/* eslint-enable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */

const sideStyles = stylex.create({
  top: {
    borderRadius: `0 0 ${radius.lg} ${radius.lg}`,
    transform: {
      default: 'translateY(-1rem)',
      ':open': 'translateY(0)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    bottom: 'auto',
    insetInline: 0,
    top: 0,
  },
  bottom: {
    borderRadius: `${radius.lg} ${radius.lg} 0 0`,
    transform: {
      default: 'translateY(1rem)',
      ':open': 'translateY(0)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    bottom: 0,
    insetInline: 0,
    top: 'auto',
  },
})
