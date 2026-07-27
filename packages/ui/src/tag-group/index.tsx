import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { spacing } from '../tokens/spacing.stylex'

export type TagListProps = Omit<ComponentPropsWithRef<'ul'>, 'className' | 'role' | 'style'> & {
  sx?: StyleXStyles
}
export type TagGroupProps = TagListProps
export type TagItemProps = Omit<ComponentPropsWithRef<'li'>, 'className' | 'style'> & {
  sx?: StyleXStyles
}

/** A semantic list for static tags. Use native checkbox/radio controls for selectable tags. */
export function TagList({ children, ref, sx, ...props }: TagListProps) {
  return (
    <ul ref={ref} {...props} role="list" {...stylex.props(styles.list, sx)}>
      {children}
    </ul>
  )
}

/** A semantic list item for one static tag. */
export function TagItem({ ref, sx, ...props }: TagItemProps) {
  return <li ref={ref} {...props} {...stylex.props(styles.item, sx)} />
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
