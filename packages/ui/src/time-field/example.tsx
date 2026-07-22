import { DemoFrame, DemoGrid } from '../example-theme/demo'
import { Field, FieldLabel } from '../field'
import { TimeField } from './index'

export default function Example() {
  return (
    <DemoFrame title="Time fields" description="Native time entry preserves platform behavior.">
      <DemoGrid>
        <Field>
          <FieldLabel htmlFor="meeting-start">Start time</FieldLabel>
          <TimeField id="meeting-start" name="meetingStart" defaultValue="09:00" />
        </Field>
        <Field>
          <FieldLabel htmlFor="meeting-end">End time</FieldLabel>
          <TimeField id="meeting-end" name="meetingEnd" defaultValue="10:00" />
        </Field>
      </DemoGrid>
    </DemoFrame>
  )
}
