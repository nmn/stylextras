'use client'

import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Field, FieldDescription, FieldLabel } from '../field'
import { Select } from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Native select"
      description="The same select preserves native forms and mobile pickers while customizable-select CSS enhances supporting browsers."
    >
      <DemoStack>
        <Field>
          <FieldLabel htmlFor="environment">Environment</FieldLabel>
          <Select id="environment" name="environment" defaultValue="preview">
            <option value="development">Development</option>
            <option value="preview">Preview</option>
            <option value="production">Production</option>
          </Select>
          <FieldDescription>Uses native validation, reset, and submission.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="component">Component</FieldLabel>
          <Select id="component" name="component" defaultValue="">
            <option value="" disabled>
              Select a component
            </option>
            <optgroup label="Forms">
              <option value="input">Input</option>
              <option value="select">Select</option>
            </optgroup>
            <optgroup label="Overlays">
              <option value="dialog">Dialog</option>
              <option value="popover">Popover</option>
            </optgroup>
          </Select>
        </Field>
      </DemoStack>
    </DemoFrame>
  )
}
