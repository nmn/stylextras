import { DemoFrame, DemoStack } from '../example-theme/demo'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './index'

const contentId = 'documentation-navigation-menu'

export default function Example() {
  return (
    <DemoFrame
      title="Documentation navigation"
      description="Links remain links; richer groups use a native popover panel."
    >
      <NavigationMenu aria-label="Component documentation">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#overview">Overview</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger target={contentId}>Components</NavigationMenuTrigger>
            <NavigationMenuContent id={contentId}>
              <DemoStack>
                <NavigationMenuLink href="#forms">Form controls</NavigationMenuLink>
                <NavigationMenuLink href="#overlays">Overlays</NavigationMenuLink>
                <NavigationMenuLink href="#layout">Layout</NavigationMenuLink>
              </DemoStack>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#themes">Themes</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </DemoFrame>
  )
}
'use client'
