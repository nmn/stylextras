'use client'

import { useRef } from 'react'
import {
  createPopoverPointerToggleGuard,
  type PopoverPointerToggleGuard,
} from '../platform-polyfills/popover-toggle-guard'

/** React adapter for preserving popover state across a pointer toggle gesture. */
export function usePopoverPointerToggleGuard(getPopover: () => HTMLElement | null) {
  const getPopoverRef = useRef(getPopover)
  getPopoverRef.current = getPopover
  const guardRef = useRef<PopoverPointerToggleGuard | null>(null)
  guardRef.current ??= createPopoverPointerToggleGuard(() => getPopoverRef.current())
  return guardRef.current
}
