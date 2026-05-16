'use client'

import { TextField } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Field forms"
        description="Text Field should show its common forms directly."
      >
        <DemoStack>
          <TextField label="Name" placeholder="Workspace name" />
          <TextField label="Slug" defaultValue="workspace-name" />
          <TextField disabled label="Disabled" defaultValue="Disabled value" />
        </DemoStack>
      </DemoFrame>
    </>
  )
}
