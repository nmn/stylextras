'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { composeRefs } from '../internal/refs'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type SxProp = { sx?: StyleXStyles }

export type CarouselProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'role' | 'style'
> &
  AccessibleAriaNameProps &
  SxProp & {
    nextButtonLabel?: string
    previousButtonLabel?: string
    role?: 'group' | 'region'
  }
export type CarouselItemProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'role' | 'style'
> &
  AccessibleAriaNameProps &
  SxProp & { role?: 'group' }

/** A native scroll-snap carousel with real, localizable HTML controls. */
export function Carousel({
  'aria-roledescription': ariaRoleDescription = 'carousel',
  children,
  id,
  nextButtonLabel = 'Next slide',
  onScroll,
  previousButtonLabel = 'Previous slide',
  ref,
  role = 'region',
  sx,
  tabIndex = 0,
  ...props
}: CarouselProps) {
  const generatedId = useId()
  const carouselId = id?.trim() || `stylextras-carousel-${generatedId.replaceAll(':', '')}`
  const carouselRef = useRef<HTMLDivElement>(null)
  const setRef = useMemo(() => composeRefs(carouselRef, ref), [ref])
  const [controls, setControls] = useState({ next: false, previous: false })

  const updateControls = useCallback(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    const maximumOffset = Math.max(0, carousel.scrollWidth - carousel.clientWidth)
    const offset = Math.min(maximumOffset, Math.abs(carousel.scrollLeft))
    const next = maximumOffset > 1 && offset < maximumOffset - 1
    const previous = offset > 1
    setControls((current) =>
      current.next === next && current.previous === previous ? current : { next, previous },
    )
  }, [])

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    updateControls()

    const resizeObserver = new ResizeObserver(updateControls)
    resizeObserver.observe(carousel)
    for (const item of carousel.children) resizeObserver.observe(item)

    const mutationObserver = new MutationObserver(() => {
      resizeObserver.disconnect()
      resizeObserver.observe(carousel)
      for (const item of carousel.children) resizeObserver.observe(item)
      updateControls()
    })
    mutationObserver.observe(carousel, { childList: true })
    return () => {
      mutationObserver.disconnect()
      resizeObserver.disconnect()
    }
  }, [updateControls])

  const scrollToSibling = useCallback((offset: -1 | 1) => {
    const carousel = carouselRef.current
    if (!carousel) return
    const items = Array.from(carousel.children).filter(
      (item): item is HTMLElement => item instanceof HTMLElement,
    )
    if (items.length === 0) return

    const carouselRect = carousel.getBoundingClientRect()
    const isRtl = getComputedStyle(carousel).direction === 'rtl'
    const inlineStart = isRtl ? carouselRect.right : carouselRect.left
    let currentIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect()
      const distance = Math.abs((isRtl ? rect.right : rect.left) - inlineStart)
      if (distance >= closestDistance) return
      closestDistance = distance
      currentIndex = index
    })

    const targetIndex = Math.max(0, Math.min(items.length - 1, currentIndex + offset))
    items[targetIndex]?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' })
  }, [])

  return (
    <div {...stylex.props(styles.frame)}>
      <div
        ref={setRef}
        id={carouselId}
        role={role}
        tabIndex={tabIndex}
        aria-roledescription={ariaRoleDescription}
        onScroll={(event) => {
          onScroll?.(event)
          updateControls()
        }}
        {...props}
        {...stylex.props(styles.carousel, sx)}
      >
        {children}
      </div>
      <div {...stylex.props(styles.controls)}>
        <button
          type="button"
          aria-controls={carouselId}
          disabled={!controls.previous}
          onClick={() => scrollToSibling(-1)}
          {...stylex.props(styles.control, !controls.previous && styles.controlDisabled)}
        >
          <span aria-hidden="true" {...stylex.props(styles.glyph, styles.previousGlyph)}>
            ‹
          </span>
          <span {...stylex.props(styles.accessibleLabel)}>{previousButtonLabel}</span>
        </button>
        <button
          type="button"
          aria-controls={carouselId}
          disabled={!controls.next}
          onClick={() => scrollToSibling(1)}
          {...stylex.props(styles.control, !controls.next && styles.controlDisabled)}
        >
          <span aria-hidden="true" {...stylex.props(styles.glyph, styles.nextGlyph)}>
            ›
          </span>
          <span {...stylex.props(styles.accessibleLabel)}>{nextButtonLabel}</span>
        </button>
      </div>
    </div>
  )
}

export function CarouselItem({
  'aria-roledescription': ariaRoleDescription = 'slide',
  ref,
  role = 'group',
  sx,
  ...props
}: CarouselItemProps) {
  return (
    <div
      ref={ref}
      role={role}
      aria-roledescription={ariaRoleDescription}
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  )
}

/* eslint-disable @stylexjs/valid-styles, @stylexjs/no-legacy-contextual-styles */
const styles = stylex.create({
  frame: {
    minWidth: 0,
  },
  carousel: {
    display: 'grid',
    gap: spacing.md,
    gridAutoColumns: 'minmax(min(82vw, 20rem), 1fr)',
    gridAutoFlow: 'column',
    overflowX: 'auto',
    overscrollBehaviorInline: 'contain',
    padding: spacing.xxs,
    scrollBehavior: {
      default: 'smooth',
      '@media (prefers-reduced-motion: reduce)': 'auto',
    },
    scrollPaddingInline: spacing.xxs,
    scrollSnapType: 'inline mandatory',
    scrollbarWidth: 'thin',
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': stroke.focusRing },
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBlockStart: spacing.xs,
  },
  control: {
    alignItems: 'center',
    backgroundColor: colors.control,
    borderColor: colors.border,
    borderRadius: radius.round,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    color: colors.fg,
    cursor: 'pointer',
    display: 'inline-flex',
    height: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    justifyContent: 'center',
    padding: 0,
    width: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
  },
  controlDisabled: {
    cursor: 'default',
    opacity: 0.5,
  },
  glyph: {
    display: 'inline-block',
    lineHeight: 1,
  },
  previousGlyph: {
    transform: {
      default: 'none',
      ':dir(rtl)': 'scaleX(-1)',
    },
  },
  nextGlyph: {
    transform: {
      default: 'none',
      ':dir(rtl)': 'scaleX(-1)',
    },
  },
  accessibleLabel: {
    blockSize: '1px',
    clipPath: 'inset(50%)',
    inlineSize: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
  },
  item: {
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    minWidth: 0,
    overflowWrap: 'anywhere',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
  },
})
/* eslint-enable @stylexjs/valid-styles, @stylexjs/no-legacy-contextual-styles */
