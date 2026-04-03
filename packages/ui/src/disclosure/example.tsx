"use client";

import { Disclosure } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Disclosure" description="A good disclosure example shows information that is useful but not needed on first scan. These examples use the component for FAQs and implementation notes.">
      <DemoSection title="Documentation FAQs" description="The summary should read like a meaningful question or status line, not like a vague 'more details' label.">
        <DemoStack>
          <Disclosure summary="Why use popover instead of a portal here?">
            The native popover model keeps the DOM shape local to the trigger and reduces the amount of custom overlay plumbing the component needs.
          </Disclosure>
          <Disclosure summary="When should this become a dialog instead?">
            Use a dialog once the content becomes task-focused, needs several controls, or should interrupt the current reading flow.
          </Disclosure>
          <Disclosure summary="How should docs pages use this component?">
            Use it for FAQs, caveats, migration notes, and other content that is useful on demand but noisy when always expanded.
          </Disclosure>
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}
