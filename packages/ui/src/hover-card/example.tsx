import { Button } from '../button'
import { DemoFrame } from '../example-theme/demo'
import {
  HoverCard,
  HoverCardDescription,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardTrigger,
} from './index'

const cardId = 'browser-apis-hover-card'

export default function Example() {
  return (
    <DemoFrame title="Hover card" description="Interactive interest content uses popover semantics.">
      <HoverCardTrigger target={cardId}>New browser APIs</HoverCardTrigger>
      <HoverCard id={cardId}>
        <HoverCardHeader>
          <HoverCardTitle>Native-first overlays</HoverCardTitle>
          <HoverCardDescription>
            Invoker relationships and anchor positioning replace most overlay JavaScript.
          </HoverCardDescription>
        </HoverCardHeader>
        <Button size="sm" variant="outline">
          Learn more
        </Button>
      </HoverCard>
    </DemoFrame>
  )
}
'use client'
