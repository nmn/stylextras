'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type ReactNode,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react'
import { Button } from '../button'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastOptions = {
  action?: ToastAction
  description?: ReactNode
  duration?: number
  id?: string
  title: ReactNode
  variant?: 'default' | 'danger' | 'success'
}

type ToastRecord = ToastOptions & {
  duration: number
  id: string
  variant: 'default' | 'danger' | 'success'
}

let snapshot: readonly ToastRecord[] = []
const listeners = new Set<() => void>()

function emit(next: readonly ToastRecord[]) {
  snapshot = next
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return snapshot
}

export function toast(options: ToastOptions | ReactNode) {
  const normalized =
    typeof options === 'object' && options !== null && 'title' in options
      ? options
      : { title: options }
  const id = normalized.id ?? `stylextras-toast-${crypto.randomUUID()}`
  const record: ToastRecord = {
    ...normalized,
    duration: normalized.duration ?? 4_000,
    id,
    variant: normalized.variant ?? 'default',
  }
  emit([...snapshot.filter((item) => item.id !== id), record])
  return {
    dismiss: () => dismissToast(id),
    id,
  }
}

export function dismissToast(id?: string) {
  emit(id ? snapshot.filter((item) => item.id !== id) : [])
}

type SxProp = { sx?: StyleXStyles }

export type ToastProps = Omit<ComponentPropsWithRef<'li'>, 'className' | 'role' | 'style'> &
  SxProp & { variant?: 'default' | 'danger' | 'success' }
export type ToastTitleProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp
export type ToastDescriptionProps = Omit<ComponentPropsWithRef<'p'>, 'className' | 'style'> & SxProp
export type ToasterProps = Omit<ComponentPropsWithRef<'ol'>, 'children' | 'className' | 'style'> & {
  limit?: number
  sx?: StyleXStyles
}

export function Toast({ children, ref, sx, variant = 'default', ...props }: ToastProps) {
  return (
    <li ref={ref} {...props} {...stylex.props(styles.toast, variantStyles[variant], sx)}>
      <div
        role="status"
        aria-atomic="true"
        aria-live={variant === 'danger' ? 'assertive' : 'polite'}
        {...stylex.props(styles.liveRegion)}
      >
        {children}
      </div>
    </li>
  )
}

export function ToastTitle({ ref, sx, ...props }: ToastTitleProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.title, sx)} />
}

export function ToastDescription({ ref, sx, ...props }: ToastDescriptionProps) {
  return <p ref={ref} {...props} {...stylex.props(styles.description, sx)} />
}

export function Toaster({ limit = 3, ref, sx, ...props }: ToasterProps) {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const timers = useRef(new Map<string, number>())

  useEffect(() => {
    for (const item of toasts) {
      if (item.duration <= 0 || timers.current.has(item.id)) continue
      const timer = window.setTimeout(() => {
        timers.current.delete(item.id)
        dismissToast(item.id)
      }, item.duration)
      timers.current.set(item.id, timer)
    }
    for (const [id, timer] of timers.current) {
      if (!toasts.some((item) => item.id === id)) {
        window.clearTimeout(timer)
        timers.current.delete(id)
      }
    }
  }, [toasts])

  return (
    <ol ref={ref} aria-label="Notifications" {...props} {...stylex.props(styles.toaster, sx)}>
      {toasts.slice(-limit).map((item) => (
        <Toast key={item.id} variant={item.variant}>
          <div {...stylex.props(styles.content)}>
            <ToastTitle>{item.title}</ToastTitle>
            {item.description ? <ToastDescription>{item.description}</ToastDescription> : null}
          </div>
          {item.action ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                item.action?.onClick()
                dismissToast(item.id)
              }}
            >
              {item.action.label}
            </Button>
          ) : null}
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(item.id)}
          >
            ×
          </Button>
        </Toast>
      ))}
    </ol>
  )
}

const styles = stylex.create({
  toaster: {
    display: 'grid',
    gap: spacing.sm,
    top: spacing.lg,
    insetInlineEnd: spacing.lg,
    listStyle: 'none',
    margin: 0,
    maxWidth: 'calc(100vw - 2rem)',
    padding: 0,
    pointerEvents: 'none',
    position: 'fixed',
    width: 'min(24rem, calc(100vw - 2rem))',
    zIndex: 100,
  },
  toast: {
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: elevation.md,
    color: colors.popoverForeground,
    display: 'block',
    padding: spacing.md,
    pointerEvents: 'auto',
    transitionDuration: {
      default: motion.durationModerate,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion.easeEmphasized,
  },
  liveRegion: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing.sm,
    width: '100%',
  },
  content: {
    display: 'grid',
    flexBasis: 0,
    flexGrow: 1,
    gap: spacing.xxxs,
    minWidth: 0,
  },
  title: {
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightSnug,
  },
  description: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
    margin: 0,
  },
})

const variantStyles = stylex.create({
  default: {},
  danger: {
    borderColor: colors.danger,
  },
  success: {
    borderColor: colors.success,
  },
})
