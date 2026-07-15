import { DemoFrame } from '../example-theme/demo'
import { Field, FieldDescription, FieldLabel } from '../field'
import { InputOTP } from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Verification code"
      description="One native input preserves mobile one-time-code autofill and form submission."
    >
      <Field>
        <FieldLabel htmlFor="verification-code">Six-digit code</FieldLabel>
        <InputOTP id="verification-code" name="code" defaultValue="204816" />
        <FieldDescription>Paste or type the code from your authenticator.</FieldDescription>
      </Field>
    </DemoFrame>
  )
}
'use client'
