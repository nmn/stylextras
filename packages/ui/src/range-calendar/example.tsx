import { RangeCalendar } from './index'
import { DemoFrame } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Range inputs"
        description="Range Calendar is currently a simple paired-date control."
      >
        <RangeCalendar
          legend="Release window"
          startDefaultValue="2026-07-11"
          endDefaultValue="2026-07-18"
        />
      </DemoFrame>
    </>
  )
}
