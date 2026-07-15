"use client";

import { DatePicker } from "./index";
import { DemoFrame, DemoGrid } from "../example-theme/demo";
import { Field, FieldDescription, FieldLabel } from "../field";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Project dates"
        description="A form-compatible readonly input opens the shared calendar in a native popover."
      >
        <DemoGrid>
          <Field>
            <FieldLabel htmlFor="publish-date">Publish date</FieldLabel>
            <DatePicker
              inputId="publish-date"
              name="publishDate"
              defaultValue="2026-07-12"
            />
            <FieldDescription>Select a day with the calendar or keyboard.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="archive-date">Archive date</FieldLabel>
            <DatePicker
              inputId="archive-date"
              name="archiveDate"
              defaultValue="2026-07-20"
              min="2026-07-12"
            />
            <FieldDescription>Dates before publishing are unavailable.</FieldDescription>
          </Field>
        </DemoGrid>
      </DemoFrame>
    </>
  );
}
