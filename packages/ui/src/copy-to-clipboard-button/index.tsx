'use client'

import * as stylex from '@stylexjs/stylex'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { type AccessibleButtonPropsWithout, Button } from '../button/index'
import { showPopoverWithSource } from '../platform-polyfills/popover-source'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { typography } from '../tokens/typography.stylex'

export type CopyToClipboardFeedback = 'none' | 'popover'

export type CopyToClipboardButtonProps = AccessibleButtonPropsWithout<
  'aria-label' | 'aria-labelledby' | 'children' | 'onCopy' | 'onError' | 'value'
> & {
  copiedIcon?: ReactNode
  /** @deprecated Use `successAnnouncement`; retained through the 0.2 beta migration. */
  copiedLabel?: string
  copiedText?: ReactNode
  errorAnnouncement?: string
  feedback?: CopyToClipboardFeedback
  icon?: ReactNode
  label?: string
  onCopy?: (value: string) => void
  onError?: (error: unknown) => void
  resetAfterMs?: number
  successAnnouncement?: string
  value: string | (() => string)
}

/**
 * Renders an icon button that copies text and briefly shows a popover confirmation.
 *
 * Search aliases: copy button, clipboard button, copy to clipboard, copy action.
 *
 * A11y notes:
 * - Keeps the button's action name stable while state changes.
 * - Announces success and failure independently of optional visual feedback.
 */
export function CopyToClipboardButton({
  copiedIcon = '✓',
  copiedLabel = 'Copied to clipboard',
  copiedText = 'Copied!',
  errorAnnouncement = 'Copy failed',
  feedback = 'popover',
  icon = '⧉',
  label = 'Copy to clipboard',
  onClick,
  onCopy,
  onError,
  ref,
  resetAfterMs = 1500,
  size = 'icon',
  sx,
  successAnnouncement = copiedLabel,
  type = 'button',
  value,
  variant = 'ghost',
  ...props
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false)
  const [announcement, setAnnouncement] = useState<{
    revision: number
    text: string
  }>()
  const attemptRef = useRef(0)
  const announcementRevision = useRef(0)
  const timeoutRef = useRef<number | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popoverId = `stylextras-copy-${useId().replaceAll(':', '')}`
  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node

      if (typeof ref === 'function') {
        const cleanup = ref(node)
        return () => {
          triggerRef.current = null
          cleanup?.()
        }
      }

      if (ref) ref.current = node
      return () => {
        triggerRef.current = null
        if (ref) ref.current = null
      }
    },
    [ref],
  )

  useEffect(
    () => () => {
      attemptRef.current += 1
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (!announcement) return
    const revision = announcement.revision
    const timer = window.setTimeout(() => {
      setAnnouncement((current) => (current?.revision === revision ? undefined : current))
    }, 1_000)
    return () => window.clearTimeout(timer)
  }, [announcement])

  function announce(text: string) {
    const normalized = text.trim()
    if (!normalized) return
    setAnnouncement({ revision: ++announcementRevision.current, text: normalized })
  }

  function hideCopiedPopover() {
    const element = popoverRef.current
    if (element?.matches(':popover-open')) {
      element.hidePopover()
    }
  }

  function clearCopiedFeedback() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setCopied(false)
    try {
      hideCopiedPopover()
    } catch {
      // Preserve the original copy error when an engine also fails to close
      // the presentation-only feedback popover.
    }
  }

  function showCopiedPopover() {
    const element = popoverRef.current
    if (!element) {
      return
    }
    if (!element.matches(':popover-open')) {
      const source = triggerRef.current
      showPopoverWithSource(element, source ?? undefined)
    }
  }

  function scheduleReset() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null
      setCopied(false)
      hideCopiedPopover()
    }, resetAfterMs)
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    if (event.defaultPrevented) {
      return
    }

    const attempt = ++attemptRef.current

    function reportCopyError(error: unknown) {
      if (attempt === attemptRef.current) {
        clearCopiedFeedback()
        announce(errorAnnouncement)
      }
      onError?.(error)
    }

    let resolvedValue: string
    try {
      resolvedValue = typeof value === 'function' ? value() : value
    } catch (error) {
      reportCopyError(error)
      return
    }

    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      reportCopyError(new Error('The Clipboard API is not available.'))
      return
    }

    let copyPromise: Promise<void>
    try {
      copyPromise = Promise.resolve(navigator.clipboard.writeText(resolvedValue))
    } catch (error) {
      reportCopyError(error)
      return
    }

    void copyPromise.then(() => {
      if (attempt !== attemptRef.current) {
        return
      }
      setCopied(true)
      announce(successAnnouncement)
      scheduleReset()
      try {
        onCopy?.(resolvedValue)
      } catch (error) {
        onError?.(error)
      }
      if (feedback === 'popover') {
        try {
          showCopiedPopover()
        } catch (error) {
          onError?.(error)
        }
      }
    }, reportCopyError)
  }

  return (
    <span {...stylex.props(rootStyles.base)}>
      <Button
        ref={setTriggerRef}
        {...props}
        aria-label={label}
        onClick={handleClick}
        size={size}
        sx={[triggerStyles.base, sx]}
        type={type}
        variant={variant}
      >
        {copied ? copiedIcon : icon}
      </Button>
      {feedback === 'popover' ? (
        <div
          aria-hidden="true"
          id={popoverId}
          inert
          ref={popoverRef}
          popover="manual"
          {...stylex.props(popoverStyles.base)}
        >
          {copied ? copiedText : null}
        </div>
      ) : null}
      <span role="status" aria-atomic="true" aria-live="polite" {...stylex.props(statusStyles.base)}>
        {announcement ? (
          <span key={announcement.revision}>{announcement.text}</span>
        ) : null}
      </span>
    </span>
  )
}

const rootStyles = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    anchorScope: '--copy-button-trigger',
    display: 'inline-grid',
  },
})

const triggerStyles = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    anchorName: '--copy-button-trigger',
  },
})

const statusStyles = stylex.create({
  base: {
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
})

const popoverStyles = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: '--copy-button-trigger',
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: 'top',
    positionTryFallbacks: stylex.positionTry({ positionArea: 'bottom' }),
    margin: 0,
    borderRadius: radius.sm,
    paddingBlock: spacing.xxxs,
    paddingInline: spacing.xs,
    alignItems: {
      default: null,
      ':popover-open': 'center',
    },
    backgroundColor: colors.fg,
    color: colors.bg,
    display: {
      default: null,
      ':popover-open': 'inline-flex',
    },
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    justifyContent: {
      default: null,
      ':popover-open': 'center',
    },
    lineHeight: typography.lineHeightSnug,
    position: 'fixed',
  },
})
