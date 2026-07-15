import {
  RangeDatePicker,
  type RangeDatePickerProps,
} from "../range-date-picker/index";

export type DateRangePickerProps = RangeDatePickerProps;

/**
 * Renders the range date picker under the spaced alias export.
 *
 * Search aliases: date range picker, range date picker, date interval picker, range picker.
 *
 * A11y notes:
 * - Shares the same limitations as RangeDatePicker.
 * - Does not implement a full custom accessible date-range popup model.
 */
export function DateRangePicker(props: DateRangePickerProps) {
  return <RangeDatePicker {...props} />;
}
