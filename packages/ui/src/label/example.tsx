'use client'

import { Label } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame title="Labels" description="Label should be shown as direct field labels.">
        <DemoStack>
          <Label htmlFor="name">Name</Label>
          <Label htmlFor="slug">Slug</Label>
        </DemoStack>
      </DemoFrame>
    </>
  )
}
