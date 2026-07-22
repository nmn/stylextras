import { DemoFrame } from '../example-theme/demo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu'
import { Menubar } from './index'

const menus = [
  { id: 'file-menu', label: 'File', items: ['New file', 'Open', 'Save'] },
  { id: 'edit-menu', label: 'Edit', items: ['Undo', 'Redo', 'Find action'] },
  { id: 'view-menu', label: 'View', items: ['Toggle sidebar', 'Zoom in', 'Zoom out'] },
]

export default function Example() {
  return (
    <DemoFrame title="Application menubar" description="Explicit popover menus share focusgroup behavior.">
      <Menubar aria-label="Application menu">
        {menus.map((menu) => (
          <DropdownMenu key={menu.id}>
            <DropdownMenuTrigger role="menuitem" variant="ghost" target={menu.id}>
              {menu.label}
            </DropdownMenuTrigger>
            <DropdownMenuContent id={menu.id}>
              {menu.items.map((item) => (
                <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </Menubar>
    </DemoFrame>
  )
}
'use client'
