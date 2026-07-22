import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Field, FieldDescription, FieldLabel } from '../field'
import { Textarea } from './index'

export default function Example() {
  return (
    <DemoFrame title="Textarea" description="A styled native multiline control.">
      <DemoStack>
        <Field>
          <FieldLabel htmlFor="summary">Summary</FieldLabel>
          <Textarea id="summary" aria-describedby="summary-description" name="summary" rows={4} placeholder="Add a summary…" />
          <FieldDescription id="summary-description">Plain native props remain available.</FieldDescription>
        </Field>
      </DemoStack>
    </DemoFrame>
  )
}
