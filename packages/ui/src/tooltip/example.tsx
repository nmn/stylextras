import { DemoFrame } from '../example-theme/demo'
import { Tooltip, TooltipTrigger } from './index'

const tooltipId = 'archive-tooltip'

export default function Example() {
  return (
    <DemoFrame title="Tooltip" description="Interest invokers enhance hover and focus; click is the touch fallback.">
      <TooltipTrigger target={tooltipId} size="icon" aria-label="Archive">
        ↧
      </TooltipTrigger>
      <Tooltip id={tooltipId}>Archive item</Tooltip>
    </DemoFrame>
  )
}
'use client'
