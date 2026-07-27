'use client'

import { DemoFrame } from '../example-theme/demo'
import { Field, FieldDescription, FieldLabel } from '../field'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
} from './index'

const reviewers = [
  { label: 'Alex Kim', value: 'alex' },
  { label: 'Taylor Rivera', value: 'taylor' },
  { label: 'Jordan Patel', value: 'jordan' },
  { label: 'Sam Lee', value: 'sam' },
]

export default function Example() {
  return (
    <DemoFrame
      title="Combobox"
      description="A native search input controls an anchored popover listbox with filtering and active-descendant navigation."
    >
      <Field>
        <FieldLabel htmlFor="reviewer">Reviewer</FieldLabel>
        <Combobox name="reviewer" required>
          <ComboboxInput
            id="reviewer"
            aria-describedby="reviewer-description"
            placeholder="Search reviewers…"
          />
          <ComboboxContent>
            <ComboboxList>
              {reviewers.map((reviewer) => (
                <ComboboxItem key={reviewer.value} value={reviewer.value}>
                  {reviewer.label}
                </ComboboxItem>
              ))}
            </ComboboxList>
            <ComboboxEmpty />
            <ComboboxStatus>
              {(count) => `${count} reviewer${count === 1 ? '' : 's'} available.`}
            </ComboboxStatus>
          </ComboboxContent>
        </Combobox>
        <FieldDescription id="reviewer-description">
          Use Arrow keys, Home, End, Enter, and Escape.
        </FieldDescription>
      </Field>
    </DemoFrame>
  )
}
