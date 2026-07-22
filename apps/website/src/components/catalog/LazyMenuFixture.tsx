import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@stylextras/ui/dropdown-menu'
import type { LazyPopoverContentProps } from '@stylextras/ui/popover/lazy'

type AccessibleMenuName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-label'?: string; 'aria-labelledby': string }

export default function LazyMenuFixture({
  id,
  ...accessibleNameProps
}: LazyPopoverContentProps & AccessibleMenuName) {
  return (
    <DropdownMenuContent
      id={id}
      {...accessibleNameProps}
      data-testid="lazy-dropdown-menu"
    >
      <DropdownMenuItem disabled>Deferred unavailable</DropdownMenuItem>
      <DropdownMenuItem hidden>Deferred hidden</DropdownMenuItem>
      <div inert>
        <DropdownMenuItem>Deferred inert</DropdownMenuItem>
      </div>
      <div style={{ display: 'none' }}>
        <DropdownMenuItem>Deferred non-visible</DropdownMenuItem>
      </div>
      <DropdownMenuItem>Deferred rename</DropdownMenuItem>
      <DropdownMenuItem>Deferred archive</DropdownMenuItem>
    </DropdownMenuContent>
  )
}
