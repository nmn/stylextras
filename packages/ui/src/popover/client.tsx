'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Popover, type PopoverProps } from './index'

export type PopoverClientProps = PopoverProps & {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

/** Optional controlled adapter for applications that need React-owned popover state. */
export function PopoverClient({
  defaultOpen = false,
  onOpenChange,
  onToggle,
  open,
  ref,
  ...props
}: PopoverClientProps) {
  const controlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = controlled ? open : internalOpen
  const popoverRef = useRef<HTMLDivElement>(null)

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      popoverRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  useEffect(() => {
    const popover = popoverRef.current
    if (!popover) return
    if (isOpen && !popover.matches(':popover-open')) popover.showPopover()
    if (!isOpen && popover.matches(':popover-open')) popover.hidePopover()
  }, [isOpen])

  return (
    <Popover
      ref={setRefs}
      onToggle={(event) => {
        onToggle?.(event)
        const nextOpen = event.currentTarget.matches(':popover-open')
        if (!controlled) setInternalOpen(nextOpen)
        onOpenChange?.(nextOpen)
      }}
      {...props}
    />
  )
}
