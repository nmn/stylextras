/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentPreview } from '@/components/catalog/HighlightedComponentPreview'
import { ThemeGallery } from '@/components/catalog/ThemeGallery'
import { vars } from '@/theming/vars.stylex'
import { StyleXStyles } from '@stylexjs/stylex'
import * as stylex from '@stylexjs/stylex'
import { Button as AriaButton } from '@stylextras/ui/button'
import { Collapsible, CollapsibleTrigger } from '@stylextras/ui/collapsible'
import {
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@stylextras/ui/table'
import { Typography } from '@stylextras/ui/typography'
import type { ComponentProps, ComponentPropsWithoutRef, HTMLAttributes } from 'react'
import Dial from '../Dial'
import { Callout, CalloutContainer } from './Callout'
import { Card, Cards } from './Cards'
import { CodeBlock, Pre } from './CodeBlock'
import Heading from './Heading'
import Image from './Image'
import { LLMInstallationFile, LLMStylingFile } from './LLMFiles'
import MDXLink from './Link'
import { DevInstallExample } from './PackageInstall'
import Table from './Table'
import { Card as WhenDemo } from './WhenDemo'
import { preMarker } from './mdx.stylex'

type StyleXHTMLProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLAttributes<T>,
  'className' | 'style'
> & {
  xstyle?: StyleXStyles
}

function Paragraph({
  xstyle,
  ...props
}: Omit<ComponentPropsWithoutRef<'p'>, 'className' | 'style'> & {
  xstyle?: StyleXStyles
}) {
  return <Typography as="p" sx={[styles.p, stylex.defaultMarker(), xstyle]} {...props} />
}

function UnorderedList({
  xstyle,
  ...props
}: Omit<ComponentPropsWithoutRef<'ul'>, 'className' | 'style'> & {
  xstyle?: StyleXStyles
}) {
  return <ul {...stylex.props(styles.list, styles.ul, stylex.defaultMarker(), xstyle)} {...props} />
}

function OrderedList({
  xstyle,
  ...props
}: Omit<ComponentPropsWithoutRef<'ol'>, 'className' | 'style'> & {
  xstyle?: StyleXStyles
}) {
  return <ol {...stylex.props(styles.list, styles.ol, stylex.defaultMarker(), xstyle)} {...props} />
}

function ListItem({
  xstyle,
  ...props
}: Omit<ComponentPropsWithoutRef<'li'>, 'className' | 'style'> & {
  xstyle?: StyleXStyles
}) {
  return <li {...stylex.props(styles.li, stylex.defaultMarker(), xstyle)} {...props} />
}

export const mdxComponents = {
  a: MDXLink,
  h1: (props: StyleXHTMLProps<HTMLHeadingElement>) => <Heading as="h1" {...props} />,
  h2: (props: StyleXHTMLProps<HTMLHeadingElement>) => <Heading as="h2" {...props} />,
  h3: (props: StyleXHTMLProps<HTMLHeadingElement>) => <Heading as="h3" {...props} />,
  h4: (props: StyleXHTMLProps<HTMLHeadingElement>) => <Heading as="h4" {...props} />,
  h5: (props: StyleXHTMLProps<HTMLHeadingElement>) => <Heading as="h5" {...props} />,
  h6: (props: StyleXHTMLProps<HTMLHeadingElement>) => <Heading as="h6" {...props} />,
  code: (props: StyleXHTMLProps<HTMLElement>) => (
    <code {...props} {...stylex.props(styles.code, stylex.defaultMarker())} />
  ),
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  table: Table,
  thead: TableHeader,
  tbody: TableBody,
  tfoot: TableFooter,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  caption: TableCaption,
  Dial,
  DevInstallExample,
  WhenDemo,
  Card,
  Cards,
  details: Collapsible,
  summary: CollapsibleTrigger,
  Callout,
  CalloutContainer,
  img: Image,
  pre: (props: ComponentProps<'pre'>) => (
    <CodeBlock {...props}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  ),
  CodeBlock,
  LLMInstallationFile,
  LLMStylingFile,
  AriaButton,
  ComponentPreview,
  ThemeGallery,
}

const styles = stylex.create({
  p: {
    marginTop: {
      default: '1.25em',
      ':first-child': 0,
    },
    marginBottom: {
      default: '1.25em',
      ':last-child': 0,
    },
    color: vars['--color-fd-foreground'],
  },
  list: {
    paddingInlineStart: '1.25rem',
    marginTop: {
      default: '1.25em',
      [stylex.when.ancestor(':where(p)')]: 0,
      [stylex.when.ancestor(':where(ul, ol)')]: '0.75em',
    },
  },
  ul: {
    listStyleType: 'disc',
  },
  ol: {
    listStyleType: {
      default: 'decimal',
      ':is([type="A"])': 'upper-alpha',
      ':is([type="I"])': 'upper-roman',
      ':is([type="a"])': 'lower-alpha',
      ':is([type="i"])': 'lower-roman',
    },
  },
  li: {
    minWidth: 0,
    overflowWrap: 'anywhere',
    paddingInlineStart: {
      default: 0,
      [stylex.when.ancestor(':where(ol)')]: '0.375em',
      [stylex.when.ancestor(':where(ul)')]: 0,
    },
    marginBlock: '0.5em',
  },
  code: {
    paddingBlock: {
      default: 3,
      [stylex.when.ancestor(':where(pre)')]: 8,
    },
    paddingInline: {
      default: 3,
      [stylex.when.ancestor(':where(pre)')]: 16,
    },
    fontSize: {
      default: `${13 / 16}rem`,
      [stylex.when.ancestor(':where(h1)')]: '1.5rem',
      [stylex.when.ancestor(':where(h2)')]: '0.875em',
      [stylex.when.ancestor(':where(h3)')]: '0.9em',
    },
    fontWeight: 'inherit',
    lineHeight: {
      default: null,
      [stylex.when.ancestor(':where(pre)')]: 1.5,
    },
    // color: `hsl(var(--cyan-h), var(--cyan-s), var(--cyan-l))`,
    color: vars['--color-code-green'],
    backgroundColor: {
      default: `color-mix(in oklab, ${vars['--color-fd-muted']} 95%, currentColor)`,
      [stylex.when.ancestor(':where(pre)', preMarker)]: 'transparent',
    },
    borderColor: vars['--color-fd-border'],
    borderStyle: {
      default: 'solid',
      [stylex.when.ancestor(':where(pre)', preMarker)]: 'none',
    },
    borderWidth: 1,
    borderRadius: 5,
  },
})
