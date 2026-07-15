'use client'

import { Kbd } from './index'
import { DemoFrame, DemoRow, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <DemoStack>
      <DemoFrame
        title="Shortcuts"
        description="Kbd should show common shortcut combinations directly."
      >
        <DemoRow>
          <Kbd>cmd</Kbd>
          <Kbd>k</Kbd>
          <Kbd>cmd</Kbd>
          <Kbd>s</Kbd>
          <Kbd>shift</Kbd>
          <Kbd>enter</Kbd>
        </DemoRow>
      </DemoFrame>
      <DemoFrame
        title="Key sizes"
        description="Compact keys fit inline hints; medium keys suit shortcut references."
      >
        <DemoRow>
          <Kbd size="sm">esc</Kbd>
          <Kbd size="sm">/</Kbd>
          <Kbd size="md">shift</Kbd>
          <Kbd size="md">enter</Kbd>
        </DemoRow>
      </DemoFrame>
    </DemoStack>
  )
}
