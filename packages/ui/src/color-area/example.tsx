'use client'

import { ColorArea } from './index'
import { DemoFrame, DemoRow } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Color Area"
        description="Color Area should be shown as a direct control specimen."
      >
        <DemoRow>
          <ColorArea aria-label="Accent" defaultValue="#4f46e5" />
          <ColorArea aria-label="Secondary accent" defaultValue="#0f766e" />
        </DemoRow>
      </DemoFrame>
    </>
  )
}
