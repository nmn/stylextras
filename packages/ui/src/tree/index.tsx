import * as React from 'react'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { typography } from '../tokens/typography.stylex'

type BaseProps = ComponentPropsWithoutRef<'div'>

export type TreeProps = Omit<BaseProps, 'className' | 'style'> & { sx?: StyleXStyles }

/**
 * Renders a simplified hierarchical tree container.
 *
 * Search aliases: tree, tree view, outline, hierarchy.
 *
 * A11y notes:
 * - Uses native details/summary disclosure instead of a full ARIA tree pattern.
 * - Keyboard navigation and selection behavior remain much simpler than a production tree widget.
 */
export function Tree({ children, sx, ...props }: TreeProps) {
  return (
    <div {...props} role="tree" {...stylex.props(rootStyles.base, sx)}>
      {renderTreeChildren(children, 0)}
    </div>
  )
}

function renderTreeChildren(children: ReactNode, depth: number): ReactNode {
  return React.Children.toArray(children).map((child, index) => {
    if (!React.isValidElement(child)) {
      return child
    }

    if (child.type === React.Fragment) {
      const fragment = child as React.ReactElement<{ children?: ReactNode }>
      return (
        <React.Fragment key={index}>
          {renderTreeChildren(fragment.props.children, depth)}
        </React.Fragment>
      )
    }

    if (typeof child.type === 'string' && child.type === 'ul') {
      const list = child as React.ReactElement<{ children?: ReactNode }>
      return (
        <div key={index} {...stylex.props(levelStyles.base, getDepthStyle(depth))}>
          {renderTreeChildren(list.props.children, depth)}
        </div>
      )
    }

    if (typeof child.type === 'string' && child.type === 'li') {
      return renderTreeItem(child as React.ReactElement<{ children?: ReactNode }>, depth, index)
    }

    return child
  })
}

function renderTreeItem(
  child: React.ReactElement<{ children?: ReactNode }>,
  depth: number,
  key: React.Key,
): ReactNode {
  const parts = React.Children.toArray(child.props.children)
  const nestedList = parts.find(
    (part) => React.isValidElement(part) && typeof part.type === 'string' && part.type === 'ul',
  )
  const labelParts = parts.filter((part) => part !== nestedList)
  const labelContent = labelParts.length > 0 ? labelParts : child.props.children

  if (nestedList && React.isValidElement(nestedList)) {
    return (
      <details key={key} {...stylex.props(branchStyles.base, getDepthStyle(depth))}>
        <summary {...stylex.props(branchStyles.summary)}>
          <span {...stylex.props(branchStyles.label)}>{labelContent}</span>
        </summary>
        <div {...stylex.props(branchStyles.children)}>
          {renderTreeChildren(
            (nestedList as React.ReactElement<{ children?: ReactNode }>).props.children,
            depth + 1,
          )}
        </div>
      </details>
    )
  }

  return (
    <div key={key} role="treeitem" {...stylex.props(leafStyles.base, getDepthStyle(depth))}>
      {labelContent}
    </div>
  )
}

function getDepthStyle(depth: number) {
  if (depth === 0) {
    return depthStyles[0]
  }

  if (depth === 1) {
    return depthStyles[1]
  }

  if (depth === 2) {
    return depthStyles[2]
  }

  if (depth === 3) {
    return depthStyles[3]
  }

  return depthStyles.deep
}

const rootStyles = stylex.create({
  base: {
    display: 'grid',
    gap: spacing['3xs'],
    margin: 0,
  },
})

const levelStyles = stylex.create({
  base: {
    display: 'grid',
    gap: spacing['3xs'],
  },
})

const branchStyles = stylex.create({
  base: {
    display: 'grid',
    gap: spacing['3xs'],
  },
  summary: {
    display: 'list-item',
    minHeight: spacing['2xl'],
    paddingInline: spacing.sm,
    borderRadius: radius.md,
    color: colors.fg,
    cursor: 'pointer',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
    listStyleType: 'disclosure-closed',
    listStylePosition: 'inside',
  },
  label: {
    minWidth: 0,
  },
  children: {
    display: 'grid',
    gap: spacing['3xs'],
    paddingLeft: spacing.md,
  },
})

const leafStyles = stylex.create({
  base: {
    display: 'flex',
    alignItems: 'center',
    minHeight: spacing['2xl'],
    paddingInline: spacing.sm,
    borderRadius: radius.md,
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightSnug,
  },
})

const depthStyles = stylex.create({
  0: {
    marginLeft: 0,
  },
  1: {
    marginLeft: spacing.sm,
  },
  2: {
    marginLeft: spacing.md,
  },
  3: {
    marginLeft: spacing.lg,
  },
  deep: {
    marginLeft: spacing.lg,
  },
})
