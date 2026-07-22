import * as stylex from '@stylexjs/stylex'
import { DatePicker, type DatePickerProps } from '../date-picker'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'

export type DateFieldProps = DatePickerProps

/** Experimental compatibility name for the native DatePicker. */
export function DateField({ sx, ...props }: DateFieldProps) {
  return <DatePicker {...props} sx={[styles.field, sx]} />
}

const styles = stylex.create({
  field: {
    backgroundColor: colors.bgRaised,
    borderRadius: radius.md,
  },
})
