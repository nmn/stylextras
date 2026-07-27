'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button } from '../button'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'
import {
  addDays,
  addMonths,
  addMonthsToValue,
  clampNormalizedDateValue,
  createMonthGrid,
  formatDateValue,
  formatDayLabel,
  formatMonthLabel,
  getWeekStartsOn,
  getWeekdayLabels,
  monthForValue,
  normalizeDateBounds,
  parseDateValue,
  todayValue,
} from './date-utils'

export type CalendarProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & {
  defaultValue?: string
  loadingLabel?: string
  locale?: string
  max?: string
  min?: string
  nextMonthLabel?: string
  onValueChange?: (value: string) => void
  previousMonthLabel?: string
  sx?: StyleXStyles
  today?: string
  value?: string
  weekStartsOn?: number
}

/** An Intl-backed, keyboard-complete single-date calendar grid. */
export function Calendar({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  defaultValue = '',
  loadingLabel = 'Loading calendar',
  locale = 'en-US',
  max,
  min,
  nextMonthLabel = 'Next month',
  onValueChange,
  previousMonthLabel = 'Previous month',
  ref,
  sx,
  today: todayProp,
  value,
  weekStartsOn = getWeekStartsOn(locale),
  ...props
}: CalendarProps) {
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const selectedValue = controlled ? value : internalValue
  const validSelectedValue = parseDateValue(selectedValue) ? selectedValue : ''
  const suppliedToday = todayProp && parseDateValue(todayProp) ? todayProp : ''
  const bounds = useMemo(() => normalizeDateBounds(min, max), [max, min])
  const isDisabled = (dateValue: string) =>
    Boolean((bounds.min && dateValue < bounds.min) || (bounds.max && dateValue > bounds.max))
  // Keep the server and first client render deterministic. When neither a
  // selection nor a caller-supplied date exists, the local date is resolved
  // after hydration before the grid is exposed.
  const rawInitialValue = validSelectedValue || suppliedToday || '1970-01-01'
  const initialValue = clampNormalizedDateValue(rawInitialValue, bounds)
  const normalizedWeekStartsOn = ((weekStartsOn % 7) + 7) % 7
  const [visibleMonth, setVisibleMonth] = useState(
    () => monthForValue(initialValue)!,
  )
  const [activeValue, setActiveValue] = useState(initialValue)
  const [currentDate, setCurrentDate] = useState(suppliedToday)
  const dayRefs = useRef(new Map<string, HTMLButtonElement>())
  const shouldFocus = useRef(false)
  const calendarReady = Boolean(validSelectedValue || currentDate)
  const boundedActiveValue = clampNormalizedDateValue(activeValue, bounds)
  const visibleMonthLastDay = new Date(
    Date.UTC(visibleMonth.year, visibleMonth.month, 0),
  ).getUTCDate()
  const visibleMonthBeforeMin = Boolean(
    bounds.min &&
      formatDateValue({ ...visibleMonth, day: visibleMonthLastDay }) < bounds.min,
  )
  const visibleMonthAfterMax = Boolean(
    bounds.max && formatDateValue({ ...visibleMonth, day: 1 }) > bounds.max,
  )
  // Bounds can change between renders. Derive the rendered month synchronously so
  // the grid never exposes a disabled roving tab stop while state catches up.
  const renderedMonth =
    visibleMonthBeforeMin || visibleMonthAfterMax
      ? monthForValue(boundedActiveValue)!
      : visibleMonth
  const days = useMemo(
    () => createMonthGrid(renderedMonth, normalizedWeekStartsOn),
    [renderedMonth, normalizedWeekStartsOn],
  )
  const rovingValue =
    days.some((day) => day.value === boundedActiveValue && !isDisabled(day.value))
      ? boundedActiveValue
      : (days.find((day) => !isDisabled(day.value))?.value ?? boundedActiveValue)
  const weeks = useMemo(
    () => Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7)),
    [days],
  )
  const weekdayLabels = useMemo(
    () => getWeekdayLabels(locale, normalizedWeekStartsOn),
    [locale, normalizedWeekStartsOn],
  )
  const previousMonth = addMonths(renderedMonth, -1)
  const nextMonth = addMonths(renderedMonth, 1)
  const previousMonthLastDay = new Date(
    Date.UTC(previousMonth.year, previousMonth.month, 0),
  ).getUTCDate()
  const previousMonthDisabled = Boolean(
    bounds.min && formatDateValue({ ...previousMonth, day: previousMonthLastDay }) < bounds.min,
  )
  const nextMonthDisabled = Boolean(bounds.max && formatDateValue(nextMonth) > bounds.max)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && bounds.invalidRange) {
      console.warn(
        `Calendar received min "${min}" after max "${max}". Both bounds were ignored.`,
      )
    }
  }, [bounds.invalidRange, max, min])

  useEffect(() => {
    if (rovingValue !== activeValue) setActiveValue(rovingValue)
  }, [activeValue, rovingValue])

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    dayRefs.current.get(activeValue)?.focus()
  }, [activeValue, renderedMonth])

  useEffect(() => {
    setCurrentDate(suppliedToday || todayValue())
  }, [suppliedToday])

  useEffect(() => {
    if (!selectedValue || !parseDateValue(selectedValue)) return
    const nextActiveValue = clampNormalizedDateValue(selectedValue, bounds)
    setActiveValue(nextActiveValue)
    setVisibleMonth(monthForValue(nextActiveValue)!)
  }, [bounds, selectedValue])

  useEffect(() => {
    if (validSelectedValue || !currentDate) return
    const nextActiveValue = clampNormalizedDateValue(currentDate, bounds)
    setActiveValue(nextActiveValue)
    setVisibleMonth(monthForValue(nextActiveValue)!)
  }, [bounds, currentDate, validSelectedValue])

  useEffect(() => {
    const nextActiveValue = clampNormalizedDateValue(activeValue, bounds)
    if (nextActiveValue === activeValue) return
    setActiveValue(nextActiveValue)
    setVisibleMonth(monthForValue(nextActiveValue)!)
  }, [activeValue, bounds])

  if (!calendarReady) {
    return (
      <div ref={ref} {...props} {...stylex.props(styles.calendar, sx)}>
        <div role="status" {...stylex.props(styles.monthLabel)}>
          {loadingLabel}
        </div>
      </div>
    )
  }

  const choose = (nextValue: string) => {
    if (isDisabled(nextValue)) return
    if (!controlled) setInternalValue(nextValue)
    setActiveValue(nextValue)
    setVisibleMonth(monthForValue(nextValue)!)
    onValueChange?.(nextValue)
  }

  const moveFocus = (nextValue: string) => {
    nextValue = clampNormalizedDateValue(nextValue, bounds)
    shouldFocus.current = true
    setActiveValue(nextValue)
    setVisibleMonth(monthForValue(nextValue)!)
  }

  const moveMonth = (amount: number) => {
    const nextActiveValue = clampNormalizedDateValue(addMonthsToValue(activeValue, amount), bounds)
    setActiveValue(nextActiveValue)
    setVisibleMonth(monthForValue(nextActiveValue)!)
  }

  const handleDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextValue: string | undefined
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
    switch (event.key) {
      case 'ArrowLeft':
        nextValue = addDays(activeValue, rtl ? 1 : -1)
        break
      case 'ArrowRight':
        nextValue = addDays(activeValue, rtl ? -1 : 1)
        break
      case 'ArrowUp':
        nextValue = addDays(activeValue, -7)
        break
      case 'ArrowDown':
        nextValue = addDays(activeValue, 7)
        break
      case 'Home':
        nextValue = addDays(
          activeValue,
          -((new Date(`${activeValue}T00:00:00Z`).getUTCDay() - normalizedWeekStartsOn + 7) % 7),
        )
        break
      case 'End':
        nextValue = addDays(
          activeValue,
          6 - ((new Date(`${activeValue}T00:00:00Z`).getUTCDay() - normalizedWeekStartsOn + 7) % 7),
        )
        break
      case 'PageUp': {
        nextValue = addMonthsToValue(activeValue, event.shiftKey ? -12 : -1)
        break
      }
      case 'PageDown': {
        nextValue = addMonthsToValue(activeValue, event.shiftKey ? 12 : 1)
        break
      }
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(activeValue)
        return
      default:
        return
    }
    if (nextValue) {
      event.preventDefault()
      moveFocus(nextValue)
    }
  }

  return (
    <div ref={ref} {...props} {...stylex.props(styles.calendar, sx)}>
      <div {...stylex.props(styles.header)}>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={previousMonthLabel}
          disabled={previousMonthDisabled}
          onClick={() => moveMonth(-1)}
        >
          ‹
        </Button>
        <div aria-live="polite" {...stylex.props(styles.monthLabel)}>
          {formatMonthLabel(renderedMonth, locale)}
        </div>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={nextMonthLabel}
          disabled={nextMonthDisabled}
          onClick={() => moveMonth(1)}
        >
          ›
        </Button>
      </div>
      <div
        role="grid"
        aria-label={ariaLabelledby ? undefined : (ariaLabel ?? formatMonthLabel(renderedMonth, locale))}
        aria-labelledby={ariaLabelledby}
        {...stylex.props(styles.grid)}
      >
        <div role="row" {...stylex.props(styles.row)}>
          {weekdayLabels.map((label) => (
            <div
              key={label}
              role="columnheader"
              aria-label={label}
              {...stylex.props(styles.weekday)}
            >
              {label.slice(0, 2)}
            </div>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week[0]?.value} role="row" {...stylex.props(styles.row)}>
            {week.map((day) => {
              const disabled = isDisabled(day.value)
              const active = rovingValue === day.value
              const selected = selectedValue === day.value
              return (
                <div
                  key={day.value}
                  role="gridcell"
                  aria-selected={selected}
                  {...stylex.props(styles.cell)}
                >
                  <button
                    ref={(node) => {
                      if (node) dayRefs.current.set(day.value, node)
                      else dayRefs.current.delete(day.value)
                    }}
                    type="button"
                    aria-label={formatDayLabel(day.value, locale)}
                    aria-current={day.value === currentDate ? 'date' : undefined}
                    disabled={disabled}
                    tabIndex={active ? 0 : -1}
                    onClick={() => choose(day.value)}
                    onFocus={() => setActiveValue(day.value)}
                    onKeyDown={handleDayKeyDown}
                    {...stylex.props(
                      styles.day,
                      !day.inMonth && styles.outsideDay,
                      selected && styles.selectedDay,
                      day.value === currentDate && styles.today,
                    )}
                  >
                    {day.day}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* eslint-disable @stylexjs/valid-styles -- StyleX 0.18 has not catalogued overscrollBehaviorInline. */
const styles = stylex.create({
  calendar: {
    padding: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.popover,
    boxSizing: 'border-box',
    color: colors.popoverForeground,
    display: 'grid',
    overscrollBehaviorInline: 'contain',
    maxWidth: '100%',
    overflowX: 'auto',
    width: 'fit-content',
  },
  header: {
    gap: spacing.xs,
    alignItems: 'center',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
  },
  monthLabel: {
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    textAlign: 'center',
  },
  grid: {
    gap: spacing.xxxs,
    display: 'grid',
  },
  row: {
    gap: spacing.xxxs,
    display: 'grid',
    gridTemplateColumns: {
      default: `repeat(7, minmax(${spacing.targetMin}, 2rem))`,
      '@media (any-pointer: coarse)': `repeat(7, ${spacing.targetCoarse})`,
    },
  },
  weekday: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus2,
    lineHeight: spacing.controlSm,
    textAlign: 'center',
  },
  cell: {
    minWidth: 0,
  },
  day: {
    padding: 0,
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    backgroundColor: {
      default: 'transparent',
      ':focus-visible': colors.accent,
      ':hover': colors.accent,
    },
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRing} ${colors.focusRing}`,
    },
    color: colors.fg,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    opacity: { default: 1, ':disabled': 0.4 },
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':focus-visible': stroke.focusRing,
    },
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, box-shadow, color',
    transitionTimingFunction: motion.easeStandard,
    height: {
      default: spacing.controlSm,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
    minWidth: spacing.controlSm,
    width: '100%',
  },
  outsideDay: {
    color: colors.fgDisabled,
  },
  selectedDay: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  today: {
    borderColor: colors.borderStrong,
  },
})
/* eslint-enable @stylexjs/valid-styles */
