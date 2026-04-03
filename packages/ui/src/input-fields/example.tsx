"use client";

import { InputFields } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Input Fields" description="The legacy pluralized input export is still useful where a plain styled input is all you need.">
      <DemoSection title="Direct inputs" description="Prefer the more semantic field components when labels and help text matter.">
        <DemoStack>
          <InputFields placeholder="Search tokens" />
          <InputFields type="email" placeholder="team@example.com" />
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

