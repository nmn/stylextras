'use client'

import { RadioGroup } from './index'
import { DemoFrame } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Exclusive choices"
        description="Radio Group only needs a clear legend and option set."
      >
        <RadioGroup
          legend="Where should this release go?"
          name="publish-target"
          options={['Preview only', 'Staging', 'Production']}
        />
      </DemoFrame>
    </>
  )
}
