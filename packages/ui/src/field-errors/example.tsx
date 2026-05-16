'use client'

import { FieldErrors } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Messages"
        description="Field Errors should show short validation messages directly."
      >
        <DemoStack>
          <FieldErrors>Password must be at least 12 characters.</FieldErrors>
          <FieldErrors>Invite email already belongs to an existing member.</FieldErrors>
        </DemoStack>
      </DemoFrame>
    </>
  )
}
