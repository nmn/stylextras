"use client";

import { DemoFrame, DemoStack } from "../example-theme/demo";
import {
  HoverCardContent,
  type HoverCardContentProps,
  HoverCardTrigger,
} from "./index";

function HoverCardExampleContent(props: HoverCardContentProps) {
  return (
    <HoverCardContent {...props}>
      <DemoStack>
        <strong>Package preview</strong>
        <span>Lightweight summary content belongs here.</span>
      </DemoStack>
    </HoverCardContent>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Preview surface"
      description="Hover or focus the trigger to open the hover card."
    >
      <HoverCardTrigger
        content={() => Promise.resolve(HoverCardExampleContent)}
      >
        Open preview
      </HoverCardTrigger>
    </DemoFrame>
  );
}
