import * as stylex from '@stylexjs/stylex'
import { ColorField, type ColorFieldProps } from '../color-field'

export type ColorWheelProps = ColorFieldProps

/** A native color-input fallback for an experimental color wheel. */
export function ColorWheel({ sx, ...props }: ColorWheelProps) {
  return <ColorField {...props} sx={[styles.input, sx]} />
}

const styles = stylex.create({
  input: {
    height: '5rem',
    width: '5rem',
  },
})
