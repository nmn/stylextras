'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { Button, type AccessibleButtonPropsWithout } from '../button'
import { composeRefs } from '../internal/refs'
import { useInterestInvoker } from '../platform-polyfills/interest-invoker'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

export type TooltipPlacement = 'bottom' | 'top' | 'end' | 'start'
export type TooltipProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'popover' | 'role' | 'style'
> & {
  placement?: TooltipPlacement
  sx?: StyleXStyles
}
export type TooltipTriggerProps = AccessibleButtonPropsWithout<
  'aria-controls' | 'popoverTarget' | 'popoverTargetAction'
> & {
  hideDelay?: number
  showDelay?: number
  target: string
}

const INTERACTIVE_TOOLTIP_SELECTOR = [
  'a[href]',
  'area[href]',
  'audio[controls]',
  'button',
  'dialog',
  'details',
  'embed',
  'iframe',
  'input:not([type="hidden"])',
  'label[for]',
  'object',
  'select',
  'summary',
  'textarea',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[draggable="true"]',
  '[popover]',
  '[tabindex]',
  '[aria-activedescendant]',
  '[aria-haspopup]',
  '[role~="button"]',
  '[role~="checkbox"]',
  '[role~="combobox"]',
  '[role~="link"]',
  '[role~="menuitem"]',
  '[role~="menuitemcheckbox"]',
  '[role~="menuitemradio"]',
  '[role~="option"]',
  '[role~="radio"]',
  '[role~="scrollbar"]',
  '[role~="searchbox"]',
  '[role~="slider"]',
  '[role~="spinbutton"]',
  '[role~="switch"]',
  '[role~="tab"]',
  '[role~="textbox"]',
  '[role~="treeitem"]',
].join(',')

const warnedInteractiveElements = new WeakSet<Element>()

function isInteractionSuppressed(element: Element, tooltip: HTMLElement) {
  let candidate: Element | null = element
  while (candidate) {
    if (
      candidate.hasAttribute('hidden') ||
      candidate.hasAttribute('inert')
    ) {
      return true
    }
    if (candidate === tooltip) break
    candidate = candidate.parentElement
  }
  return false
}

function hasActivationHandler(element: Element) {
  if (!(element instanceof HTMLElement)) return false
  return (
    typeof element.onclick === 'function' ||
    typeof element.onkeydown === 'function' ||
    typeof element.onkeyup === 'function'
  )
}

function useNonInteractiveContentInvariant(tooltipRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    const tooltip = tooltipRef.current
    if (!tooltip) return
    const validate = () => {
      for (const element of tooltip.querySelectorAll('*')) {
        if (
          warnedInteractiveElements.has(element) ||
          isInteractionSuppressed(element, tooltip) ||
          (!element.matches(INTERACTIVE_TOOLTIP_SELECTOR) && !hasActivationHandler(element))
        ) {
          continue
        }

        warnedInteractiveElements.add(element)
        console.warn(
          `Tooltip content must be non-interactive. Move <${element.localName}> content to HoverCard, Popover, or Dialog.`,
          element,
        )
      }
    }

    validate()
    const observer = new MutationObserver(validate)
    observer.observe(tooltip, {
      attributeFilter: [
        'aria-activedescendant',
        'aria-haspopup',
        'contenteditable',
        'controls',
        'draggable',
        'hidden',
        'href',
        'inert',
        'onclick',
        'onkeydown',
        'onkeyup',
        'popover',
        'role',
        'tabindex',
        'type',
      ],
      attributes: true,
      childList: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [tooltipRef])
}

export function Tooltip({ placement = 'top', ref, sx, ...props }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const setRef = useMemo(() => composeRefs(tooltipRef, ref), [ref])
  useNonInteractiveContentInvariant(tooltipRef)

  return (
    <div
      ref={setRef}
      popover="hint"
      role="tooltip"
      {...props}
      {...stylex.props(styles.tooltip, placementStyles[placement], sx)}
    />
  )
}

export function TooltipTrigger({
  'aria-describedby': ariaDescribedBy,
  hideDelay,
  ref,
  showDelay,
  target,
  type = 'button',
  variant = 'ghost',
  ...props
}: TooltipTriggerProps) {
  const setRef = useInterestInvoker(ref, { hideDelay, showDelay, target })
  const interestProps = { interestfor: target } as Record<string, string>
  return (
    <Button
      ref={setRef}
      {...props}
      type={type}
      variant={variant}
      aria-controls={target}
      aria-describedby={[ariaDescribedBy, target].filter(Boolean).join(' ')}
      popoverTarget={target}
      popoverTargetAction="toggle"
      {...interestProps}
    />
  )
}

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  tooltip: {
    backgroundColor: {
      default: colors.fg,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderColor: {
      default: 'transparent',
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: {
      default: 0,
      '@media (forced-colors: active)': stroke.thin,
    },
    color: {
      default: colors.bg,
      '@media (forced-colors: active)': 'Canvas',
    },
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    inset: 'auto',
    margin: spacing.xs,
    maxWidth: 'min(20rem, calc(100vw - 2rem))',
    opacity: { default: 0, ':popover-open': 1 },
    paddingBlock: spacing.xxxs,
    paddingInline: spacing.xs,
    position: 'fixed',
    positionAnchor: 'auto',
    transitionBehavior: 'allow-discrete',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'display, opacity, overlay',
    transitionTimingFunction: motion.easeStandard,
    overflowWrap: 'anywhere',
    textWrap: 'pretty',
  },
})

const placementStyles = stylex.create({
  bottom: {
    positionArea: 'bottom',
    positionTryFallbacks: 'flip-block',
  },
  top: {
    positionArea: 'top',
    positionTryFallbacks: 'flip-block',
  },
  end: {
    positionArea: 'self-x-end',
    positionTryFallbacks: 'flip-inline',
  },
  start: {
    positionArea: 'self-x-start',
    positionTryFallbacks: 'flip-inline',
  },
})
/* eslint-enable @stylexjs/valid-styles */
