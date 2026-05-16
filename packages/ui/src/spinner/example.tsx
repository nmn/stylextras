'use client'

import { Spinner } from './index'
import { DemoFrame, DemoRow } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Spinner"
        description="Spinner is a minimal indeterminate loading indicator."
      >
        <DemoRow>
          <Spinner aria-label="Loading" />
          <span>Loading…</span>
        </DemoRow>
      </DemoFrame>
    </>
  )
}
