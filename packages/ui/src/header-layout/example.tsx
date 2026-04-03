"use client";

import { HeaderLayout } from "./index";
import { Button } from "../button";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Header Layout" description="A simple page shell that keeps a header region distinct from the scrolling content below it.">
      <DemoSection title="Docs shell" description="Use the layout when the header carries navigation, context, or actions that should stay visually separate.">
        <HeaderLayout header={<Button type="button">Back to docs</Button>}>
          <DemoStack>
            <strong>Token foundations</strong>
            <span>Start with a small set of themeable variables and derive the rest from them.</span>
          </DemoStack>
        </HeaderLayout>
      </DemoSection>
    </DemoFrame>
  );
}

