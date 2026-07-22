import { describe, expectTypeOf, it } from 'vitest'
import type { TabsContentProps, TabsListProps, TabsTriggerProps } from '../src/tabs'

describe('tabs managed attribute contract', () => {
  it('keeps generated relationships and interaction state out of consumer props', () => {
    expectTypeOf<TabsListProps>().not.toHaveProperty('aria-orientation')

    expectTypeOf<TabsTriggerProps>().not.toHaveProperty('aria-controls')
    expectTypeOf<TabsTriggerProps>().not.toHaveProperty('aria-selected')
    expectTypeOf<TabsTriggerProps>().not.toHaveProperty('id')
    expectTypeOf<TabsTriggerProps>().not.toHaveProperty('role')
    expectTypeOf<TabsTriggerProps>().not.toHaveProperty('tabIndex')
    expectTypeOf<TabsTriggerProps>().not.toHaveProperty('type')

    expectTypeOf<TabsContentProps>().not.toHaveProperty('aria-labelledby')
    expectTypeOf<TabsContentProps>().not.toHaveProperty('hidden')
    expectTypeOf<TabsContentProps>().not.toHaveProperty('id')
    expectTypeOf<TabsContentProps>().not.toHaveProperty('role')
    expectTypeOf<TabsContentProps>().not.toHaveProperty('tabIndex')
  })
})
