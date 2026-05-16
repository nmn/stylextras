'use client'

import { ProgressBar } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Progress values"
        description="Progress Bar should show representative completion points."
      >
        <DemoStack>
          <ProgressBar label="Build" max={100} value={20} />
          <ProgressBar label="Build" max={100} value={50} />
          <ProgressBar label="Build" max={100} value={90} />
        </DemoStack>
      </DemoFrame>
    </>
  )
}
