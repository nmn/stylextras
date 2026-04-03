"use client";

import { Radio } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Radio" description="Use radio buttons when the user must choose exactly one option from a short list.">
      <DemoSection title="Publish target" description="Radio choices should be mutually exclusive and their labels should read as complete options.">
        <DemoStack>
          <Radio name="publish-target" defaultChecked label="Publish to staging" />
          <Radio name="publish-target" label="Publish to production" />
          <Radio name="publish-target" label="Save as draft" />
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

