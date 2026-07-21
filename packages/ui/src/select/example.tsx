'use client'

import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Field, FieldDescription, FieldLabel } from '../field'
import { Option, Select } from './index'

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
            <Option value="development">Development</Option>
            <Option value="preview">Preview</Option>
            <Option value="production">Production</Option>
          </Select>
          <FieldDescription>Uses native validation, reset, and submission.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="component">Component</FieldLabel>
          <Select id="component" name="component" defaultValue="">
            <Option value="" disabled>
              Select a component
            </Option>
            <optgroup label="Forms">
              <Option value="input">Input</Option>
              <Option value="select">Select</Option>
            </optgroup>
            <optgroup label="Overlays">
              <Option value="dialog">Dialog</Option>
              <Option value="popover">Popover</Option>
            </optgroup>
          </Select>
        </Field>
      </DemoStack>
    </DemoFrame>
  )
}
