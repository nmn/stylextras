import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { Children, type ComponentPropsWithRef } from 'react'
import { spacing } from '../tokens/spacing.stylex'

export type TagListProps = Omit<ComponentPropsWithRef<'ul'>, 'className' | 'style'> & {
  sx?: StyleXStyles
}
export type TagGroupProps = TagListProps

/** A semantic list for static tags. Use native checkbox/radio controls for selectable tags. */
export function TagList({ children, ref, sx, ...props }: TagListProps) {
  return (
    <ul ref={ref} role="list" {...props} {...stylex.props(styles.list, sx)}>
      {Children.map(children, (child) => (
        <li {...stylex.props(styles.item)}>{child}</li>
      ))}
    </ul>
  )
}

/** @deprecated Static tags are a list rather than an interactive group. */
export const TagGroup = TagList

const styles = stylex.create({
  list: {
    margin: 0,
    padding: 0,
    gap: spacing.xs,
    listStyle: 'none',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  item: {
    display: 'inline-flex',
  },
})
