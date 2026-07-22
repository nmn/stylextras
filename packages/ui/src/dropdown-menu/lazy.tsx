'use client'

import {
  LazyPopover,
  LazyPopoverMenuTrigger,
  type LazyPopoverProps,
  type LazyPopoverMenuTriggerProps,
} from '../popover/lazy'
import type { AccessibleAriaNameProps } from '../accessibility'

export type LazyDropdownMenuProps<Props extends object = Record<string, never>> = Omit<
  LazyPopoverProps<Props & AccessibleAriaNameProps>,
  'contentProps' | 'initialFocus'
> &
  AccessibleAriaNameProps & { contentProps: Props }
export type LazyDropdownMenuTriggerProps = LazyPopoverMenuTriggerProps

export function LazyDropdownMenu<Props extends object = Record<string, never>>(
  {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    contentProps,
    ...props
  }: LazyDropdownMenuProps<Props>,
) {
  const accessibleNameProps: AccessibleAriaNameProps =
    ariaLabel !== undefined
      ? { 'aria-label': ariaLabel }
      : { 'aria-labelledby': ariaLabelledBy as string }

  return (
    <LazyPopover
      {...props}
      contentProps={{ ...contentProps, ...accessibleNameProps }}
      initialFocus="first"
    />
  )
}

export { LazyPopoverMenuTrigger as LazyDropdownMenuTrigger }
