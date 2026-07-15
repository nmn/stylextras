import { DemoFrame } from '../example-theme/demo'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './index'

export default function Example() {
  return (
    <DemoFrame title="Release details" description="A single native details disclosure with styled parts.">
      <Collapsible>
        <CollapsibleTrigger>What changed in 0.2?</CollapsibleTrigger>
        <CollapsibleContent>
          Components now own their implementation and styling, while browser primitives own more of
          the interaction behavior.
        </CollapsibleContent>
      </Collapsible>
    </DemoFrame>
  )
}
'use client'
