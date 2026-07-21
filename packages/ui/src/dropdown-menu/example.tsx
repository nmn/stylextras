import { DemoFrame } from '../example-theme/demo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './index'

const menuId = 'project-actions-menu'

export default function Example() {
  return (
    <DemoFrame title="Menu surface" description="A native popover with focusgroup navigation.">
      <DropdownMenu>
        <DropdownMenuTrigger target={menuId}>Actions</DropdownMenuTrigger>
        <DropdownMenuContent id={menuId}>
          <DropdownMenuLabel>Project</DropdownMenuLabel>
          <DropdownMenuItem>
            Rename <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem disabled>Deploy (unavailable)</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoFrame>
  )
}
'use client'
