import * as stylex from '@stylexjs/stylex'
import { ColorField, type ColorFieldProps } from '../color-field'

export type ColorAreaProps = ColorFieldProps

/** A lightweight native color-input fallback for an experimental color area. */
export function ColorArea({ sx, ...props }: ColorAreaProps) {
  return <ColorField {...props} sx={[styles.input, sx]} />
}

const styles = stylex.create({
  input: {
    aspectRatio: '4 / 3',
    height: 'auto',
    minHeight: '6rem',
    width: 'min(12rem, 100%)',
  },
})
