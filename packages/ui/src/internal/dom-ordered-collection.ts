'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'

export type DomOrderedCollectionRecord = {
  getElement: () => Element | null
  id: string
  value: string
}

const DOCUMENT_POSITION_DISCONNECTED = 1
const DOCUMENT_POSITION_PRECEDING = 2
const DOCUMENT_POSITION_FOLLOWING = 4

export function getAdjacentItem<T extends { id: string }>(
  items: readonly T[],
  activeId: string | null,
  direction: -1 | 1,
) {
  if (items.length === 0) return undefined
  const currentIndex = items.findIndex((item) => item.id === activeId)
  if (currentIndex === -1) return direction === 1 ? items[0] : items.at(-1)
  return items[(currentIndex + direction + items.length) % items.length]
}

export function getDomOrderedRecords<T extends DomOrderedCollectionRecord>(records: Iterable<T>) {
  return [...records].sort((left, right) => {
    const leftElement = left.getElement()
    const rightElement = right.getElement()
    if (!leftElement || !rightElement || leftElement === rightElement) return 0

    const position = leftElement.compareDocumentPosition(rightElement)
    if (position & DOCUMENT_POSITION_DISCONNECTED) return 0
    if (position & DOCUMENT_POSITION_FOLLOWING) return -1
    if (position & DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })
}

type DomOrderedCollectionStore<T extends DomOrderedCollectionRecord> = {
  getItems: () => T[]
  getSnapshot: () => number
  register: (record: T) => () => void
  subscribe: (listener: () => void) => () => void
}

function createDomOrderedCollectionStore<T extends DomOrderedCollectionRecord>(
  componentName: string,
): DomOrderedCollectionStore<T> {
  const records = new Map<string, T>()
  const listeners = new Set<() => void>()
  let revision = 0

  const emitChange = () => {
    revision += 1
    for (const listener of listeners) listener()
  }

  return {
    getItems: () => getDomOrderedRecords(records.values()),
    getSnapshot: () => revision,
    register: (record) => {
      if (process.env.NODE_ENV !== 'production') {
        const duplicate = [...records.values()].find(
          (candidate) => candidate.id !== record.id && candidate.value === record.value,
        )
        if (duplicate) {
          console.warn(
            `${componentName} values must be unique. Duplicate value "${record.value}" was registered.`,
          )
        }
      }

      if (records.get(record.id) !== record) {
        records.set(record.id, record)
        emitChange()
      }

      return () => {
        if (records.get(record.id) !== record) return
        records.delete(record.id)
        emitChange()
      }
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

/**
 * Keeps composite-widget records keyed by generated DOM id and returns them in
 * document order. Values are deliberately not keys: duplicate consumer values
 * must never collapse two options into one active-descendant target.
 */
export function useDomOrderedCollection<T extends DomOrderedCollectionRecord>(
  componentName: string,
) {
  const [store] = useState(() => createDomOrderedCollectionStore<T>(componentName))
  const revision = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  const items = useMemo(() => store.getItems(), [revision, store])

  return { getItems: store.getItems, items, register: store.register }
}
