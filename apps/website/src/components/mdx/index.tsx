/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentPreview } from '@/components/catalog/ComponentPreview'
import { ThemeGallery } from '@/components/catalog/ThemeGallery'
import { vars } from '@/theming/vars.stylex'
import { StyleXStyles } from '@stylexjs/stylex'
import * as stylex from '@stylexjs/stylex'
import { Button as AriaButton } from '@stylextras/ui/button'
import type { ComponentProps, HTMLAttributes } from 'react'
import Dial from '../Dial'
import { Callout, CalloutContainer, CalloutDescription, CalloutTitle } from './Callout'
import { Card, Cards } from './Cards'
import { CodeBlock, Pre } from './CodeBlock'
import { Accordion, Accordions, Details, Summary } from './Details'
import Heading from './Heading'
import Image from './Image'
import { LLMInstallationFile, LLMStylingFile } from './LLMFiles'
import MDXLink from './Link'
import { DevInstallExample } from './PackageInstall'
import { TabItem, Tabs } from './Tabs'
import { Card as WhenDemo } from './WhenDemo'
import { Li, Ol, P, Ul } from './core'
import { preMarker } from './mdx.stylex'

type StyleXHTMLProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLAttributes<T>,
  'className' | 'style'
> & {
  xstyle?: StyleXStyles
}

// PENDING ELEMENTS:
//
// table

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
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  TabItem,
  Tabs,
  Dial,
  DevInstallExample,
  WhenDemo,
  Card,
  Cards,
  details: Details,
  summary: Summary,
  Accordion,
  Accordions,
  Details,
  Summary,
  Callout,
  CalloutContainer,
  CalloutTitle,
  CalloutDescription,
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
