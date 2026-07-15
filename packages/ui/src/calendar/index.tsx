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
  createMonthGrid,
  formatMonthLabel,
  getWeekStartsOn,
  getWeekdayLabels,
  isDateDisabled,
  monthForValue,
  parseDateValue,
  todayValue,
} from './date-utils'

export type CalendarProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & {
  defaultValue?: string
  locale?: string
  max?: string
  min?: string
  onValueChange?: (value: string) => void
  sx?: StyleXStyles
  value?: string
  weekStartsOn?: number
}

/** An Intl-backed, keyboard-complete single-date calendar grid. */
export function Calendar({
  defaultValue = '',
  locale = 'en-US',
  max,
  min,
  onValueChange,
  ref,
  sx,
  value,
  weekStartsOn = getWeekStartsOn(locale),
  ...props
}: CalendarProps) {
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const selectedValue = controlled ? value : internalValue
  const initialValue = parseDateValue(selectedValue) ? selectedValue : todayValue()
  const [visibleMonth, setVisibleMonth] = useState(
    () => monthForValue(initialValue) ?? monthForValue(todayValue())!,
  )
  const [activeValue, setActiveValue] = useState(initialValue)
  const dayRefs = useRef(new Map<string, HTMLButtonElement>())
  const shouldFocus = useRef(false)
  const today = todayValue()
  const days = useMemo(
    () => createMonthGrid(visibleMonth, weekStartsOn),
    [visibleMonth, weekStartsOn],
  )
  const weeks = useMemo(
    () => Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7)),
    [days],
  )
  const weekdayLabels = useMemo(
    () => getWeekdayLabels(locale, weekStartsOn),
    [locale, weekStartsOn],
  )

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    dayRefs.current.get(activeValue)?.focus()
  }, [activeValue, visibleMonth])

  useEffect(() => {
    if (!selectedValue || !parseDateValue(selectedValue)) return
    setActiveValue(selectedValue)
    setVisibleMonth(monthForValue(selectedValue)!)
  }, [selectedValue])

  const choose = (nextValue: string) => {
    if (isDateDisabled(nextValue, min, max)) return
    if (!controlled) setInternalValue(nextValue)
    setActiveValue(nextValue)
    setVisibleMonth(monthForValue(nextValue)!)
    onValueChange?.(nextValue)
  }

  const moveFocus = (nextValue: string) => {
    if (min && nextValue < min) nextValue = min
    if (max && nextValue > max) nextValue = max
    shouldFocus.current = true
    setActiveValue(nextValue)
    setVisibleMonth(monthForValue(nextValue)!)
  }

  const handleDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextValue: string | undefined
    switch (event.key) {
      case 'ArrowLeft':
        nextValue = addDays(activeValue, -1)
        break
      case 'ArrowRight':
        nextValue = addDays(activeValue, 1)
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
          -((new Date(`${activeValue}T00:00:00Z`).getUTCDay() - weekStartsOn + 7) % 7),
        )
        break
      case 'End':
        nextValue = addDays(
          activeValue,
          6 - ((new Date(`${activeValue}T00:00:00Z`).getUTCDay() - weekStartsOn + 7) % 7),
        )
        break
      case 'PageUp': {
        const month = addMonths(monthForValue(activeValue)!, event.shiftKey ? -12 : -1)
        nextValue = `${month.year}-${String(month.month).padStart(2, '0')}-01`
        break
      }
      case 'PageDown': {
        const month = addMonths(monthForValue(activeValue)!, event.shiftKey ? 12 : 1)
        nextValue = `${month.year}-${String(month.month).padStart(2, '0')}-01`
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
          aria-label="Previous month"
          onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
        >
          ‹
        </Button>
        <div aria-live="polite" {...stylex.props(styles.monthLabel)}>
          {formatMonthLabel(visibleMonth, locale)}
        </div>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Next month"
          onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
        >
          ›
        </Button>
      </div>
      <div
        role="grid"
        aria-label={formatMonthLabel(visibleMonth, locale)}
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
              const disabled = isDateDisabled(day.value, min, max)
              const active = activeValue === day.value
              const selected = selectedValue === day.value
              return (
                <button
                  key={day.value}
                  ref={(node) => {
                    if (node) dayRefs.current.set(day.value, node)
                    else dayRefs.current.delete(day.value)
                  }}
                  type="button"
                  role="gridcell"
                  aria-current={day.value === today ? 'date' : undefined}
                  aria-selected={selected}
                  disabled={disabled}
                  tabIndex={active ? 0 : -1}
                  onClick={() => choose(day.value)}
                  onFocus={() => setActiveValue(day.value)}
                  onKeyDown={handleDayKeyDown}
                  {...stylex.props(
                    styles.day,
                    !day.inMonth && styles.outsideDay,
                    selected && styles.selectedDay,
                    day.value === today && styles.today,
                  )}
                >
                  {day.day}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = stylex.create({
  calendar: {
    backgroundColor: colors.popover,
    boxSizing: 'border-box',
    color: colors.popoverForeground,
    display: 'grid',
    gap: spacing.sm,
    maxWidth: '100%',
    padding: spacing.sm,
    width: 'fit-content',
  },
  header: {
    alignItems: 'center',
    display: 'grid',
    gap: spacing.xs,
    gridTemplateColumns: 'auto 1fr auto',
  },
  monthLabel: {
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gap: spacing.xxxs,
  },
  row: {
    display: 'grid',
    gap: spacing.xxxs,
    gridTemplateColumns: 'repeat(7, minmax(0, 2rem))',
  },
  weekday: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus2,
    lineHeight: spacing.controlSm,
    textAlign: 'center',
  },
  day: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
      ':focus-visible': colors.accent,
    },
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRing} ${colors.focusRing}`,
    },
    color: colors.fg,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    height: spacing.controlSm,
    opacity: { default: 1, ':disabled': 0.4 },
    outline: 'none',
    padding: 0,
    transitionDuration: motion.durationFast,
    transitionProperty: 'background-color, box-shadow, color',
    transitionTimingFunction: motion.easeStandard,
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
