import { RangeCalendar, type RangeCalendarProps } from '../range-calendar'

export type DateRangePickerProps = RangeCalendarProps

/** A native, form-compatible date-range fallback with explicit labels. */
export function DateRangePicker(props: DateRangePickerProps) {
  return <RangeCalendar {...props} />
}
