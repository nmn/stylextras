import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type BaseProps = ComponentPropsWithoutRef<'select'>

type ListboxOption = string | { label: string; value: string }

export type ListboxProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles
  options?: ListboxOption[]
}

const defaultOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
]

/**
 * Renders a simplified listbox-style container.
 *
 * Search aliases: listbox, list box, option list, selection list.
 *
 * A11y notes:
 * - This is not a fully managed ARIA listbox implementation.
 * - Keyboard selection, active option management, and typeahead are limited.
 */
export function Listbox({ children, options = defaultOptions, sx, ...props }: ListboxProps) {
  return (
    <select multiple {...props} {...stylex.props(styles.base, sx)}>
      {children ??
        options.map((option) => {
          const normalizedOption =
            typeof option === 'string' ? { label: option, value: option } : option

          return (
            <option key={normalizedOption.value} value={normalizedOption.value}>
              {normalizedOption.label}
            </option>
          )
        })}
    </select>
  )
}

const styles = stylex.create({
  base: {
    width: '100%',
    minHeight: spacing['4xl'],
    padding: spacing.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
  },
})
