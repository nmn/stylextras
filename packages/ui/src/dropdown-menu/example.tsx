import { DemoFrame } from '../example-theme/demo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './index'

const menuId = 'project-actions-menu'
const groupLabelId = 'project-actions-label'

export default function Example() {
  return (
    <DemoFrame title="Menu surface" description="A native popover with focusgroup navigation.">
      <DropdownMenu>
        <DropdownMenuTrigger target={menuId}>Actions</DropdownMenuTrigger>
        <DropdownMenuContent id={menuId}>
          <DropdownMenuGroup aria-labelledby={groupLabelId}>
            <DropdownMenuLabel id={groupLabelId}>Project</DropdownMenuLabel>
            <DropdownMenuItem>
              Rename <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem disabled>Deploy (unavailable)</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoFrame>
  )
}
'use client'
