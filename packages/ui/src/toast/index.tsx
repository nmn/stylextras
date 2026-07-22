'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type ReactNode,
  useEffect,
  useRef,
  useState,
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
  /** Plain text used by the queue's hidden live region for rich visual content. */
  announcement?: string
  description?: ReactNode
  duration?: number
  id?: string
  priority?: 'assertive' | 'polite'
  title: ReactNode
  variant?: 'default' | 'danger' | 'success'
}

type ToastRecord = ToastOptions & {
  duration: number
  id: string
  priority: 'assertive' | 'polite'
  variant: 'default' | 'danger' | 'success'
}

type Announcement = { revision: number; text: string }

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

function textFromReactNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint') {
    return String(node).trim()
  }
  if (Array.isArray(node)) return node.map(textFromReactNode).filter(Boolean).join(' ')
  return ''
}

function getAnnouncementText(record: ToastRecord) {
  if (record.announcement !== undefined) return record.announcement.trim()
  return [textFromReactNode(record.title), textFromReactNode(record.description)]
    .filter(Boolean)
    .join(' ')
}

export function toast(options: ToastOptions | ReactNode) {
  const normalized =
    typeof options === 'object' && options !== null && 'title' in options
      ? options
      : { title: options }
  const id = normalized.id ?? `stylextras-toast-${crypto.randomUUID()}`
  const record: ToastRecord = {
    ...normalized,
    duration: normalized.duration ?? (normalized.action ? 0 : 4_000),
    id,
    priority: normalized.priority ?? 'polite',
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
  SxProp & {
    priority?: 'assertive' | 'off' | 'polite'
    variant?: 'default' | 'danger' | 'success'
  }
export type ToastTitleProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp
export type ToastDescriptionProps = Omit<ComponentPropsWithRef<'p'>, 'className' | 'style'> & SxProp
export type ToasterProps = Omit<
  ComponentPropsWithRef<'ol'>,
  'aria-label' | 'children' | 'className' | 'style'
> & {
  'aria-label'?: string
  dismissLabel?: string
  limit?: number
  sx?: StyleXStyles
}

export function Toast({
  children,
  priority = 'polite',
  ref,
  sx,
  variant = 'default',
  ...props
}: ToastProps) {
  return (
    <li ref={ref} {...props} {...stylex.props(styles.toast, variantStyles[variant], sx)}>
      {priority === 'off' ? (
        children
      ) : (
        <div
          role={priority === 'assertive' ? 'alert' : 'status'}
          aria-atomic="true"
          aria-live={priority}
          {...stylex.props(styles.liveRegion)}
        >
          {children}
        </div>
      )}
    </li>
  )
}

export function ToastTitle({ ref, sx, ...props }: ToastTitleProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.title, sx)} />
}

export function ToastDescription({ ref, sx, ...props }: ToastDescriptionProps) {
  return <p ref={ref} {...props} {...stylex.props(styles.description, sx)} />
}

export function Toaster({
  'aria-label': ariaLabel = 'Notifications',
  dismissLabel = 'Dismiss notification',
  limit = 3,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  ref,
  sx,
  ...props
}: ToasterProps) {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const timers = useRef(new Map<string, number>())
  const timerRecords = useRef(new Map<string, ToastRecord>())
  const remaining = useRef(new Map<string, number>())
  const startedAt = useRef(new Map<string, number>())
  const pauseReasons = useRef(new Set<string>())
  const announcedRecords = useRef(new Map<string, ToastRecord>())
  const announcementRevision = useRef(0)
  const [paused, setPaused] = useState(false)
  const [announcements, setAnnouncements] = useState<{
    assertive?: Announcement
    polite?: Announcement
  }>({})

  const setPauseReason = (reason: string, active: boolean) => {
    if (active) pauseReasons.current.add(reason)
    else pauseReasons.current.delete(reason)
    setPaused(pauseReasons.current.size > 0)
  }

  useEffect(() => {
    const ids = new Set(toasts.map((item) => item.id))
    for (const id of remaining.current.keys()) {
      if (!ids.has(id)) {
        remaining.current.delete(id)
        timerRecords.current.delete(id)
      }
    }
    for (const item of toasts) {
      if (timerRecords.current.get(item.id) !== item) {
        timerRecords.current.set(item.id, item)
        remaining.current.set(item.id, item.duration)
      }
    }

    const stopTimers = () => {
      const now = performance.now()
      for (const [id, timer] of timers.current) {
        window.clearTimeout(timer)
        const start = startedAt.current.get(id) ?? now
        remaining.current.set(id, Math.max(0, (remaining.current.get(id) ?? 0) - (now - start)))
      }
      timers.current.clear()
      startedAt.current.clear()
    }

    if (paused) {
      stopTimers()
      return
    }

    for (const item of toasts) {
      const duration = remaining.current.get(item.id) ?? item.duration
      if (duration <= 0 || timers.current.has(item.id)) continue
      startedAt.current.set(item.id, performance.now())
      const timer = window.setTimeout(() => {
        timers.current.delete(item.id)
        remaining.current.delete(item.id)
        startedAt.current.delete(item.id)
        dismissToast(item.id)
      }, duration)
      timers.current.set(item.id, timer)
    }

    return stopTimers
  }, [paused, toasts])

  useEffect(() => {
    const handleVisibilityChange = () => setPauseReason('document', document.hidden)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    handleVisibilityChange()
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    const currentIds = new Set(toasts.map((item) => item.id))
    for (const id of announcedRecords.current.keys()) {
      if (!currentIds.has(id)) announcedRecords.current.delete(id)
    }
    const unseen = toasts.filter((item) => announcedRecords.current.get(item.id) !== item)
    if (unseen.length === 0) return
    for (const item of unseen) announcedRecords.current.set(item.id, item)
    const politeText = unseen
      .filter((item) => item.priority === 'polite')
      .map(getAnnouncementText)
      .filter(Boolean)
      .join(' ')
    const assertiveText = unseen
      .filter((item) => item.priority === 'assertive')
      .map(getAnnouncementText)
      .filter(Boolean)
      .join(' ')
    const polite = politeText
      ? { revision: ++announcementRevision.current, text: politeText }
      : undefined
    const assertive = assertiveText
      ? { revision: ++announcementRevision.current, text: assertiveText }
      : undefined
    if (!polite && !assertive) return
    setAnnouncements((current) => ({
      ...current,
      ...(assertive ? { assertive } : {}),
      ...(polite ? { polite } : {}),
    }))
  }, [toasts])

  return (
    <>
      <div role="status" aria-atomic="true" aria-live="polite" {...stylex.props(styles.announcer)}>
        {announcements.polite ? (
          <span key={announcements.polite.revision}>{announcements.polite.text}</span>
        ) : null}
      </div>
      <div
        role="alert"
        aria-atomic="true"
        aria-live="assertive"
        {...stylex.props(styles.announcer)}
      >
        {announcements.assertive ? (
          <span key={announcements.assertive.revision}>{announcements.assertive.text}</span>
        ) : null}
      </div>
      <ol
        ref={ref}
        aria-label={ariaLabel}
        onBlur={(event) => {
          onBlur?.(event)
          if (!event.currentTarget.contains(event.relatedTarget)) setPauseReason('focus', false)
        }}
        onFocus={(event) => {
          onFocus?.(event)
          setPauseReason('focus', true)
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event)
          setPauseReason('pointer', true)
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event)
          setPauseReason('pointer', false)
        }}
        {...props}
        {...stylex.props(styles.toaster, sx)}
      >
        {toasts.slice(-limit).map((item) => (
          <Toast key={item.id} priority="off" variant={item.variant}>
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
              aria-label={dismissLabel}
              onClick={() => dismissToast(item.id)}
            >
              ×
            </Button>
          </Toast>
        ))}
      </ol>
    </>
  )
}

const styles = stylex.create({
  toaster: {
    margin: 0,
    padding: 0,
    gap: spacing.sm,
    listStyle: 'none',
    display: 'grid',
    insetInlineEnd: spacing.lg,
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 100,
    bottom: 'auto',
    maxWidth: 'calc(100vw - 2rem)',
    top: spacing.lg,
    width: 'min(24rem, calc(100vw - 2rem))',
  },
  toast: {
    padding: spacing.md,
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    gap: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.popover,
    boxShadow: elevation.md,
    color: colors.popoverForeground,
    display: 'flex',
    flexWrap: 'wrap',
    overflowWrap: 'anywhere',
    pointerEvents: 'auto',
    transitionDuration: {
      default: motion.durationModerate,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion.easeEmphasized,
    minWidth: 0,
    width: '100%',
  },
  liveRegion: {
    gap: spacing.sm,
    alignItems: 'center',
    display: 'flex',
    width: '100%',
  },
  announcer: {
    margin: -1,
    padding: 0,
    borderStyle: 'none',
    borderWidth: 0,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    position: 'absolute',
    whiteSpace: 'nowrap',
    height: 1,
    width: 1,
  },
  content: {
    gap: spacing.xxxs,
    display: 'grid',
    flexBasis: 0,
    flexGrow: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightSnug,
  },
  description: {
    margin: 0,
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
  },
})

const variantStyles = stylex.create({
  default: {},
  danger: {
    borderColor: {
      default: colors.danger,
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
  success: {
    borderColor: {
      default: colors.success,
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
})
