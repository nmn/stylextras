'use client'

import { useCallback, useRef, useState } from 'react'

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

/**
 * Keeps composite-widget records keyed by generated DOM id and returns them in
 * document order. Values are deliberately not keys: duplicate consumer values
 * must never collapse two options into one active-descendant target.
 */
export function useDomOrderedCollection<T extends DomOrderedCollectionRecord>(
  componentName: string,
) {
  const recordsRef = useRef(new Map<string, T>())
  const [version, setVersion] = useState(0)

  const register = useCallback(
    (record: T) => {
      if (process.env.NODE_ENV !== 'production') {
        const duplicate = [...recordsRef.current.values()].find(
          (candidate) => candidate.id !== record.id && candidate.value === record.value,
        )
        if (duplicate) {
          console.warn(
            `${componentName} values must be unique. Duplicate value "${record.value}" was registered.`,
          )
        }
      }

      recordsRef.current.set(record.id, record)
      setVersion((current) => current + 1)

      return () => {
        if (recordsRef.current.get(record.id) !== record) return
        recordsRef.current.delete(record.id)
        setVersion((current) => current + 1)
      }
    },
    [componentName],
  )

  const getItems = useCallback(() => getDomOrderedRecords(recordsRef.current.values()), [])

  return { getItems, register, version }
}
