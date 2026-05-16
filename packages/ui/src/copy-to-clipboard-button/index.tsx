'use client'

import * as React from 'react'
import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { IconButton, type IconButtonProps } from '../icon-button/index'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { typography } from '../tokens/typography.stylex'

export type CopyToClipboardButtonProps = Omit<IconButtonProps, 'children' | 'label'> & {
  copiedText?: ReactNode
  icon?: ReactNode
  label?: string
  onCopy?: (value: string) => void
  resetAfterMs?: number
  value: string
}

/**
 * Renders an icon button that copies text and briefly shows a popover confirmation.
 *
 * Search aliases: copy button, clipboard button, copy to clipboard, copy action.
 *
 * A11y notes:
 * - Uses native button semantics and a transient popover for visible feedback.
 * - The confirmation message is not a live region, so assistive-tech announcement may vary by browser.
 */
export function CopyToClipboardButton({
  copiedText = 'Copied!',
  icon = '⧉',
  label = 'Copy to clipboard',
  onClick,
  onCopy,
  resetAfterMs = 1500,
  size = 'md',
  sx,
  type = 'button',
  value,
  ...props
}: CopyToClipboardButtonProps) {
  const timeoutRef = React.useRef<number | null>(null)
  const popoverRef = React.useRef<HTMLDivElement | null>(null)

  const setPopoverRef = React.useCallback((node: HTMLDivElement | null) => {
    popoverRef.current = node

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  function showCopiedPopover() {
    const element = popoverRef.current
    if (!element) {
      return
    }

    if (!element.matches(':popover-open')) {
      element.showPopover()
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      if (element.matches(':popover-open')) {
        element.hidePopover()
      }
    }, resetAfterMs)
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)

    if (event.defaultPrevented || typeof navigator === 'undefined' || !navigator.clipboard) {
      return
    }

    void navigator.clipboard.writeText(value).then(() => {
      onCopy?.(value)
      showCopiedPopover()
    })
  }

  return (
    <span {...stylex.props(rootStyles.base)}>
      <IconButton
        {...props}
        label={label}
        onClick={handleClick}
        size={size}
        sx={[triggerStyles.base, sx]}
        type={type}
      >
        {icon}
      </IconButton>
      <div ref={setPopoverRef} popover="manual" role="status" {...stylex.props(popoverStyles.base)}>
        {copiedText}
      </div>
    </span>
  )
}

const rootStyles = stylex.create({
  base: {
    display: 'inline-grid',
  },
})

const triggerStyles = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    anchorName: '--copy-button-trigger',
  },
})

const popoverStyles = stylex.create({
  base: {
    position: 'fixed',
    margin: 0,
    paddingInline: spacing.xs,
    paddingBlock: spacing['3xs'],
    borderRadius: radius.sm,
    backgroundColor: colors.fg,
    color: colors.bg,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightSnug,
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: '--copy-button-trigger',
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: 'top',
    positionTryFallbacks: stylex.positionTry({ positionArea: 'bottom' }),
    alignItems: {
      default: null,
      ':popover-open': 'center',
    },
    display: {
      default: null,
      ':popover-open': 'inline-flex',
    },
    justifyContent: {
      default: null,
      ':popover-open': 'center',
    },
  },
})
