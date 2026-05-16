'use client'

import { Slider } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Slider values"
        description="Slider should show a few representative ranges directly."
      >
        <DemoStack>
          <Slider aria-label="Value 25" min={0} max={100} defaultValue={25} />
          <Slider aria-label="Value 50" min={0} max={100} defaultValue={50} />
          <Slider aria-label="Value 75" min={0} max={100} defaultValue={75} />
        </DemoStack>
      </DemoFrame>
    </>
  )
}
