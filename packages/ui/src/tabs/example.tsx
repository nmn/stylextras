'use client'

import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './index'

export default function Example() {
  return (
    <DemoStack>
      <DemoFrame title="Automatic tabs" description="Horizontal arrow navigation selects on focus.">
        <Tabs defaultValue="overview">
          <TabsList aria-label="Documentation sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">A compact native-first implementation.</TabsContent>
          <TabsContent value="examples">Typechecked examples live with each component.</TabsContent>
          <TabsContent value="accessibility">
            Arrow keys, Home, End, Enter, and Space are covered.
          </TabsContent>
        </Tabs>
      </DemoFrame>
      <DemoFrame
        title="Manual vertical tabs"
        description="Focus moves independently; Enter or Space commits the selection."
      >
        <Tabs defaultValue="account" orientation="vertical" activationMode="manual">
          <TabsList aria-label="Settings sections">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Update your profile and sign-in settings.</TabsContent>
          <TabsContent value="notifications">Choose which events reach your inbox.</TabsContent>
          <TabsContent value="billing">Manage invoices and payment details.</TabsContent>
        </Tabs>
      </DemoFrame>
    </DemoStack>
  )
}
