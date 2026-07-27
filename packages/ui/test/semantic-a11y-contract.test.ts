import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { PaginationLinkProps, PaginationProps } from '../src/pagination'

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src')

function source(component: string) {
  return readFileSync(path.join(sourceRoot, component, 'index.tsx'), 'utf8')
}

describe('semantic accessibility contracts', () => {
  it('keeps static callouts and errors out of live regions by default', () => {
    expect(source('alert')).not.toContain("role = 'status'")
    expect(source('field')).not.toContain("role = 'alert'")
    expect(source('field-errors')).not.toContain('role="alert"')
  })

  it('keeps the native file input exposed and explicitly labelled', () => {
    const fileTrigger = source('file-trigger')
    expect(fileTrigger).toContain('htmlFor={id}')
    expect(fileTrigger).toContain('"::file-selector-button"')
    expect(fileTrigger).not.toContain('display: "none"')
  })

  it('represents table-of-contents depth with nested lists', () => {
    const tableOfContents = source('table-of-contents')
    expect(tableOfContents).toContain('role="list"')
    expect(tableOfContents).not.toContain('TableOfContentsLevel')
    expect(tableOfContents).not.toContain('level?:')
  })

  it('preserves list semantics when visual markers are removed', () => {
    expect(source('breadcrumb')).toMatch(/<ol ref=\{ref\}[^>]*role="list"/)
  })

  it('makes pagination own exactly one current destination', () => {
    expectTypeOf<PaginationProps>().toHaveProperty('currentHref')
    expectTypeOf<PaginationProps['currentHref']>().toEqualTypeOf<string>()
    expectTypeOf<PaginationLinkProps>().not.toHaveProperty('active')
    expectTypeOf<PaginationLinkProps>().not.toHaveProperty('aria-current')

    const pagination = source('pagination')
    expect(pagination).toContain('href === useCurrentHref()')
    expect(pagination).toContain('matchingLinks.length === 0')
    expect(pagination).toContain('matchingLinks.length > 1')
  })

  it('makes layout landmarks explicit opt-ins', () => {
    expect(source('content')).toContain('as ?? "div"')
    expect(source('header-layout')).toContain('mainAs = "div"')
    expect(source('sidebar-layout')).toContain('sidebarAs = "div"')
  })
})
