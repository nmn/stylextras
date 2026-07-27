'use client'

import { DemoFrame, DemoStack } from '../example-theme/demo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarNavigation,
  SidebarTrigger,
} from './index'

function WorkspaceNavigation({
  id,
  mode = 'inline',
}: { id?: string; mode?: 'inline' | 'popover' }) {
  return (
    <Sidebar id={id} mode={mode} aria-label="Workspace">
      <SidebarHeader>Acme workspace</SidebarHeader>
      <SidebarContent>
        <SidebarNavigation aria-label="Workspace navigation">
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton aria-current="page">Overview</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Projects</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Team</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Manage</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Settings</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarNavigation>
      </SidebarContent>
      <SidebarFooter>Signed in as Ada</SidebarFooter>
    </Sidebar>
  )
}

export default function Example() {
  return (
    <DemoStack>
      <DemoFrame
        title="Inline sidebar"
        description="Persistent navigation inside an application layout."
      >
        <WorkspaceNavigation />
      </DemoFrame>
      <DemoFrame
        title="Popover sidebar"
        description="The same parts can become a dismissible narrow-screen layer."
      >
        <SidebarTrigger target="workspace-popover-sidebar" aria-label="Toggle workspace sidebar">
          ☰
        </SidebarTrigger>
        <WorkspaceNavigation id="workspace-popover-sidebar" mode="popover" />
      </DemoFrame>
    </DemoStack>
  )
}
