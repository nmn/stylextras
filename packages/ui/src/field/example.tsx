import { DemoFrame, DemoGrid } from '../example-theme/demo'
import { Input } from '../input'
import { Field, FieldDescription, FieldError, FieldLabel } from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Labeled fields"
      description="Labels, supporting copy, and validation messages remain explicit native composition."
    >
      <DemoGrid>
        <Field>
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" type="email" placeholder="you@example.com" />
          <FieldDescription>Used only for account notifications.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="field-handle">Handle</FieldLabel>
          <Input id="field-handle" aria-invalid defaultValue="two words" />
          <FieldError>Use letters, numbers, and hyphens only.</FieldError>
        </Field>
      </DemoGrid>
    </DemoFrame>
  )
}
'use client'
