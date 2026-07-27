/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client'

import type { ReactNode } from 'react'
import { AnchorProvider, type TOCItemType, useActiveAnchors } from 'fumadocs-core/toc'
import { useTreeContext } from 'fumadocs-ui/contexts/tree'
import { usePathname } from 'fumadocs-core/framework'
import type * as PageTree from 'fumadocs-core/page-tree'
import * as stylex from '@stylexjs/stylex'
import {
  TableOfContents,
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
  TableOfContentsTitle,
} from '@stylextras/ui/table-of-contents'
import { Typography } from '@stylextras/ui/typography'
import { RouterButtonLink } from '@/components/router-link'
import { StyleXComponentProps } from './shared'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { vars } from '@/theming/vars.stylex'

export interface DocsPageProps {
  toc?: TOCItemType[]

  children: ReactNode
}

export function DocsPage({ toc = [], ...props }: DocsPageProps) {
  return (
    <AnchorProvider toc={toc}>
      <div {...stylex.props(pageStyles.wrapper)}>
        <main {...stylex.props(pageStyles.flexCol, pageStyles.main)}>
          <article {...stylex.props(pageStyles.flexCol, pageStyles.article)}>
            {props.children}
            <Footer />
          </article>
        </main>
        {toc.length > 0 && (
          <TableOfContents aria-label="On this page" sx={pageStyles.sticky}>
            <TableOfContentsTitle>On this page</TableOfContentsTitle>
            <TableOfContentsList>
              {nestToc(toc).map((node) => (
                <TocItem node={node} key={node.item.url} />
              ))}
            </TableOfContentsList>
          </TableOfContents>
        )}
      </div>
    </AnchorProvider>
  )
}
const pageStyles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flexGrow: 1,
    minWidth: 0,
  },
  article: {
    flexGrow: 1,
    gap: 24,
    width: '100%',
    maxWidth: 860,
    paddingBlock: 32,
    paddingInline: 16,
    marginInline: {
      default: null,
      '@media (min-width: 768px)': 'auto',
    },
  },
  sticky: {
    position: 'sticky',
    top: 80,
    zIndex: 1,
    display: {
      default: 'block',
      '@media (max-width: 1280px)': 'none',
    },
    flexShrink: 0,
    width: 360,
    maxHeight: 'calc(100dvh - 96px)',
    padding: 4 * 4,
    marginBottom: 16,
    overflow: 'auto',
    borderInlineStartColor: vars['--color-fd-border'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 1,
  },
})

export function DocsBody({ xstyle, ...props }: StyleXComponentProps<'div'>) {
  return (
    <Typography as="div" sx={[docsBodyStyles.root, xstyle]} {...props}>
      {props.children}
    </Typography>
  )
}
const docsBodyStyles = stylex.create({
  root: {
    fontSize: '1rem',
    lineHeight: 1.75,
    maxWidth: 'none',
    overflowWrap: 'normal',
  },
})

export function DocsDescription({ xstyle, ...props }: StyleXComponentProps<'p'>) {
  // don't render if no description provided
  if (props.children === undefined) return null

  return (
    <Typography as="p" scale="body" sx={[descStyles.p, xstyle]} {...props}>
      {props.children}
    </Typography>
  )
}
const descStyles = stylex.create({
  p: {
    maxWidth: 'none',
    fontSize: `${18 / 16}rem`,
    lineHeight: 1.555,
    color: vars['--color-fd-muted-foreground'],
    overflowWrap: 'normal',
  },
})

export function DocsTitle({ xstyle, ...props }: StyleXComponentProps<'h1'>) {
  return (
    <Typography as="h1" scale="title" tone="brand" sx={[titleStyles.h1, xstyle]} {...props}>
      {props.children}
    </Typography>
  )
}
const titleStyles = stylex.create({
  h1: {
    fontSize: `${30 / 16}rem`,
    fontWeight: 600,
    lineHeight: 1.2,
    maxWidth: 'none',
    wordBreak: 'break-word',
  },
})

interface TocNode {
  children: TocNode[]
  item: TOCItemType
}

function nestToc(items: TOCItemType[]): TocNode[] {
  const roots: TocNode[] = []
  const ancestors: TocNode[] = []

  for (const item of items) {
    const node: TocNode = { children: [], item }

    while (ancestors.length > 0 && ancestors[ancestors.length - 1]!.item.depth >= item.depth) {
      ancestors.pop()
    }

    const parent = ancestors[ancestors.length - 1]
    ;(parent?.children ?? roots).push(node)
    ancestors.push(node)
  }

  return roots
}

function TocItem({ node }: { node: TocNode }) {
  const { item } = node
  const isActive = useActiveAnchors().includes(item.url.slice(1))

  return (
    <TableOfContentsItem>
      <TableOfContentsLink active={isActive} href={item.url}>
        {item.title}
      </TableOfContentsLink>
      {node.children.length > 0 ? (
        <TableOfContentsList>
          {node.children.map((child) => (
            <TocItem key={child.item.url} node={child} />
          ))}
        </TableOfContentsList>
      ) : null}
    </TableOfContentsItem>
  )
}
function Footer() {
  const { root } = useTreeContext()
  const pathname = usePathname()
  const flatten: PageTree.Item[] = []

  function scan(items: PageTree.Node[]) {
    for (const item of items) {
      if (item.type === 'page') flatten.push(item)
      else if (item.type === 'folder') {
        if (item.index) flatten.push(item.index)
        scan(item.children)
      }
    }
  }

  scan(root.children)

  const currentIndex = flatten.findIndex((item) => item.url === pathname)
  const previous = currentIndex === -1 ? undefined : flatten[currentIndex - 1]
  const next = currentIndex === -1 ? undefined : flatten[currentIndex + 1]

  return (
    <div {...stylex.props(footerStyles.div)}>
      {previous ? (
        <RouterButtonLink
          href={previous.url}
          sx={[footerStyles.link, footerStyles.prev]}
          variant="ghost"
        >
          <ChevronLeft {...stylex.props(footerStyles.chevron)} />
          {previous.name}
        </RouterButtonLink>
      ) : null}
      {next ? (
        <RouterButtonLink
          href={next.url}
          sx={[footerStyles.link, footerStyles.next]}
          variant="ghost"
        >
          {next.name}
          <ChevronRight {...stylex.props(footerStyles.chevron)} />
        </RouterButtonLink>
      ) : null}
    </div>
  )
}
const footerStyles = stylex.create({
  div: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2 * 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '45%',
    flexDirection: 'row',
    gap: 8,
    minWidth: 'fit-content',
    padding: 16,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    overflowWrap: 'normal',
    color: vars['--color-fd-primary'],
    backgroundColor: {
      default: 'transparent',
      ':hover': vars['--color-fd-muted'],
    },
    borderColor: vars['--color-fd-border'],
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    cornerShape: 'squircle',
  },
  prev: {
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  next: {
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  chevron: {
    width: '1em',
    height: '1em',
    marginTop: 5,
  },
})
