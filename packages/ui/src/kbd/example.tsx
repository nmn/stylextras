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
          <span><Kbd>Command</Kbd> + <Kbd>K</Kbd></span>
          <span><Kbd>Command</Kbd> + <Kbd>S</Kbd></span>
          <span><Kbd>Shift</Kbd> + <Kbd>Enter</Kbd></span>
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
