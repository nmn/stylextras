'use client'

import { IconButton } from './index'
import { DemoFrame, DemoRow } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame title="Sizes" description="Icon Button should show size differences directly.">
        <DemoRow>
          <IconButton label="Search" size="sm">
            S
          </IconButton>
          <IconButton label="Search" size="md">
            S
          </IconButton>
          <IconButton label="Search" size="lg">
            S
          </IconButton>
          <IconButton label="Disabled" disabled>
            D
          </IconButton>
        </DemoRow>
      </DemoFrame>
    </>
  )
}
