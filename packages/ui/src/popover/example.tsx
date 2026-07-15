import { DemoFrame, DemoRow, DemoStack } from '../example-theme/demo'
import { Popover, PopoverClose, PopoverTrigger } from './index'

const compactId = 'compact-details-popover'
const standardId = 'standard-details-popover'
const wideId = 'wide-details-popover'

export default function Example() {
  return (
    <DemoStack>
      <DemoFrame title="Compact popover" description="A small bottom-anchored disclosure.">
        <PopoverTrigger target={compactId}>Quick details</PopoverTrigger>
        <Popover id={compactId} size="sm">
          <DemoStack>
            <strong>Quick details</strong>
            <span>Short supporting content belongs here.</span>
            <PopoverClose target={compactId} size="sm">
              Close
            </PopoverClose>
          </DemoStack>
        </Popover>
      </DemoFrame>
      <DemoFrame title="Side popover" description="Placement can flip when space is constrained.">
        <DemoRow>
          <PopoverTrigger target={standardId}>View activity</PopoverTrigger>
          <Popover id={standardId} placement="end">
            <DemoStack>
              <strong>Recent activity</strong>
              <span>Three component examples were updated today.</span>
              <PopoverClose target={standardId} size="sm">
                Close
              </PopoverClose>
            </DemoStack>
          </Popover>
        </DemoRow>
      </DemoFrame>
      <DemoFrame title="Wide popover" description="Larger content keeps the same native behavior.">
        <PopoverTrigger target={wideId}>Review changes</PopoverTrigger>
        <Popover id={wideId} placement="top" size="lg">
          <DemoStack>
            <strong>Ready to publish</strong>
            <span>Tokens, examples, accessibility notes, and browser fallbacks are included.</span>
            <PopoverClose target={wideId} size="sm">
              Dismiss
            </PopoverClose>
          </DemoStack>
        </Popover>
      </DemoFrame>
    </DemoStack>
  )
}
;('use client')
