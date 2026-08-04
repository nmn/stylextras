import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import {
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogBodyProps,
  type DialogCloseProps,
  type DialogDescriptionProps,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogProps,
  type DialogTitleProps,
  type DialogTriggerProps,
} from '../dialog'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type DistributiveOmit<Props, Keys extends PropertyKey> = Props extends unknown
  ? Omit<Props, Keys>
  : never

type SxProp = { sx?: StyleXStyles }

export type AnchoredDialogPlacement = 'bottom' | 'top' | 'end' | 'start'
export type AnchoredDialogSize = 'sm' | 'md' | 'lg'
export type AnchoredDialogRootProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> &
  SxProp
export type AnchoredDialogProps = DistributiveOmit<DialogProps, 'size'> & {
  placement?: AnchoredDialogPlacement
  size?: AnchoredDialogSize
}
export type AnchoredDialogTriggerProps = DialogTriggerProps
export type AnchoredDialogCloseProps = DialogCloseProps
export type AnchoredDialogHeaderProps = DialogHeaderProps
export type AnchoredDialogTitleProps = DialogTitleProps
export type AnchoredDialogDescriptionProps = DialogDescriptionProps
export type AnchoredDialogBodyProps = DialogBodyProps
export type AnchoredDialogFooterProps = DialogFooterProps

/** Scopes the shared CSS anchor name to one trigger and dialog pair. */
export function AnchoredDialogRoot({ ref, sx, ...props }: AnchoredDialogRootProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.root, sx)} />
}

/** A native modal dialog positioned beside its trigger when CSS anchors are supported. */
export function AnchoredDialog({
  closedBy = 'any',
  placement = 'bottom',
  ref,
  size = 'md',
  sx,
  ...props
}: AnchoredDialogProps) {
  const closedByProps = { closedby: closedBy } as Record<string, string>
  return (
    <dialog
      ref={ref}
      {...closedByProps}
      {...props}
      {...stylex.props(styles.dialog, placementStyles[placement], sizeStyles[size], sx)}
    />
  )
}

export function AnchoredDialogTrigger({ sx, ...props }: AnchoredDialogTriggerProps) {
  return <DialogTrigger {...props} sx={[styles.trigger, sx]} />
}

export function AnchoredDialogClose(props: AnchoredDialogCloseProps) {
  return <DialogClose {...props} />
}

export function AnchoredDialogHeader({ sx, ...props }: AnchoredDialogHeaderProps) {
  return <DialogHeader {...props} sx={[styles.header, sx]} />
}

export function AnchoredDialogTitle({ sx, ...props }: AnchoredDialogTitleProps) {
  return <DialogTitle {...props} sx={[styles.title, sx]} />
}

export function AnchoredDialogDescription({ sx, ...props }: AnchoredDialogDescriptionProps) {
  return <DialogDescription {...props} sx={[styles.description, sx]} />
}

export function AnchoredDialogBody({ sx, ...props }: AnchoredDialogBodyProps) {
  return <DialogBody {...props} sx={[styles.body, sx]} />
}

export function AnchoredDialogFooter({ sx, ...props }: AnchoredDialogFooterProps) {
  return <DialogFooter {...props} sx={[styles.footer, sx]} />
}

/* eslint-disable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
const styles = stylex.create({
  root: {
    anchorScope: '--stylextras-anchored-dialog',
    display: 'inline-flex',
    position: 'relative',
  },
  trigger: {
    anchorName: '--stylextras-anchored-dialog',
  },
  dialog: {
    positionAnchor: '--stylextras-anchored-dialog',
    scrollbarGutter: 'stable',
    transitionBehavior: 'allow-discrete',
    ':open::backdrop': {
      opacity: 0.55,
    },
    inset: {
      default: 0,
      '@supports ((position-anchor: --stylextras-anchored-dialog) and (anchor-scope: --stylextras-anchored-dialog))':
        'auto',
    },
    padding: 0,
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    marginBlock: {
      default: 'auto',
      '@supports ((position-anchor: --stylextras-anchored-dialog) and (anchor-scope: --stylextras-anchored-dialog))':
        spacing.xs,
    },
    marginInline: {
      default: 'auto',
      '@supports ((position-anchor: --stylextras-anchored-dialog) and (anchor-scope: --stylextras-anchored-dialog))': 0,
    },
    overflow: 'auto',
    backgroundColor: colors.popover,
    boxShadow: elevation.md,
    color: colors.popoverForeground,
    opacity: {
      default: 0,
      ':open': 1,
    },
    overflowWrap: 'anywhere',
    position: 'fixed',
    transform: {
      default: 'translateY(-4px) scale(0.98)',
      ':open': 'translateY(0) scale(1)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'display, opacity, overlay, transform',
    transitionTimingFunction: motion.easeEmphasized,
    maxHeight: 'min(80dvh, 36rem)',
    maxWidth: 'calc(100vw - 2rem)',
    '::backdrop': {
      transitionBehavior: 'allow-discrete',
      backdropFilter: 'none',
      backgroundColor: colors.overlay,
      opacity: 0,
      transitionDuration: {
        default: motion.durationFast,
        '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
      },
      transitionProperty: 'display, opacity, overlay',
      transitionTimingFunction: motion.easeStandard,
    },
  },
  header: {
    gap: spacing.xxs,
    paddingBlock: `${spacing.md} 0`,
    paddingInline: spacing.md,
  },
  title: {
    fontSize: '1rem',
  },
  description: {
    fontSize: '0.875rem',
  },
  body: {
    padding: spacing.md,
  },
  footer: {
    gap: spacing.xs,
    paddingBlock: `0 ${spacing.md}`,
    paddingInline: spacing.md,
  },
})

const placementStyles = stylex.create({
  bottom: {
    positionArea: 'block-end span-inline-start',
    positionTryFallbacks: 'flip-block',
  },
  top: {
    positionArea: 'block-start span-inline-start',
    positionTryFallbacks: 'flip-block',
  },
  end: {
    positionArea: 'inline-end span-block-start',
    positionTryFallbacks: 'flip-inline',
  },
  start: {
    positionArea: 'inline-start span-block-start',
    positionTryFallbacks: 'flip-inline',
  },
})
/* eslint-enable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */

const sizeStyles = stylex.create({
  sm: { width: 'min(15rem, calc(100vw - 2rem))' },
  md: { width: 'min(20rem, calc(100vw - 2rem))' },
  lg: { width: 'min(26rem, calc(100vw - 2rem))' },
})
