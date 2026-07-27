import { describe, expect, it } from 'vitest'
import {
  type DomOrderedCollectionRecord,
  getAdjacentItem,
  getDomOrderedRecords,
} from '../src/internal/dom-ordered-collection'
import { composeRefs } from '../src/internal/refs'

describe('DOM-ordered composite collections', () => {
  it('preserves duplicate values while following live DOM order', () => {
    let order = ['first', 'second', 'third']
    const elements = new Map<string, Element>()

    for (const id of order) {
      elements.set(id, {
        compareDocumentPosition(other: Element) {
          const leftIndex = order.indexOf(id)
          const rightIndex = order.indexOf(
            [...elements].find(([, element]) => element === other)?.[0] ?? '',
          )
          if (leftIndex < rightIndex) return 4
          if (leftIndex > rightIndex) return 2
          return 0
        },
      } as Element)
    }

    const records: DomOrderedCollectionRecord[] = [
      { getElement: () => elements.get('first')!, id: 'first', value: 'duplicate' },
      { getElement: () => elements.get('second')!, id: 'second', value: 'duplicate' },
      { getElement: () => elements.get('third')!, id: 'third', value: 'unique' },
    ]

    expect(getDomOrderedRecords(records).map((record) => record.id)).toEqual(order)
    order = ['third', 'second', 'first']
    expect(getDomOrderedRecords(records).map((record) => record.id)).toEqual(order)
  })

  it('wraps from no active item in the requested direction', () => {
    const items = [{ id: 'first' }, { id: 'middle' }, { id: 'last' }]
    expect(getAdjacentItem(items, null, 1)?.id).toBe('first')
    expect(getAdjacentItem(items, null, -1)?.id).toBe('last')
    expect(getAdjacentItem(items, 'first', -1)?.id).toBe('last')
    expect(getAdjacentItem(items, 'last', 1)?.id).toBe('first')
    expect(getAdjacentItem([], null, 1)).toBeUndefined()
  })

  it('preserves callback-ref cleanup semantics when composing refs', () => {
    const objectRef: { current: object | null } = { current: null }
    const node = {}
    const assignments: Array<object | null> = []
    let cleanupCount = 0
    const composed = composeRefs<object>(objectRef, (value) => {
      assignments.push(value)
      return () => {
        cleanupCount += 1
      }
    })

    const cleanup = composed(node)
    expect(objectRef.current).toBe(node)
    expect(assignments).toEqual([node])
    expect(cleanup).toBeTypeOf('function')
    cleanup?.()
    expect(objectRef.current).toBeNull()
    expect(assignments).toEqual([node])
    expect(cleanupCount).toBe(1)
  })
})
