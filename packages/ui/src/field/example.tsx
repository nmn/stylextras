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
          <Input id="field-email" aria-describedby="field-email-description" type="email" placeholder="you@example.com" />
          <FieldDescription id="field-email-description">Used only for account notifications.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="field-handle">Handle</FieldLabel>
          <Input id="field-handle" aria-errormessage="field-handle-error" aria-invalid pattern="[A-Za-z0-9-]+" defaultValue="two words" />
          <FieldError id="field-handle-error">Use letters, numbers, and hyphens only.</FieldError>
        </Field>
      </DemoGrid>
    </DemoFrame>
  )
}
