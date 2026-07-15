'use client'

import { Toggle } from './index'
import type { ToggleProps } from './index'
import { DemoFrame, DemoRow, DemoStack } from '../example-theme/demo'
import { useState } from 'react'

type DemoToggleProps = Omit<ToggleProps, 'aria-pressed' | 'onClick'> & {
  defaultPressed?: boolean
}

function DemoToggle({ defaultPressed = false, ...props }: DemoToggleProps) {
  const [pressed, setPressed] = useState(defaultPressed)
  return <Toggle aria-pressed={pressed} onClick={() => setPressed((value) => !value)} {...props} />
}

export default function Example() {
  return (
    <DemoStack>
      <DemoFrame
        title="Toggle states"
        description="Toggle buttons act like independently pressed controls."
      >
        <DemoRow>
          <DemoToggle defaultPressed>Bold</DemoToggle>
          <DemoToggle>Italic</DemoToggle>
          <DemoToggle>Code</DemoToggle>
          <DemoToggle disabled defaultPressed>
            Locked
          </DemoToggle>
        </DemoRow>
      </DemoFrame>
      <DemoFrame title="Toggle sizes" description="The same state model at each control density.">
        <DemoRow>
          <DemoToggle size="sm">Small</DemoToggle>
          <DemoToggle size="md" defaultPressed>
            Medium
          </DemoToggle>
          <DemoToggle size="lg">Large</DemoToggle>
        </DemoRow>
      </DemoFrame>
    </DemoStack>
  )
}
