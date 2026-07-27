import { DemoFrame } from '../example-theme/demo'
import { DateRangePicker } from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Date range"
      description="Two labeled native date fields preserve keyboard, validation, and form behavior."
    >
      <DateRangePicker
        legend="Travel dates"
        startDefaultValue="2026-07-11"
        endDefaultValue="2026-07-18"
        startName="travelStart"
        endName="travelEnd"
        startProps={{ required: true }}
        endProps={{ required: true }}
        invalidRangeMessage="Return date must be on or after departure date."
      />
    </DemoFrame>
  )
}
