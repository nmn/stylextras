import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ReactNode } from 'react'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { AccordionItemProps, AccordionTriggerProps } from '../src/accordion'
import type { ButtonLinkProps } from '../src/button'
import type { CollapsibleTriggerProps } from '../src/collapsible'
import type { CopyToClipboardButtonProps } from '../src/copy-to-clipboard-button'
import type { LinkProps } from '../src/link'
import type { ScrollAreaProps } from '../src/scroll-area'
import type {
  TableOfContentsLinkProps,
  TableOfContentsProps,
  TableOfContentsTitleProps,
} from '../src/table-of-contents'

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src')

describe('website migration component contracts', () => {
  it('keeps website styling on the existing token axes', () => {
    const presetSource = readFileSync(path.join(sourceRoot, 'style-presets/index.ts'), 'utf8')
    expect(presetSource).toContain("color: 'docs'")
    expect(presetSource).toContain("typography: 'docs'")
    expect(presetSource).not.toContain('componentThemes')
  })

  it('exposes native anchor and button-link props', () => {
    expectTypeOf<LinkProps>().toHaveProperty('href')
    expectTypeOf<LinkProps>().toHaveProperty('ref')
    expectTypeOf<LinkProps>().toHaveProperty('sx')

    expectTypeOf<ButtonLinkProps>().toHaveProperty('href')
    expectTypeOf<ButtonLinkProps>().toHaveProperty('ref')
    expectTypeOf<ButtonLinkProps>().toHaveProperty('size')
    expectTypeOf<ButtonLinkProps>().toHaveProperty('variant')
  })

  it('supports deferred clipboard values and optional feedback', () => {
    expectTypeOf<CopyToClipboardButtonProps['value']>().toEqualTypeOf<string | (() => string)>()
    expectTypeOf<CopyToClipboardButtonProps['feedback']>().toEqualTypeOf<
      'none' | 'popover' | undefined
    >()
    expectTypeOf<CopyToClipboardButtonProps>().toHaveProperty('copiedIcon')
    expectTypeOf<CopyToClipboardButtonProps>().toHaveProperty('copiedLabel')
    expectTypeOf<CopyToClipboardButtonProps>().toHaveProperty('onError')
  })

  it('supports compound table-of-contents state', () => {
    expectTypeOf<TableOfContentsProps>().toHaveProperty('aria-label')
    expectTypeOf<TableOfContentsTitleProps<'h3'>['as']>().toEqualTypeOf<'h3' | undefined>()
    expectTypeOf<TableOfContentsLinkProps['active']>().toEqualTypeOf<boolean | undefined>()

    const source = readFileSync(path.join(sourceRoot, 'table-of-contents/index.tsx'), 'utf8')
    expect(source).toContain("aria-current={active ? 'location' : ariaCurrent}")
  })

  it('keeps disclosure and scroll defaults opt-in', () => {
    expectTypeOf<AccordionItemProps['name']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<AccordionTriggerProps['indicator']>().toEqualTypeOf<ReactNode | false>()
    expectTypeOf<AccordionTriggerProps['indicatorPosition']>().toEqualTypeOf<
      'start' | 'end' | undefined
    >()
    expectTypeOf<CollapsibleTriggerProps['indicatorPosition']>().toEqualTypeOf<
      'start' | 'end' | undefined
    >()
    expectTypeOf<ScrollAreaProps['scrollbar']>().toEqualTypeOf<'stable' | 'overlay' | undefined>()

    const scrollAreaSource = readFileSync(path.join(sourceRoot, 'scroll-area/index.tsx'), 'utf8')
    expect(scrollAreaSource).toContain("scrollbarGutter: 'stable'")
    expect(scrollAreaSource).toContain("scrollbarGutter: 'auto'")
    expect(scrollAreaSource).toContain('height: 6')
    expect(scrollAreaSource).toContain('width: 6')
  })
})
