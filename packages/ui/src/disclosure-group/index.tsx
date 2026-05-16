import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import * as React from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { spacing } from '../tokens/spacing.stylex'

type BaseProps = ComponentPropsWithoutRef<'div'>
type DisclosureChildProps = { children?: React.ReactNode; name?: string }

export type DisclosureGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  exclusive?: boolean
  name?: string
  sx?: StyleXStyles
}

/**
 * Renders a wrapper for grouped disclosures.
 *
 * Search aliases: disclosure group, accordion group, details group, expandable list.
 *
 * A11y notes:
 * - Provides grouping and can opt into native single-open details behavior.
 * - Does not implement roving focus beyond what the browser provides.
 */
export function DisclosureGroup({
  children,
  exclusive = false,
  name,
  sx,
  ...props
}: DisclosureGroupProps) {
  const generatedName = React.useId()
  const detailsName = exclusive ? (name ?? generatedName) : undefined

  return (
    <div {...props} {...stylex.props(styles.base, sx)}>
      {mapDisclosureChildren(children, detailsName)}
    </div>
  )
}

const styles = stylex.create({ base: { display: 'grid', gap: spacing.sm, width: '100%' } })

function mapDisclosureChildren(children: React.ReactNode, name?: string): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child) || name === undefined) {
      return child
    }

    if (child.type === React.Fragment) {
      const fragment = child as React.ReactElement<{ children?: React.ReactNode }>
      return <React.Fragment>{mapDisclosureChildren(fragment.props.children, name)}</React.Fragment>
    }

    return React.cloneElement(child as React.ReactElement<DisclosureChildProps>, { name })
  })
}
