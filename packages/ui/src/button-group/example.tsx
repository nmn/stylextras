import { Button } from '../button'
import { DemoFrame, DemoMuted, DemoStack } from '../example-theme/demo'
import { ButtonGroup } from './index'

export default function Example() {
  return (
    <DemoStack>
      <DemoFrame
        title="Toolbar group"
        description="A focusgroup-enhanced toolbar for compact related commands."
      >
        <ButtonGroup aria-label="Text alignment">
          <Button size="icon-sm" variant="ghost" aria-label="Align start">
            ≡
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Align center">
            ≣
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Align end">
            ≡
          </Button>
        </ButtonGroup>
      </DemoFrame>

      <DemoFrame
        title="Equal action choices"
        description="The actions variant uses inline-grid so every decision has equal visual weight."
      >
        <DemoStack>
          <DemoMuted>Dialog footer</DemoMuted>
          <ButtonGroup variant="actions" aria-label="Confirm changes">
            <Button variant="outline">Cancel</Button>
            <Button>Done</Button>
          </ButtonGroup>
        </DemoStack>
      </DemoFrame>

      <DemoFrame
        title="Vertical actions"
        description="The same equal-width treatment adapts to narrow layouts."
      >
        <ButtonGroup variant="actions" orientation="vertical" aria-label="Document actions">
          <Button variant="outline">Save draft</Button>
          <Button>Publish</Button>
        </ButtonGroup>
      </DemoFrame>
    </DemoStack>
  )
}
;('use client')
