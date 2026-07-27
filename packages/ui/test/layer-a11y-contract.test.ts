import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src')

function source(relativePath: string) {
  return readFileSync(path.join(sourceRoot, relativePath), 'utf8')
}

describe('layer accessibility contracts', () => {
  it('keeps tooltip content hoverable and warns about interactive descendants', () => {
    const tooltip = source('tooltip/index.tsx')
    expect(tooltip).not.toMatch(/pointerEvents:\s*['"]none['"]/)
    expect(tooltip).toContain('INTERACTIVE_TOOLTIP_SELECTOR')
    expect(tooltip).toContain('new MutationObserver(validate)')
    expect(tooltip).toContain('composeRefs(tooltipRef, ref)')
    expect(tooltip).toContain('Tooltip content must be non-interactive.')
  })

  it('installs lazy dialog command fallback behavior for every dialog alias', () => {
    const lazyDialog = source('dialog/lazy.tsx')
    expect(lazyDialog).toContain("import { DialogCommandBridge } from './client'")
    expect(lazyDialog).toContain('<DialogCommandBridge target={id} />')
  })

  it('preserves dialog backdrop and nested-popover escape fallbacks', () => {
    const dialogClient = source('dialog/client.tsx')
    expect(dialogClient).toContain('supportsDialogClosedBy()')
    expect(dialogClient).toContain("closedBy !== 'any'")
    expect(dialogClient).toContain('getTopmostNestedPopover')
  })

  it('uses labelled menu groups and never switches a menubar through consumer clicks', () => {
    for (const menu of ['dropdown-menu/index.tsx', 'context-menu/index.tsx']) {
      const menuSource = source(menu)
      expect(menuSource).toMatch(/function \w+MenuGroup[\s\S]*role="group"/)
      expect(menuSource).toContain("'aria-labelledby': string")
    }

    const menubar = source('menubar/index.tsx')
    expect(menubar).toContain('switchMenubarMenu')
    expect(menubar).not.toContain('trigger.click()')
  })

  it('keeps markerless navigation lists and sidebar navigation semantic', () => {
    expect(source('navigation-menu/index.tsx')).toMatch(/<ul ref=\{ref\}[^>]*role="list"/)
    const sidebar = source('sidebar/index.tsx')
    expect(sidebar).toContain('export function SidebarNavigation')
    expect(sidebar).toMatch(/<ul ref=\{ref\}[^>]*role="list"/)
  })

  it('invalidates focusgroup state across detach and reinsertion', () => {
    const focusgroup = source('focusgroup/index.ts')
    expect(focusgroup).toContain('nodeGenerations')
    expect(focusgroup).toContain('nodeGenerations.set(node, generation + 1)')
    expect(focusgroup).toContain('(nodeGenerations.get(focusgroup) ?? 0) + 1')
    expect(focusgroup).toContain('polyfill(node);')
  })
})
