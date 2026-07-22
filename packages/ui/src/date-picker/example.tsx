import { DatePicker } from './index'
import { DemoFrame, DemoGrid } from '../example-theme/demo'
import { Field, FieldDescription, FieldLabel } from '../field'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Project dates"
        description="A zero-JavaScript native date input preserves platform entry, validation, and form behavior."
      >
        <DemoGrid>
          <Field>
            <FieldLabel htmlFor="publish-date">Publish date</FieldLabel>
            <DatePicker id="publish-date" name="publishDate" defaultValue="2026-07-12" />
            <FieldDescription>Enter a date or use the platform date chooser.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="archive-date">Archive date</FieldLabel>
            <DatePicker
              id="archive-date"
              name="archiveDate"
              defaultValue="2026-07-20"
              min="2026-07-12"
            />
            <FieldDescription>Dates before publishing are unavailable.</FieldDescription>
          </Field>
        </DemoGrid>
      </DemoFrame>
    </>
  )
}
