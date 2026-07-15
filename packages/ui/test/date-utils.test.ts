import { describe, expect, it } from 'vitest'
import {
  addDays,
  addMonths,
  createMonthGrid,
  formatDateValue,
  formatDisplayDate,
  formatMonthLabel,
  getWeekdayLabels,
  isDateDisabled,
  monthForValue,
  parseDateValue,
  todayValue,
} from '../src/calendar/date-utils'

describe('calendar date utilities', () => {
  it('parses and formats strict calendar values', () => {
    expect(parseDateValue('2028-02-29')).toEqual({ day: 29, month: 2, year: 2028 })
    expect(parseDateValue('2027-02-29')).toBeNull()
    expect(parseDateValue('2027-2-09')).toBeNull()
    expect(parseDateValue('not-a-date')).toBeNull()
    expect(formatDateValue({ day: 3, month: 7, year: 42 })).toBe('0042-07-03')
  })

  it('moves dates across month, year, and leap-day boundaries', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
    expect(addDays('invalid', 4)).toBe('invalid')
    expect(addMonths({ day: 31, month: 12, year: 2026 }, 1)).toEqual({
      day: 1,
      month: 1,
      year: 2027,
    })
  })

  it('creates a stable six-week grid for either week convention', () => {
    const month = monthForValue('2026-07-11')!
    const sundayGrid = createMonthGrid(month, 0)
    const mondayGrid = createMonthGrid(month, 1)
    expect(sundayGrid).toHaveLength(42)
    expect(mondayGrid).toHaveLength(42)
    expect(sundayGrid[0]?.value).toBe('2026-06-28')
    expect(mondayGrid[0]?.value).toBe('2026-06-29')
    expect(sundayGrid.filter((cell) => cell.inMonth)).toHaveLength(31)
  })

  it('uses deterministic UTC-backed Intl formatting', () => {
    const weekdays = getWeekdayLabels('en-US', 1)
    expect(weekdays).toHaveLength(7)
    expect(weekdays[0]).toMatch(/^Mon/)
    expect(formatMonthLabel({ day: 1, month: 7, year: 2026 }, 'en-US')).toBe(
      'July 2026',
    )
    expect(formatDisplayDate('2026-07-11', 'en-US')).toContain('Jul')
    expect(formatDisplayDate('invalid', 'en-US')).toBe('')
  })

  it('handles bounds and local today conversion', () => {
    expect(isDateDisabled('2026-07-01', '2026-07-02')).toBe(true)
    expect(isDateDisabled('2026-08-01', undefined, '2026-07-31')).toBe(true)
    expect(isDateDisabled('2026-07-11', '2026-07-01', '2026-07-31')).toBe(false)
    expect(todayValue(new Date(2026, 6, 11, 23, 59))).toBe('2026-07-11')
  })
})
