import { DemoFrame, DemoGrid } from '../example-theme/demo'
import { Field, FieldDescription, FieldLabel } from '../field'
import { Input } from './index'

export default function Example() {
  return (
    <DemoFrame title="Native inputs" description="Input types retain browser validation, autofill, and form behavior.">
      <DemoGrid>
        <Field>
          <FieldLabel htmlFor="input-email">Work email</FieldLabel>
          <Input id="input-email" aria-describedby="input-email-description" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
          <FieldDescription id="input-email-description">Try the native email validation state.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-search">Search</FieldLabel>
          <Input id="input-search" aria-describedby="input-search-description" name="query" type="search" placeholder="Search components…" />
          <FieldDescription id="input-search-description">The browser owns search-input behavior.</FieldDescription>
        </Field>
      </DemoGrid>
    </DemoFrame>
  )
}
