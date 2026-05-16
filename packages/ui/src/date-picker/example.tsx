'use client'

import { DatePicker } from './index'
import { DemoFrame, DemoRow } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Date pickers"
        description="Date Picker is currently a lightweight native date control wrapper."
      >
        <DemoRow>
          <DatePicker aria-label="Publish date" defaultValue="2026-04-12" />
          <DatePicker aria-label="Archive date" defaultValue="2026-04-20" />
        </DemoRow>
      </DemoFrame>
    </>
  )
}
