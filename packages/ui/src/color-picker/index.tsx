import * as stylex from '@stylexjs/stylex'
import type { ColorFieldProps } from '../color-field'
import { ColorField } from '../color-field'

export type ColorPickerProps = ColorFieldProps

/** A native, zero-JavaScript color picker. */
export function ColorPicker({ sx, ...props }: ColorPickerProps) {
  return <ColorField {...props} sx={[styles.input, sx]} />
}

const styles = stylex.create({
  input: {
    width: '4rem',
  },
})
