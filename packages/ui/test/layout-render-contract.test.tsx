import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test, vi } from 'vitest'
import { Content } from '../src/content'
import { HeaderLayout } from '../src/header-layout'
import { SidebarLayout, SidebarNavigation } from '../src/sidebar-layout'

vi.mock('@stylexjs/stylex', () => ({
  create: <T,>(styles: T) => styles,
  defineConsts: <T,>(constants: T) => constants,
  defineVars: <T extends Record<string, unknown>>(variables: T) =>
    Object.fromEntries(Object.keys(variables).map((key) => [key, `var(--${key})`])) as T,
  props: () => ({}),
}))

describe('layout semantics', () => {
  test('layout primitives are landmark-neutral by default and retain slot props', () => {
    const markup = renderToStaticMarkup(
      <>
        <HeaderLayout
          id="header-layout"
          header="Header"
          headerProps={{ id: 'header-slot' }}
          mainProps={{ id: 'header-content-slot' }}
        >
          Content
        </HeaderLayout>
        <SidebarLayout
          id="sidebar-layout"
          sidebar="Sidebar"
          sidebarProps={{ id: 'sidebar-slot' }}
          mainProps={{ id: 'sidebar-content-slot' }}
        >
          Content
        </SidebarLayout>
        <Content id="neutral-content">Article copy</Content>
      </>,
    )

    expect(markup).not.toMatch(/<(?:aside|header|main|nav)\b/)
    for (const id of [
      'header-layout',
      'header-slot',
      'header-content-slot',
      'sidebar-layout',
      'sidebar-slot',
      'sidebar-content-slot',
      'neutral-content',
    ]) {
      expect(markup).toContain(`id="${id}"`)
    }
  })

  test('callers can opt into one named landmark composition', () => {
    const markup = renderToStaticMarkup(
      <SidebarLayout
        sidebar={
          <SidebarNavigation aria-label="Documentation">
            <a href="#overview">Overview</a>
          </SidebarNavigation>
        }
        sidebarAs="aside"
        sidebarProps={{ 'aria-label': 'Documentation sidebar', id: 'semantic-sidebar' }}
        mainAs="main"
        mainProps={{ id: 'semantic-main' }}
      >
        <HeaderLayout
          header="Page tools"
          headerAs="header"
          headerProps={{ id: 'semantic-header' }}
        >
          Page content
        </HeaderLayout>
      </SidebarLayout>,
    )

    expect(markup.match(/<main\b/g)).toHaveLength(1)
    expect(markup.match(/<aside\b/g)).toHaveLength(1)
    expect(markup.match(/<header\b/g)).toHaveLength(1)
    expect(markup.match(/<nav\b/g)).toHaveLength(1)
    expect(markup).toContain('aria-label="Documentation"')
    expect(markup).toContain('aria-label="Documentation sidebar"')
  })
})
