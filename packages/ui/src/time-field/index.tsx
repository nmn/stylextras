import { Timefield, type TimefieldProps } from "../timefield/index";

export type TimeFieldProps = TimefieldProps;
export type TimeFieldFieldProps = TimeFieldProps;

/**
 * Renders the time-field primitive under the spaced alias export.
 *
 * Search aliases: time field, time input, time picker, clock field.
 *
 * A11y notes:
 * - Shares the same limitations as the underlying Timefield primitive.
 * - Accessibility behavior varies with native browser time input support.
 */
export function TimeFieldField(props: TimeFieldFieldProps) {
  return <TimeField {...props} />;
}

export function TimeField(props: TimeFieldProps) {
  return <Timefield {...props} />;
}
