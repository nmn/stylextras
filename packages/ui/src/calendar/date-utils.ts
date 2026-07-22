export type CalendarDate = {
  day: number
  month: number
  year: number
}

export type CalendarCell = CalendarDate & {
  inMonth: boolean
  value: string
}

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseDateValue(value: string): CalendarDate | null {
  const match = datePattern.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = fromUTCDate(new Date(Date.UTC(year, month - 1, day)))
  if (date.year !== year || date.month !== month || date.day !== day) return null
  return date
}

export function formatDateValue({ day, month, year }: CalendarDate) {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function todayValue(now = new Date()) {
  return formatDateValue({
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  })
}

export function addDays(value: string, amount: number) {
  const parsed = parseDateValue(value)
  if (!parsed) return value
  const date = toUTCDate(parsed)
  date.setUTCDate(date.getUTCDate() + amount)
  return formatDateValue(fromUTCDate(date))
}

export function addMonths(month: CalendarDate, amount: number): CalendarDate {
  const date = new Date(Date.UTC(month.year, month.month - 1 + amount, 1))
  return fromUTCDate(date)
}

export function addMonthsToValue(value: string, amount: number) {
  const parsed = parseDateValue(value)
  if (!parsed) return value
  const month = addMonths(parsed, amount)
  const lastDay = new Date(Date.UTC(month.year, month.month, 0)).getUTCDate()
  return formatDateValue({ ...month, day: Math.min(parsed.day, lastDay) })
}

export function clampDateValue(value: string, min?: string, max?: string) {
  let nextValue = value
  if (min && parseDateValue(min) && nextValue < min) nextValue = min
  if (max && parseDateValue(max) && nextValue > max) nextValue = max
  return nextValue
}

export function monthForValue(value: string): CalendarDate | null {
  const parsed = parseDateValue(value)
  return parsed ? { ...parsed, day: 1 } : null
}

export function createMonthGrid(month: CalendarDate, weekStartsOn: number): CalendarCell[] {
  const first = new Date(Date.UTC(month.year, month.month - 1, 1))
  const leadingDays = (first.getUTCDay() - weekStartsOn + 7) % 7
  const start = new Date(first)
  start.setUTCDate(start.getUTCDate() - leadingDays)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + index)
    const parts = fromUTCDate(date)
    return {
      ...parts,
      inMonth: parts.year === month.year && parts.month === month.month,
      value: formatDateValue(parts),
    }
  })
}

export function getWeekStartsOn(locale: string) {
  const localeWithWeekInfo = new Intl.Locale(locale) as Intl.Locale & {
    getWeekInfo?: () => { firstDay: number }
    weekInfo?: { firstDay: number }
  }
  const weekInfo = localeWithWeekInfo.getWeekInfo?.() ?? localeWithWeekInfo.weekInfo
  return weekInfo ? weekInfo.firstDay % 7 : 0
}

export function getWeekdayLabels(locale: string, weekStartsOn: number) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
  const sunday = new Date(Date.UTC(2024, 0, 7))
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday)
    date.setUTCDate(sunday.getUTCDate() + ((weekStartsOn + index) % 7))
    return formatter.format(date)
  })
}

export function formatMonthLabel(month: CalendarDate, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(toUTCDate(month))
}

export function formatDisplayDate(value: string, locale: string) {
  const parsed = parseDateValue(value)
  if (!parsed) return ''
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(toUTCDate(parsed))
}

export function formatDayLabel(value: string, locale: string) {
  const parsed = parseDateValue(value)
  if (!parsed) return value
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
  }).format(toUTCDate(parsed))
}

export function isDateDisabled(value: string, min?: string, max?: string) {
  return Boolean((min && value < min) || (max && value > max))
}

function toUTCDate({ day, month, year }: CalendarDate) {
  return new Date(Date.UTC(year, month - 1, day))
}

function fromUTCDate(date: Date): CalendarDate {
  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  }
}
