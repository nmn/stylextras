import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuLabel,
} from '@stylextras/ui/context-menu'
import type { LazyPopoverContentProps } from '@stylextras/ui/popover/lazy'

type AccessibleMenuName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-label'?: string; 'aria-labelledby': string }

export default function LazyContextMenuFixture(
  props: LazyPopoverContentProps & AccessibleMenuName,
) {
  return (
    <ContextMenu {...props} data-testid="lazy-context-menu">
      <ContextMenuLabel>Deferred canvas</ContextMenuLabel>
      <ContextMenuItem>Deferred copy</ContextMenuItem>
      <ContextMenuItem>Deferred paste</ContextMenuItem>
      <ContextMenuItem hidden>Deferred hidden context item</ContextMenuItem>
      <div inert>
        <ContextMenuItem>Deferred inert context item</ContextMenuItem>
      </div>
      <div style={{ display: 'none' }}>
        <ContextMenuItem>Deferred non-visible context item</ContextMenuItem>
      </div>
    </ContextMenu>
  )
}
